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
  const [isWebcamLoaded, setIsWebcamLoaded] = React.useState<boolean>(false);

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
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          videoRef.current.addEventListener("loadeddata", () => {
            if (isStreaming) {
              setIsWebcamLoaded(true);
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
      window.requestAnimationFrame(() => {
        predictWebcam();
      });
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
      <div className="intro mb-5">
        <div className="text-center">
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
        </div>
      </div>
      <div className="flex flex-col items-center justify-center space-y-6 px-4 sm:flex-row sm:space-x-6 sm:space-y-0">
        <div className="w-1/2 h-70v h-overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:shadow-lg border-solid border-2 border-gray-100 p-5">
          <div className="flex justify-center ">
            <WebcamBtn
              isStreaming={isStreaming}
              stopVideo={stopVideo}
              startVideo={startVideo}
              modelLoaded={model.isloaded}
            />
          </div>
          <div className="webcamContainer">
            <div id="liveView" className="camView ">
              {isStreaming && predictions && (
                <PredictionsOverlay predictions={predictions} />
              )}
              {isStreaming && <video muted ref={videoRef} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ObjectDetectionPage;
