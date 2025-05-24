import { Link } from "react-router-dom";
import participant from "../../images/participant.png";
import OrgProfile from "../Organization/OrgProfile";

const SurveyCard = ({ survey }) => {
  const { id, title, description, category, image, organization } = survey;

  const orgImage = organization.image
    ? organization.image
    : require("../../images/ngodefault.png");
  const surveyImage = image ? image : require("../../images/surveydefault.jpg");
  const totalSurveys =
    organization.number_of_active_surveys + organization.number_of_inactive_surveys;

  return (
    <Link to={survey.is_active ? `/surveys/${id}` : `/results/${id}`} className="block w-full">
      <div className="flex h-60 rounded-lg overflow-hidden shadow-md border bg-white hover:shadow-slate-400 transition-shadow duration-300 font-nunito">
        <div className="w-1/3 h-full">
          <img src={surveyImage} alt={title} className="object-cover h-full w-full" />
        </div>
        <div className="w-2/3 p-4 pb-7 flex flex-col justify-between">
          <OrgProfile
            orgImage={orgImage}
            organization={organization}
            totalSurveys={totalSurveys}
          />
          <div>
            <h2 className="text-lg font-bold text-slate-700">{title}</h2>
            <div className="flex text-sm text-gray-400 -mt-1">
              <p>
                {survey.number_of_questions} question
                {survey.number_of_questions !== 1 ? "s" : ""}
              </p>
            </div>
            <p className="text-sm text-slate-700 line-clamp-3 mt-2 mb-2">{description}</p>
            <div className="flex items-center mt-3 text-sm">
              <p className="text-lime-800">{category}</p>
              {survey.total_participants !== undefined && (
                <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                  <img src={participant} alt="participants" className="w-5 h-5" />
                  <span>{survey.total_participants}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SurveyCard;
