import { Fields, Files, IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import { NextApiRequest } from 'next';

interface FormDataResult {
  files: Files;
  fields: Fields;
}

export const parseFormData = async (req: NextApiRequest) => {
  return await new Promise<FormDataResult>((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export const readUploadedFile = async (data: FormDataResult, key: string) => {
  const path = data.files[key]?.path || '';
  if (path) {
    return await fs.readFile(path);
  }
  return null;
};
