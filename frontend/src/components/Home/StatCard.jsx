const StatCard = ({ title, description }) => (
  <div className="bg-white hover:bg-stone-200 transition duration-300 p-6 rounded-lg shadow-md w-60 text-center">
    <h4 className="text-2xl font-semibold text-slate-700 mb-2 font-nunito">{title}</h4>
    <p className="text-slate-600 font-nunito">{description}</p>
  </div>
);

export default StatCard;
