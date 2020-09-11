export type S3_TYPE = 'profileImage' | 'image';
export type S3_SIZE = 'hero' | 'large' | 'medium' | 'small' | 'thumb';

export const S3_IMG = (
  args:
    | {
        model: string;
        type?: S3_TYPE;
        size?: S3_SIZE | null;
      }
    | string,
  id: number,
  fileName: string
) => {
  let model = args;
  let type = 'profile_image';
  let size: S3_SIZE | null = 'medium';
  if (typeof args !== 'string') {
    model = args.model;
    type = args.type || type;
    size = args.size ? args.size : args.size === null ? null : size;
  }
  return `https://${
    process.env.NEXT_PUBLIC_S3_BUCKET
  }.s3.amazonaws.com/uploads/${model}/${type}/${id}/${size ? `${size}_` : ''}${
    fileName ? fileName.replace(/ /g, '+') : ''
  }`;
};

export const CARD_SORT_DIRECTIONS = [
  {
    value: 0,
    shortLabel: 'LH',
    label: 'Low to High'
  },
  {
    value: 1,
    shortLabel: 'HL',
    label: 'High to Low'
  },
  {
    value: 3,
    shortLabel: 'SUIT',
    label: 'Grouped by suit'
  }
];
