const QuestionResponse = ({ question, index, totalParticipants }) => {
  if (!question) return null;

  const totalVotes = question.choices.reduce((sum, choice) => sum + choice.votes, 0);
  const unanswered = question.unanswered_count || 0;
  const grandTotal = totalParticipants;

  const getPercentage = (count) => {
    if (question.question_type === "multiple_choice") {
      const total = totalVotes + unanswered;
      return total ? ((count / total) * 100).toFixed(1) : 0;
    } else {
      return grandTotal ? ((count / grandTotal) * 100).toFixed(1) : 0;
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-lg p-6 shadow-inner mb-6">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">
        {index + 1}. {question.text}{" "}
        <span className="text-sm text-gray-500 ml-2">
          ({question.question_type === "single_choice" ? "Single Choice" : "Multiple Choice"})
        </span>
      </h2>
      <div className="space-y-2">
        {question.choices.map((choice) => (
          <div key={choice.id}>
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>{choice.text}</span>
              <span>
                {choice.votes} votes ({getPercentage(choice.votes)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
              <div
                className="h-full bg-blue-400 transition-all"
                style={{ width: `${getPercentage(choice.votes)}%` }}
              ></div>
            </div>
          </div>
        ))}
        {unanswered > 0 && (
          <div>
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>Unanswered</span>
              <span>
                {unanswered} ({getPercentage(unanswered)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
              <div
                className="h-full bg-red-400 transition-all"
                style={{ width: `${getPercentage(unanswered)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Answered respondents: {grandTotal - unanswered}
      </p>
    </div>
  );
};

export default QuestionResponse;
