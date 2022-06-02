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
              style={prediction?.HTMLStyle?.highlighter}
            ></div>
            <p style={prediction?.HTMLStyle?.p}>
              {prediction.class} with {prediction.confidence}% confidence.
            </p>
          </div>
        );
      })}
    </>
  );
};

export default PredictionsOverlay;
