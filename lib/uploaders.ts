import AWS from 'aws-sdk';
import { snakeCase } from 'lodash';
import Sharp from 'sharp';

interface Sizes {
  [key: string]: [number, number];
}

export class FileUploader {
  private config: any;
  private s3: AWS.S3;
  private name: string;
  private modelName: string;
  private sizes: Sizes = {};

  constructor(name: string, modelName: string, sizes: Sizes = {}) {
    this.name = name;
    this.modelName = modelName;
    this.sizes = sizes;

    // Amazon SES configuration
    this.config = {
      // current version of Amazon S3 API (see: https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
      apiVersion: '2006-03-01',
      accessKeyId: process.env.S3_KEY_ID,
      secretAccessKey: process.env.S3_SECRET,
      region: process.env.S3_REGION
    };

    this.s3 = new AWS.S3(this.config);
  }

  dir = (id: any) => {
    return `uploads/${snakeCase(this.modelName).toLocaleLowerCase()}/${
      this.name
    }/${id}`;
  };

  delete = async (id: number, fileName: string) => {
    const Bucket = process.env.NEXT_PUBLIC_S3_BUCKET!;
    await this.s3
      .deleteObject({ Bucket, Key: `${this.dir(id)}/${fileName}` })
      .promise();
    if (this.sizes) {
      const names = Object.keys(this.sizes);
      for (const name of names) {
        await this.s3
          .deleteObject({
            Bucket,
            Key: `${this.dir(id)}/${name}_${fileName}`
          })
          .promise();
      }
    }
  };

  upload = async (
    id: number,
    fileName: string,
    body: Buffer,
    contentType: string
  ) => {
    const Bucket = process.env.NEXT_PUBLIC_S3_BUCKET!;
    try {
      await this.s3
        .putObject({
          Bucket,
          Body: body,
          Key: `${this.dir(id)}/${fileName}`,
          ContentType: contentType,
          ACL: 'public-read'
        })
        .promise();

      if (this.sizes) {
        const names = Object.keys(this.sizes);
        for (const name of names) {
          const [width, height] = this.sizes[name];
          const sizedBody = await Sharp(body)
            .resize(width, height, { fit: 'fill' })
            .toBuffer();

          await this.s3
            .putObject({
              Bucket,
              Body: sizedBody,
              Key: `${this.dir(id)}/${name}_${fileName}`,
              ContentType: contentType,
              ACL: 'public-read'
            })
            .promise();
        }
      }
    } catch (err) {
      await this.s3
        .deleteObject({ Bucket, Key: `${this.dir(id)}/${fileName}` })
        .promise();
      if (this.sizes) {
        const names = Object.keys(this.sizes);
        for (const name of names) {
          await this.s3
            .deleteObject({
              Bucket,
              Key: `${this.dir(id)}/${name}_${fileName}`
            })
            .promise();
        }
      }
      throw err;
    }
  };
}

export class HeroUploader extends FileUploader {
  constructor(name: string, modelName: string) {
    super(name, modelName, {
      hero: [1200, 300],
      large: [600, 600],
      thumb: [80, 80]
    });
  }
}

export class ProfileUploader extends FileUploader {
  constructor(name: string, modelName: string) {
    super(name, modelName, {
      hero: [1200, 300],
      large: [600, 600],
      medium: [300, 300],
      small: [150, 150],
      thumb: [80, 80]
    });
  }
}

export class Profile34Uploader extends FileUploader {
  constructor(name: string, modelName: string) {
    super(name, modelName, {
      hero: [1140, 1520],
      large: [570, 760],
      medium: [285, 380],
      small: [142, 190],
      thumb: [70, 95]
    });
  }
}
