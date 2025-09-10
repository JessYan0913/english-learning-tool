'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import TiptapInput, { type TiptapInputRef } from '../components/tiptap-input';

// 词组数据
const phrases = [
  {
    id: 1,
    phrase: 'I like',
    meaning: '我喜欢',
    example: 'I like the food.',
    exercises: [
      {
        chinese: '我喜欢这个食物。',
        answer: 'I like the food.',
      },
      {
        chinese: '我喜欢音乐。',
        answer: 'I like music.',
      },
    ],
  },
  {
    id: 2,
    phrase: "I don't like",
    meaning: '我不喜欢',
    example: "I don't like the food.",
    exercises: [
      {
        chinese: '我不喜欢这个食物。',
        answer: "I don't like the food.",
      },
      {
        chinese: '我不喜欢咖啡。',
        answer: "I don't like coffee.",
      },
    ],
  },
  {
    id: 3,
    phrase: 'I want to',
    meaning: '我想要',
    example: 'I want to eat now.',
    exercises: [
      {
        chinese: '我想现在吃东西。',
        answer: 'I want to eat now.',
      },
      {
        chinese: '我想去公园。',
        answer: 'I want to go to the park.',
      },
    ],
  },
  {
    id: 4,
    phrase: "I don't want to",
    meaning: '我不想要',
    example: "I don't want to do it today.",
    exercises: [
      {
        chinese: '我今天不想做这件事。',
        answer: "I don't want to do it today.",
      },
      {
        chinese: '我不想喝茶。',
        answer: "I don't want to drink tea.",
      },
    ],
  },
  {
    id: 5,
    phrase: 'now',
    meaning: '现在',
    example: 'I like to do it now.',
    exercises: [
      {
        chinese: '我现在想做这件事。',
        answer: 'I want to do it now.',
      },
      {
        chinese: '我现在需要吃东西。',
        answer: 'I need to eat now.',
      },
    ],
  },
  {
    id: 6,
    phrase: 'today',
    meaning: '今天',
    example: "I don't want to eat the food today.",
    exercises: [
      {
        chinese: '我今天不想吃东西。',
        answer: "I don't want to eat today.",
      },
      {
        chinese: '我今天必须工作。',
        answer: 'I have to work today.',
      },
    ],
  },
  {
    id: 7,
    phrase: 'It is important',
    meaning: '这是重要的',
    example: 'It is important to be here.',
    exercises: [
      {
        chinese: '准时到这里是重要的。',
        answer: 'It is important to be here on time.',
      },
      {
        chinese: '学习英语是重要的。',
        answer: 'It is important to study English.',
      },
    ],
  },
  {
    id: 8,
    phrase: 'It is very good',
    meaning: '这是非常好的',
    example: 'It is very good to see you.',
    exercises: [
      {
        chinese: '见到你真好。',
        answer: 'It is very good to see you.',
      },
      {
        chinese: '每天锻炼真好。',
        answer: 'It is very good to exercise every day.',
      },
    ],
  },
];

