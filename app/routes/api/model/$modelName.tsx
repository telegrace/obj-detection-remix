import { json } from "@remix-run/node";
import { s3, myBucket, streamToString } from "s3";

//seperate API routes to be sure to call s3.getObject twice

type Params = {
  params: { modelName: "model.json" };
};

const jsonResponse = (res: string) => {
  return json(JSON.parse(res));
};

const responseTypes = {
  "model.json": jsonResponse,
};

export async function loader({ params }: Params) {
  const responseFn = responseTypes[params.modelName];

  if (!responseFn) {
    throw new Error(`No response function for ${params.modelName}`);
  }

  let bucketParamsModel = { Bucket: myBucket, Key: params.modelName };
  const res: string = await new Promise((resolve, reject) => {
    s3.getObject(bucketParamsModel)
      .then((data) => {
        streamToString(data.Body).then((model) => {
          resolve(model);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });

  return responseFn(res);
}
