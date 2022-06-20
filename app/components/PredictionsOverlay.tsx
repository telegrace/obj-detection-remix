import { Prediction } from "~/typings";

interface PredictionsOverlayProps {
  predictions: Prediction[];
}

const PredictionsOverlay: React.FC<PredictionsOverlayProps> = ({
  predictions,
}) => {
  return (
    <>
      {predictions.map((prediction: Prediction) => {
        return (
          <div key={prediction.bbox[0]}>
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
              style={{
                marginLeft: prediction.bbox[0] + "px",
                marginTop: prediction.bbox[1] - 10 + "px",
                width: prediction.bbox[2] - 10 + "px",
                top: 0,
                left: 0,
              }}
            >
              {prediction.class} with {prediction.confidence}% confidence.
            </p>
          </div>
        );
      })}
    </>
  );
};

export default PredictionsOverlay;
