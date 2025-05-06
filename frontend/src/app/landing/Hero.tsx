import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-[150px]">
      {/* Dot patterns on left side */}
      <div className="absolute left-8 top-1/3 grid grid-cols-1 gap-2">
        {[...Array(8)].map((_, i) => (
          <div key={`left-${i}`} className="flex gap-2">
            {[...Array(3)].map((_, j) => (
              <div
                key={`left-${i}-${j}`}
                className="w-1 h-1 rounded-full bg-indigo-500/30"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Dot patterns on right side */}
      <div className="absolute right-8 bottom-16 grid grid-cols-6 gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={`right-${i}`} className="flex gap-2">
            {[...Array(6)].map((_, j) => (
              <div
                key={`right-${i}-${j}`}
                className="w-1 h-1 rounded-full bg-indigo-500/30"
              />
            ))}
          </div>
        ))}
      </div>
      {/* Curved lines background */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
        <svg
          className="absolute h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Elegant wave set */}
          <path
            d="M0,0 Q30,25 60,20 T100,45"
            stroke="rgba(147, 51, 234, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M0,6 Q25,30 55,25 T100,50"
            stroke="rgba(139, 92, 246, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M0,12 Q35,20 65,15 T100,40"
            stroke="rgba(79, 70, 229, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M0,18 Q20,35 50,30 T100,55"
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="0.5"
          />

          {/* Soft echoes for depth */}
          <path
            d="M-10,8 Q20,35 40,25 T90,50"
            stroke="rgba(168, 85, 247, 0.4)"
            strokeWidth="0.4"
          />
          <path
            d="M-5,28 Q25,45 45,35 T95,65"
            stroke="rgba(129, 140, 248, 0.4)"
            strokeWidth="0.4"
          />
          <path
            d="M-15,48 Q15,60 35,50 T85,85"
            stroke="rgba(96, 165, 250, 0.4)"
            strokeWidth="0.4"
          />
          <path
            d="M-20,68 Q10,80 30,70 T80,105"
            stroke="rgba(192, 132, 252, 0.4)"
            strokeWidth="0.4"
          />

          {/* Mirrored right-to-left waves */}
          <path
            d="M100,0 Q70,25 40,20 T0,45"
            stroke="rgba(147, 51, 234, 0.3)"
            strokeWidth="0.3"
          />
          <path
            d="M100,18 Q60,35 30,30 T-10,60"
            stroke="rgba(79, 70, 229, 0.3)"
            strokeWidth="0.3"
          />
          <path
            d="M100,36 Q65,50 35,45 T-5,80"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="0.3"
          />

          {/* Light ripples */}
          <path
            d="M10,5 Q30,15 50,10 T80,20"
            stroke="rgba(139, 92, 246, 0.4)"
            strokeWidth="0.3"
          />
          <path
            d="M20,25 Q40,30 60,25 T90,40"
            stroke="rgba(79, 70, 229, 0.4)"
            strokeWidth="0.3"
          />
          <path
            d="M15,45 Q35,50 55,45 T85,60"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="0.3"
          />
          <path
            d="M5,65 Q25,70 45,65 T75,75"
            stroke="rgba(147, 51, 234, 0.4)"
            strokeWidth="0.3"
          />
          <path
            d="M25,85 Q45,90 65,85 T95,100"
            stroke="rgba(139, 92, 246, 0.4)"
            strokeWidth="0.3"
          />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mx-auto max-w-5xl">
          <h1 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
          Boost your development with  :
          {'        '}
            <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-rose-500 bg-clip-text text-transparent">
              EnsaAi
            </span>
          </h1>
          <p className="mx-auto max-w-4xl text-lg text-gray-300 md:text-xl">
            Unlock your development potential with AI: automatic code generation
            and correction for unprecedented productivity.
          </p>
          <div className="flex mt-10 justify-center">
            <Button
              size="lg"
              className="relative bg-black text-white  hover:bg-black/80 before:absolute before:-inset-[2px] before:rounded-lg before:bg-gradient-to-r before:from-blue-500 before:via-violet-500 before:to-purple-600 before:-z-10"
              asChild
            >
              <Link href="/login" className="relative  z-10">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
