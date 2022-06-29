import { json } from "@remix-run/node";
import { s3, myBucket, streamToString } from "s3";
type Params = {
  params: { modelName: string };
};

// the component will send a request this route
// this route will make a request to the s3 bucket
// this route will return the response from the s3 bucket

// export async function loader({ params }: Params) {
//   let bucketParamsModel = { Bucket: myBucket, Key: params.modelName };
//   return json(
//     await s3
//       .getObject(bucketParamsModel)
//       .then((data) => {
//         streamToString(data.Body).then((model) => {
//           console.log("💕💕💕 model", model);
//           return model;
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//         return err;
//       })
//   );
// }

export async function loader({ params }: Params) {
  let bucketParamsModel = { Bucket: myBucket, Key: params.modelName };

  const res = await s3
    .getObject(bucketParamsModel)
    .then((data) => {
      streamToString(data.Body).then((model) => {
        console.log("💕💕💕 model", model);
        return model;
      });
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
  console.log("💕💕💕💕💕💕 res", await res);
  return json(await res.json());
}

// [1] 💕💕💕💕💕💕 res undefined
// [1] TypeError: Cannot read property 'json' of undefined

// Not everything makes it! Loaders are for data, and data needs to be serializable.
