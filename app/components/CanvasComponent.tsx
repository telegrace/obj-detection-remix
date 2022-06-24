import React from "react";
import * as tf from "@tensorflow/tfjs";
import { CanvasRef, MNISTModel, PenObj } from "~/typings";
import ModelLoadingButton from "./ModelLoadingModel";

interface CanvasComponentProps {
  prediction: number | null;
  handlePrediction: (modelPrediction: number | null) => void;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  prediction,
  handlePrediction,
}) => {
  //model
  const [model, setModel] = React.useState<MNISTModel>({
    loadedModel: null,
    isloaded: false,
  });

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
        handlePrediction(index);
        answer.dispose();
      });
    }
  };

  return (
    <>
      <div className="w-1/4 h-50v h-overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:shadow-lg border-solid border-2 border-gray-100 p-5 flex justify-center">
        <div
          onMouseUp={() => {
            setPen({ ...pen, isDrawing: false });
          }}
        >
          <p className="mt-5 text-center">Draw Here!</p>
          <canvas
            className="mt-5"
            id="canvas"
            width={WIDTH}
            height={WIDTH}
            ref={canvasRef}
            onMouseDown={() => {
              setPen({ ...pen, isDrawing: true });
            }}
            onMouseMove={(
              e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
            ) => {
              if (canvas) {
                let x = e.clientX - canvas.offsetLeft;
                let y = e.clientY - canvas.offsetTop;
                setPen({ ...pen, position: { x, y } });
              }
            }}
          />
          <div className="flex mt-5 justify-center">
            {model.isloaded ? (
              <>
                <button
                  onClick={() => {
                    ctx?.clearRect(0, 0, WIDTH, WIDTH);
                    handlePrediction(null);
                  }}
                  className="rounded-lg px-3 py-2 border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline"
                >
                  Clear Canvas
                </button>

                <button
                  onClick={() => {
                    handlePredictButton();
                  }}
                  className="rounded-lg px-3 py-2 border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
                >
                  Predict
                </button>
              </>
            ) : (
              <ModelLoadingButton />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CanvasComponent;
