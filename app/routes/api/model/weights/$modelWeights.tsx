import { json } from "@remix-run/node";
// import weights from "~/data/model.weights.bin";
import { s3, myBucket, streamToString } from "s3";

type Params = {
  params: { modelWeights: string };
};

// export async function loader({ params }: Params) {
//   return json(weights); //No loader is configured for ".bin" files: app/data/model.weights.bin
// }

export async function loader({ params }: Params) {
  let bucketParamsModelWeights = { Bucket: myBucket, Key: params.modelWeights };
  const res: string = await new Promise((resolve, reject) => {
    s3.getObject(bucketParamsModelWeights)
      .then((data) => {
        streamToString(data.Body).then((weights) => {
          console.log(typeof weights);
          resolve(weights);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });

  return json(res);
}
