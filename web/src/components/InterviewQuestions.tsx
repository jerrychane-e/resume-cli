interface Props {
  questions: string[];
}

export default function InterviewQuestions({ questions }: Props) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: 16, fontSize: 16 }}>💬 建议面试问题</h3>
      <ol style={{ paddingLeft: 20, color: 'var(--text)' }}>
        {questions.map((q, i) => (
          <li
            key={i}
            style={{
              marginBottom: i < questions.length - 1 ? 14 : 0,
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            {q}
          </li>
        ))}
      </ol>
    </div>
  );
}
