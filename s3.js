const aws = require("@aws-sdk/client-s3");

let secrets;
if (process.env.NODE_ENV == "production") {
  secrets = process.env; // in prod the secrets are environment variables
} else {
  secrets = require("./token.json"); // in dev they are in secrets.json which is listed in .gitignore
}

async function streamToString(stream) {
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

const s3 = new aws.S3(credentials);
console.log(secrets);
const myBucket = secrets.BUCKET;
const model = "model.json";
const weights = "weights.bin";

let bucketParamsModel = { Bucket: myBucket, Key: model };
let bucketParamsWeights = { Bucket: myBucket, Key: weights };

s3.getObject(bucketParamsModel)
  .then((data) => {
    //console.log(Buffer.from(data.Body).toString("utf-8"));
    streamToString(data.Body).then((model) => {
      console.log("model", model);
      return model;
    });
  })
  .catch((err) => {
    console.log(err);
  });

s3.getObject(bucketParamsModel)
  .then((data) => {
    //console.log(Buffer.from(data.Body).toString("utf-8"));
    streamToString(data.Body).then((weights) => {
      console.log("weights", weights);
      return weights;
    });
  })
  .catch((err) => {
    console.log(err);
  });
// https://mnist-model.s3.eu-central-1.amazonaws.com/model.json
