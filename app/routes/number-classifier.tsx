// import { trainingData } from "~/data/mnist";

import React from "react";
import { CanvasRef } from "~/typings";
import { Link } from "@remix-run/react";
import { LinksFunction, MetaFunction } from "@remix-run/node";
import stylesUrl from "~/styles/canvas.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const meta: MetaFunction = () => ({
  title: "Number Classifier",
  description: "Number Classifier with Tensorflow.js",
});

type CanvasCoords = {
  x: number;
  y: number;
};

type PenObj = {
  position: CanvasCoords;
  isDrawing: boolean;
};

const NumberClassifier: React.FC<any> = (props) => {
  //canvas
  const canvasRef: CanvasRef = React.useRef(null);
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");

  //canvas state

  const [pen, setPen] = React.useState<PenObj>({
    position: { x: 0, y: 0 },
    isDrawing: false,
  });

  const getPosition = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (canvas) {
      let x = e.clientX - canvas.offsetLeft;
      let y = e.clientY - canvas.offsetTop;
      setPen({ ...pen, position: { x, y } });
      console.log("position", pen.position);
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
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
      ctx.moveTo(pen.position.x, pen.position.y);
      getPosition(e);
      ctx.lineTo(pen.position.x, pen.position.y);
      ctx.stroke();
    }
  };

  React.useEffect(() => {}, [pen]);
  return (
    <>
      <h1>TensorFlow.js MNIST classifier</h1>
      <canvas
        id="canvas"
        width="128"
        height="128"
        ref={canvasRef}
        {...props}
        onMouseDown={(e) => {
          startDrawing(e);
        }}
        onMouseUp={() => {
          stopDrawing();
        }}
        onMouseMove={(e) => {
          draw(e);
        }}
      />
      <button>Clear Canvas</button>
      <button>Submit</button>
    </>
  );
};

export default NumberClassifier;
