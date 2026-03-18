import { useState } from "react";

export default function MCQBlock({ question, options = [], answer, explanation, index }) {
  const [selected, setSelected] = useState(null);

  const getStyle = (i) => {
    if (selected === null)
      return {
        background: "#1c1916",
        borderColor: "#332e29",
        color: "#f0d9a8",
      };
    if (i === answer)
      return {
        background: "#7a9e7e18",
        borderColor: "#7a9e7e",
        color: "#7a9e7e",
      };
    if (i === selected)
      return {
        background: "#c0392b18",
        borderColor: "#c0392b",
        color: "#e74c3c",
      };
    return {
      background: "#13110f",
      borderColor: "#1c1916",
      color: "#f9eed8",
      opacity: 0.4,
    };
  };

  return (
    <div
      className="p-6 rounded-xl border"
      style={{ background: "#13110f", borderColor: "#26221e" }}
    >
      {/* Label */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="font-mono text-xs tracking-widest"
          style={{ color: "#d4843a" }}
        >
          QUIZ
        </span>
        {selected !== null && (
          <span
            className="font-mono text-xs px-2 py-0.5 rounded-full"
            style={
              selected === answer
                ? { background: "#7a9e7e18", color: "#7a9e7e" }
                : { background: "#c0392b18", color: "#e74c3c" }
            }
          >
            {selected === answer ? "✓ Correct!" : "✗ Incorrect"}
          </span>
        )}
      </div>

      {/* Question */}
      <p
        className="font-display text-base font-semibold mb-5 leading-snug"
        style={{ color: "#fdf8f0" }}
      >
        {question}
      </p>

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => selected === null && setSelected(i)}
            disabled={selected !== null}
            className="w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 font-body text-sm"
            style={getStyle(i)}
          >
            <span
              className="font-mono text-xs mr-2.5"
              style={{ opacity: 0.5 }}
            >
              {String.fromCharCode(65 + i)}.
            </span>
            {opt}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {selected !== null && explanation && (
        <div
          className="mt-5 p-4 rounded-lg font-body text-sm leading-relaxed"
          style={{
            background: "#d4843a0d",
            borderLeft: "3px solid #d4843a",
            color: "#e8a85a",
          }}
        >
          <span style={{ opacity: 0.6 }}>💡 </span>
          {explanation}
        </div>
      )}

      {/* Reset */}
      {selected !== null && (
        <button
          onClick={() => setSelected(null)}
          className="mt-4 font-mono text-xs transition-opacity hover:opacity-100"
          style={{ color: "#f9eed8", opacity: 0.25 }}
        >
          ↺ Try again
        </button>
      )}
    </div>
  );
}
