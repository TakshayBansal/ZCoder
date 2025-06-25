import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "../../App";
import SearchFilterBar from "../../components/Problems/SearchFilterBar";
import ProblemCard from "../../components/Problems/ProblemCard";
import "../../App.css";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function ProblemsHub() {
  const { theme } = useTheme();
  const [typing, setTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const chartRef = useRef();

  useEffect(() => {
    fetch("http://localhost:3000/api/problems")
      .then((res) => res.json())
      .then((data) => {
        setAllProblems(data);
        setFilteredProblems(data);
      });
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const userData = storedUser ? JSON.parse(storedUser) : null;
    const solvedKey = userData
      ? `solvedProblems_${userData.username}`
      : "solvedProblems";
    const solved = JSON.parse(localStorage.getItem(solvedKey) || "[]");
    setSolvedProblems(solved);
  }, []);

  useEffect(() => {
    setTyping(true);
  }, []);

  const countByDifficulty = (problems, solvedList) => {
    const levels = ["Easy", "Medium", "Hard"];
    const total = { Easy: 0, Medium: 0, Hard: 0 };
    const solved = { Easy: 0, Medium: 0, Hard: 0 };
    problems.forEach((p) => {
      if (levels.includes(p.difficulty)) {
        total[p.difficulty]++;
        if (solvedList.includes(p.title)) solved[p.difficulty]++;
      }
    });
    return { total, solved };
  };

  const { total, solved } = countByDifficulty(allProblems, solvedProblems);

  const pieData = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        data: [solved.Easy, solved.Medium, solved.Hard],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
        borderWidth: 2,
        borderColor: theme === "dark" ? "#18181b" : "#fff",
      },
      {
        data: [
          total.Easy - solved.Easy,
          total.Medium - solved.Medium,
          total.Hard - solved.Hard,
        ],
        backgroundColor: ["#bbf7d0", "#fef9c3", "#fecaca"],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const idx = context.dataIndex;
            const label = context.chart.data.labels[idx];
            const solvedVal = pieData.datasets[0].data[idx];
            const totalVal =
              pieData.datasets[0].data[idx] + pieData.datasets[1].data[idx];
            return `${label}: ${solvedVal} / ${totalVal} solved`;
          },
        },
      },
    },
    cutout: "80%",
    responsive: true,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    let filtered = allProblems;
    const user = JSON.parse(localStorage.getItem("user"));
    const solvedKey = user ? `solvedProblems_${user.name}` : "solvedProblems";
    const solvedArr = JSON.parse(localStorage.getItem(solvedKey) || "[]");
    const bookmarkKey = user
      ? `bookmarkedProblems_${user.name}`
      : "bookmarkedProblems";
    const bookmarksArr = JSON.parse(localStorage.getItem(bookmarkKey) || "[]");

    if (filterType === "difficulty" && filterValue) {
      filtered = filtered.filter((p) => p.difficulty === filterValue);
    }
    if (filterType === "tags" && filterValue) {
      filtered = filtered.filter((p) => (p.tags || []).includes(filterValue));
    }
    if (filterType === "solved") {
      filtered = filtered.filter((p) => solvedArr.includes(p.title));
    }
    if (filterType === "notSolved") {
      filtered = filtered.filter((p) => !solvedArr.includes(p.title));
    }
    if (filterType === "bookmarked") {
      filtered = filtered.filter((p) => bookmarksArr.includes(p.title));
    }
    if (filterType === "notBookmarked") {
      filtered = filtered.filter((p) => !bookmarksArr.includes(p.title));
    }
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProblems(filtered);
  }, [filterType, filterValue, searchTerm, allProblems]);

  const allTags = [
    ...new Set(allProblems.flatMap((p) => p.tags || [])),
  ].filter(Boolean);

  const solvedCount = solvedProblems.length;
  const totalCount = allProblems.length;

  return (
    <div
      className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-gray-900"} min-h-screen relative`}
    >
      {/* Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg className="relative block w-[150%] h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill={theme === "dark" ? "#111827" : "#f0f5ff"} d="M0,64L80,85.3C160,107,320,149,480,170.7C640,192,800,192,960,176C1120,160,1280,128,1360,112L1440,96L1440,0L0,0Z" />
        </svg>
      </div>

      {/* Progress Pie */}
      <div className="absolute top-8 right-8 z-10 bg-white/90 dark:bg-gray-800/90 shadow-2xl rounded-3xl p-6 w-64">
        <div className="text-lg font-bold mb-2 text-center">Progress</div>
        <div className="relative w-40 h-40 mx-auto">
          <Pie data={pieData} options={pieOptions} width={160} height={160} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold">{solvedCount} / {totalCount}</span>
            <span className="text-xs text-gray-500 dark:text-gray-300 mt-1">Solved</span>
          </div>
        </div>
        <div className="flex justify-between mt-4 text-sm text-gray-700 dark:text-gray-300">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span>Easy</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-400"></span>Medium</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span>Hard</span>
        </div>
      </div>

      {/* Heading */}
      <section className="pt-40 pb-12 px-6 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          <span className={`text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 ${typing ? "typing" : ""}`}>
            🧠 Problems Hub
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore challenges, track progress, and sharpen your skills.
        </p>
      </section>

      {/* Filter + Search */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 space-y-6 pb-16">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <SearchFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            problems={allProblems}
            setFilteredProblems={setFilteredProblems}
          />
          <select
            className={`rounded-lg px-3 py-2 border text-sm focus:outline-none ${theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"}`}
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setFilterValue(""); }}
          >
            <option value="">Filter by...</option>
            <option value="difficulty">Difficulty</option>
            <option value="tags">Tag</option>
            <option value="solved">Solved</option>
            <option value="notSolved">Not Solved</option>
            <option value="bookmarked">Bookmarked</option>
            <option value="notBookmarked">Not Bookmarked</option>
          </select>

          {(filterType === "difficulty" || filterType === "tags") && (
            <select
              className={`rounded-lg px-3 py-2 border text-sm focus:outline-none ${theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"}`}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="">All</option>
              {(filterType === "difficulty" ? ["Easy", "Medium", "Hard"] : allTags).map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          )}
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      </section>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg className="relative block w-[150%] h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill={theme === "dark" ? "#111827" : "#f0f5ff"} d="M0,64L80,85.3C160,107,320,149,480,170.7C640,192,800,192,960,176C1120,160,1280,128,1360,112L1440,96L1440,320L0,320Z" />
        </svg>
      </div>

      {/* Typing Animation */}
      <style jsx>{`
        .typing {
          overflow: hidden;
          white-space: nowrap;
          border-right: 3px solid;
          animation: typing 3s steps(24) forwards, blink 0.75s step-end infinite;
        }
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        @keyframes blink {
          50% { border-color: transparent }
        }
      `}</style>
    </div>
  );
}
