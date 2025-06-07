import { S3Client as AWSS3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export default class S3Client {
  constructor({ config }) {
    this.config = config;

    this.client = new AWSS3Client({ region: config.region });
  }

  async putObject({ bucket, key, body }) {
    const command = new PutObjectCommand({
      Body: JSON.stringify(body),
      Bucket: bucket,
      Key: key,
    });

    const response = await this.client.send(command);
    return response;
  }

  async getObject({ bucket, key }) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const response = await this.client.send(command);

    const body = await response.Body.transformToString();

    return JSON.parse(body);
  }

  async putValuesToNotification(valuesToNotification) {
    return await this.putObject({
      bucket: this.config.bucket,
      key: this.config.key,
      body: valuesToNotification,
    });
  }

  async getValuesForNotification() {
    try {
      const result = await this.getObject({
        bucket: this.config.bucket,
        key: this.config.key,
      });

      return result;
    } catch (error) {
      if (error.Code === "NoSuchKey") {
        console.log(`File ${this.config.key} not found. Creating a new one as a fallback.`);

        const valuesToNotification = [];

        await this.putValuesToNotification(valuesToNotification);

        return valuesToNotification;
      }
      throw error;
    }
  }
}
