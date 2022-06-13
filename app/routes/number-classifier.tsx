// import { trainingData } from "~/data/mnist";

import React from "react";
import { CanvasRef } from "~/typings";

// interface Props {}

const NumberClassifier: React.FC<any> = (props) => {
  const canvasRef: CanvasRef = React.useRef(null);
  React.useEffect(() => {}, []);
  return (
    <>
      <h1>TensorFlow.js MNIST classifier</h1>
      <canvas ref={canvasRef} {...props} />
      <button>Clear Canvas</button>
    </>
  );
};

export default NumberClassifier;
