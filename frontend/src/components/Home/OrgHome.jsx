import who from "../../images/who.png";
import stc from "../../images/stc.png";
import wwf from "../../images/wwf.png";
import msf from "../../images/msf.png";

const OrgHome = () => {
  return (
    <div className="text-center space-y-10">
      <h3 className="text-5xl text-slate-800 font-ancizar">
        Explore Surveys by Leading Organizations
      </h3>
      <p className="text-lg text-slate-600 max-w-3xl mx-auto font-nunito">
        Discover surveys from over 300 NGOs working in health, education, environment, and
        humanitarian aid. Your voice fuels their mission.
      </p>
      <div className="flex justify-center gap-6 flex-wrap">
        <div className="bg-white hover:bg-stone-200 transition duration-300 p-4 rounded-lg shadow-md flex flex-col items-center">
          <img width="150" src={who} />
        </div>
        <div className="bg-white hover:bg-stone-200 transition duration-300 p-4 rounded-lg shadow-md flex flex-col items-center">
          <img width="150" src={stc} />
        </div>
        <div className="bg-white hover:bg-stone-200 transition duration-300 p-4 rounded-lg shadow-md flex flex-col items-center">
          <img width="150" src={wwf} />
        </div>
        <div className="bg-white hover:bg-stone-200 transition duration-300 p-4 rounded-lg shadow-md flex flex-col items-center">
          <img width="150" src={msf} />
        </div>
      </div>
    </div>
  );
};

export default OrgHome;
