import React from "react";
import { Link } from "@remix-run/react"; //this just appends to the end
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

// Object { modelPath: "https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/model.json", model: {…} }
// model: Object { modelUrl: "https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/model.json", loadOptions: {}, version: "undefined.undefined", … }
// artifacts: Object { modelTopology: {…}, format: undefined, generatedBy: undefined, … }
// executor: Object { graph: {…}, SEPERATOR: ",", keepTensorForDebug: false, … }
// handler: Object { DEFAULT_METHOD: "POST", weightPathPrefix: undefined, path: "https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/model.json", … }
// loadOptions: Object {  }
// modelUrl: "https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/model.json"
// resourceManager: Object { hashTableNameToHandle: {}, hashTableMap: {} }
// signature: undefined
// version: "undefined.undefined"

// interface Props {}
type VideoRef = React.MutableRefObject<HTMLVideoElement | null>;
interface LoadedModel {
  modelPath: string;
  model: {
    modelUrl: string;
  };
  handler: any;
  loadOptions: {};
}

const IndexPage: React.FC<any> = () => {
  const videoRef: VideoRef = React.useRef(null);
  // const liveView = document.getElementById("liveView");
  // const demosSection = document.getElementById("demos");
  const [isStreaming, setIsStreaming] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<any>(null); //fix this for model

  //models needs to load, then make the predictWebcam
  React.useEffect(() => {
    console.log("isstreaming", isStreaming);
    if (!model) {
      getModel();
    }
    if (isStreaming) {
      getVideo(); //starts webcam
    } else {
      videoRef?.current?.pause(); // this stops the webcam
    }
  }, [isStreaming]);

  const getModel = () => {
    cocoSsd.load().then((loadedModel) => {
      console.log("loadedModel", loadedModel);
      setModel(loadedModel);
    });
  };

  const predictWebcam = (model: string) => {
    return model;
  };

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => {
        console.error("error:", err); //show error for user
      });
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

        {/* <div id="liveView" className="camView">
          <button id="webcamButton">Enable Webcam</button>
          <video id="webcam" autoPlay muted width="640" height="480"></video>
        </div> */}
        <div>
          <div id="liveView" className="camView">
            {isStreaming && (
              <video autoPlay={isStreaming} muted ref={videoRef} />
            )}
          </div>

          {isStreaming ? (
            <button onClick={stopVideo}>Stop Webcam</button>
          ) : (
            <button onClick={startVideo}>Start Webcam</button>
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