export default function EnglishLearningTool() {
  const router = useRouter();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [mode, setMode] = useState<'learn' | 'practice' | 'completed'>('learn');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<TiptapInputRef>(null);

  const phrase = phrases[currentPhrase];

  const triggerCelebration = () => {
    // 左下角喷射
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 1 },
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
    });

    // 右下角喷射
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 1 },
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
    });

    // 延迟第二波庆祝
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 90,
        spread: 45,
        origin: { x: 0.5, y: 0.8 },
        colors: ['#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'],
      });
    }, 250);
  };

  useEffect(() => {
    if (mode === 'practice' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [mode, currentExercise]);

  const handleStartPractice = () => {
    setMode('practice');
    setCurrentExercise(0);
  };

  const handleBackToLearn = () => {
    setMode('learn');
  };

  const calculateLevenshteinDistance = (str1: string, str2: string): number => {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] =
            1 +
            Math.min(
              dp[i - 1][j], // 删除
              dp[i][j - 1], // 插入
              dp[i - 1][j - 1] // 替换
            );
        }
      }
    }

    return dp[m][n];
  };

  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:]/g, '');
  };

  const handleSubmitAnswer = useCallback(() => {
    const correctAnswer = phrase.exercises[currentExercise].answer;
    const targetPhrase = phrase.phrase; // 获取目标短语
    const normalizedUserAnswer = normalizeText(userAnswer);
    const normalizedCorrectAnswer = normalizeText(correctAnswer);
    const normalizedTargetPhrase = normalizeText(targetPhrase);

    // 1. 首先检查是否包含目标短语
    if (!normalizedUserAnswer.includes(normalizedTargetPhrase)) {
      setIsCorrect(false);
      setShowResult(true);

      // 高亮显示缺失的目标短语
      inputRef.current?.highlightWords([], [targetPhrase]);
      return;
    }

    // 2. 计算编辑距离
    const distance = calculateLevenshteinDistance(normalizedUserAnswer, normalizedCorrectAnswer);
    const maxLength = Math.max(normalizedUserAnswer.length, normalizedCorrectAnswer.length);
    const similarity = maxLength > 0 ? (maxLength - distance) / maxLength : 0;

    // 3. 判定是否正确（相似度大于80%或编辑距离小于等于2）
    const correct = similarity >= 0.8 || distance <= 2;

    setIsCorrect(correct);
    setShowResult(true);

    if (!correct) {
      // 高亮显示错误部分
      const userWords = normalizedUserAnswer.split(/\s+/);
      const correctWords = normalizedCorrectAnswer.split(/\s+/);

      const matchedWords: string[] = [];
      const unmatchedWords: string[] = [];

      userWords.forEach((word) => {
        if (correctWords.includes(word)) {
          matchedWords.push(word);
        } else {
          unmatchedWords.push(word);
        }
      });

      inputRef.current?.highlightWords(matchedWords, unmatchedWords);
    }

    if (correct) {
      setTimeout(() => {
        if (currentExercise < phrase.exercises.length - 1) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setShowResult(false);
          inputRef.current?.clear();
        } else {
          if (currentPhrase < phrases.length - 1) {
            setCurrentPhrase(currentPhrase + 1);
            setMode('learn');
            setCurrentExercise(0);
            setUserAnswer('');
            setShowResult(false);
            inputRef.current?.clear();
          } else {
            setMode('completed');
            triggerCelebration();
            setUserAnswer('');
            setShowResult(false);
            inputRef.current?.clear();
          }
        }
      }, 1500);
    }
  }, [currentExercise, currentPhrase, inputRef, phrase.exercises, phrase.phrase, userAnswer]);

  const handleInputChange = (value: string) => {
    setUserAnswer(value);
    if (showResult && !isCorrect) {
      setShowResult(false);
    }
  };

  const handleNextPhrase = useCallback(() => {
    if (currentPhrase < phrases.length - 1) {
      setCurrentPhrase(currentPhrase + 1);
      setMode('learn');
      setCurrentExercise(0);
    }
  }, [currentPhrase]);

  const handlePrevPhrase = useCallback(() => {
    if (currentPhrase > 0) {
      setCurrentPhrase(currentPhrase - 1);
      setMode('learn');
      setCurrentExercise(0);
    }
  }, [currentPhrase]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && mode !== 'practice') {
        event.preventDefault();
        handlePrevPhrase();
      } else if (event.key === 'ArrowRight' && mode !== 'practice') {
        event.preventDefault();
        handleNextPhrase();
      } else if (event.key === 'Enter' && mode === 'practice' && userAnswer.trim() && !showResult) {
        event.preventDefault();
        handleSubmitAnswer();
      } else if (event.key === 'Enter' && mode === 'learn') {
        event.preventDefault();
        handleStartPractice();
      } else if (event.key === 'Escape' && mode === 'practice') {
        event.preventDefault();
        handleBackToLearn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPhrase, mode, userAnswer, showResult, handleNextPhrase, handlePrevPhrase, handleSubmitAnswer]);

  const handleRestart = () => {
    setCurrentPhrase(0);
    setMode('learn');
    setCurrentExercise(0);
    setUserAnswer('');
    setShowResult(false);
  };

  const handleViewSummary = () => {
    // 将学习数据存储到localStorage，以便总结页面使用
    localStorage.setItem(
      'learningData',
      JSON.stringify({
        phrases,
        completedAt: new Date().toISOString(),
      })
    );
    router.push('/summary');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8 relative">
      {mode !== 'completed' && (
        <>
          <Button
            onClick={handlePrevPhrase}
            disabled={currentPhrase === 0 || mode === 'practice'}
            className="fixed left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card shadow-lg hover:shadow-xl border border-border flex items-center justify-center text-2xl text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
            title={`上一个词组 (←) ${currentPhrase > 0 ? phrases[currentPhrase - 1].phrase : ''}`}
            variant="outline"
            size="icon"
          >
            ←
          </Button>

          <Button
            onClick={handleNextPhrase}
            disabled={currentPhrase === phrases.length - 1 || mode === 'practice'}
            className="fixed right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card shadow-lg hover:shadow-xl border border-border flex items-center justify-center text-2xl text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
            title={`下一个词组 (→) ${currentPhrase < phrases.length - 1 ? phrases[currentPhrase + 1].phrase : ''}`}
            variant="outline"
            size="icon"
          >
            →
          </Button>
        </>
      )}

      <div className="w-full max-w-3xl">
        {mode === 'completed' ? (
          <div className="text-center">
            <div className="mb-16">
              <div className="text-6xl mb-8">🎉</div>
              <h1 className="text-5xl font-bold text-foreground mb-6">恭喜完成学习！</h1>
              <p className="text-xl text-muted-foreground mb-12">你已经完成了所有 {phrases.length} 个词组的学习</p>
            </div>

            <div className="flex justify-center gap-6">
              <Button className="h-12 text-lg" onClick={handleViewSummary} size="lg">
                查看学习总结
              </Button>
              <Button className="h-12 text-lg" onClick={handleRestart} size="lg">
                重新开始
              </Button>
            </div>
          </div>
        ) : mode === 'learn' ? (
          <div className="text-center">
            <div className="mb-16">
              <div className="text-sm text-muted-foreground mb-6">
                {currentPhrase + 1} / {phrases.length}
              </div>
              <div className="w-full bg-muted rounded-full h-1 mb-12">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-500"
                  style={{ width: `${((currentPhrase + 1) / phrases.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-20">
              <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-8 font-mono tracking-wide">
                {phrase.phrase}
              </h1>
              <p className="text-3xl md:text-4xl text-muted-foreground mb-12 font-light">{phrase.meaning}</p>
              <div className="bg-muted rounded-xl p-8 inline-block">
                <p className="text-xl md:text-2xl text-muted-foreground italic font-light">{`"${phrase.example}"`}</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Button onClick={handleStartPractice} className="h-12 text-lg" size="lg">
                开始练习 <span className="text-sm opacity-75">(Enter)</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-16">
              <div className="text-sm text-muted-foreground mb-4">
                词组 {currentPhrase + 1} / {phrases.length} · 练习 {currentExercise + 1} / {phrase.exercises.length}
              </div>
              <div className="w-full bg-muted rounded-full h-1 mb-8">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / phrase.exercises.length) * 100}%` }}
                />
              </div>
              <h2 className="text-4xl font-light text-foreground mb-16">{phrase.exercises[currentExercise].chinese}</h2>
            </div>

            <div className="mb-16">
              <TiptapInput
                ref={inputRef}
                value={userAnswer}
                onChange={handleInputChange}
                onSubmit={() => {
                  if (userAnswer.trim()) {
                    handleSubmitAnswer();
                  }
                }}
                placeholder="输入英文句子... (按 Enter 提交)"
                className={showResult && !isCorrect ? 'border-destructive focus-within:border-destructive' : ''}
                expectedAnswer={phrase.exercises[currentExercise].answer}
                enableRealTimeValidation={true}
              />

              {showResult && !isCorrect && (
                <div className="mt-4 text-center">
                  <div className="text-destructive text-lg mb-2">请检查输入的内容</div>
                  <div className="text-muted-foreground text-sm">
                    正确答案：{phrase.exercises[currentExercise].answer}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                {!showResult ? (
                  <Button onClick={handleSubmitAnswer} disabled={!userAnswer.trim()} size="lg">
                    检查答案
                  </Button>
                ) : isCorrect ? (
                  <div className="flex items-center gap-3 text-primary text-xl font-medium">
                    <span className="text-2xl">✓</span>
                    <span>正确！正在进入下一题...</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-center gap-8">
              <Button size="lg" onClick={handleBackToLearn} variant="ghost">
                返回学习 <span className="text-xs text-muted-foreground/60">(Esc)</span>
              </Button>

              <Button
                size="lg"
                onClick={() => {
                  if (currentExercise < phrase.exercises.length - 1) {
                    setCurrentExercise(currentExercise + 1);
                    setUserAnswer('');
                    setShowResult(false);
                    inputRef.current?.clear();
                  } else {
                    setMode('learn');
                    setCurrentExercise(0);
                    setUserAnswer('');
                    setShowResult(false);
                    inputRef.current?.clear();
                  }
                }}
                variant="outline"
              >
                跳过
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
