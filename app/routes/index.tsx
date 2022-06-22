import { Link } from "@remix-run/react";

const LandingPage: React.FC<any> = () => {
  return (
    <>
      <h1>TensorFlow.js</h1>
      <p>Explore</p>
      <p className="underline">The quick brown fox...</p>
      <ul>
        <li>
          <Link to="/number-classifier">Number Classifier</Link>
        </li>
        <li>
          <Link to="/obj-detection">Object Detection</Link>
        </li>
      </ul>
    </>
  );
};

export default LandingPage;
