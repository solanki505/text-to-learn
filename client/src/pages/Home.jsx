import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateCourse, getAllCourses, deleteCourse } from "../utils/api";

export default function Home() {
  const [topic, setTopic]     = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllCourses()
      .then(({ data }) => setCourses(data))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await generateCourse(topic.trim());
      setCourses((prev) => [data, ...prev]);
      setTopic("");
      navigate(`/course/${data._id}`);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        "Failed to generate course. Check your API key and server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this course?")) return;
    await deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 0%, #1c1916 0%, #0a0908 65%)",
      }}
    >
      {/* ── Header ─────────────────────────────────── */}
      <header
        className="border-b px-8 py-5 flex items-center justify-between"
        style={{ borderColor: "#1c1916" }}
      >
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-parchment-100">
            Text<span style={{ color: "#d4843a" }}>-to-</span>Learn
          </h1>
          <p
            className="font-body text-sm mt-0.5"
            style={{ color: "#f9eed8", opacity: 0.4 }}
          >
            AI-Powered Course Generator
          </p>
        </div>
        <span
          className="text-xs font-mono px-3 py-1 rounded-full border"
          style={{
            borderColor: "#d4843a44",
            color: "#d4843a",
            background: "#d4843a0e",
          }}
        >
          by Solanki Sarkar
        </span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* ── Hero ──────────────────────────────────── */}
        <div className="text-center mb-14 fade-in">
          <p
            className="font-mono text-xs tracking-widest mb-4"
            style={{ color: "#d4843a" }}
          >
            INSTANT LEARNING PATHS
          </p>
          <h2
            className="font-display text-5xl font-bold leading-tight mb-5"
            style={{ color: "#fdf8f0" }}
          >
            Turn any topic into a{" "}
            <em style={{ color: "#d4843a", fontStyle: "italic" }}>
              complete course
            </em>
          </h2>
          <p
            className="font-body text-lg leading-relaxed"
            style={{ color: "#f0d9a8", opacity: 0.6 }}
          >
            Type a subject below. Claude will generate structured modules,
            <br />
            detailed lessons, quizzes, code examples & video suggestions.
          </p>
        </div>

        {/* ── Prompt Form ───────────────────────────── */}
        <form onSubmit={handleGenerate} className="mb-16 fade-in">
          <div
            className="flex gap-2 p-2 rounded-2xl border"
            style={{ background: "#13110f", borderColor: "#332e29" }}
          >
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder='"Intro to React Hooks"  or  "Basics of Machine Learning"'
              className="flex-1 bg-transparent px-4 py-3 font-body text-base outline-none placeholder-opacity-30"
              style={{ color: "#fdf8f0", caretColor: "#d4843a" }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="px-7 py-3 rounded-xl font-display font-semibold text-sm transition-all duration-200 whitespace-nowrap"
              style={{
                background: loading ? "#26221e" : "#d4843a",
                color: loading ? "#d4843a88" : "#0a0908",
                cursor: loading || !topic.trim() ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="spinner"
                    style={{ width: 16, height: 16, borderWidth: 2 }}
                  />
                  Generating…
                </span>
              ) : (
                "Generate Course →"
              )}
            </button>
          </div>

          {/* progress hint */}
          {loading && (
            <p
              className="text-center font-mono text-xs mt-3 animate-pulse"
              style={{ color: "#d4843a", opacity: 0.7 }}
            >
              Claude is designing your curriculum… this may take 15–30 seconds
            </p>
          )}
          {error && (
            <p className="text-center font-mono text-xs mt-3 text-red-400">
              ⚠ {error}
            </p>
          )}
        </form>

        {/* ── Course Library ────────────────────────── */}
        {fetching ? (
          <div className="flex justify-center py-12">
            <div className="spinner" />
          </div>
        ) : courses.length > 0 ? (
          <div className="fade-in">
            <h3
              className="font-display text-xl font-semibold mb-5 flex items-center gap-3"
              style={{ color: "#fdf8f0" }}
            >
              <span style={{ color: "#d4843a" }}>◆</span> Your Library
              <span className="font-mono text-xs opacity-30">
                ({courses.length}{" "}
                {courses.length === 1 ? "course" : "courses"})
              </span>
            </h3>

            <div className="grid gap-3">
              {courses.map((course) => {
                const totalLessons = course.modules?.reduce(
                  (s, m) => s + (m.lessons?.length || 0),
                  0
                );
                return (
                  <div
                    key={course._id}
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="group p-5 rounded-xl border cursor-pointer transition-all duration-200"
                    style={{
                      background: "#13110f",
                      borderColor: "#26221e",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#d4843a55")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "#26221e")
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4
                          className="font-display text-lg font-semibold truncate mb-1"
                          style={{ color: "#fdf8f0" }}
                        >
                          {course.title}
                        </h4>
                        <p
                          className="font-body text-sm line-clamp-2 mb-3"
                          style={{ color: "#f9eed8", opacity: 0.5 }}
                        >
                          {course.description}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className="font-mono text-xs"
                            style={{ color: "#d4843a", opacity: 0.7 }}
                          >
                            {course.modules?.length || 0} modules ·{" "}
                            {totalLessons || 0} lessons
                          </span>
                          {course.tags?.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded font-mono"
                              style={{
                                background: "#d4843a12",
                                color: "#e8a85a",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(course._id, e)}
                        className="shrink-0 opacity-0 group-hover:opacity-100 font-mono text-xs px-3 py-1.5 rounded border transition-all"
                        style={{
                          color: "#e74c3c",
                          borderColor: "#c0392b44",
                          background: "#c0392b0a",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className="text-center py-20 rounded-2xl border fade-in"
            style={{ borderColor: "#1c1916", background: "#0d0b09" }}
          >
            <p className="text-5xl mb-4">📚</p>
            <p
              className="font-display text-xl mb-2"
              style={{ color: "#f9eed8", opacity: 0.5 }}
            >
              No courses yet
            </p>
            <p
              className="font-body text-sm"
              style={{ color: "#f9eed8", opacity: 0.3 }}
            >
              Type a topic above to generate your first course.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
