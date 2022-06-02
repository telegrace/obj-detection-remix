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
        <button onClick={stopVideo}>Stop Webcam</button>
      ) : (
        <button onClick={startVideo} disabled={!modelLoaded}>
          Start Webcam
        </button>
      )}
    </>
  );
};

export default WebcamBtn;
