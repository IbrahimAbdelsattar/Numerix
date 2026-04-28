import { useState, useEffect } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { CheckCircle2, XCircle, BrainCircuit, RefreshCcw } from "lucide-react";
import { generateQuiz, type Question } from "@/lib/quizGenerator";

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setQuestions(generateQuiz(10));
  }, []);

  const handleSelect = (qId: string, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setQuestions(generateQuiz(10)); // Generate 10 brand new unique questions
    window.scrollTo(0, 0);
  };

  const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0), 0);

  return (
    <PageShell>
      <div className="container py-10 max-w-3xl space-y-8">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-glow">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Numerical Analysis Quiz</h1>
            <p className="text-sm text-muted-foreground mt-1">Test your knowledge of the methods and concepts learned in the Hub.</p>
          </div>
        </div>

        <div className="space-y-8">
          {questions.map((q, qIndex) => {
            const isCorrect = answers[q.id] === q.correctAnswer;
            const hasAnswered = answers[q.id] !== undefined;

            return (
              <div key={q.id} className="glass p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-foreground leading-relaxed">
                  <span className="text-muted-foreground mr-2">{qIndex + 1}.</span>
                  {q.question}
                </h3>
                
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.id] === oIdx;
                    let bgClass = "bg-white/[0.03] border-white/10 hover:bg-white/[0.08]";
                    if (isSelected) bgClass = "bg-primary/20 border-primary/50 text-foreground";
                    
                    if (submitted) {
                      if (oIdx === q.correctAnswer) bgClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
                      else if (isSelected && !isCorrect) bgClass = "bg-red-500/20 border-red-500/50 text-red-400";
                      else bgClass = "bg-white/[0.02] border-white/5 text-muted-foreground opacity-50";
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelect(q.id, oIdx)}
                        disabled={submitted}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 flex items-center justify-between ${bgClass}`}
                      >
                        <span className="text-sm">{opt}</span>
                        {submitted && oIdx === q.correctAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {submitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className={`mt-4 p-4 rounded-lg border text-sm ${isCorrect ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200" : "bg-red-500/10 border-red-500/20 text-red-200"}`}>
                    <p className="font-semibold mb-1">{isCorrect ? "Correct!" : "Incorrect."}</p>
                    <p className="opacity-90">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-white/10">
          {submitted ? (
            <>
              <div className="text-xl font-bold">
                Score: <span className={score === questions.length ? "text-emerald-400" : "text-primary"}>{score}</span> / {questions.length}
              </div>
              <button onClick={handleReset} className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition flex items-center gap-2">
                <RefreshCcw className="w-4 h-4" /> Retake Quiz
              </button>
            </>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                Answer all {questions.length} questions
              </div>
              <button 
                onClick={handleSubmit} 
                disabled={Object.keys(answers).length < questions.length}
                className="btn-gradient px-8 py-2.5 rounded-xl font-bold disabled:opacity-50"
              >
                Submit Answers
              </button>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
