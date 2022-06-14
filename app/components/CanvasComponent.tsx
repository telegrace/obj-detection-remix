// import { trainingData } from "~/data/mnist";

import React from "react";
import * as tf from "@tensorflow/tfjs";
import { CanvasRef, PenObj } from "~/typings";
import { LinksFunction, MetaFunction } from "@remix-run/node";
import stylesUrl from "~/styles/canvas.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

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

  //canvas
  const canvasRef: CanvasRef = React.useRef(null);
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  const WIDTH = 128;
  //canvas state

  React.useEffect(() => {
    if (!model.isloaded) {
      loadModel();
    }
  }, []);

  const loadModel = () => {
    tf.loadLayersModel("http://127.0.0.1:8080/mnist-model.json").then(
      (loadedModel) => {
        setModel({ loadedModel, isloaded: true });
      }
    );
  };

  const [pen, setPen] = React.useState<PenObj>({
    position: { x: 0, y: 0 },
    isDrawing: false,
  });

  React.useEffect(() => {
    if (pen.isDrawing && ctx) {
      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
      ctx.moveTo(pen.position.x, pen.position.y);
      ctx.lineTo(pen.position.x, pen.position.y);
      ctx.stroke();
    }
  }, [pen]);

  return (
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
      <button>Predict</button>
    </div>
  );
};

export default CanvasComponent;
