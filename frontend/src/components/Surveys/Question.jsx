import { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import NavigationButtons from "./NavigationButtons";
import axiosInstance from "../../services/axiosInstance";
import defaultSurveyImage from "../../images/surveydefault.jpg";

const Question = ({ survey, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = survey.questions[currentIndex];

  useEffect(() => {
    if (survey?.questions?.length) {
      setAnswers(
        survey.questions.map((q) => ({
          question: q.id,
          choices: [],
        }))
      );
    }
  }, [survey]);

  const handleAnswerChange = (questionId, selectedChoices) => {
    setAnswers((prev) =>
      prev.map((a) => (a.question === questionId ? { ...a, choices: selectedChoices } : a))
    );
  };

  const handleNext = () => {
    if (currentIndex < survey.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const payload = { survey: survey.id, answers };
      const unanswered = answers.filter((a) => a.choices.length === 0).length;
      if (unanswered > 0) {
        console.warn(`${unanswered} question(s) unanswered`);
      }

      axiosInstance
        .post("responses", payload)
        .then(() => onComplete?.())
        .catch((err) => console.error("Submit error:", err));
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-nunito bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 border border-slate-200 rounded-lg shadow-sm">
      <div className="flex items-start mb-6">
        <img
          src={survey.image && survey.image.trim() !== "" ? survey.image : defaultSurveyImage}
          alt="Survey"
          className="w-24 h-24 object-cover rounded shadow-md"
        />
        <div className="ml-4">
          <h2 className="text-2xl font-semibold">{survey.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{survey.organization.name}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md px-4 py-3 mb-1 shadow-sm">
        <div className="flex justify-between items-center text-sm text-slate-500 font-medium mb-2">
          <span>
            Question {currentIndex + 1}/{survey.questions.length}
          </span>
        </div>
        <ProgressBar current={currentIndex + 1} total={survey.questions.length} />
      </div>

      <QuestionCard
        question={currentQuestion}
        selected={answers.find((a) => a.question === currentQuestion.id)?.choices || []}
        onChange={handleAnswerChange}
      />

      <NavigationButtons
        onPrev={handlePrev}
        onNext={handleNext}
        isFirst={currentIndex === 0}
        isLast={currentIndex === survey.questions.length - 1}
      />
    </div>
  );
};

export default Question;
