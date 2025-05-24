const ProgressBar = ({ current, total }) => {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="w-full rounded-full h-2 overflow-hidden shadow-inner">
      <div
        className="bg-amber-500 h-full transition-all duration-300"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
