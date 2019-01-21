# Automated Release
This is a sample or 'proof-of-work' project to create a simple executable that can automatically update itself on execution. 

## How it works

  - To deploy, the release package (in this case an index.js file) is uploaded to a public amazon S3 bucket. Anyone can read from this.
  - When our release is executed, it compares the latest release in S3 verses the current version. If it's not equal, it downloads, patches itself, and restarts.

## Setup

As always - you have to have the aws-cli installed and configured for your credentials first.

1. First alter the config section of the package.json. Update your bucketname, aws region, current deployable version, and username. 

2. Run ``` npm run create-bucket ```
3. Run ``` npm run create-user ```
4. Open AWS console in your browser and grab an access-key and access-secret for your new user.  Paste the credentials inside of ``` src/services/AWSStorageProvider.ts ```.
5. Run ``` npm run deploy ``` a couple of times, and update your version both in the config section as well as the ``` example/index.ts ``` file.  This is just to get some versions in the S3 bucket.
6. Down-grade the version in ``` example/index.ts ``` to a lower version. This will force the next execution to patch itself from the latest in S3.
7. Run ``` npm run start-dist ```.  This will auto-patch itself and re-run the latest.

Sample output: 

```
Hi there! I'm version 1.0.1
latest version: 1.0.2
downloading ./downloads/1.0.2.js...
replacing executable...
copying ./downloads/1.0.2.js to c:\projects\automated-release\dist\index.js...
restarting...
Hi there! I'm version 1.0.2
latest version: 1.0.2
here is my business logic: 1.0.2
```

## Some notes
This is not the prettiest code I have ever written, but it's kinda neat.