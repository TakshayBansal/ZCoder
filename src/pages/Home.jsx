import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../App";

const contestLinks = [
  { name: "LeetCode Weekly Contest", url: "https://leetcode.com/contest/", icon: "🟧", desc: "Official LeetCode weekly and biweekly contests." },
  { name: "Codeforces Contests", url: "https://codeforces.com/contests", icon: "🟦", desc: "Upcoming and past Codeforces contests." },
  { name: "AtCoder Contests", url: "https://atcoder.jp/contests/", icon: "🟩", desc: "Practice with AtCoder programming contests." },
];

export default function Home() {
  const { theme } = useTheme();
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    setTyping(true);
  }, []);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-gray-800'} relative overflow-hidden min-h-screen`}>      

      {/* SVG Wave Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg className="relative block w-[150%] h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill={theme === 'dark' ? '#111827' : '#f0f5ff'} d="M0,64L80,85.3C160,107,320,149,480,170.7C640,192,800,192,960,176C1120,160,1280,128,1360,112L1440,96L1440,0L0,0Z"></path>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative z-20 flex flex-col items-center text-center pt-40 pb-20 px-6">
        <h1
          className={`text-6xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 ${typing ? 'typing' : ''}`}
        >
          Welcome to ZCoder
        </h1>
        <p className="text-xl md:text-2xl font-bold max-w-3xl mb-8 leading-relaxed">
          Practice coding problems, collaborate in real-time rooms, and track your progress — all in one place.
        </p>
        <Link
          to="/problems"
          className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1"
        >
          Start Solving
        </Link>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: '💻', title: 'Problems', text: 'Solve problems in a powerful editor.', url: '/problems', gradient: 'from-green-300 to-blue-300' },
              { icon: '🗣️', title: 'Interactive Rooms', text: 'Collaborate and chat in real time.', url : '/rooms', gradient: 'from-yellow-300 to-orange-300' },
              { icon: '👤', title: 'Your Profile', text: 'Track your progress with detailed stats.', url: '/profile', gradient: 'from-purple-300 to-pink-300' },
            ].map((feat, idx) => (
              <a
                key={idx}
                href={feat.url}
                //target="_blank"
                rel="noopener noreferrer"
              >
              <div key={idx} className="p-8 bg-gradient-to-br dark:bg-none shadow-2xl rounded-3xl transform hover:scale-105 transition-transform duration-300">
                <div className={`flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-tr ${feat.gradient} text-white text-3xl`}>
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{feat.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feat.text}</p>
              </div></a>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Contests Section */}
      <section className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'} py-20 px-6 relative z-10`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-200">🏆 Practice Contests</h2>
          <p className="mb-12 text-gray-700 dark:text-gray-300">Sharpen your skills with real contest problems from popular platforms:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contestLinks.map((contest, idx) => (
              <a
                key={idx}
                href={contest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{contest.icon}</div>
                <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">{contest.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{contest.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SVG Wave Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg className="relative block w-[150%] h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill={theme === 'dark' ? '#111827' : '#f0f5ff'} d="M0,64L80,85.3C160,107,320,149,480,170.7C640,192,800,192,960,176C1120,160,1280,128,1360,112L1440,96L1440,320L0,320Z"></path>
        </svg>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 dark:text-gray-400 relative z-10">
        &copy; {new Date().getFullYear()} ZCoder. All rights reserved.
      </footer>

      {/* Typing Animation Styles */}
      <style jsx>{`
        .typing {
          overflow: hidden;
          white-space: nowrap;
          border-right: 3px solid;
          animation: typing 3s steps(22) forwards, blink 0.75s step-end infinite;
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
