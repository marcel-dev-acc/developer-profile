import { useState, useEffect } from 'react';

interface TypewriterProfileProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export function TypewriterProfile({
  texts,
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseTime = 3000
}: TypewriterProfileProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const currentText = texts[currentTextIndex];

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(pauseTimeout);
    }

    if (!isDeleting && displayedText === currentText) {
      // Finished typing, pause before deleting
      setIsPaused(true);
      return;
    }

    if (isDeleting && displayedText === '') {
      // Finished deleting, move to next text
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayedText(currentText.substring(0, displayedText.length - 1));
      } else {
        setDisplayedText(currentText.substring(0, displayedText.length + 1));
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, currentTextIndex, isDeleting, isPaused, texts, typingSpeed, deletingSpeed, pauseTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  if (!texts || texts.length === 0) {
    return null;
  }

  return (
    <div className="relative bg-black/60 backdrop-blur-sm border border-purple-500/40 rounded-lg p-6 shadow-[0_0_20px_rgba(168,85,247,0.3)] mb-8">
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden rounded-lg">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-[scanline_8s_linear_infinite]" />
      </div>

      {/* Terminal Prompt */}
      <div className="flex items-start gap-2 font-mono">
        <span className="text-green-400 select-none">{'>'}</span>
        <div className="flex-1">
          <span className="text-purple-300">{displayedText}</span>
          <span
            className={`text-green-400 transition-opacity duration-100 ${
              cursorVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            ▊
          </span>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
}
