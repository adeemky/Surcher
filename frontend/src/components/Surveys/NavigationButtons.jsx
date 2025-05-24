const NavigationButtons = ({ onPrev, onNext, isFirst, isLast }) => {
  return (
    <div className="flex justify-between mt-10">
      <button
        onClick={onPrev}
        disabled={isFirst}
        className={`px-6 py-3 text-lg font-semibold rounded-md shadow-md transition duration-300 ${
          isFirst
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white hover:from-slate-950 hover:to-slate-950"
        }`}
      >
        Previous
      </button>
      <button
        onClick={onNext}
        className="px-6 py-3 text-lg font-semibold rounded-md shadow-md bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white hover:from-slate-950 hover:to-slate-950 transition duration-300"
      >
        {isLast ? "Submit" : "Next"}
      </button>
    </div>
  );
};

export default NavigationButtons;
