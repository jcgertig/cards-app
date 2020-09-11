import { UserRolesMapping } from '../../lib/enum-mappings';
import { numberCheck, objectCheck } from '../../lib/utils/checks';
import { DBInstanceBase, IModels } from '../../models/db.tables';
import { GeneralError, UnauthorizedError } from '../utils/errors';
import { pundit } from '../utils/pundit';
import { check, IValidateSchema } from '../utils/validate';
import { ISession } from './session';

export interface IComment extends DBInstanceBase {
  userId: number;
  gameId: number;
  content: any;
}

export interface CommentCreateArgs {
  userId?: number;
  gameId: number;
  content: any;
}

export type UpdateCommentArgs = Omit<CommentCreateArgs, 'gameId' | 'userId'>;

export const CommentPolicy = pundit({
  create: () => true,
  update: (user, comment) =>
    comment.userId === user.id || [UserRolesMapping.Admin].includes(user.role),
  delete: (user, comment) =>
    comment.userId === user.id || [UserRolesMapping.Admin].includes(user.role)
});

export const commentSchema = (create = true): IValidateSchema => ({
  userId: check({ required: create, method: numberCheck }),
  gameId: check({ required: create, method: numberCheck }),
  content: check({ required: true, method: objectCheck })
});

export async function createComment(
  db: IModels,
  user: ISession,
  { gameId, content }: CommentCreateArgs
) {
  if (!CommentPolicy(user).create) {
    throw new UnauthorizedError('User is not authorized to create comments');
  }
  const comment = await db.Comments.build({
    gameId,
    content,
    userId: user.id
  });
  await comment.save();
  if (comment) {
    return comment;
  }
  throw new GeneralError('Failed to create comment');
}

export async function updateComment(
  db: IModels,
  user: ISession,
  id: number,
  { content }: UpdateCommentArgs
) {
  const comment = await db.Comments.findByPk(id);
  if (comment) {
    if (!CommentPolicy(user, comment).update) {
      throw new UnauthorizedError('User is not authorized to update comments');
    }
    if (content) comment.setDataValue('content', content);
    await comment.save();
    return comment;
  }
  throw new GeneralError('Failed to update comment');
}
