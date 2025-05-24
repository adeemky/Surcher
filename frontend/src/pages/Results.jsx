import { useEffect, useState } from "react";
import SurveyCard from "../components/Commons/SurveyCard";
import axiosInstance from "../services/axiosInstance.js";
import Filter from "../components/Commons/Filter.jsx";

const Results = () => {
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    category__name: "",
    organization__name: "",
  });
  const [orderBy, setOrderBy] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
  };

  const handleReset = () => {
    setFilters({ category__name: "", organization__name: "" });
    setOrderBy("");
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const params = {};
        if (filters.category__name) params.category__name = filters.category__name;
        if (filters.organization__name) params.organization__name = filters.organization__name;
        if (orderBy) params.ordering = orderBy;

        const response = await axiosInstance.get("results/", { params });
        setResults(response.data);
        setFilteredResults(response.data);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      }
    };

    fetchResults();
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

  return (
    <div>
      <Filter
        filters={filters}
        onFilterChange={handleFilterChange}
        orderBy={orderBy}
        onOrderChange={handleOrderChange}
        categories={categories}
        organizations={organizations}
        onReset={handleReset}
        surveyCount={filteredResults.length}
        title="Results"
      />
      <div className="flex flex-wrap justify-center max-w-6xl gap-y-4 px-4 mx-auto">
        {filteredResults.map((result) => (
          <div key={result.id} className="w-full sm:w-1/2 px-2 mb-4">
            <SurveyCard survey={result} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
