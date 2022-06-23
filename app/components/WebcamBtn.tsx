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
  return (
    <>
      {isStreaming ? (
        <button
          onClick={stopVideo}
          className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900"
        >
          Stop Webcam
        </button>
      ) : (
        <button
          onClick={startVideo}
          disabled={!modelLoaded}
          className="rounded-lg px-3 py-2 border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Start Webcam
        </button>
      )}
    </>
  );
};

export default WebcamBtn;
