import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

export default function CodeBlock({ language = "javascript", text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: "#26221e" }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ background: "#1c1916", borderColor: "#26221e" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          <span
            className="ml-2 font-mono text-xs"
            style={{ color: "#f9eed8", opacity: 0.35 }}
          >
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="font-mono text-xs transition-all px-2 py-1 rounded"
          style={{
            color: copied ? "#7a9e7e" : "#f9eed8",
            opacity: copied ? 1 : 0.4,
            background: copied ? "#7a9e7e15" : "transparent",
          }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          background: "#13110f",
          padding: "1.25rem 1.5rem",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.82rem",
          lineHeight: "1.7",
        }}
        showLineNumbers
        lineNumberStyle={{
          color: "#f9eed8",
          opacity: 0.2,
          fontSize: "0.75rem",
          paddingRight: "1rem",
        }}
      >
        {text}
      </SyntaxHighlighter>
    </div>
  );
}
