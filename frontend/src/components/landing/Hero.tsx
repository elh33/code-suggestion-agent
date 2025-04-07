import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-[200px]">
      {/* Curved lines background */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
        <svg
          className="absolute h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* First set of curves */}
          <path d="M0,0 Q30,30 60,25 T100,50" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="0.5" />
          <path d="M0,5 Q25,35 55,30 T100,55" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="0.5" />
          <path d="M0,10 Q35,25 65,20 T100,45" stroke="rgba(79, 70, 229, 0.5)" strokeWidth="0.5" />
          <path d="M0,15 Q20,40 50,35 T100,60" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5" />

        

       

          {/* Additional curves with different patterns */}
          <path d="M-10,10 Q20,40 40,30 T90,60" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="0.4" />
          <path d="M-5,30 Q25,50 45,40 T95,80" stroke="rgba(129, 140, 248, 0.4)" strokeWidth="0.4" />
          <path d="M-15,50 Q15,70 35,60 T85,100" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.4" />
          <path d="M-20,70 Q10,90 30,80 T80,120" stroke="rgba(192, 132, 252, 0.4)" strokeWidth="0.4" />

          {/* Curves starting from right side */}
          <path d="M100,0 Q70,30 40,25 T0,50" stroke="rgba(147, 51, 234, 0.3)" strokeWidth="0.3" />
          <path d="M100,20 Q60,40 30,35 T-10,70" stroke="rgba(79, 70, 229, 0.3)" strokeWidth="0.3" />
          <path d="M100,40 Q65,60 35,55 T-5,90" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.3" />

          {/* Shorter curves for variety */}
          <path d="M10,5 Q30,15 50,10 T80,25" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="0.3" />
          <path d="M20,25 Q40,35 60,30 T90,45" stroke="rgba(79, 70, 229, 0.4)" strokeWidth="0.3" />
          <path d="M15,45 Q35,55 55,50 T85,65" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="0.3" />
          <path d="M5,65 Q25,75 45,70 T75,85" stroke="rgba(147, 51, 234, 0.4)" strokeWidth="0.3" />
          <path d="M25,85 Q45,95 65,90 T95,105" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="0.3" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mx-auto max-w-5xl space-y-8">
          <h1 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Booster votre développement avec{" "}
            <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-rose-500 bg-clip-text text-transparent">
              EnsaAi
            </span>
          </h1>
          <p className="mx-auto max-w-4xl text-lg text-gray-300 md:text-xl">
            Libérez votre potentiel de développement avec l'IA : génération et correction automatique du code pour une
            productivité sans précédent
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              className="relative bg-black text-white hover:bg-black/80 before:absolute before:-inset-[2px] before:rounded-lg before:bg-gradient-to-r before:from-blue-500 before:via-violet-500 before:to-purple-600 before:-z-10"
              asChild
            >
              <Link href="/get-started" className="relative z-10">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

