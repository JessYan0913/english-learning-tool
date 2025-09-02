'use client';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Exercise {
  chinese: string;
  answer: string;
}

interface Phrase {
  id: number;
  phrase: string;
  meaning: string;
  example: string;
  exercises: Exercise[];
}

interface LearningData {
  phrases: Phrase[];
  completedAt: string;
}

export default function SummaryPage() {
  const router = useRouter();
  const [learningData, setLearningData] = useState<LearningData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('learningData');
    if (data) {
      setLearningData(JSON.parse(data));
    } else {
      // 如果没有学习数据，跳转回主页
      router.push('/');
    }
  }, [router]);

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleRestartLearning = () => {
    localStorage.removeItem('learningData');
    router.push('/');
  };

  if (!learningData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-light text-muted-foreground">加载中...</div>
        </div>
      </div>
    );
  }

  const completedDate = new Date(learningData.completedAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <div className="text-8xl mb-8">📚</div>
          <h1 className="text-6xl font-light text-foreground mb-8">学习总结</h1>
          <p className="text-2xl text-muted-foreground mb-6">回顾你学过的所有词组</p>
          <p className="text-lg text-muted-foreground">完成时间：{completedDate}</p>
        </div>

        <div className="space-y-10 mb-20">
          {learningData.phrases.map((phrase, index) => (
            <div key={phrase.id} className="bg-card rounded-3xl p-10">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-medium">
                  {index + 1}
                </div>
                <h3 className="text-3xl font-light text-foreground font-mono">{phrase.phrase}</h3>
                <span className="text-2xl text-muted-foreground">- {phrase.meaning}</span>
              </div>
              <p className="text-xl text-card-foreground italic mb-6 ml-18">{`"${phrase.example}"`}</p>
              <div className="space-y-4 ml-18">
                <p className="text-lg text-muted-foreground font-medium">练习题目：</p>
                {phrase.exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="bg-background rounded-2xl p-6">
                    <p className="text-lg text-foreground mb-2">{exercise.chinese}</p>
                    <p className="text-lg text-primary font-mono">{exercise.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-8">
          <Button
            onClick={handleBackToHome}
            variant="outline"
            className="rounded-full px-16 py-5 text-xl font-medium"
          >
            返回首页
          </Button>
          <Button
            onClick={handleRestartLearning}
            className="rounded-full px-16 py-5 text-xl font-medium"
          >
            重新学习
          </Button>
        </div>
      </div>
    </div>
  );
}
