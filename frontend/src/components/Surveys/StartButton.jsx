const StartButton = ({ onClick, disabled }) => {
  return (
    <div className="flex justify-center items-center mt-10">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`relative inline-flex items-center justify-center w-80 h-20 px-8 text-2xl font-nunito text-white shadow-md rounded-full transition-all duration-500
          ${
            disabled
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-950 hover:via-slate-800 hover:to-slate-950 hover:shadow-lg group"
          }`}
      >
        <span
          className={`transition-all duration-300 ${!disabled ? "group-hover:translate-x-[11px]" : ""}`}
        >
          Start Survey
        </span>
        {!disabled && (
          <svg
            viewBox="0 0 28 20"
            className="absolute right-8 w-5 h-5 transition-all duration-500 group-hover:right-4 group-hover:fill-white"
            fill="currentColor"
          >
            <path d="M18,19c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414L23.586,11H2c-0.552,0-1-0.448-1-1s0.448-1,1-1h21.586l-6.293-6.293c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0l8,8c0.097,0.096,0.169,0.208,0.218,0.326C26.973,9.735,27,9.863,27,9.997l0,0c0,0.002,0,0.004,0,0.006l0,0c0,0.134-0.027,0.262-0.075,0.378c-0.049,0.119-0.121,0.23-0.218,0.326l-8,8C18.512,18.902,18.256,19,18,19z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default StartButton;
