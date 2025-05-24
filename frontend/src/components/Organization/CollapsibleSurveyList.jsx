import SurveyCard from "../Commons/SurveyCard";
import upArrow from "../../images/up-arrow.png";
import downArrow from "../../images/down-arrow.png";

const CollapsibleSurveyList = ({ title, surveys, isOpen, setIsOpen }) => {
  if (surveys.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto mt-4">
      <h2
        className="text-3xl text-cyan-600 mb-2 bg-gradient-to-br from-neutral-100 via-white to-neutral-100 border py-6 px-4 cursor-pointer flex justify-between items-center rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-center w-full">{title}</span>
        <img
          src={isOpen ? upArrow : downArrow}
          alt="Toggle"
          className="w-7 h-7 flex-shrink-0"
        />
      </h2>
      <div
        className={`transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="w-full flex flex-wrap justify-center gap-y-4 px-4">
          {surveys.map((survey) => (
            <div key={survey.id} className="w-full sm:w-1/2 px-2 mb-4">
              <SurveyCard survey={survey} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSurveyList;
