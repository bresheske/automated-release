import { AWSStorageProvider } from "../src/services/AWSStorageProvider";
import * as fs from 'fs';
import * as path from 'path';
import * as proc from 'child_process';

const version = "1.0.1";
const bucket = "44399-aaceef-myapp-releases";
const region = "us-east-2";
console.log(`Hi there! I'm version ${version}`);

(async() => {
    const provider = new AWSStorageProvider(bucket, region);
    const latest = await provider.getLatestVersion();
    console.log(`latest version: ${latest}`);

    // update ourself and restart.
    if (version !== latest) {
        const myFile = process.argv[1];
        const newFile = `${latest}.js`
        const location = `./downloads/${newFile}`;
        console.log(`downloading ${location}...`);
        await provider.downloadVersion(newFile, location);
        console.log(`replacing executable...`);
        await copy(location, myFile);
        console.log(`restarting...`);
        // execute the new version of ourselves, print out the result.
        const result = proc.execSync(`node --no-deprecation ${myFile}`).toString('utf8');
        console.log(result);
        return;
    }

    // execute the logic of the program
    console.log(`here is my business logic: ${version}`);
})();

function copy(from: string, to: string): Promise<boolean> {
    return new Promise<boolean>((res) => {
        console.log(`copying ${from} to ${to}...`)
        fs.copyFile(from, to, (err) => {
            if (err) {
                console.log(err);
            }
            res(true);
        });
    });
}