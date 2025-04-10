import { Cog, RefreshCcw, LayoutGrid } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section className="relative w-full py-15 md:py-2 overflow-hidden">
      {/* Curved lines background */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
        <svg
          className="absolute h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Inverted curved paths */}
          <path
            d="M0,80 Q40,60 70,65 T100,30"
            stroke="rgba(147, 51, 234, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M0,75 Q30,55 60,60 T100,25"
            stroke="rgba(139, 92, 246, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M0,70 Q45,65 75,70 T100,35"
            stroke="rgba(79, 70, 229, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M0,65 Q25,50 55,55 T100,20"
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Decorative gradient elements */}
      <div className="absolute -z-10 top-1/4 left-0 w-72 h-72 bg-purple-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute -z-10 bottom-1/4 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[120px]"></div>

      {/* Dot patterns on left side */}
      <div className="absolute left-8 top-1/3 grid grid-cols-1 gap-2 z-10">
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
      <div className="absolute right-8 bottom-16 grid grid-cols-6 gap-2 z-10">
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

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="text-indigo-400 uppercase text-sm font-medium tracking-wider mb-4">
            FEATURES
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Discover the Tools that Enhance Your Code with AI
          </h2>
          <p className="text-lg text-gray-400">
            Unleash Creativity and Boost Productivity with AI-Powered Code
            Suggestions
          </p>
        </div>

        <div className="grid bg-gray-900/50  p-[50px] grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="flex flex-col items-center  p-[27px] text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-sm"></div>
              <Cog className="w-8 h-8 text-indigo-400 relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              AI-Powered Code Optimization
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience AI-Driven Code Analysis that Transforms Development
              Workflows Instantly
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center  p-[27px] text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-sm"></div>
              <RefreshCcw className="w-8 h-8 text-indigo-400 relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Effortless AI-Powered Coding
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stay Efficient Anytime, Anywhere with AI-Powered Code Assistance
              for Seamless Development
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center  p-[27px]  text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-sm"></div>
              <LayoutGrid className="w-8 h-8 text-indigo-400 relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Intuitive User Interface
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience an Intuitive and Seamless AI-Powered Coding Interface
              for Maximum Productivity
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
