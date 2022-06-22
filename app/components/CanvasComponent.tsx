import React from "react";
import * as tf from "@tensorflow/tfjs";
import { CanvasRef, PenObj } from "~/typings";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => ({
  title: "Number Classifier",
  description: "Number Classifier with Tensorflow.js",
});

type MNISTModel = {
  loadedModel: any;
  isloaded: boolean;
};

const CanvasComponent: React.FC<any> = (props) => {
  //model
  const [model, setModel] = React.useState<MNISTModel>({
    loadedModel: null,
    isloaded: false,
  });

  const [prediction, setPredition] = React.useState<number | null>(null);
  //canvas
  const canvasRef: CanvasRef = React.useRef(null);
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  const WIDTH = 280;
  //canvas state

  const [pen, setPen] = React.useState<PenObj>({
    position: { x: 0, y: 0 },
    isDrawing: false,
  });

  React.useEffect(() => {
    if (!model.isloaded) {
      loadModel();
    }
  }, []);

  React.useEffect(() => {
    if (prediction) {
      console.log("prediction", prediction);
    }
  }, [prediction]);

  React.useEffect(() => {
    if (pen.isDrawing && ctx) {
      ctx.beginPath();
      ctx.lineWidth = 20;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
      ctx.moveTo(pen.position.x, pen.position.y);
      ctx.lineTo(pen.position.x, pen.position.y);
      ctx.stroke();
    }
  }, [pen]);

  // const MODEL_PATH = "http://127.0.0.1:8080/mnist-model.json"
  const MODEL_PATH = "http://127.0.0.1:8080/model.json";

  const loadModel = () => {
    tf.loadLayersModel(MODEL_PATH).then((loadedModel) => {
      console.log("loadedModel", loadedModel);
      setModel({ loadedModel, isloaded: true });
    });
  };

  const handlePredictButton = () => {
    const imageData = ctx?.getImageData(0, 0, WIDTH, WIDTH);

    if (imageData) {
      let answer = tf.tidy(() => {
        const tensor = tf.tensor(imageData.data);
        const reshapedTensor = tensor.reshape([280, 280, 4]);
        const alphaChannelInput = reshapedTensor
          .resizeBilinear([28, 28]) // resize to 28x28
          .slice([0, 0, 3], [28, 28, 1]) // get the alpha channel
          .squeeze() // remove the extra dimension
          .reshape([1, 28 * 28]) // reshape to a 1D tensor
          .div(255); // normalize to [0, 1]

        return model.loadedModel.predict(alphaChannelInput);
      });
      answer.array().then((array: Array<Array<number>>) => {
        const answerArr = array[0];

        const max = Math.max(...answerArr);
        const index = answerArr.indexOf(max);
        console.log(index);
        setPredition(index);
        answer.dispose();
      });
    }
  };

  return (
    <>
      <p>Draw a single digit and run inference with the Predict button.</p>
      <div
        onMouseUp={() => {
          setPen({ ...pen, isDrawing: false });
        }}
      >
        <canvas
          id="canvas"
          width={WIDTH}
          height={WIDTH}
          ref={canvasRef}
          onMouseDown={() => {
            setPen({ ...pen, isDrawing: true });
          }}
          onMouseMove={(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
            if (canvas) {
              let x = e.clientX - canvas.offsetLeft;
              let y = e.clientY - canvas.offsetTop;
              setPen({ ...pen, position: { x, y } });
            }
          }}
        />
        <button
          onClick={() => {
            ctx?.clearRect(0, 0, WIDTH, WIDTH);
          }}
        >
          Clear Canvas
        </button>
        <button
          onClick={() => {
            handlePredictButton();
          }}
        >
          Predict
        </button>
      </div>
      <h1>Predictions</h1>
      {prediction && prediction}
    </>
  );
};

export default CanvasComponent;
