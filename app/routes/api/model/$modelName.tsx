import { json } from "@remix-run/node";
import { s3, myBucket, streamToString } from "s3";
import model from "~/data/model.json";
type Params = {
  params: { modelName: string };
};

// the component will send a request this route
// this route will make a request to the s3 bucket
// this route will return the response from the s3 bucket

// export async function loader({ params }: Params) {
//   return json(model);
// }

export async function loader({ params }: Params) {
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

  return json(JSON.parse(res));
}
