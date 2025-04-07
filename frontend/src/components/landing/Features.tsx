import { Code, Lightbulb, Rocket } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function FeaturesSection() {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden backdrop-blur-sm">
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
      <div className="absolute inset-0 -z-10"></div>

      {/* Decorative gradient elements */}
      <div className="absolute -z-10 top-1/4 left-0 w-72 h-72 bg-purple-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute -z-10 bottom-1/4 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-[120px]"></div>

      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Discover the Tools that Enhance Your Code with AI
          </h2>
          <p className="text-lg md:text-xl text-gray-300">
            Unleash Creativity and Boost Productivity with AI-Powered Code Suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[2500px] mx-auto">
          {/* Feature Card 1 */}
          <Card className="group bg-gradient-to-br from-[#090813] to-[#0e0d11] border-gray-800 overflow-hidden relative h-full">
            {/* Curved gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full blur-sm transform -translate-y-1/2 translate-x-1/2"></div>

            <CardHeader className="pt-8 pb-0 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">AI Code Suggestions</h3>
            </CardHeader>

            <CardContent className="text-center pt-2 pb-8">
              <p className="text-gray-400">Receive context-aware code suggestions that boost your coding efficiency.</p>
            </CardContent>

            {/* Subtle curved accent at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-blue-500/5 to-transparent"></div>
          </Card>

          {/* Feature Card 2 */}
          <Card className="group bg-gradient-to-br from-[#090813] to-[#0e0d11] border-gray-800 overflow-hidden relative h-full">
            {/* Curved gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full blur-sm transform -translate-y-1/2 translate-x-1/2"></div>

            <CardHeader className="pt-8 pb-0 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/30 transition-all duration-300">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">Creative Assistance</h3>
            </CardHeader>

            <CardContent className="text-center pt-2 pb-8">
              <p className="text-gray-400">
                Unlock your creativity with AI-powered features that help you think outside the box.
              </p>
            </CardContent>

            {/* Subtle curved accent at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-purple-500/5 to-transparent"></div>
          </Card>

          {/* Feature Card 3 */}
          <Card className="group bg-gradient-to-br from-[#090813] to-[#0e0d11] border-gray-800 overflow-hidden relative h-full lg:col-span-1 md:col-span-2 md:max-w-md md:mx-auto">
            {/* Curved gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full blur-sm transform -translate-y-1/2 translate-x-1/2"></div>

            <CardHeader className="pt-8 pb-0 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/30 transition-all duration-300">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">Boost Productivity</h3>
            </CardHeader>

            <CardContent className="text-center pt-2 pb-8">
              <p className="text-gray-400">
                Improve your development speed with AI-driven productivity tools tailored to your needs.
              </p>
            </CardContent>

            {/* Subtle curved accent at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-cyan-500/5 to-transparent"></div>
          </Card>
        </div>
      </div>
    </section>
  )
}

