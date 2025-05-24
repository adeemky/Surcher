import { useEffect, useState } from "react";
import SurveyCard from "../components/Commons/SurveyCard";
import axiosInstance from "../services/axiosInstance.js";
import Filter from "../components/Commons/Filter.jsx";

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [filters, setFilters] = useState({
    category__name: "",
    organization__name: "",
  });
  const [orderBy, setOrderBy] = useState("");
  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axiosInstance.get("surveys/", {
          params: {
            ...filters,
            ordering: orderBy,
          },
        });
        setSurveys(response.data);
      } catch (error) {
        console.error("Failed to fetch surveys:", error);
      }
    };

    fetchSurveys();
  }, [filters, orderBy]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [catRes, orgRes] = await Promise.all([
          axiosInstance.get("filters/categories/"),
          axiosInstance.get("filters/organizations/"),
        ]);
        setCategories(catRes.data);
        setOrganizations(orgRes.data);
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
  };

  const handleResetFilters = () => {
    setFilters({ category__name: "", organization__name: "" });
    setOrderBy("");
  };

  return (
    <div>
      <Filter
        filters={filters}
        onFilterChange={handleFilterChange}
        orderBy={orderBy}
        onOrderChange={handleOrderChange}
        categories={categories}
        organizations={organizations}
        onReset={handleResetFilters}
        surveyCount={surveys.length}
        title="Surveys"
      />

      <div className="flex flex-wrap justify-center max-w-6xl gap-y-4 px-4 mx-auto">
        {surveys.map((survey) => (
          <div key={survey.id} className="w-full sm:w-1/2 px-2 mb-4">
            <SurveyCard survey={survey} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Surveys;
