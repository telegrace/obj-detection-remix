import { Prediction } from "~/typings";

interface WebcamDemoProps {
  isStreaming: boolean;
  predictions: Array<Prediction>;
  startVideo: () => void;
  stopVideo: () => void;
}

const WebcamDemo: React.FC<WebcamDemoProps> = ({
  isStreaming,
  predictions,
  startVideo,
  stopVideo,
}) => {
  return (
    <section id="demos">
      <p>
        Hold some objects up close to your webcam to get a real-time
        classification! When ready click "enable webcam" below and accept access
        to the webcam when the browser asks (check the top left of your window)
      </p>
      <div>
        {isStreaming ? (
          <button onClick={stopVideo}>Stop Webcam</button>
        ) : (
          <button onClick={startVideo} disabled={!model}>
            Start Webcam
          </button>
        )}
        <div id="liveView" className="camView">
          {isStreaming &&
            predictions &&
            predictions.map((prediction: Prediction, index) => {
              return (
                <div key={prediction.bbox[0]}>
                  <div
                    className="highlighter"
                    style={prediction?.HTMLStyle?.highlighter}
                  ></div>
                  <p style={prediction?.HTMLStyle?.p}>
                    {prediction.class} with {prediction.confidence}% confidence.
                  </p>
                </div>
              );
            })}
          {isStreaming && <video autoPlay={isStreaming} muted ref={videoRef} />}
        </div>
      </div>
    </section>
  );
};

export default WebcamDemo;
