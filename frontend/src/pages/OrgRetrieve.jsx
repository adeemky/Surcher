import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import CollapsibleSurveyList from "../components/Organization/CollapsibleSurveyList";
import OrganizationHeader from "../components/Organization/OrganizationHeader";

const OrgRetrieve = () => {
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [surveys, setSurveys] = useState({ active: [], inactive: [] });
  const [isActiveOpen, setIsActiveOpen] = useState(false);
  const [isInactiveOpen, setIsInactiveOpen] = useState(false);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await axiosInstance.get(
          `http://localhost:8000/api/organizations/${id}/`
        );
        setOrganization(response.data);
        setSurveys({
          active: response.data.active_surveys.map((survey) => ({
            ...survey,
            organization: response.data,
          })),
          inactive: response.data.inactive_surveys.map((survey) => ({
            ...survey,
            organization: response.data,
          })),
        });
      } catch (error) {
        console.error("Failed to fetch organization:", error);
      }
    };

    fetchOrganization();
  }, [id]);

  if (!organization) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <>
      <OrganizationHeader organization={organization} />

      <CollapsibleSurveyList
        title={`${organization.name}'s Surveys`}
        surveys={surveys.active}
        isOpen={isActiveOpen}
        setIsOpen={setIsActiveOpen}
      />

      <CollapsibleSurveyList
        title={`${organization.name}'s Survey Results`}
        surveys={surveys.inactive}
        isOpen={isInactiveOpen}
        setIsOpen={setIsInactiveOpen}
      />
    </>
  );
};

export default OrgRetrieve;
