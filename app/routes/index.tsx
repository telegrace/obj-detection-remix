import React from "react";
import { Link } from "@remix-run/react"; //this just appends to the end
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import stylesUrl from "~/global-styles.css";
import { Prediction, VideoRef } from "~/typings";
import { LinksFunction, MetaFunction } from "@remix-run/node";

type Model = {
  loadedModel: cocoSsd.ObjectDetection | null;
  isloaded: boolean;
};
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
            if (model.loadedModel && isStreaming)
              predictWebcam(model.loadedModel);
          });
        }
      })
      .catch((err) => {
        console.log("getVideo error: ", err); //show error for user
      });
  };

  const predictWebcam = (model: cocoSsd.ObjectDetection) => {
    if (videoRef.current) {
      model
        .detect(videoRef.current as HTMLVideoElement)
        .then((predictions: Array<Prediction>) => {
          for (let n = 0; n < predictions.length; n++) {
            if (predictions[n].score > 0.66) {
              const { bbox, score } = predictions[n];

              predictions[n].confidence = Math.round(score * 100);

              const highlighter = {
                left: bbox[0] + "px",
                top: bbox[1] + "px",
                width: bbox[2] + "px",
                height: bbox[3] + "px",
              };
              const p = {
                marginLeft: bbox[0] + "px",
                marginTop: bbox[1] - 10 + "px",
                width: bbox[2] - 10 + "px",
                top: 0,
                left: 0,
              };

              predictions[n].HTMLStyle = { highlighter, p };

              setPredictions(predictions);
            }
          }
        })
        .catch((err) => {
          console.log("predictWebcam error: ", err);
          return;
        });
      window.requestAnimationFrame(() => {
        predictWebcam(model);
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
            {isStreaming ? (
              <button onClick={stopVideo}>Stop Webcam</button>
            ) : (
              <button onClick={startVideo} disabled={!model.isloaded}>
                Start Webcam
              </button>
            )}
            {isStreaming &&
              predictions &&
              predictions.map((prediction: Prediction) => {
                return (
                  <div key={prediction.bbox[0]}>
                    <div
                      className="highlighter"
                      style={prediction?.HTMLStyle?.highlighter}
                    ></div>
                    <p style={prediction?.HTMLStyle?.p}>
                      {prediction.class} with {prediction.confidence}%
                      confidence.
                    </p>
                  </div>
                );
              })}
            {isStreaming && (
              <video autoPlay={isStreaming} muted ref={videoRef} />
            )}
          </div>
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
