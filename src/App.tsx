import React, { useState, useEffect } from 'react';
import { Timer, Pause, Play, RotateCcw } from 'lucide-react';

function App() {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    const nextIsBreak = !isBreak;
    setIsBreak(nextIsBreak);
    setTimeLeft(nextIsBreak ? 5 * 60 : 20 * 60);
    
    // Show notification
    if (Notification.permission === 'granted') {
      new Notification(nextIsBreak ? 'Time for a break!' : 'Break is over!', {
        body: nextIsBreak ? 'Take 5 minutes to relax.' : 'Let\'s focus for 20 minutes.',
        icon: '/timer-icon.png'
      });
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(20 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-[300px] h-[400px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6">
      <div className="flex flex-col items-center justify-between h-full">
        <div className="text-center">
          <Timer className="w-12 h-12 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold mb-2">Pomodoro Timer</h1>
          <p className="text-sm opacity-80">{isBreak ? 'Break Time' : 'Focus Time'}</p>
        </div>

        <div className="text-center">
          <div className="text-6xl font-bold mb-8">{formatTime(timeLeft)}</div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={toggleTimer}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="text-center text-sm opacity-80">
          {isBreak ? 'Time to recharge!' : 'Stay focused!'}
        </div>
      </div>
    </div>
  );
}

export default App