import React from "react";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { Prediction, VideoRef } from "~/typings";
import { MetaFunction } from "@remix-run/node";
import WebcamBtn from "~/components/WebcamBtn";
import PredictionsOverlay from "~/components/PredictionsOverlay";

type Model = {
  loadedModel: cocoSsd.ObjectDetection | null;
  isloaded: boolean;
};

export const meta: MetaFunction = () => ({
  title: "Multi-Object Detection",
  description: "Multi-Object Detection with Tensorflow.js",
});

const ObjectDetectionPage: React.FC<any> = () => {
  const videoRef: VideoRef = React.useRef(null);
  const [isStreaming, setIsStreaming] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<Model>({
    loadedModel: null,
    isloaded: false,
  });
  const [predictions, setPredictions] = React.useState<Array<Prediction>>([]);

  React.useEffect(() => {
    if (!model.isloaded) {
      loadModel();
    }
  }, []);

  React.useEffect(() => {
    if (isStreaming) {
      getVideo();
    } else {
      if (videoRef.current) {
        videoRef?.current?.pause();
        const videoStream = videoRef?.current?.srcObject as MediaStream;
        videoStream.getTracks()[0].stop();
      }
    }
  }, [isStreaming]);

  const loadModel = () => {
    cocoSsd.load().then((loadedModel) => {
      setModel({ loadedModel: loadedModel, isloaded: true });
    });
  };

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          videoRef.current.addEventListener("loadeddata", () => {
            if (isStreaming) {
              // console.log("videoRef.current", videoRef.current); // this keeps the webcam running?
              predictWebcam();
            }
          });
        }
      })
      .catch((err) => {
        console.log("getVideo error: ", err);
      });
  };

  const predictWebcam = () => {
    if (model.loadedModel) {
      model.loadedModel
        .detect(videoRef.current as HTMLVideoElement)
        .then((predictions: Array<Prediction>) => {
          for (let n = 0; n < predictions.length; n++) {
            if (predictions[n].score > 0.66) {
              predictions[n].confidence = Math.round(
                predictions[n].score * 100
              );
              setPredictions(predictions);
            }
          }
        })
        .catch((err) => {
          console.log("predictWebcam error: ", err);
          return;
        });
      // window.requestAnimationFrame(() => {
      //   predictWebcam();
      // });
    }
  };

  const startVideo = () => {
    setIsStreaming(true);
  };

  const stopVideo = () => {
    setIsStreaming(false);
  };

  return (
    <>
      <h1>
        Multiple object detection using a pre-trained model in TensorFlow.js
      </h1>

      <p>
        Wait for the{" "}
        <a
          target="_blank"
          href="https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd"
          rel="noreferrer"
        >
          COCO-SSD model
        </a>{" "}
        to load and click "enable webcam" to start predictions.
      </p>

      <section id="demos">
        <div>
          <div id="liveView" className="camView">
            <WebcamBtn
              isStreaming={isStreaming}
              stopVideo={stopVideo}
              startVideo={startVideo}
              modelLoaded={model.isloaded}
            />
            {isStreaming && predictions && (
              <PredictionsOverlay predictions={predictions} />
            )}
            {isStreaming && <video muted ref={videoRef} />}
          </div>
        </div>
      </section>
    </>
  );
};

export default ObjectDetectionPage;
