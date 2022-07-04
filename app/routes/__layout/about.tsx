import GenericCardLayout from "~/components/layout/GenericCardLayout";
import TechStackLinks from "~/data/TechStackLinks.json";

// interface AboutPageProps {}

const AboutPage: React.FC<any> = () => {
  const title = "About";
  const shortDesc = "Machine Learning on the edge.";
  return (
    <>
      <GenericCardLayout title={title} shortDesc={shortDesc}>
        <div className="pr-10">
          Here is a showcase of two machine learning models made with
          TensorFlow.js.
          <br></br>
          <br></br>• COCO-SSD which is a pre-trained model can detect up to 80
          objects.
          <br></br>
          <br></br>• Number Classifier which was trained with the MNIST data set
          can recognise hand written numbers.
          <br></br>
          <br></br>
          Privacy is one of the biggest advantages as well as lower costs of
          TensowFlow.js, since no data is sent nor stored on a server. Other
          benefits of using TensorFlow.js is that there is lower latency since
          there is direct access to the camera and also greater reach and scale.
          <br></br>
          <br></br>
          <p>Thanks for visiting, this site is still a work in progress.</p>
          <br></br>
          <br></br>
        </div>
      </GenericCardLayout>

      <div className="flex justify-center px-4 sm:flex-row  ">
        <div className="bg-gray-100 px-3 py-2 text-gray-500 font-medium  mb-3">
          TECH STACK
        </div>

        {TechStackLinks.map((link) => {
          console.log("link ", link.title, " URL ", link.URL);
          return (
            <div
              className="bg-white border-solid border-2 border-gray-100 px-3 py-2 text-slate-700 font-medium hover:text-slate-900 hover:-translate-y-2 mb-3 "
              key={link.title}
            >
              <a target="_blank" href={link.URl} rel="noreferrer">
                {link.title}
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AboutPage;
