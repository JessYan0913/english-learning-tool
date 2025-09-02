'use client';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function StatsPage() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalTime: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    streak: 0,
    phrasesLearned: 0,
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('learningStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const accuracy = stats.totalAnswers > 0 ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) : 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-6xl space-y-16">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 font-mono tracking-wide">统计</h1>
          <p className="text-2xl text-muted-foreground">查看你的学习进度和成就</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-6xl font-bold text-blue-500 font-mono">{stats.phrasesLearned}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">已学词组</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-6xl font-bold text-green-500 font-mono">{accuracy}%</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">正确率</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-6xl font-bold text-orange-500 font-mono">{stats.streak}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">连续天数</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-6xl font-bold text-purple-500 font-mono">{stats.totalSessions}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">学习次数</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-6xl font-bold text-pink-500 font-mono">
                {Math.round(stats.totalTime / 60)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">学习时长 (分钟)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-6xl font-bold text-indigo-500 font-mono">{stats.correctAnswers}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">正确答题数</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold">总体进度 {stats.phrasesLearned}/10 词组</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(stats.phrasesLearned / 10) * 100} className="w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold">正确率目标 {accuracy}/90%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={Math.min((accuracy / 90) * 100, 100)} className="w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
