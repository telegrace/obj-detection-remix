import React from "react";
import { Link } from "@remix-run/react"; //this just appends to the end
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

// need to move typings
type VideoRef = React.MutableRefObject<HTMLVideoElement | null>;
type LiveViewChild = HTMLDivElement | HTMLParagraphElement | null;

const IndexPage: React.FC<any> = () => {
  const videoRef: VideoRef = React.useRef(null);
  const [isStreaming, setIsStreaming] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<any>(null); //fix this for model
  const [webcamChildren, setWebcamChildren] = React.useState<
    Array<LiveViewChild>
  >([]);

  //models needs to load, then make the predictWebcam
  React.useEffect(() => {
    console.log("isstreaming", isStreaming);
    if (!model) {
      getModel();
    }
    if (isStreaming) {
      getVideo(); //starts webcam
    }
  }, [isStreaming]);

  const getModel = () => {
    cocoSsd.load().then((loadedModel) => {
      console.log("loadedModel", loadedModel);
      setModel(loadedModel);
    });
  };

  const predictWebcam = (model: any, video: VideoRef) => {
    console.log("video", video);
    // model.detect(video).then(() => {
    //   console.log("model & video", model, video);
    // });
    return model;
  };

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          predictWebcam(model, videoRef);
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
    videoRef?.current?.pause();
    const videoStream = videoRef?.current?.srcObject as MediaStream;
    videoStream.getTracks()[0].stop(); // this stops the webcam
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
            {webcamChildren &&
              webcamChildren.map((child: any) => {
                return <>{child}</>;
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
