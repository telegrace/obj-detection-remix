import TechStackLinks from "~/data/TechStackLinks.json";

// interface AboutPageProps {}

const AboutPage: React.FC<any> = () => {
  return (
    <>
      <div className="intro mb-5">
        <div className="text-center">
          <p>Machine Learning on the edge</p>
          <p>Thanks for visiting, this site is still a work in progress.</p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-4 sm:flex-row ">
        <div className="w-1/3 h-50v h-overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:shadow-lg border-solid border-2 border-gray-100 p-8">
          <h1 className="mb-3">About</h1>
          <p className="pr-10">
            Here is a showcase of two machine learning models.
            <br></br>
            <br></br>
            COCO-SSD which is a pre-trained model can detect up to 80 objects.
            <br></br>
            <br></br>
            Number Classifier which was trained with the MNIST data set.
            <br></br>
            <br></br>
            This website runs inference on directly on your browser, which means
            there's no need to send your data anywhere and the since the models
            are already trained no extra data is needed.
            <br></br>
          </p>

          <div className="flex justify-end -mt-40">
            <div className="inline-block">
              <div className="bg-gray-100 px-3 py-2 text-gray-500 font-medium  mb-3 -mr-20">
                TECH STACK
              </div>

              {TechStackLinks.map((link) => {
                console.log("link ", link.title, " URL ", link.URL);
                return (
                  <div
                    className="bg-white border-solid border-2 border-gray-100 px-3 py-2 text-slate-700 font-medium hover:text-slate-900 hover:translate-x-3 mb-3 -mr-20"
                    key={link.title}
                  >
                    <a target="_blank" href={link.URl} rel="noreferrer">
                      {link.title}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
