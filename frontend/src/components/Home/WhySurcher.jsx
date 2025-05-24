const WhySurcher = () => {
  const steps = [
    {
      title: "Voluntary Participation",
      description:
        "Surcher is a volunteer-driven platform where everyone can contribute. It aims to amplify the voice of the community.",
      icon: "🤝",
    },
    {
      title: "NGO-Backed Surveys",
      description:
        "The surveys on Surcher are created by civil society organizations working for the public good.",
      icon: "🏛️",
    },
    {
      title: "Open and Transparent Results",
      description:
        "All survey results are made publicly available in the app once the deadline is reached.",
      icon: "🔍",
    },
  ];

  return (
    <div className="py-16 px-6 md:px-20">
      <h2 className="text-5xl text-center text-slate-700 mb-12 font-ancizar">
        How Surcher Makes a Difference
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-md p-8 text-center transition hover:shadow-lg"
          >
            <div className="text-5xl mb-4">{step.icon}</div>
            <h3 className="text-2xl font-semibold text-slate-700 font-nunito mb-2">
              {step.title}
            </h3>
            <p className="text-slate-600 text-md font-nunito">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhySurcher;
