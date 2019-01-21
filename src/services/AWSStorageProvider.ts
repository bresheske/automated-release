import { IStorageProvider } from "./IStorageProvider";
import * as aws from 'aws-sdk';
import { S3 } from "aws-sdk";
import * as fs from 'fs';
import { Stream, Duplex } from "stream";

export class AWSStorageProvider implements IStorageProvider {
    private s3: S3;
    private bucket: string = '';
    private region: string = '';
    
    // note - these credentials don't have access to anything.
    // it's just a dummy user to use with the SDK. The bucket is already set as public.
    private accessId = '';
    private secretId = '';

    constructor(bucket: string, region: string) {
        this.bucket = bucket;
        this.region = region;
        this.s3 = new aws.S3({ region: this.region, credentials: { accessKeyId: this.accessId, secretAccessKey: this.secretId } });
    }

    async getLatestVersion(): Promise<string|null> {
        const params = {
            Bucket: this.bucket,
        };
        const result = await this.s3.listObjectsV2(params)
            .promise();
        const objects: S3.Object[] | undefined = result.Contents;
        if (!objects) {
            return null;
        }
        const sorted = objects
            .map(o => o.Key)
            .sort((a, b) => {
                return a < b ? 1
                    : b < a ? -1
                    : 0;
            });
        const latest = sorted[0];
        // strip off the extension
        const name = latest || null;
        return name
            ? name.replace(/\.[^/.]+$/, "")
            : null;
    }

    async downloadVersion(fullFileName: string, destinationPath: string): Promise<boolean> {
        const params = {
            Bucket: this.bucket,
            Key: fullFileName
        };
        const result = await this.s3.getObject(params)
            .promise();
        const readStream = this.createStreamFromBuffer(<Buffer>result.Body);
        const writeStream = fs.createWriteStream(destinationPath);
        return new Promise<boolean>((res) => {
            readStream.pipe(writeStream);
            writeStream.on('close', () => {
                res(true);
            });
        });
    }

    private createStreamFromBuffer(body: Buffer) {
        const stream = new Duplex();
        stream.push(body);
        stream.push(null);
        return stream;
    }
}