import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getLesson, generateLesson } from "../utils/api";
import LessonRenderer from "../components/LessonRenderer";

export default function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError]         = useState("");
  const contentRef = useRef(null);

  useEffect(() => {
    getLesson(id)
      .then(({ data }) => setLesson(data))
      .catch(() => setError("Could not load lesson."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      const { data } = await generateLesson(id);
      setLesson(data);
    } catch (e) {
      setError(
        e?.response?.data?.error || "Generation failed. Check your API key."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handlePDF = async () => {
    if (!contentRef.current) return;
    setExporting(true);
    try {
      // Dynamic imports to keep initial bundle small
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: "#13110f",
        scale: 2,
        useCORS: true,
      });

      const pdf      = new jsPDF("p", "mm", "a4");
      const imgData  = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let position    = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Multi-page support
      while (position < imgHeight) {
        pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, imgHeight);
        position += pageHeight;
        if (position < imgHeight) pdf.addPage();
      }

      pdf.save(`${lesson.title}.pdf`);
    } catch (e) {
      setError("PDF export failed.");
    } finally {
      setExporting(false);
    }
  };

  /* ── Loading ───────────────────────────────────────────────── */
  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0908" }}
      >
        <div className="spinner" />
      </div>
    );

  /* ── Error / not found ─────────────────────────────────────── */
  if (!lesson || error)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0908" }}
      >
        <div className="text-center">
          <p className="text-red-400 font-mono mb-4">
            {error || "Lesson not found."}
          </p>
          <Link
            to="/"
            className="font-mono text-sm"
            style={{ color: "#d4843a" }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );

  const courseId = lesson.module?.course?._id;

  return (
    <div className="min-h-screen" style={{ background: "#0a0908" }}>
      {/* ── Sticky Header ──────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10 border-b px-6 py-3 flex items-center justify-between"
        style={{
          borderColor: "#1c1916",
          background: "#0a0908f0",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 min-w-0">
          <Link
            to="/"
            className="font-mono text-xs shrink-0 hover:opacity-100 transition-opacity"
            style={{ color: "#d4843a", opacity: 0.7 }}
          >
            Home
          </Link>
          <span style={{ color: "#332e29" }}>/</span>
          {courseId && (
            <>
              <Link
                to={`/course/${courseId}`}
                className="font-mono text-xs hover:opacity-100 transition-opacity truncate max-w-[160px]"
                style={{ color: "#d4843a", opacity: 0.7 }}
              >
                {lesson.module?.course?.title}
              </Link>
              <span style={{ color: "#332e29" }}>/</span>
            </>
          )}
          <span
            className="font-mono text-xs truncate max-w-[180px]"
            style={{ color: "#f9eed8", opacity: 0.4 }}
          >
            {lesson.title}
          </span>
        </nav>

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          {!lesson.isEnriched && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-5 py-2 rounded-lg font-display text-sm font-semibold transition-all"
              style={{
                background: generating ? "#26221e" : "#d4843a",
                color: generating ? "#d4843a88" : "#0a0908",
              }}
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <span
                    className="spinner"
                    style={{ width: 14, height: 14, borderWidth: 2 }}
                  />
                  Generating…
                </span>
              ) : (
                "✨ Generate Lesson"
              )}
            </button>
          )}

          {lesson.isEnriched && (
            <>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-4 py-2 rounded-lg font-mono text-xs border transition-all"
                style={{
                  borderColor: "#332e29",
                  color: "#f9eed8",
                  opacity: generating ? 0.4 : 0.6,
                }}
              >
                {generating ? "Regenerating…" : "↺ Regenerate"}
              </button>
              <button
                onClick={handlePDF}
                disabled={exporting}
                className="px-5 py-2 rounded-lg font-mono text-xs border transition-all"
                style={{
                  borderColor: "#d4843a55",
                  color: "#d4843a",
                  background: "#d4843a0a",
                  opacity: exporting ? 0.5 : 1,
                }}
              >
                {exporting ? "Exporting…" : "↓ PDF"}
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-6 py-14 fade-in">
        {/* Module label */}
        <p
          className="font-mono text-xs tracking-widest mb-3"
          style={{ color: "#d4843a" }}
        >
          {lesson.module?.title?.toUpperCase()}
        </p>

        {/* Title */}
        <h1
          className="font-display text-4xl font-bold leading-tight mb-8"
          style={{ color: "#fdf8f0" }}
        >
          {lesson.title}
        </h1>

        {/* Objectives */}
        {lesson.objectives?.length > 0 && (
          <div
            className="mb-10 p-5 rounded-xl border"
            style={{ background: "#13110f", borderColor: "#d4843a22" }}
          >
            <p
              className="font-mono text-xs tracking-widest mb-3"
              style={{ color: "#d4843a" }}
            >
              LEARNING OBJECTIVES
            </p>
            <ul className="space-y-2">
              {lesson.objectives.map((obj, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 font-body text-sm leading-relaxed"
                  style={{ color: "#f0d9a8", opacity: 0.8 }}
                >
                  <span style={{ color: "#7a9e7e", flexShrink: 0 }}>✓</span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Error inline */}
        {error && (
          <div
            className="mb-6 p-4 rounded-lg border font-mono text-sm text-red-400"
            style={{ borderColor: "#c0392b44", background: "#c0392b0a" }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Content or empty state */}
        {lesson.isEnriched ? (
          <div ref={contentRef}>
            <LessonRenderer content={lesson.content} />
          </div>
        ) : (
          <EmptyState onGenerate={handleGenerate} generating={generating} />
        )}
      </main>
    </div>
  );
}

/* ── Empty / not-yet-generated state ──────────────────────────────────────── */
function EmptyState({ onGenerate, generating }) {
  return (
    <div
      className="text-center py-24 rounded-2xl border"
      style={{ borderColor: "#1c1916", background: "#0d0b09" }}
    >
      <p className="text-5xl mb-5">📖</p>
      <h3
        className="font-display text-2xl font-semibold mb-2"
        style={{ color: "#fdf8f0", opacity: 0.8 }}
      >
        Lesson not yet generated
      </h3>
      <p
        className="font-body text-sm mb-10"
        style={{ color: "#f9eed8", opacity: 0.35 }}
      >
        Click below to have Claude write the full lesson content, quizzes, and
        code examples.
      </p>
      <button
        onClick={onGenerate}
        disabled={generating}
        className="px-10 py-4 rounded-xl font-display text-lg font-semibold transition-all"
        style={{
          background: generating ? "#26221e" : "#d4843a",
          color: generating ? "#d4843a88" : "#0a0908",
        }}
      >
        {generating ? (
          <span className="flex items-center gap-3">
            <span
              className="spinner"
              style={{ width: 20, height: 20, borderWidth: 2 }}
            />
            Claude is writing your lesson…
          </span>
        ) : (
          "✨ Generate Lesson Content"
        )}
      </button>
      {generating && (
        <p
          className="font-mono text-xs mt-5 animate-pulse"
          style={{ color: "#d4843a", opacity: 0.5 }}
        >
          Crafting headings, paragraphs, code, quizzes… ~20 seconds
        </p>
      )}
    </div>
  );
}
