import SurveyInfo from "../components/Commons/SurveyInfo";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import Question from "../components/Surveys/Question";
import StartButton from "../components/Surveys/StartButton";
import FinishScreen from "../components/Surveys/FinishScreen";

const SurveyRetrieve = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [hasResponded, setHasResponded] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await axiosInstance.get(`/surveys/${id}/`);
        setSurvey(response.data);
      } catch (error) {
        console.error("Failed to fetch survey:", error);
      }
    };

    const checkResponseStatus = async () => {
      try {
        const res = await axiosInstance.get(`/has-responded/${id}/`);
        setHasResponded(res.data.has_responded);
      } catch (error) {
        console.error("Failed to check response status:", error);
      }
    };

    fetchSurvey();
    checkResponseStatus();
  }, [id]);

  return (
    <div className="py-10">
      {!showQuestions && !isFinished && <SurveyInfo survey={survey} />}
      {!showQuestions && !isFinished && (
        <>
          <StartButton onClick={() => setShowQuestions(true)} disabled={hasResponded} />
          {hasResponded && (
            <p className="text-sm text-gray-500 text-center mt-1">
              You have already taken this survey.
            </p>
          )}
        </>
      )}
      {showQuestions && !isFinished && (
        <Question
          survey={survey}
          onComplete={() => {
            setShowQuestions(false);
            setIsFinished(true);
          }}
        />
      )}
      {isFinished && (
        <FinishScreen deadline={survey?.deadline} organization={survey?.organization?.name} />
      )}
    </div>
  );
};

export default SurveyRetrieve;
