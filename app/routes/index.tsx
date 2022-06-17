import { Link } from "@remix-run/react";
import styles from "~/styles/app.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

const LandingPage: React.FC<any> = () => {
  return (
    <>
      <h1 className="text-3xl font-bold underline">TensorFlow.js</h1>
      <p>Explore</p>
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
