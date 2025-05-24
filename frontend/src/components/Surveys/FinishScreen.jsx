import { useNavigate } from "react-router-dom";
import successImg from "../../images/thick.png";

const FinishScreen = ({ deadline, organization }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[75vh] py-10 font-nunito border border-gray-200 bg-gradient-to-br from-white via-neutral-100 to-white shadow-sm">
      <img src={successImg} alt="Success" className="w-40 h-40 mb-6" />
      <h2 className="text-3xl font-bold text-amber-600 mb-2">Thank you!</h2>
      <p className="text-gray-700 text-lg">
        Your responses have been recorded. We appreciate your time and input!
      </p>
      <p className="mt-2 mb-2 text-gray-700 text-lg">
        {deadline
          ? `The results will be available on ${new Date(deadline).toLocaleDateString()}`
          : "Sonuçlar en kısa sürede açıklanacaktır."}
      </p>
      <p className="text-gray-500 text-lg">-{organization}</p>
      <button
        onClick={() => navigate("/surveys")}
        className="px-6 py-4 mt-4 bg-amber-500 text-white rounded-md shadow hover:bg-amber-600 transition"
      >
        Back to Surveys
      </button>
    </div>
  );
};

export default FinishScreen;
