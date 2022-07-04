import { ReactNode } from "react";

interface GenericCardLayoutProps {
  title: string;
  shortDesc?: string | ReactNode;
}

const GenericCardLayout: React.FC<GenericCardLayoutProps> = ({
  title,
  shortDesc,
  children,
}) => {
  return (
    <>
      <div className="intro mb-5">
        <div className="text-center">
          <p>{title}</p>
          <p>{shortDesc && shortDesc}</p>
        </div>
      </div>

      <div className="flex justify-center px-4 sm:flex-row ">
        <div className=" md:w-screen lg:w-1/3  h-overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:shadow-lg border-solid border-2 border-gray-100 p-8 ">
          {children}
        </div>
      </div>
    </>
  );
};

export default GenericCardLayout;
