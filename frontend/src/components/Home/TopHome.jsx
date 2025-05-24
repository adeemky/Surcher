import humanitarian from "../../images/humanitarian.jpg";
import children from "../../images/children.jpg";
import homep from "../../images/homep.png";

const TopHome = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-7xl text-slate-700 font-ancizar">Your opinion matters</h1>
      <p className="text-2xl text-slate-600 font-nunito m-5">
        Take a few minutes to contribute to the research of non-governmental organizations
      </p>
      <div className="relative flex justify-center items-center gap-0 mt-20">
        <img
          src={humanitarian}
          className="w-60 h-42 sm:w-72 sm:h-48 lg:w-96 lg:h-64 absolute bottom-[20px] left-[-68px] rotate-[-10deg] hover:scale-105 hover:z-10 transition-all duration-500 shadow-md rounded-xl"
          alt="health"
        />
        <img
          src={children}
          className="w-60 h-42 sm:w-72 sm:h-48 lg:w-96 lg:h-64 relative hover:scale-105 hover:z-10 transition-all duration-500 shadow-md rounded-xl"
          alt="children"
        />
        <img
          src={homep}
          className="w-60 h-42 sm:w-72 sm:h-48 lg:w-96 lg:h-64 absolute top-[20px] right-[-68px] rotate-[10deg] hover:scale-105 hover:z-10 transition-all duration-500 shadow-md rounded-xl"
          alt="humanitarian"
        />
      </div>
    </div>
  );
};

export default TopHome;
