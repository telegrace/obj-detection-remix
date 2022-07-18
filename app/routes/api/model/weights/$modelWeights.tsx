import { s3, myBucket, streamToBinary } from "s3";
type Params = {
  params: { modelWeights: "model.weights.bin" };
};

const binaryResponse = (res: string) => {
  return new Response(res, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
};

const responseTypes = {
  "model.weights.bin": binaryResponse,
};

export async function loader({ params }: Params) {
  const responseFn = responseTypes[params.modelWeights];

  if (!responseFn) {
    throw new Error(`No response function for ${params.modelWeights}`);
  }

  let bucketParamsModel = { Bucket: myBucket, Key: params.modelWeights };
  let res: string;

  res = await new Promise((resolve, reject) => {
    s3.getObject(bucketParamsModel)
      .then((data) => {
        streamToBinary(data.Body).then((model) => {
          resolve(model);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });

  return responseFn(res);
}
