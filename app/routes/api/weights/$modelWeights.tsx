import { json } from "@remix-run/node";

type Params = {
  params: { modelWeights: string };
};

//the component will send a request this route
// this route will make a request to the s3 bucket
// this route will return the response from the s3 bucket

export async function loader({ params }: Params) {
  //model name should be model.weights.bin

  const url = new URL(params.modelWeights);
  return json(url);
}
