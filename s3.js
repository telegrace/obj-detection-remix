const aws = require("@aws-sdk/client-s3");

let secrets;
if (process.env.NODE_ENV == "production") {
  secrets = process.env; // in prod the secrets are environment variables
} else {
  secrets = require("./token.json"); // in dev they are in secrets.json which is listed in .gitignore
}

export async function streamToString(stream) {
  return await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

const credentials = {
  region: "eu-central-1",
  credentials: {
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
  },
};

export const s3 = new aws.S3(credentials);
export const myBucket = secrets.BUCKET;
