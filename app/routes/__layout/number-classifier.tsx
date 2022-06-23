import React from "react";
import { MetaFunction } from "@remix-run/node";
import CanvasComponent from "~/components/CanvasComponent";

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
