import React from "react";
import { Link } from "@remix-run/react"; //this just appends to the end
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import stylesUrl from "~/global-styles.css";
import { Prediction, VideoRef } from "~/typings";
import { LinksFunction, MetaFunction } from "@remix-run/node";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const meta: MetaFunction = () => ({
  title: "Multi-Object Detection",
  description: "Multi-Object Detection with Tensorflow.js",
});

const IndexPage: React.FC<any> = () => {
  const videoRef: VideoRef = React.useRef(null);
  const [isStreaming, setIsStreaming] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<cocoSsd.ObjectDetection | null>(
    null
  ); //fix this for model
  const [predictions, setPredictions] = React.useState<Array<Prediction>>([]);

  React.useEffect(() => {
    if (!model) {
      loadModel();
    }
  }, []); //bad practice? Turn this into a hook

  React.useEffect(() => {
    console.log("isstreaming", isStreaming);
    if (isStreaming) {
      getVideo(); //starts webcam
    }
  }, [isStreaming]);

  const loadModel = () => {
    cocoSsd.load().then((loadedModel) => {
      setModel(loadedModel);
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
            predictWebcam();
          });
        }
      })
      .catch((err) => {
        console.error("error:", err); //show error for user
      });
  };

  const predictWebcam = () => {
    if (model) {
      model
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
        });
    }
  };

  const startVideo = () => {
    setIsStreaming(true);
  };

  const stopVideo = () => {
    setIsStreaming(false);
    videoRef?.current?.pause();
    const videoStream = videoRef?.current?.srcObject as MediaStream;
    videoStream.getTracks()[0].stop();
  };

  return (
    <>
      <h1>
        Multiple object detection using pre trained model in TensorFlow.js
      </h1>

      <p>
        Wait for the model to load before clicking the button to enable the
        webcam - at which point it will become visible to use.
      </p>

      <section id="demos">
        <p>
          Hold some objects up close to your webcam to get a real-time
          classification! When ready click "enable webcam" below and accept
          access to the webcam when the browser asks (check the top left of your
          window)
        </p>
        <div>
          <div id="liveView" className="camView">
            {isStreaming &&
              predictions &&
              predictions.map((prediction: Prediction, index) => {
                return (
                  <>
                    <div
                      className="highlighter"
                      style={{
                        left: prediction.bbox[0] + "px",
                        top: prediction.bbox[1] + "px",
                        width: prediction.bbox[2] + "px",
                        height: prediction.bbox[3] + "px",
                      }}
                    ></div>
                    <p
                      key={index}
                      style={{
                        marginLeft: prediction.bbox[0] + "px",
                        marginTop: prediction.bbox[1] - 10 + "px",
                        width: prediction.bbox[2] - 10 + "px",
                        top: 0,
                        left: 0,
                      }}
                    >
                      {prediction.class} with {prediction.confidence}%
                      confidence.
                    </p>
                  </>
                );
              })}
            {isStreaming && (
              <video autoPlay={isStreaming} muted ref={videoRef} />
            )}
          </div>
          {isStreaming ? (
            <button onClick={stopVideo}>Stop Webcam</button>
          ) : (
            <button onClick={startVideo} disabled={!model}>
              Start Webcam
            </button>
          )}
        </div>
      </section>

      <p>
        Further reading for{" "}
        <Link to="https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd">
          COCO-SSD model
        </Link>
        .
      </p>
    </>
  );
};

export default IndexPage;
