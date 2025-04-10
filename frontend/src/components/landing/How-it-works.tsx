'use client';

import { useState } from 'react';
import { Sparkles, Zap, ArrowRight, Brain, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      icon: <Terminal className="w-6 h-6" />,
      title: 'Write Your Code',
      description:
        'Start coding in your preferred language. Our AI assistant observes your patterns in real-time.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 2,
      icon: <Brain className="w-6 h-6" />,
      title: 'AI Analysis',
      description:
        'Our advanced neural networks analyze your code structure, patterns, and potential improvements.',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      id: 3,
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Smart Suggestions',
      description:
        'Receive intelligent code suggestions, completions, and optimizations as you type.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 4,
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Implementation',
      description:
        'Apply suggestions with a single click, dramatically accelerating your development workflow.',
      color: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <section className="relative w-full py-10 md:py-10 overflow-hidden bg-[#0e0d14]">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
        <svg
          className="absolute h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Curved paths */}
          <path
            d="M0,20 Q40,40 70,35 T100,70"
            stroke="rgba(147, 51, 234, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M0,25 Q30,45 60,40 T100,75"
            stroke="rgba(139, 92, 246, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M0,30 Q45,35 75,30 T100,65"
            stroke="rgba(79, 70, 229, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M0,35 Q25,50 55,45 T100,80"
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-indigo-400 uppercase text-sm font-medium tracking-wider mb-4">
            HOW IT WORKS
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Experience the Power of AI-Driven Development
          </h2>
          <p className="text-lg text-gray-400">
            Our intelligent system works seamlessly with your workflow to
            enhance productivity and code quality
          </p>
        </div>

        {/* Interactive process visualization */}
        <div className="max-w-6xl mx-auto">
          {/* Step indicators */}
          <div className="flex justify-between items-center mb-12 relative">
            {/* Progress line */}
            <div className="absolute h-1 bg-gray-800 left-0 right-0 top-1/2 -translate-y-1/2 z-0"></div>
            <div
              className="absolute h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 left-0 top-1/2 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(activeStep - 1) * 33.33}%` }}
            ></div>

            {steps.map((step) => (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center cursor-pointer"
                onClick={() => setActiveStep(step.id)}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeStep >= step.id
                      ? `bg-gradient-to-r ${step.color} shadow-lg`
                      : 'bg-gray-800'
                  }`}
                >
                  <div
                    className={`${activeStep >= step.id ? 'text-white' : 'text-gray-500'}`}
                  >
                    {step.icon}
                  </div>
                </div>
                <div className="mt-3 text-sm font-medium text-white opacity-0 md:opacity-100">
                  {step.title}
                </div>
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {steps[activeStep - 1].title}
                </h3>
                <p className="text-gray-400 mb-6">
                  {steps[activeStep - 1].description}
                </p>

                <div className="flex space-x-4">
                  {activeStep > 1 && (
                    <button
                      onClick={() =>
                        setActiveStep((prev) => Math.max(prev - 1, 1))
                      }
                      className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                    >
                      Previous
                    </button>
                  )}

                  {activeStep < steps.length && (
                    <button
                      onClick={() =>
                        setActiveStep((prev) =>
                          Math.min(prev + 1, steps.length)
                        )
                      }
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-colors flex items-center"
                    >
                      Next <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-black/30 rounded-xl p-6 border border-gray-800 h-[300px] flex items-center justify-center">
                {/* Step 1: Code Editor */}
                {activeStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full flex flex-col"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="text-gray-400 text-xs ml-2">code.js</div>
                    </div>
                    <div className="flex-1 font-mono text-sm overflow-hidden">
                      <div className="flex">
                        <div className="text-gray-500 mr-4">1</div>
                        <div className="text-blue-400">function</div>
                        <div className="text-green-400 ml-2">
                          calculateTotal
                        </div>
                        <div className="text-white">(items) {`{`}</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">2</div>
                        <div className="text-white ml-4">let total = 0;</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">3</div>
                        <div className="text-blue-400 ml-4">for</div>
                        <div className="text-white ml-2">
                          (let i = 0; i {`<`} items.length; i++) {`{`}
                        </div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">4</div>
                        <div className="text-white ml-8">
                          total += items[i].price;
                        </div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">5</div>
                        <div className="text-white ml-4">{`}`}</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">6</div>
                        <div className="text-white ml-4"></div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">7</div>
                        <div className="text-blue-400 ml-4">return</div>
                        <div className="text-white ml-2">total;</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">8</div>
                        <div className="text-white">{`}`}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: AI Analysis */}
                {activeStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-full blur-[50px]"></div>
                      <div className="relative z-10">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                          <Brain className="w-12 h-12 text-white" />
                        </div>
                        <div className="text-center">
                          <div className="text-white font-medium mb-2">
                            Analyzing Code Patterns
                          </div>
                          <div className="flex space-x-1 justify-center">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Smart Suggestions */}
                {activeStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full flex flex-col"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="text-gray-400 text-xs ml-2">code.js</div>
                    </div>
                    <div className="flex-1 font-mono text-sm overflow-hidden">
                      <div className="flex">
                        <div className="text-gray-500 mr-4">1</div>
                        <div className="text-blue-400">function</div>
                        <div className="text-green-400 ml-2">
                          calculateTotal
                        </div>
                        <div className="text-white">(items) {`{`}</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">2</div>
                        <div className="text-white ml-4">let total = 0;</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">3</div>
                        <div className="text-white ml-4 bg-purple-500/20 px-2 py-1 rounded">
                          <span className="text-blue-400">return</span> items.
                          <span className="text-yellow-400">reduce</span>((sum,
                          item) {'=>'} sum + item.price, 0);
                        </div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">4</div>
                        <div className="text-gray-500 ml-4 line-through">
                          for (let i = 0; i {`<`} items.length; i++) {`{`}
                        </div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">5</div>
                        <div className="text-gray-500 ml-8 line-through">
                          total += items[i].price;
                        </div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">6</div>
                        <div className="text-gray-500 ml-4 line-through">{`}`}</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">7</div>
                        <div className="text-gray-500 ml-4 line-through">
                          return total;
                        </div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">8</div>
                        <div className="text-white">{`}`}</div>
                      </div>
                    </div>
                    <div className="mt-2 bg-purple-500/20 rounded-lg p-2 text-xs">
                      <div className="flex items-start">
                        <Sparkles className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-gray-300">
                          <span className="text-purple-400 font-medium">
                            Suggestion:
                          </span>{' '}
                          Replace loop with Array.reduce() for cleaner, more
                          functional code
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Implementation */}
                {activeStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full flex flex-col"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="text-gray-400 text-xs ml-2">code.js</div>
                    </div>
                    <div className="flex-1 font-mono text-sm overflow-hidden">
                      <div className="flex">
                        <div className="text-gray-500 mr-4">1</div>
                        <div className="text-blue-400">function</div>
                        <div className="text-green-400 ml-2">
                          calculateTotal
                        </div>
                        <div className="text-white">(items) {`{`}</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">2</div>
                        <div className="text-blue-400 ml-4">return</div>
                        <div className="text-white ml-2">items.</div>
                        <div className="text-yellow-400">reduce</div>
                        <div className="text-white">
                          ((sum, item) {'=>'} sum + item.price, 0);
                        </div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">3</div>
                        <div className="text-white">{`}`}</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">4</div>
                        <div className="text-white"></div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">5</div>
                        <div className="text-blue-400">// Example usage</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">6</div>
                        <div className="text-blue-400">const</div>
                        <div className="text-white ml-2">items = [</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">7</div>
                        <div className="text-white ml-4">{`{ name: 'Item 1', price: 10 },`}</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">8</div>
                        <div className="text-white ml-4">{`{ name: 'Item 2', price: 20 },`}</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">9</div>
                        <div className="text-white ml-4">{`{ name: 'Item 3', price: 30 }`}</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">10</div>
                        <div className="text-white">];</div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">11</div>
                        <div className="text-blue-400">const</div>
                        <div className="text-white ml-2">
                          total = calculateTotal(items);
                        </div>
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-4">12</div>
                        <div className="text-white">
                          console.log(total); // 60
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 bg-green-500/20 rounded-lg p-2 text-xs">
                      <div className="flex items-start">
                        <Zap className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-gray-300">
                          <span className="text-green-400 font-medium">
                            Implemented:
                          </span>{' '}
                          Code is now 67% shorter and follows functional
                          programming best practices
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
