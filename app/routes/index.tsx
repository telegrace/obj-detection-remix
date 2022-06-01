import React from "react";
import { Link } from "@remix-run/react"; //this just appends to the end
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import styles from "~/global-styles.css";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
}
// need to move typings
type VideoRef = React.MutableRefObject<HTMLVideoElement | null>;
type LiveViewChild = HTMLDivElement | HTMLParagraphElement | null;
type Prediction = {
  bbox: [number, number, number, number];
  class: string;
  score: number;
  confidence?: number;
  HTMLStyle?: string;
};

const IndexPage: React.FC<any> = () => {
  const videoRef: VideoRef = React.useRef(null);
  const [isStreaming, setIsStreaming] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<any>(null); //fix this for model
  const [webcamChildren, setWebcamChildren] = React.useState<
    Array<LiveViewChild>
  >([]);
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
      console.log("loadedModel", loadedModel);
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
    // error handling for the predictions
    model.detect(videoRef.current).then((predictions: Array<Prediction>) => {
      // console.log("predictions", predictions);
      // remove previous bounding boxes
      // add new bounding boxes
      for (let n = 0; n < predictions.length; n++) {
        if (predictions[n].score > 0.66) {
          predictions[n].confidence = Math.round(predictions[n].score * 100);
          setPredictions(predictions);

          // const p = document.createElement("p");
          // p.innerText =
          //   predictions[n].class +
          //   " - with " +
          //   Math.round(predictions[n].score * 100) +
          //   "% confidence.";

          // p.style.marginLeft = predictions[n].bbox[0] + "px";
          // p.style.marginTop = predictions[n].bbox[1] - 10 + "px";
          // p.style.width = predictions[n].bbox[2] - 10 + "px";
          // p.style.top = "0";
          // p.style.left = "0";

          // const highlighter = document.createElement("div");
          // highlighter.setAttribute("class", "highlighter");
          // highlighter.style =
          //   "left: " +
          //   predictions[n].bbox[0] +
          //   "px; top: " +
          //   predictions[n].bbox[1] +
          //   "px; width: " +
          //   predictions[n].bbox[2] +
          //   "px; height: " +
          //   predictions[n].bbox[3] +
          //   "px;";

          // liveView.appendChild(highlighter);
          // liveView.appendChild(p);
          // children.push(highlighter);
          // children.push(p);
        }
      }
    });
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
            {predictions &&
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
