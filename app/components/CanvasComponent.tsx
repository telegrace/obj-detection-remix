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
      console.log("model", model.loadedModel);
    }
  }, []);

  const loadModel = () => {
    tf.loadLayersModel("http://127.0.0.1:8080/mnist-model.json").then(
      (loadedModel) => {
        setModel({ loadedModel, isloaded: true });
      }
    );
  };

  const handleTest = () => {
    console.log("GRACE", JSON.stringify("../public/data/mnist-model.json"));
  };

  const [pen, setPen] = React.useState<PenObj>({
    position: { x: 0, y: 0 },
    isDrawing: false,
  });

  const getPosition = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (canvas) {
      let x = e.clientX - canvas.offsetLeft;
      let y = e.clientY - canvas.offsetTop;
      setPen({ ...pen, position: { x, y } });
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    console.log("startDrawing");
    setPen({ ...pen, isDrawing: true });
    getPosition(e);
  };

  const stopDrawing = () => {
    console.log("stopDrawing");
    setPen({ ...pen, isDrawing: false });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!pen.isDrawing) return;
    if (ctx) {
      getPosition(e);
      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
      ctx.moveTo(pen.position.x, pen.position.y);
      ctx.lineTo(pen.position.x, pen.position.y);
      ctx.stroke();
    }
  };

  return (
    <>
      <canvas
        id="canvas"
        width={WIDTH}
        height={WIDTH}
        ref={canvasRef}
        onMouseDown={(e) => {
          startDrawing(e);
        }}
        onMouseUp={() => {
          stopDrawing();
        }}
        onMouseMove={(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
          draw(e);
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
    </>
  );
};

export default CanvasComponent;
