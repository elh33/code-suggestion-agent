from langchain import LLMChain
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI

class CodeSuggestion:
    def __init__(self, model_name: str, api_key: str):
        self.llm = OpenAI(model_name=model_name, openai_api_key=api_key)
        self.prompt_template = PromptTemplate(
            input_variables=["context", "code"],
            template="Given the following context: {context}, suggest improvements or additions to this code: {code}"
        )
        self.chain = LLMChain(llm=self.llm, prompt=self.prompt_template)

    def suggest_code(self, context: str, code: str) -> str:
        return self.chain.run(context=context, code=code)