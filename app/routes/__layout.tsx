import { Outlet } from "@remix-run/react";
import { Link } from "@remix-run/react";
import NavLinks from "~/data/NavLinks.json";

const MainLayout: React.FC = () => {
  return (
    <>
      <div className="flex justify-center mt-5">
        <h1>TensorFlow.js X Remix.js</h1>
      </div>
      <nav className="flex sm:justify-center space-x-4 my-5">
        {NavLinks.map((link) => {
          return (
            <Link to={link.path}>
              <div className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900">
                {link.title}
              </div>
            </Link>
          );
        })}
      </nav>

      <Outlet />
    </>
  );
};

export default MainLayout;
