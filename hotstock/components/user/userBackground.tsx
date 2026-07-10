"use client";

import { useMemo, useEffect, useState, memo } from "react";
import Image from "next/image";

// PERF: [RE-RENDER] Wrap pure functional component in React.memo
export const UserBackground = memo(function UserBackground() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // Seed-based random function để tránh hydration mismatch
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Helper function để round số và tránh hydration mismatch
  const round = (num: number, decimals: number = 2) => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  };

  const largeBubbles = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const seed = i * 7919;
      return {
        size: round(100 + seededRandom(seed) * 100, 1),
        left: round(seededRandom(seed + 1) * 100, 2),
        top: round(seededRandom(seed + 2) * 100, 2),
        delay: round(seededRandom(seed + 3) * 5, 2),
        duration: round(15 + seededRandom(seed + 4) * 5, 2),
      };
    });
  }, []);

  const mediumBubbles = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const seed = (i + 100) * 7919;
      return {
        size: round(50 + seededRandom(seed) * 50, 1),
        left: round(seededRandom(seed + 1) * 100, 2),
        top: round(seededRandom(seed + 2) * 100, 2),
        delay: round(seededRandom(seed + 3) * 4, 2),
        duration: round(12 + seededRandom(seed + 4) * 4, 2),
      };
    });
  }, []);

  const smallBubbles = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const seed = (i + 200) * 7919;
      return {
        size: round(20 + seededRandom(seed) * 25, 1),
        left: round(seededRandom(seed + 1) * 100, 2),
        top: round(seededRandom(seed + 2) * 100, 2),
        delay: round(seededRandom(seed + 3) * 3, 2),
        duration: round(10 + seededRandom(seed + 4) * 3, 2),
      };
    });
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const seed = (i + 300) * 7919;
      return {
        size: round(3 + seededRandom(seed) * 4, 2),
        left: round(seededRandom(seed + 1) * 100, 2),
        top: round(seededRandom(seed + 2) * 100, 2),
        delay: round(seededRandom(seed + 3) * 5, 2),
        duration: round(8 + seededRandom(seed + 4) * 3, 2),
      };
    });
  }, []);

  // Không render trên server để tránh hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <>
      <div 
        className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-background"
        aria-hidden="true"
      >
        
        {/* DARK: Background với BG.png */}
        <div className="hidden dark:block absolute inset-0 pointer-events-none" style={{height: '100%', overflow: 'hidden'}}>
          {/* Background Image */}
          <div
            className="absolute inset-0"
            style={{
              height: '100%',
              width: '100%',
              backgroundImage: 'url(/BG.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          
          {/* Bong bóng lớn - di chuyển từ trên xuống dưới */}
          {/* PERF: [IMAGE] Replace img with next/image */}
          <Image
            src="/homePage/bubble.svg"
            alt=""
            className="bubble-large-orbit"
            loading="lazy"
            decoding="async"
            width={120}
            height={120}
            style={{
              position: 'absolute',
              width: '120px',
              height: 'auto',
              left: '10vw',
              willChange: 'top',
              transform: 'translateZ(0px)',
            }}
          />
          
          {/* Bong bóng nhỏ - di chuyển từ trên xuống dưới */}
          {/* PERF: [IMAGE] Replace img with next/image */}
          <Image
            src="/homePage/bubble_small.svg"
            alt=""
            className="bubble-small-orbit"
            loading="lazy"
            decoding="async"
            width={80}
            height={80}
            style={{
              position: 'absolute',
              width: '80px',
              height: 'auto',
              left: '85vw',
              willChange: 'top',
              transform: 'translateZ(0px)',
            }}
          />
        </div>
        
        {/* LIGHT: Simplified elegant background với chiều sâu */}
        <div className="dark:hidden absolute inset-0 overflow-hidden pointer-events-none" style={{height: '100%'}}>
          {/* Base gradient background - tạo nền mềm mại */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/25 via-indigo-50/20 to-white" style={{height: '100%'}} />
          
          {/* Soft purple glow orbs - tạo chiều sâu */}
          <div 
            className="absolute rounded-full blur-[120px]"
            style={{
              width: 'clamp(400px, 50vw, 700px)',
              height: 'clamp(400px, 50vw, 700px)',
              background: 'radial-gradient(circle, rgba(160, 132, 251, 0.25) 0%, transparent 70%)',
              top: '5%',
              right: '-10%',
              willChange: 'transform',
              transform: 'translateZ(0px)',
            }}
          />
          <div 
            className="absolute rounded-full blur-[100px]"
            style={{
              width: 'clamp(350px, 45vw, 600px)',
              height: 'clamp(350px, 45vw, 600px)',
              background: 'radial-gradient(circle, rgba(112, 66, 225, 0.22) 0%, transparent 70%)',
              bottom: '10%',
              left: '-8%',
              willChange: 'transform',
              transform: 'translateZ(0px)',
            }}
          />
          
          {/* Single elegant wave layer - mượt mà và có chiều sâu */}
          <svg className="absolute top-0 left-0 w-full h-full opacity-18" viewBox="0 0 2400 2000" preserveAspectRatio="none" style={{zIndex: 1, willChange: 'transform'}}>
            <defs>
              <linearGradient id="elegantWave" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A084FB" stopOpacity="0.28" />
                <stop offset="50%" stopColor="#7042E1" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#A084FB" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <path fill="url(#elegantWave)">
              <animate 
                attributeName="d" 
                dur="25s" 
                repeatCount="indefinite" 
                values="M0,0 L0,350 Q400,300 800,350 T1600,400 T2400,450 L2400,2000 L0,2000 Z;
                        M0,0 L0,380 Q400,280 800,380 T1600,430 T2400,480 L2400,2000 L0,2000 Z;
                        M0,0 L0,320 Q400,320 800,320 T1600,370 T2400,420 L2400,2000 L0,2000 Z;
                        M0,0 L0,350 Q400,300 800,350 T1600,400 T2400,450 L2400,2000 L0,2000 Z"
              />
            </path>
          </svg>
          
          {/* Subtle second wave layer - tạo độ sâu nhẹ nhàng */}
          <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 2800 2200" preserveAspectRatio="none" style={{zIndex: 2, willChange: 'transform'}}>
            <defs>
              <linearGradient id="subtleWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.18" />
                <stop offset="50%" stopColor="#A084FB" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#7042E1" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            <path fill="url(#subtleWave)">
              <animate 
                attributeName="d" 
                dur="30s" 
                repeatCount="indefinite" 
                begin="8s"
                values="M0,0 L0,500 Q350,450 700,500 T1400,550 T2100,600 T2800,650 L2800,2200 L0,2200 Z;
                        M0,0 L0,520 Q350,480 700,520 T1400,570 T2100,620 T2800,670 L2800,2200 L0,2200 Z;
                        M0,0 L0,480 Q350,420 700,480 T1400,530 T2100,580 T2800,630 L2800,2200 L0,2200 Z;
                        M0,0 L0,500 Q350,450 700,500 T1400,550 T2100,600 T2800,650 L2800,2200 L0,2200 Z"
              />
            </path>
          </svg>
          
          {/* HOÀNH TRÁNG BUBBLES */}
          {/* Large bubbles */}
          {largeBubbles.map((bubble, i) => (
            <div
              key={`bubble-large-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                background: `radial-gradient(circle at 30% 30%, rgba(160, 132, 251, 0.4), rgba(112, 66, 225, 0.2), transparent 70%)`,
                border: `2px solid rgba(160, 132, 251, 0.3)`,
                left: `${bubble.left}%`,
                top: `${bubble.top}%`,
                animation: `bubbleFloat ${bubble.duration}s ease-in-out infinite`,
                animationDelay: `${bubble.delay}s`,
                boxShadow: `0 0 ${round(bubble.size / 2, 1)}px rgba(160, 132, 251, 0.3)`,
                willChange: 'transform',
                transform: 'translateZ(0px)',
                backfaceVisibility: 'hidden',
                opacity: '0.6'
              }}
            />
          ))}
          
          {/* Medium bubbles */}
          {mediumBubbles.map((bubble, i) => (
            <div
              key={`bubble-medium-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                background: `radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.35), rgba(139, 92, 246, 0.2), transparent 65%)`,
                border: `1.5px solid rgba(167, 139, 250, 0.25)`,
                left: `${bubble.left}%`,
                top: `${bubble.top}%`,
                animation: `bubbleFloat ${bubble.duration}s ease-in-out infinite`,
                animationDelay: `${bubble.delay}s`,
                boxShadow: `0 0 ${round(bubble.size / 3, 1)}px rgba(167, 139, 250, 0.25)`,
                willChange: 'transform',
                transform: 'translateZ(0px)',
                backfaceVisibility: 'hidden',
                opacity: '0.5'
              }}
            />
          ))}
          
          {/* Small bubbles */}
          {smallBubbles.map((bubble, i) => (
            <div
              key={`bubble-small-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                background: `radial-gradient(circle at 30% 30%, rgba(124, 58, 237, 0.3), rgba(160, 132, 251, 0.15), transparent 60%)`,
                border: `1px solid rgba(124, 58, 237, 0.2)`,
                left: `${bubble.left}%`,
                top: `${bubble.top}%`,
                animation: `bubbleFloatSmall ${bubble.duration}s ease-in-out infinite`,
                animationDelay: `${bubble.delay}s`,
                boxShadow: `0 0 ${round(bubble.size / 4, 1)}px rgba(124, 58, 237, 0.2)`,
                willChange: 'transform',
                transform: 'translateZ(0px)',
                backfaceVisibility: 'hidden',
                opacity: '0.4'
              }}
            />
          ))}
          
          {/* Glowing particles floating */}
          {particles.map((particle, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: `radial-gradient(circle, rgba(160, 132, 251, 0.8), transparent)`,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `particleGlow ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
                boxShadow: `0 0 ${round(particle.size * 4, 1)}px rgba(160, 132, 251, 0.5)`,
                willChange: 'transform, opacity',
                transform: 'translateZ(0px)',
                backfaceVisibility: 'hidden'
              }}
            />
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .animate-float { animation: mf 8s ease-in-out infinite; }
        .animate-drift { animation: md 9s ease-in-out infinite; }
        @keyframes mf { 0% { transform: translate(0,0) } 50% { transform: translate(14px,-16px) } 100% { transform: translate(0,0) } }
        @keyframes md { 0% { transform: translate(0,0) } 50% { transform: translate(-16px,12px) } 100% { transform: translate(0,0) } }
        
        .bubble-large-orbit {
          animation: bubbleLargeOrbit 40s linear infinite;
          top: -10%;
        }
        
        .bubble-small-orbit {
          animation: bubbleSmallOrbit 35s linear infinite;
          top: -10%;
        }
        
        @keyframes bubbleLargeOrbit {
          0% {
            top: -10%;
            left: 10vw;
          }
          10% {
            left: 12vw;
          }
          20% {
            left: 8vw;
          }
          30% {
            left: 11vw;
          }
          40% {
            left: 9vw;
          }
          50% {
            top: 50%;
            left: 10vw;
          }
          60% {
            left: 12vw;
          }
          70% {
            left: 8vw;
          }
          80% {
            left: 11vw;
          }
          90% {
            left: 9vw;
          }
          100% {
            top: 110%;
            left: 10vw;
          }
        }
        
        @keyframes bubbleSmallOrbit {
          0% {
            top: -10%;
            left: 85vw;
          }
          10% {
            left: 88vw;
          }
          20% {
            left: 82vw;
          }
          30% {
            left: 87vw;
          }
          40% {
            left: 83vw;
          }
          50% {
            top: 50%;
            left: 85vw;
          }
          60% {
            left: 88vw;
          }
          70% {
            left: 82vw;
          }
          80% {
            left: 87vw;
          }
          90% {
            left: 83vw;
          }
          100% {
            top: 110%;
            left: 85vw;
          }
        }
        
        @keyframes bubbleFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translate3d(30px, -40px, 0) scale(1.08);
            opacity: 0.75;
          }
          50% {
            transform: translate3d(-20px, -70px, 0) scale(1.12);
            opacity: 0.7;
          }
          75% {
            transform: translate3d(15px, -55px, 0) scale(1.04);
            opacity: 0.72;
          }
          100% {
            transform: translate3d(0, -90px, 0) scale(1);
            opacity: 0.4;
          }
        }
        
        @keyframes bubbleFloatSmall {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translate3d(20px, -30px, 0) scale(1.06);
            opacity: 0.55;
          }
          50% {
            transform: translate3d(-15px, -55px, 0) scale(1.1);
            opacity: 0.5;
          }
          75% {
            transform: translate3d(10px, -42px, 0) scale(1.03);
            opacity: 0.52;
          }
          100% {
            transform: translate3d(0, -70px, 0) scale(1);
            opacity: 0.3;
          }
        }
        
        @keyframes particleGlow {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate3d(15px, -25px, 0) scale(1.15);
            opacity: 0.7;
          }
          50% {
            transform: translate3d(-10px, -50px, 0) scale(1.25);
            opacity: 0.8;
          }
          75% {
            transform: translate3d(8px, -35px, 0) scale(1.1);
            opacity: 0.6;
          }
        }
        
        /* Performance optimization */
        @media (prefers-reduced-motion: reduce) {
          .bubble-large-orbit,
          .bubble-small-orbit,
          [class*="bubble"],
          [class*="particle"] {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Responsive optimizations */
        @media (max-width: 768px) {
          .bubble-large-orbit {
            width: 80px !important;
          }
          .bubble-small-orbit {
            width: 60px !important;
          }
        }
        
        /* GPU acceleration */
        .bubble-large-orbit,
        .bubble-small-orbit {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </>
  );
});
