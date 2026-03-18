export default function HeadingBlock({ text }) {
  return (
    <h2
      className="font-display text-2xl font-bold mt-10 mb-2 pb-2 border-b"
      style={{ color: "#fdf8f0", borderColor: "#d4843a2a" }}
    >
      {text}
    </h2>
  );
}
