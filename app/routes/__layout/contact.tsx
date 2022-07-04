// interface ContactPageProps {}

import GenericCardLayout from "../../components/layout/GenericCardLayout";

const ContactPage: React.FC<any> = () => {
  const title = "Contact";
  const shortDesc = "Thanks for visiting, and wanting to reach out.";
  return (
    <>
      <GenericCardLayout title={title} shortDesc={shortDesc}>
        <div className="pr-10">
          To report and see issues check out the{" "}
          <a
            target="_blank"
            href="https://github.com/telegrace/obj-detection-remix/issues"
            rel="noreferrer"
          >
            <span className="underline underline-offset-1"> GitHub repro</span>
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
      </GenericCardLayout>
    </>
  );
};

export default ContactPage;
