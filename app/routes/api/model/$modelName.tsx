import { json } from "@remix-run/node";
import { btoa } from "@remix-run/node/base64";
import { s3, myBucket, streamToString } from "s3";
type Params = {
  params: { modelName: "model.json" | "model.weights.bin" };
};

const jsonResponse = (res: string) => {
  return json(JSON.parse(res));
};

const binaryResponse = (res: string) => {
  // console.log("🐙🐙🐙", res);
  // res = btoa(res);
  // console.log("🐙B🐙T🐙O🐙A🐙", res);
  return new Response(res, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
};

const responseTypes = {
  "model.json": jsonResponse,
  "model.weights.bin": binaryResponse,
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
        // looked at the Headers for the gzip encoding
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
