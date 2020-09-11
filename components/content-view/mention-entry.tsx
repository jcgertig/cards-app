import React from 'react';

import { S3_IMG } from '../../lib/constants';

const defaultImg =
  'http://makerepo.com/assets/default-avatar-19cf8cebb96b4d8beff4ef9cad0e5903d288c778c503777332a57085a65371be.png';

const MentionEntry: React.FC<any> = ({
  mention,
  theme,
  searchValue, // eslint-disable-line @typescript-eslint/no-unused-vars
  isFocused, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...parentProps
}) => {
  const { profileImage, username } = mention;
  return (
    <div {...parentProps}>
      <div className={theme.mentionSuggestionsEntryContainer}>
        <div className={theme.mentionSuggestionsEntryContainerLeft}>
          <img
            src={
              profileImage
                ? S3_IMG(
                    { model: 'user', size: 'thumb' },
                    mention.id,
                    profileImage
                  )
                : defaultImg
            }
            className={theme.mentionSuggestionsEntryAvatar}
            role="presentation"
          />
        </div>

        <div className={theme.mentionSuggestionsEntryContainerRight}>
          <div className={theme.mentionSuggestionsEntryText}>{username}</div>
        </div>
      </div>
    </div>
  );
};

export default MentionEntry;
