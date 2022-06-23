import ModelLoadingButton from "./ModelLoadingModel";

interface WebcamBtnProps {
  isStreaming: boolean;
  stopVideo: () => void;
  startVideo: () => void;
  modelLoaded: boolean;
}

const WebcamBtn: React.FC<WebcamBtnProps> = ({
  isStreaming,
  stopVideo,
  startVideo,
  modelLoaded,
}) => {
  // ternary in a ternary
  return (
    <div className="mb-5">
      {modelLoaded ? (
        <>
          {isStreaming ? (
            <button
              onClick={stopVideo}
              className="rounded-lg px-3 py-2 border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline"
            >
              Stop Webcam
            </button>
          ) : (
            <button
              onClick={startVideo}
              className="rounded-lg px-3 py-2 border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
            >
              Start Webcam
            </button>
          )}
        </>
      ) : (
        <>
          <ModelLoadingButton />
        </>
      )}
    </div>
  );
};

export default WebcamBtn;
