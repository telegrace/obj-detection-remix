// interface ContactPageProps {}

const ContactPage: React.FC<any> = () => {
  const actionURL = "";
  return (
    <>
      <p>Here is the contact page.</p>
      <form method="post" action={actionURL}>
        <label>
          <input name="name" type="text" />
        </label>
        <label>
          <textarea name="description"></textarea>
        </label>
        <button type="submit">Send</button>
      </form>
    </>
  );
};

export default ContactPage;
