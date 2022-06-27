// interface ContactPageProps {}

const ContactPage: React.FC<any> = () => {
  const actionURL = "";
  return (
    <>
      <div className="intro mb-5">
        <div className="text-center">
          <p>Contact Me</p>
          <p>
            Thanks for visiting, if you find any bugs or want to get in touch,
            feel free to reach out.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-4 sm:flex-row ">
        <div className="w-1/3 h-50v h-overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:shadow-lg border-solid border-2 border-gray-100 p-8">
          <h1 className="mb-3">Contact</h1>
          <div className="pr-10">
            To report and see issues check out the{" "}
            <a
              target="_blank"
              href="https://github.com/telegrace/obj-detection-remix/issues"
              rel="noreferrer"
            >
              <span className="underline underline-offset-1">
                {" "}
                GitHub repro
              </span>
            </a>
            .<br></br>
            <br></br>
            Feel free to check out my{" "}
            <a
              target="_blank"
              href="https://www.linkedin.com/in/telegrace/"
              rel="noreferrer"
            >
              <span className="underline underline-offset-1"> LinkedIn</span>
            </a>{" "}
            too.
            <br></br>
            <br></br>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
