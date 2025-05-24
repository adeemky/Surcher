import defaultSurvey from "../../images/surveydefault.jpg";
import defaultOrg from "../../images/ngodefault.png";
import OrgProfile from "../Organization/OrgProfile";

const SurveyInfo = ({ survey }) => {
  if (!survey) return null;

  const {
    title,
    description,
    category,
    organization,
    created_at,
    deadline,
    number_of_questions,
    image,
  } = survey;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-GB");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 font-nunito text-slate-800">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative w-full h-52 sm:h-80 md:h-96 lg:w-1/2 lg:h-auto">
          <img
            src={image && image.trim() !== "" ? image : defaultSurvey}
            alt={title}
            className="w-full h-full object-cover rounded-lg shadow"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-b-lg" />
          <div className="absolute bottom-4 left-4 text-white">
            <OrgProfile
              orgImage={
                organization.image && organization.image.trim() !== ""
                  ? organization.image
                  : defaultOrg
              }
              organization={organization}
              totalSurveys={
                organization.number_of_active_surveys + organization.number_of_inactive_surveys
              }
            />
          </div>
          <div className="absolute bottom-4 right-4 text-xs text-white bg-black/50 rounded px-2 py-1">
            {category}
          </div>
        </div>

        <div className="mt-6 lg:mt-0 px-4 sm:px-0 lg:w-1/2">
          <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-lg p-6 shadow-inner">
            <h1 className="text-4xl font-bold mb-1">{title}</h1>
            <p className="text-sm text-gray-500 mb-4">
              {number_of_questions} Question{number_of_questions > 1 ? "s" : ""}
            </p>

            <p className="text-base leading-relaxed">{description}</p>

            <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <img
                  src={require("../../images/participant.png")}
                  alt="participants"
                  className="w-7 h-7"
                />
                <span>{survey.total_participants}</span>
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>Created on : {formatDate(created_at)}</div>
                <div>Deadline : {formatDate(deadline)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyInfo;
