import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import SurveyInfo from "../components/Commons/SurveyInfo";
import Demographics from "../components/Results/Demographics";
import QuestionResponse from "../components/Results/QuestionResponse";

const ResultRetrieve = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axiosInstance.get(`/results/${id}/`);
        setResult(response.data);
      } catch (error) {
        console.error("Failed to fetch result:", error);
      }
    };

    fetchResult();
  }, [id]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {result ? (
        <>
          <SurveyInfo survey={result} />
          <Demographics demographics={result.demographics} />

          <h2 className="text-4xl text-slate-800 mt-2 mb-4">Questions</h2>
          {result.questions.map((question, idx) => (
            <QuestionResponse
              key={question.id}
              question={question}
              index={idx}
              totalParticipants={result.total_participants}
            />
          ))}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ResultRetrieve;
