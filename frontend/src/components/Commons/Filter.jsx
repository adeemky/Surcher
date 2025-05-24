import { useState } from "react";
import filter from "../../images/filter.png";

const Filter = ({
  filters = {},
  onFilterChange,
  orderBy,
  onOrderChange,
  categories = [],
  organizations = [],
  onReset,
  surveyCount,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full mb-4 p-6 [background-color:#f8f8f8] text-slate-950 shadow font-nunito">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-6xl pl-1">{title}</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 border border-black rounded-md shadow hover:bg-gray-100 transition duration-200"
          >
            <img src={filter} alt="Filter" className="w-6 h-6" />
          </button>
        </div>
        <div className="max-w-5xl mx-auto mb-4 font-nunito">
          <div
            className={`mt-4 p-4 border rounded-md bg-white shadow ${
              isOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
              <div className="flex flex-col sm:flex-row gap-4 flex-grow">
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">Category</label>
                  <select
                    name="category__name"
                    value={filters.category__name}
                    onChange={onFilterChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">Organization</label>
                  <select
                    name="organization__name"
                    value={filters.organization__name}
                    onChange={onFilterChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">All Organizations</option>
                    {organizations.map((org) => (
                      <option key={org} value={org}>
                        {org}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">Order By</label>
                  <select
                    name="ordering"
                    value={orderBy}
                    onChange={onOrderChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">Default</option>
                    <option value="-created_at">Newest to Oldest</option>
                    <option value="created_at">Oldest to Newest</option>
                    <option value="number_of_questions">Fewest to Most Questions</option>
                    <option value="-number_of_questions">Most to Fewest Questions</option>
                  </select>
                </div>
              </div>
              <div className="self-end">
                <button
                  onClick={onReset}
                  className="px-4 py-2 border border-amber-500 text-amber-500 text-sm rounded-md shadow hover:bg-amber-600 hover:text-white transition duration-300 font-nunito"
                >
                  Reset Filters
                </button>
              </div>
            </div>
            {surveyCount !== undefined && (
              <h3 className="text-sm text-gray-600 mt-4 text-center">
                {surveyCount} survey{surveyCount !== 1 ? "s are" : " is"} listed
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
