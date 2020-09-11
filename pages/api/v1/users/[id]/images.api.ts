import {
  parseFormData,
  readUploadedFile
} from '../../../../../api/utils/parse-form-data';
import routeHandler from '../../../../../api/utils/route-handler';
import { validateId } from '../../../../../api/utils/validate';
import { ProfileUploader } from '../../../../../lib/uploaders';

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false
  }
};
const profileUploader = new ProfileUploader('profileImage', 'user');

export default routeHandler(async ({ req, db, requiresAuth, validate }) => {
  if (req.method === 'POST') {
    await requiresAuth();
    await validate(validateId, { query: { id: req.query.slug } });
    const id = parseInt(req.query.slug as string, 10);
    const user = await db.Users.findByPk(id);
    if (user) {
      const data = await parseFormData(req);
      const updates: any = {};
      if (data.files.profileImage) {
        // remove old files
        if (user.getDataValue('profileImage')) {
          await profileUploader.delete(
            user.getDataValue('id')!,
            user.getDataValue('profileImage')!
          );
        }
        // read file from the temporary path
        const contents = await readUploadedFile(data, 'profileImage');
        if (contents) {
          try {
            const fileName = data.files.profileImage.name;
            await profileUploader.upload(
              user.getDataValue('id')!,
              fileName,
              contents,
              data.files.profileImage.type
            );
            updates.profileImage = fileName;
          } catch (err) {
            console.error('failed to upload profile image', err);
          }
        }
      }
      const keysToUpdate = Object.keys(updates);
      if (keysToUpdate.length > 0) {
        for (const key of keysToUpdate) {
          console.log(key, updates[key]);
          user.set(key as any, updates[key] as any);
        }
        user.save();
        return { success: true, updates };
      }
      return { success: false };
    }
  }
});
