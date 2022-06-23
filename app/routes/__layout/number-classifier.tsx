import React from "react";
import { MetaFunction } from "@remix-run/node";
import CanvasComponent from "~/components/CanvasComponent";
import PredictionComponent from "~/components/PredictionComponent";

export const meta: MetaFunction = () => ({
  title: "Number Classifier",
  description: "Number Classifier with Tensorflow.js",
});

const NumberClassifier: React.FC = () => {
  const [prediction, setPredition] = React.useState<number | null>(null);

  const handlePrediction = (modelPrediction: number) => {
    setPredition(modelPrediction);
  };
  return (
    <>
      <div className="intro mb-5">
        <div className="text-center">
          <h1>Number Classifier with MNIST Data Set</h1>

          <p>
            Wait for the model to load and draw a digit on the canvas. Click
            "Predict" to run inference.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center space-y-6 px-4 sm:flex-row sm:space-x-6 sm:space-y-0">
        <CanvasComponent
          prediction={prediction}
          handlePrediction={handlePrediction}
        />
        <PredictionComponent prediction={prediction} />
      </div>
    </>
  );
};

export default NumberClassifier;
