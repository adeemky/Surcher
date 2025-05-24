import StatCard from "./StatCard";
import { Link } from "react-router-dom";

const SectionBlock = ({
  imgSrc,
  imgPosition = "left",
  title,
  description,
  stats,
  buttonText,
  buttonLink = "#",
}) => {
  const isReversed = imgPosition === "right";
  return (
    <div
      className={`flex flex-col bg-gradient-to-br from-slate-100 via-white to-slate-200 rounded-xl py-16 px-4 shadow-md ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} items-center md:items-center gap-10 w-full px-4 md:px-10`}
    >
      <img
        src={imgSrc}
        className="w-100 h-90 md:w-[450px] flex-shrink-0 rounded-xl shadow-lg border border-slate-200"
      />
      <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left flex-1">
        <h3 className="text-4xl font-semibold text-slate-700 mb-4 font-nunito">{title}</h3>
        <p className="text-slate-600 text-xl font-nunito mb-6">{description}</p>
        <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
          {stats.map((s, i) => (
            <StatCard key={i} title={s.title} description={s.description} />
          ))}
        </div>
        <Link to={buttonLink} className="mt-5">
          <button className="group relative inline-flex items-center justify-center w-80 h-20 px-8 text-2xl font-nunito text-white shadow-md rounded-full transition-all duration-300 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:via-amber-500 hover:to-amber-400 hover:shadow-lg">
            <span className="mr-7 transition-all duration-300 group-hover:translate-x-[6px]">
              {buttonText}
            </span>
            <svg
              viewBox="0 0 28 20"
              className="w-5 h-5 transition-all duration-500 group-hover:translate-x-3 fill-white"
              fill="currentColor"
            >
              <path d="M18,19c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414L23.586,11H2c-0.552,0-1-0.448-1-1s0.448-1,1-1h21.586l-6.293-6.293c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0l8,8c0.097,0.096,0.169,0.208,0.218,0.326C26.973,9.735,27,9.863,27,9.997l0,0c0,0.002,0,0.004,0,0.006l0,0c0,0.134-0.027,0.262-0.075,0.378c-0.049,0.119-0.121,0.23-0.218,0.326l-8,8C18.512,18.902,18.256,19,18,19z" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SectionBlock;
