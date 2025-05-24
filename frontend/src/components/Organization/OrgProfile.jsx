import { Link } from "react-router-dom";

const OrgProfile = ({ orgImage, organization, totalSurveys }) => {
  return (
    <Link
      to={`/organizations/${organization.id}`}
      className="flex items-center gap-3 hover:underline"
    >
      <img
        src={orgImage}
        alt={organization.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <h4 className="text-sm font-semibold text-slate-700">{organization.name}</h4>
        <p className="text-xs text-gray-400">
          {totalSurveys} survey
          {totalSurveys > 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
};

export default OrgProfile;
