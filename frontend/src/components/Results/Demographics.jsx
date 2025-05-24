import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Demographics = ({ demographics }) => {
  if (!demographics) return null;

  const {
    age_distribution,
    gender_distribution,
    marital_status_distribution,
    education_level_distribution,
  } = demographics;

  const getChartData = (data, label) => ({
    labels: data.map((item) => item[`user__profile__${label}`] || "Unknown"),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: [
          "#60A5FA",
          "#34D399",
          "#FBBF24",
          "#F87171",
          "#A78BFA",
          "#F472B6",
          "#FCD34D",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  });

  const ChartBlock = ({ title, data, label }) => {
    if (!data || data.length === 0) return null;

    return (
      <div className="w-full md:w-1/2 lg:w-1/4 p-4">
        <h3 className="text-center text-slate-700 font-semibold mb-2">{title}</h3>
        <div className="bg-white rounded-lg shadow p-4 flex justify-center">
          <Pie data={getChartData(data, label)} />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 mb-8 bg-gradient-to-br from-slate-100 via-white to-slate-200 rounded-xl py-6 px-4 shadow-md">
      <h2 className="text-4xl text-slate-800 mb-2">Demographics</h2>
      <div className="flex flex-wrap -mx-4">
        <ChartBlock title="Age Distribution" data={age_distribution} label="age" />
        <ChartBlock title="Gender Distribution" data={gender_distribution} label="gender" />
        <ChartBlock
          title="Marital Status"
          data={marital_status_distribution}
          label="marital_status"
        />
        <ChartBlock
          title="Education Level"
          data={education_level_distribution}
          label="education_level"
        />
      </div>
    </div>
  );
};

export default Demographics;
