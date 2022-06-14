import React from "react";
import { LinksFunction, MetaFunction } from "@remix-run/node";
import stylesUrl from "~/styles/canvas.css";
import CanvasComponent from "~/components/CanvasComponent";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const meta: MetaFunction = () => ({
  title: "Number Classifier",
  description: "Number Classifier with Tensorflow.js",
});

const NumberClassifier: React.FC<any> = (props) => {
  return (
    <>
      <h1>TensorFlow.js MNIST classifier</h1>
      <CanvasComponent />
    </>
  );
};

export default NumberClassifier;
