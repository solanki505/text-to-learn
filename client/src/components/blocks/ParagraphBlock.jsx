export default function ParagraphBlock({ text }) {
  return (
    <p
      className="font-body text-base leading-[1.85] "
      style={{ color: "#f0d9a8", opacity: 0.82 }}
    >
      {text}
    </p>
  );
}
