# The custom calculator is built to avoid the issue
# https://github.com/langchain-ai/langchain/issues/3071
# Inspiration sources:
# https://python.langchain.com/docs/modules/agents/tools/custom_tools
# and (https://github.com/langchain-ai/langchain/blob/master/libs/
#      langchain/langchain/chains/llm_math/base.py#L82)

import math
from typing import Optional, Type

from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain.tools import BaseTool
from pydantic import BaseModel, Field


class CalculatorInput(BaseModel):
    question: str = Field()


def _evaluate_expression(expression: str) -> str:
    try:
        # Simple safe evaluation for basic math
        # Only allow basic math operations and constants
        allowed_names = {
            "pi": math.pi,
            "e": math.e,
            "sqrt": math.sqrt,
            "sin": math.sin,
            "cos": math.cos,
            "tan": math.tan,
            "log": math.log,
            "abs": abs,
            "pow": pow,
            "round": round
        }
        
        # Remove any potentially dangerous characters
        if any(char in expression for char in ['import', 'exec', 'eval', '__']):
            raise ValueError("Invalid expression")
            
        result = eval(expression.strip(), {"__builtins__": {}}, allowed_names)
        return str(result)
    except Exception as e:
        raise ValueError(
            f'Calculator error: {e}. Please provide a valid mathematical expression.'
        )

    return str(result).strip()


class CustomCalculatorTool(BaseTool):
    name: str = "Calculator"
    description: str = "useful for when you need to answer questions about math"
    args_schema: Type[BaseModel] = CalculatorInput

    def _run(
        self, query: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool."""
        try:
            return _evaluate_expression(query.strip())
        except Exception as e:
            return (
                f"Failed to evaluate the expression with error {e}."
                " Please only provide a valid math expression."
            )

    async def _arun(
        self, query: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("Calculator does not support async")
