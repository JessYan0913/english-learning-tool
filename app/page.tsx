'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import TiptapInput, { type TiptapInputRef } from '../components/tiptap-input';
import { calculateLevenshteinDistance, normalizeText } from '@/lib/utils';

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
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [mode, setMode] = useState<'learn' | 'practice' | 'completed'>('learn');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<TiptapInputRef>(null);

  const currentPhrase = phrases[currentPhraseIndex];

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 1 },
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
    });
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 1 },
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
    });
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
  }, [mode, currentExerciseIndex]);

  const handleStartPractice = () => {
    setMode('practice');
    setCurrentExerciseIndex(0);
    setUserAnswer('');
    setShowResult(false);
  };

  const handleBackToLearn = () => {
    setMode('learn');
    setUserAnswer('');
    setShowResult(false);
    inputRef.current?.clear();
  };

  const handleSubmitAnswer = useCallback(() => {
    const correctAnswer = currentPhrase.exercises[currentExerciseIndex].answer;
    const targetPhrase = currentPhrase.phrase;
    const normalizedUserAnswer = normalizeText(userAnswer);
    const normalizedCorrectAnswer = normalizeText(correctAnswer);
    const normalizedTargetPhrase = normalizeText(targetPhrase);

    if (!normalizedUserAnswer.includes(normalizedTargetPhrase)) {
      setIsCorrect(false);
      setShowResult(true);
      inputRef.current?.highlightWords([], [targetPhrase]);
      return;
    }

    const distance = calculateLevenshteinDistance(normalizedUserAnswer, normalizedCorrectAnswer);
    const maxLength = Math.max(normalizedUserAnswer.length, normalizedCorrectAnswer.length);
    const similarity = maxLength > 0 ? (maxLength - distance) / maxLength : 0;
    const correct = similarity >= 0.8 || distance <= 2;

    setIsCorrect(correct);
    setShowResult(true);

    if (!correct) {
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
    } else {
      setTimeout(() => {
        if (currentExerciseIndex < currentPhrase.exercises.length - 1) {
          setCurrentExerciseIndex((prev) => prev + 1);
          setUserAnswer('');
          setShowResult(false);
          inputRef.current?.clear();
        } else if (currentPhraseIndex < phrases.length - 1) {
          setCurrentPhraseIndex((prev) => prev + 1);
          setMode('learn');
          setCurrentExerciseIndex(0);
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
      }, 1500);
    }
  }, [currentExerciseIndex, currentPhraseIndex, userAnswer, currentPhrase]);

  const handleInputChange = (value: string) => {
    setUserAnswer(value);
    if (showResult && !isCorrect) {
      setShowResult(false);
    }
  };

  const handleNextPhrase = useCallback(() => {
    if (currentPhraseIndex < phrases.length - 1) {
      setCurrentPhraseIndex((prev) => prev + 1);
      setMode('learn');
      setCurrentExerciseIndex(0);
      setUserAnswer('');
      setShowResult(false);
    }
  }, [currentPhraseIndex]);

  const handlePrevPhrase = useCallback(() => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex((prev) => prev - 1);
      setMode('learn');
      setCurrentExerciseIndex(0);
      setUserAnswer('');
      setShowResult(false);
    }
  }, [currentPhraseIndex]);

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
  }, [
    mode,
    userAnswer,
    showResult,
    handleSubmitAnswer,
    handleNextPhrase,
    handlePrevPhrase,
    handleStartPractice,
    handleBackToLearn,
  ]);

  const handleRestart = () => {
    setCurrentPhraseIndex(0);
    setMode('learn');
    setCurrentExerciseIndex(0);
    setUserAnswer('');
    setShowResult(false);
    inputRef.current?.clear();
  };

  const handleViewSummary = () => {
    localStorage.setItem(
      'learningData',
      JSON.stringify({
        phrases,
        completedAt: new Date().toISOString(),
      })
    );
    router.push('/summary');
  };

  const renderProgress = () => {
    const phraseProgress = ((currentPhraseIndex + 1) / phrases.length) * 100;

    return (
      <div className="mb-12">
        <div className="text-sm text-muted-foreground mb-2">
          词组进度：{currentPhraseIndex + 1} / {phrases.length}
        </div>
        <div className="w-full bg-muted rounded-full h-4">
          <div
            className="bg-primary h-4 rounded-full transition-all duration-500"
            style={{ width: `${phraseProgress}%` }}
            role="progressbar"
            aria-valuenow={phraseProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`词组学习进度：${currentPhraseIndex + 1} / ${phrases.length}`}
          />
        </div>
        {mode === 'practice' && (
          <div className="text-sm text-muted-foreground mt-2">
            练习进度：{currentExerciseIndex + 1} / {currentPhrase.exercises.length}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8 relative">
      {mode !== 'completed' && (
        <>
          <Button
            onClick={handlePrevPhrase}
            disabled={currentPhraseIndex === 0 || mode === 'practice'}
            className="fixed left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card shadow-lg hover:shadow-xl border border-border flex items-center justify-center text-2xl text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
            title={`上一个词组 (←) ${currentPhraseIndex > 0 ? phrases[currentPhraseIndex - 1].phrase : ''}`}
            variant="outline"
            size="icon"
          >
            ←
          </Button>

          <Button
            onClick={handleNextPhrase}
            disabled={currentPhraseIndex === phrases.length - 1 || mode === 'practice'}
            className="fixed right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card shadow-lg hover:shadow-xl border border-border flex items-center justify-center text-2xl text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
            title={`下一个词组 (→) ${currentPhraseIndex < phrases.length - 1 ? phrases[currentPhraseIndex + 1].phrase : ''}`}
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
            {renderProgress()}
            <div className="mb-20">
              <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-8 font-mono tracking-wide">
                {currentPhrase.phrase}
              </h1>
              <p className="text-3xl md:text-4xl text-muted-foreground mb-12 font-light">{currentPhrase.meaning}</p>
              <div className="bg-muted rounded-xl p-8 inline-block">
                <p className="text-xl md:text-2xl text-muted-foreground italic font-light">{`"${currentPhrase.example}"`}</p>
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
            {renderProgress()}
            <h2 className="text-4xl font-light text-foreground mb-16">
              {currentPhrase.exercises[currentExerciseIndex].chinese}
            </h2>

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
                expectedAnswer={currentPhrase.exercises[currentExerciseIndex].answer}
                enableRealTimeValidation={true}
              />

              {showResult && !isCorrect && (
                <div className="mt-4 text-center">
                  <div className="text-destructive text-lg mb-2">请检查输入的内容</div>
                  <div className="text-muted-foreground text-sm">
                    正确答案：{currentPhrase.exercises[currentExerciseIndex].answer}
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
                  if (currentExerciseIndex < currentPhrase.exercises.length - 1) {
                    setCurrentExerciseIndex((prev) => prev + 1);
                    setUserAnswer('');
                    setShowResult(false);
                    inputRef.current?.clear();
                  } else {
                    setMode('learn');
                    setCurrentExerciseIndex(0);
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
