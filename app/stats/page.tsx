"use client"
import { useState, useEffect } from "react"

export default function StatsPage() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalTime: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    streak: 0,
    phrasesLearned: 0,
  })

  useEffect(() => {
    const savedStats = localStorage.getItem("learningStats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [])

  const accuracy = stats.totalAnswers > 0 ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) : 0

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-light text-gray-900 mb-6">统计</h1>
          <p className="text-xl text-gray-400">查看你的学习进度和成就</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mb-20">
          <div className="text-center">
            <div className="text-5xl font-light text-blue-500 mb-4">{stats.phrasesLearned}</div>
            <div className="text-xl text-gray-500">已学词组</div>
          </div>

          <div className="text-center">
            <div className="text-5xl font-light text-green-500 mb-4">{accuracy}%</div>
            <div className="text-xl text-gray-500">正确率</div>
          </div>

          <div className="text-center">
            <div className="text-5xl font-light text-orange-500 mb-4">{stats.streak}</div>
            <div className="text-xl text-gray-500">连续天数</div>
          </div>

          <div className="text-center">
            <div className="text-5xl font-light text-purple-500 mb-4">{stats.totalSessions}</div>
            <div className="text-xl text-gray-500">学习次数</div>
          </div>

          <div className="text-center">
            <div className="text-5xl font-light text-pink-500 mb-4">{Math.round(stats.totalTime / 60)}</div>
            <div className="text-xl text-gray-500">学习时长 (分钟)</div>
          </div>

          <div className="text-center">
            <div className="text-5xl font-light text-indigo-500 mb-4">{stats.correctAnswers}</div>
            <div className="text-xl text-gray-500">正确答题数</div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="text-center">
            <div className="text-xl text-gray-500 mb-8">总体进度 {stats.phrasesLearned}/10 词组</div>
            <div className="w-full bg-gray-100 rounded-full h-4 max-w-lg mx-auto">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${(stats.phrasesLearned / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className="text-xl text-gray-500 mb-8">正确率目标 {accuracy}/90%</div>
            <div className="w-full bg-gray-100 rounded-full h-4 max-w-lg mx-auto">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((accuracy / 90) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
