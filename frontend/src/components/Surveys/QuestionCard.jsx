const QuestionCard = ({ question, selected, onChange }) => {
  const handleChange = (choiceId) => {
    if (question.question_type === "single_choice") {
      onChange(question.id, [choiceId]);
    } else {
      const updatedSelection = selected.includes(choiceId)
        ? selected.filter((id) => id !== choiceId)
        : [...selected, choiceId];
      onChange(question.id, updatedSelection);
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-md shadow-sm">
      <h3 className="text-xl font-semibold">{question.text}</h3>
      <div className="text-sm text-gray-500 mb-3 italic">
        ({question.question_type === "single_choice" ? "Single Choice" : "Multiple Choice"})
      </div>
      <div className="space-y-4">
        {question.choices.map((choice) => (
          <label key={choice.id} className="flex items-center space-x-3">
            <input
              type={question.question_type === "single_choice" ? "radio" : "checkbox"}
              name={`question-${question.id}`}
              value={choice.id}
              checked={selected.includes(choice.id)}
              onChange={() => handleChange(choice.id)}
              className="accent-amber-500 w-5 h-5"
            />
            <span className="text-gray-800">{choice.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
