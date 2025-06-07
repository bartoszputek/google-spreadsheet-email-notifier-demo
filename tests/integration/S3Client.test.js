import assert from "assert";
import { describe, it } from "node:test";
import S3Client from "../../src/S3Client.js";

describe("S3Client", async () => {
  describe("getNotifiedValues", async () => {
    it("should not throw an error when getting a file", async () => {
      const s3Client = new S3Client({
        config: {
          region: "eu-central-1",
          bucket: "values-bucket-20250601",
          key: "valuesDump.json",
        },
      });

      assert.doesNotReject(async () => {
        const result = await s3Client.getNotifiedValues();

        console.log({ result });
      });
    });
  });
});
