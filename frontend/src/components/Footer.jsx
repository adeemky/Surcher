import logo from "../images/s.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-yellow-50 py-8 mt-20 font-nunito">
      <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold">Surcher</h4>
          <p className="text-sm text-yellow-50 pt-3">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        <div className="flex justify-center md:justify-center">
          <img src={logo} alt="SurveyApp logo" className="h-12 w-auto" />
        </div>

        <div className="flex space-x-4">
          <Link
            to="/contact"
            className="text-yellow-50 hover:text-amber-200 text-m transition"
          >
            Contact
          </Link>
          <Link to="/" className="text-yellow-50 hover:text-amber-200 text-m transition">
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
