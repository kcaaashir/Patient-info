import { Injectable } from '@nestjs/common';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable()
export class S3ConfigProvider {
  private readonly _s3: S3;
  private readonly _bucketName: string;

  constructor() {
    (this._bucketName = process.env.AWS_BUCKET_NAME ?? 'mybucket'),
      (this._s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'test',
        endpoint: process.env.DYNAMO_DB_END_POINT ?? 'http://localhost:4566',
        s3ForcePathStyle: true,
        region: process.env.AWS_REGION ?? 'us-east-1',
        logger: console,
      }));
  }

  getS3() {
    return this._s3;
  }

  getBucketName() {
    return this._bucketName;
  }

  createBucket() {
    this.getS3().createBucket({ Bucket: 'mybucket' }, (err, data) => {
      console.log(err, data);
    });
  }
}
