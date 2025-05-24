const BottomHome = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-20 space-y-8 bg-gradient-to-br from-slate-50 to-slate-100 shadow-inner">
      <h3 className="text-5xl font-extrabold text-slate-800 font-nunito leading-tight">
        Join the Surcher World
      </h3>
      <div className="w-24 h-1 bg-slate-700 rounded-full mb-2"></div>
      <p className="text-lg text-slate-600 max-w-2xl font-nunito leading-relaxed">
        Join over 1M+ volunteers and support NGOs. Explore impactful surveys, analyze
        transparent results, and make data-driven change happen.
      </p>
      <a href="/register">
        <button className="px-10 py-4 bg-gradient-to-r from-slate-800 to-slate-600 hover:from-slate-900 hover:to-slate-700 text-white font-nunito rounded-full shadow-md hover:shadow-lg transition duration-300 text-lg">
          Sign Up Now
        </button>
      </a>
    </div>
  );
};

export default BottomHome;
