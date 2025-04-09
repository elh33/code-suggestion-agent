from typing import Dict, List, Optional, Literal
from langchain.chains import LLMChain 
from langchain.prompts import PromptTemplate
from langchain.llms.base import LLM

from langchain_community.llms import HuggingFacePipeline


class CodeSuggestion:
    """Class for generating code suggestions using the Phi-2 model"""
    
    SUGGESTION_TYPES = Literal["improvement", "bug_fix", "optimization", "refactoring", "documentation"]
    
    # Enhanced prompts for different suggestion types
    PROMPTS = {
        "improvement": """
        You are an expert programmer helping to improve code.
        
        Given the following code:
        ```
        {code}
        ```
        
        Context information (optional):
        {context}
        
        Please suggest improvements to make this code more readable, maintainable, and aligned with best practices.
        Format your response clearly with:
        1. The improved code
        2. A brief explanation of the changes made
        """,
        
        "bug_fix": """
        You are an expert programmer helping to fix bugs in code.
        
        Given the following code:
        ```
        {code}
        ```
        
        Context information (optional):
        {context}
        
        Please identify and fix any bugs or issues in this code.
        Format your response clearly with:
        1. The fixed code
        2. An explanation of the bugs you found and how you fixed them
        """,
        
        "optimization": """
        You are an expert programmer helping to optimize code.
        
        Given the following code:
        ```
        {code}
        ```
        
        Context information (optional):
        {context}
        
        Please optimize this code for better performance while maintaining its functionality.
        Format your response clearly with:
        1. The optimized code
        2. An explanation of the optimizations made and their benefits
        """,
        
        "refactoring": """
        You are an expert programmer helping to refactor code.
        
        Given the following code:
        ```
        {code}
        ```
        
        Context information (optional):
        {context}
        
        Please refactor this code to improve its structure, readability, and maintainability.
        Format your response clearly with:
        1. The refactored code
        2. An explanation of the refactoring changes made and their benefits
        """,
        
        "documentation": """
        You are an expert programmer helping to document code.
        
        Given the following code:
        ```
        {code}
        ```
        
        Context information (optional):
        {context}
        
        Please add appropriate documentation to this code, including:
        - Function/method docstrings
        - Inline comments for complex logic
        - Any necessary module-level documentation
        
        Format your response clearly with:
        1. The documented code
        2. A brief explanation of the documentation you added
        """
    }
    
    def __init__(self, model_pipeline, vectorstore=None):
        """Initialize the CodeSuggestion class
        
        Args:
            model_pipeline: HuggingFace pipeline for text generation
            vectorstore: Optional vector store for retrieving context
        """
        self.model_pipeline = model_pipeline
        self.vectorstore = vectorstore
        
        # Create LangChain HF pipeline
        self.llm = HuggingFacePipeline(pipeline=model_pipeline)
        
        # Initialize chains for different suggestion types
        self.chains = {}
        for suggestion_type, prompt_template in self.PROMPTS.items():
            prompt = PromptTemplate(
                template=prompt_template,
                input_variables=["code", "context"]
            )
            self.chains[suggestion_type] = LLMChain(
                llm=self.llm,
                prompt=prompt
            )
    
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
    
    def generate_suggestion(
        self, 
        code: str, 
        suggestion_type: SUGGESTION_TYPES = "improvement",
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
        if suggestion_type not in self.chains:
            raise ValueError(f"Invalid suggestion type: {suggestion_type}")
            
        # Get context if not provided
        if context is None and self.vectorstore:
            context = self.get_context(code)
            
        # Generate suggestion
        chain = self.chains[suggestion_type]
        result = chain.run(code=code, context=context if context else "No additional context.")
        
        return result