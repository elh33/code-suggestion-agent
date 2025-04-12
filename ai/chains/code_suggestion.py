from typing import Dict, List, Optional, Literal, Callable, Any, Union

class CodeSuggestion:
    """Class for generating code suggestions using LLM models"""
    
    SUGGESTION_TYPES = Literal["completion", "fix", "generate"]
    
    # Enhanced prompts for different suggestion types
    PROMPTS = {
        "completion": """[INST] <<SYS>>
        You are an expert programming assistant specializing in code completion.
        You complete partial code with clear, efficient, and well-structured solutions.
        Focus on maintaining the existing code style and producing high-quality code.
        <</SYS>>

        Complete the following code:
        ```
        {code}
        ```
        
        Additional context:
        {context}
        
        Requirements:
        - Complete the code naturally, as if the developer would have written it
        - Follow best practices for the programming language
        - Use efficient algorithms and data structures
        - Include necessary error handling
        - Maintain consistent naming conventions and style

        Respond with ONLY the completed code. Do not include explanations. [/INST]
        """,
        
        "fix": """[INST] <<SYS>>
        You are an expert programming assistant specializing in debugging and fixing code.
        You identify and fix bugs, errors, and issues in code from any programming language.
        Focus on maintaining the existing code style while fixing issues.
        <</SYS>>

        Fix the following code:
        ```
        {code}
        ```
        
        Additional context:
        {context}
        
        Fix all issues including:
        - Syntax errors
        - Logic bugs
        - Performance problems
        - Security vulnerabilities
        
        Respond with:
        1. The complete fixed code
        2. A brief explanation of what was wrong and what you fixed [/INST]
        """,
        
        "generate": """[INST] <<SYS>>
        You are an expert programming assistant specializing in implementing code based on requirements.
        You write clean, efficient, well-documented code in the appropriate programming language.
        You focus on high-quality implementations following best practices.
        <</SYS>>

        Requirement:
        {code}
        
        Additional context:
        {context}
        
        Create production-quality code that:
        - Is clean, readable, and maintainable
        - Has appropriate comments and documentation
        - Handles edge cases properly
        - Follows language-specific conventions and best practices
        
        Respond with:
        1. The complete implementation
        2. A brief explanation of your approach and any notable design decisions [/INST]
        """
    }
    
    def __init__(self, model_pipeline: Union[Callable, Any], vectorstore=None):
        """Initialize the CodeSuggestion class
        
        Args:
            model_pipeline: Either a QuantizedModel instance or a pipeline function
            vectorstore: Optional vector store for retrieving context
        """
        self.model_pipeline = model_pipeline
        self.vectorstore = vectorstore
    
    def get_context(self, code: str, n_results: int = 3) -> str:
        """Retrieve relevant context from the vector store
        
        Args:
            code: The code to get context for
            n_results: Number of context examples to retrieve
            
        Returns:
            String with context information
        """
        if not self.vectorstore:
            return ""
            
        results = self.vectorstore.search(code, n_results=n_results)
        
        # Format context from search results
        context_items = []
        for i, (doc, metadata) in enumerate(zip(results.get('documents', [[]]), results.get('metadatas', [[]]))):
            if doc and metadata:
                context_items.append(f"Example {i+1} ({metadata.get('language', 'code')}):\n{doc[0]}")
        
        return "\n\n".join(context_items) if context_items else ""
    
    def _clean_response(self, response: str) -> str:
        """Clean up the model response by removing prompt artifacts
        
        Args:
            response: Raw model response
            
        Returns:
            Cleaned response
        """
        # Remove the instruction tag if it appears in the response
        if "[/INST]" in response:
            response = response.split("[/INST]", 1)[1].strip()
        
        # Remove common prefixes that models sometimes generate
        prefixes_to_remove = [
            "Here's the completed code:",
            "Here is the completed code:",
            "Here's the fixed code:",
            "Here is the fixed code:",
            "Here's the implementation:",
            "Here is the implementation:"
        ]
        
        for prefix in prefixes_to_remove:
            if response.startswith(prefix):
                response = response[len(prefix):].strip()
        
        return response
    
    def post_process_code(self, response: str, suggestion_type: str) -> str:
        """Fix common errors in generated code"""
        
        if "split(\"\")" in response:
            response = response.replace("split(\"\")", "")
            response = response.replace("reversed_chars = string[::-1]", 
                                    "reversed_string = string[::-1]")
            response = response.replace("reversed_chars[i]", "reversed_string[i]")
        
        return response

    def generate_suggestion(
        self, 
        code: str, 
        suggestion_type: SUGGESTION_TYPES = "completion",
        context: Optional[str] = None
    ) -> str:
        """Generate a code suggestion
        
        Args:
            code: Code to suggest improvements for
            suggestion_type: Type of suggestion to generate
            context: Additional context (if None, will try to get from vectorstore)
            
        Returns:
            Suggested code with explanations
        """
        if suggestion_type not in self.PROMPTS:
            raise ValueError(f"Invalid suggestion type: {suggestion_type}")
            
        # Get context if not provided
        if context is None and self.vectorstore:
            context = self.get_context(code)
            
        # Format the prompt with the template
        prompt_template = self.PROMPTS[suggestion_type]
        formatted_prompt = prompt_template.format(
            code=code,
            context=context if context else "No additional context."
        )
        
        # Generate text from the model
        result = self.model_pipeline.generate(formatted_prompt, max_tokens=1536)
        
        # Clean the response before returning it
        result = self._clean_response(result)
        
        return result