// Define types for code suggestions and analysis

export type SuggestionType = "completion" | "bugfix" | "optimization" | "refactoring"

export interface CodeSuggestion {
  id: string
  type: SuggestionType
  lineNumber: number
  code: string
  replacement?: string
  description: string
  severity: "info" | "warning" | "error"
}

export interface LanguagePattern {
  pattern: RegExp
  message: string
  type: SuggestionType
  severity: "info" | "warning" | "error"
  replacement?: string
}

// Language-specific patterns for detecting issues or suggesting improvements
export const languagePatterns: Record<string, LanguagePattern[]> = {
  javascript: [
    {
      pattern: /console\.log\(/g,
      message: "Consider removing console.log statements in production code",
      type: "optimization",
      severity: "info",
    },
    {
      pattern: /for\s*\(\s*let\s+i\s*=\s*0;.+\.length;/g,
      message: "Consider using Array.forEach or map instead of for loop",
      type: "refactoring",
      severity: "info",
      replacement: "// Using Array methods\n$array.forEach((item, index) => {\n  // Your code here\n});",
    },
    {
      pattern: /if\s*$$.+$$\s*\{\s*return true;\s*\}\s*else\s*\{\s*return false;\s*\}/g,
      message: "This if-else statement can be simplified",
      type: "optimization",
      severity: "info",
      replacement: "return condition;",
    },
    {
      pattern: /setTimeout\s*$$\s*function\s*\($$/g,
      message: "Consider using arrow function for better scoping",
      type: "refactoring",
      severity: "info",
      replacement: "setTimeout(() =>",
    },
    {
      pattern: /var\s+/g,
      message: "Consider using let or const instead of var",
      type: "refactoring",
      severity: "warning",
      replacement: "const ",
    },
    {
      pattern: /===\s*undefined/g,
      message: "Consider using optional chaining or nullish coalescing",
      type: "optimization",
      severity: "info",
    },
    {
      pattern: /catch\s*$$\s*e\s*$$\s*\{\s*console\.error/g,
      message: "Consider proper error handling instead of just logging",
      type: "bugfix",
      severity: "warning",
    },
  ],
  typescript: [
    {
      pattern: /any\s*[;,)=]/g,
      message: 'Avoid using "any" type when possible',
      type: "optimization",
      severity: "warning",
    },
    {
      pattern: /:\s*Function/g,
      message: "Consider using a more specific function type",
      type: "optimization",
      severity: "info",
      replacement: ": (param: ParamType) => ReturnType",
    },
    {
      pattern: /!\./g,
      message: "Non-null assertion operator might cause runtime errors",
      type: "bugfix",
      severity: "warning",
    },
  ],
  python: [
    {
      pattern: /print\(/g,
      message: "Consider using logging instead of print in production code",
      type: "optimization",
      severity: "info",
      replacement: "logging.info(",
    },
    {
      pattern: /except:/g,
      message: "Avoid bare except clauses",
      type: "bugfix",
      severity: "warning",
      replacement: "except Exception as e:",
    },
    {
      pattern: /for\s+i\s+in\s+range\(len\(/g,
      message: "Consider using enumerate() for cleaner iteration",
      type: "refactoring",
      severity: "info",
      replacement: "for i, item in enumerate(",
    },
  ],
  html: [
    {
      pattern: /<img[^>]+>/g,
      message: "Ensure img tags have alt attributes for accessibility",
      type: "bugfix",
      severity: "warning",
    },
    {
      pattern: /<div[^>]*>\s*<div/g,
      message: "Consider using semantic HTML elements instead of nested divs",
      type: "optimization",
      severity: "info",
    },
  ],
  css: [
    {
      pattern: /!important/g,
      message: "Avoid using !important when possible",
      type: "optimization",
      severity: "warning",
    },
    {
      pattern: /position:\s*absolute/g,
      message: "Absolute positioning might cause layout issues",
      type: "bugfix",
      severity: "info",
    },
  ],
}

// Function to analyze code and generate suggestions
export function analyzeCode(code: string, language: string): CodeSuggestion[] {
  const suggestions: CodeSuggestion[] = []
  const patterns = languagePatterns[language] || []

  // Split code into lines for line number tracking
  const lines = code.split("\n")

  patterns.forEach((pattern) => {
    // Reset lastIndex to ensure we find all matches
    pattern.pattern.lastIndex = 0

    // Find all matches in the code
    let match
    while ((match = pattern.pattern.exec(code)) !== null) {
      // Find the line number for this match
      const upToMatch = code.substring(0, match.index)
      const lineNumber = upToMatch.split("\n").length

      // Create a suggestion
      suggestions.push({
        id: `${language}-${pattern.type}-${lineNumber}-${Math.random().toString(36).substring(2, 9)}`,
        type: pattern.type,
        lineNumber,
        code: lines[lineNumber - 1],
        replacement: pattern.replacement,
        description: pattern.message,
        severity: pattern.severity,
      })
    }
  })

  return suggestions
}

// Function to get icon for suggestion type
export function getSuggestionIcon(type: SuggestionType): string {
  switch (type) {
    case "completion":
      return "✨" // Sparkles for completion
    case "bugfix":
      return "🐛" // Bug for bugfix
    case "optimization":
      return "🚀" // Rocket for optimization
    case "refactoring":
      return "♻️" // Recycle for refactoring
    default:
      return "💡" // Lightbulb as default
  }
}

// Function to get HTML-formatted icon for suggestion type
export function getSuggestionIconHTML(type: SuggestionType): string {
  switch (type) {
    case "completion":
      return '<span style="color: #6366f1;">✨</span>' // Sparkles for completion
    case "bugfix":
      return '<span style="color: #ef4444;">🐛</span>' // Bug for bugfix
    case "optimization":
      return '<span style="color: #10b981;">🚀</span>' // Rocket for optimization
    case "refactoring":
      return '<span style="color: #8b5cf6;">♻️</span>' // Recycle for refactoring
    default:
      return '<span style="color: #f59e0b;">💡</span>' // Lightbulb as default
  }
}

// Function to get color for suggestion severity
export function getSeverityColor(severity: "info" | "warning" | "error"): string {
  switch (severity) {
    case "info":
      return "text-blue-400"
    case "warning":
      return "text-yellow-400"
    case "error":
      return "text-red-400"
    default:
      return "text-gray-400"
  }
}
