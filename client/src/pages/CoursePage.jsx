import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourse } from "../utils/api";

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [openModule, setOpenModule] = useState(0);

  useEffect(() => {
    getCourse(id)
      .then(({ data }) => setCourse(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0908" }}
      >
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p
            className="font-body text-sm"
            style={{ color: "#f9eed8", opacity: 0.4 }}
          >
            Loading course…
          </p>
        </div>
      </div>
    );

  if (!course)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0908" }}
      >
        <div className="text-center">
          <p className="font-mono text-red-400 mb-4">Course not found.</p>
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

  const totalLessons = course.modules.reduce(
    (s, m) => s + (m.lessons?.length || 0),
    0
  );
  const enrichedCount = course.modules.reduce(
    (s, m) => s + (m.lessons?.filter((l) => l.isEnriched).length || 0),
    0
  );

  return (
    <div className="min-h-screen" style={{ background: "#0a0908" }}>
      {/* ── Header ─────────────────────────────────── */}
      <header
        className="sticky top-0 z-10 border-b px-8 py-4 flex items-center gap-3"
        style={{
          borderColor: "#1c1916",
          background: "#0a0908ee",
          backdropFilter: "blur(10px)",
        }}
      >
        <Link
          to="/"
          className="font-mono text-sm transition-opacity hover:opacity-100"
          style={{ color: "#d4843a", opacity: 0.7 }}
        >
          ← Home
        </Link>
        <span style={{ color: "#332e29" }}>/</span>
        <span
          className="font-body text-sm truncate max-w-xs"
          style={{ color: "#f9eed8", opacity: 0.5 }}
        >
          {course.title}
        </span>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-14 fade-in">
        {/* ── Course Hero ────────────────────────────── */}
        <div
          className="mb-12 pb-10 border-b"
          style={{ borderColor: "#1c1916" }}
        >
          {/* Tags */}
          {course.tags?.length > 0 && (
            <div className="flex gap-2 mb-5 flex-wrap">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full font-mono"
                  style={{ background: "#d4843a12", color: "#e8a85a" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1
            className="font-display text-4xl font-bold leading-tight mb-5"
            style={{ color: "#fdf8f0" }}
          >
            {course.title}
          </h1>
          <p
            className="font-body text-lg leading-relaxed mb-8"
            style={{ color: "#f0d9a8", opacity: 0.65 }}
          >
            {course.description}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-6">
            <Stat label="Modules"  value={course.modules.length} />
            <Stat label="Lessons"  value={totalLessons} />
            <Stat label="Generated" value={`${enrichedCount}/${totalLessons}`} accent />
          </div>
        </div>

        {/* ── Curriculum ─────────────────────────────── */}
        <div>
          <h2
            className="font-display text-2xl font-semibold mb-6 flex items-center gap-3"
            style={{ color: "#fdf8f0" }}
          >
            <span style={{ color: "#d4843a" }}>◆</span> Course Curriculum
          </h2>

          <div className="space-y-3">
            {course.modules.map((mod, i) => (
              <ModuleAccordion
                key={mod._id}
                mod={mod}
                index={i}
                isOpen={openModule === i}
                onToggle={() => setOpenModule(openModule === i ? -1 : i)}
                onLessonClick={(lessonId) => navigate(`/lesson/${lessonId}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────────────────── */

function Stat({ label, value, accent }) {
  return (
    <div>
      <p
        className="font-mono text-xs mb-0.5"
        style={{ color: "#f9eed8", opacity: 0.35 }}
      >
        {label}
      </p>
      <p
        className="font-display text-xl font-bold"
        style={{ color: accent ? "#d4843a" : "#fdf8f0" }}
      >
        {value}
      </p>
    </div>
  );
}

function ModuleAccordion({ mod, index, isOpen, onToggle, onLessonClick }) {
  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-200"
      style={{
        borderColor: isOpen ? "#d4843a44" : "#26221e",
        background: "#13110f",
      }}
    >
      {/* Module header */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs shrink-0"
            style={{ background: "#d4843a1a", color: "#d4843a" }}
          >
            {index + 1}
          </span>
          <span
            className="font-display font-semibold"
            style={{ color: "#fdf8f0" }}
          >
            {mod.title}
          </span>
          <span
            className="font-mono text-xs"
            style={{ color: "#f9eed8", opacity: 0.3 }}
          >
            {mod.lessons?.length} lessons
          </span>
        </div>
        <span style={{ color: "#d4843a", fontSize: "1.1rem" }}>
          {isOpen ? "▾" : "▸"}
        </span>
      </button>

      {/* Lessons list */}
      {isOpen && (
        <div
          className="px-5 pb-4 border-t"
          style={{ borderColor: "#1c1916" }}
        >
          <div className="space-y-1.5 mt-3">
            {mod.lessons?.map((lesson, j) => (
              <button
                key={lesson._id}
                onClick={() => onLessonClick(lesson._id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-150"
                style={{ background: "#1c1916" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#26221e")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#1c1916")
                }
              >
                <span
                  className="font-mono text-xs w-5 shrink-0"
                  style={{ color: "#f9eed8", opacity: 0.3 }}
                >
                  {j + 1}.
                </span>
                <span
                  className="flex-1 font-body text-sm"
                  style={{ color: "#f0d9a8" }}
                >
                  {lesson.title}
                </span>
                <span
                  className="shrink-0 text-xs font-mono px-2.5 py-0.5 rounded-full"
                  style={
                    lesson.isEnriched
                      ? { background: "#7a9e7e18", color: "#7a9e7e" }
                      : { background: "#d4843a10", color: "#d4843a", opacity: 0.7 }
                  }
                >
                  {lesson.isEnriched ? "✓ Ready" : "Generate"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
