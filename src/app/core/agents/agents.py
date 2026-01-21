"""Agent implementations for the multi-agent RAG flow.

This module defines four LangChain agents (Planning, Retrieval, Summarization,
Verification) and thin node functions that LangGraph uses to invoke them.
"""

from typing import List

from langchain.agents import create_agent
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from ..llm.factory import create_chat_model
from .prompts import (
    PLANNING_SYSTEM_PROMPT,
    RETRIEVAL_SYSTEM_PROMPT,
    SUMMARIZATION_SYSTEM_PROMPT,
    VERIFICATION_SYSTEM_PROMPT,
)
from .state import QAState
from .tools import retrieval_tool


def _extract_last_ai_content(messages: List[object]) -> str:
    """Extract the content of the last AIMessage in a messages list."""
    for msg in reversed(messages):
        if isinstance(msg, AIMessage):
            return str(msg.content)
    return ""


def _extract_sub_questions(plan_text: str) -> list[str]:
    """Extract sub-questions from the planning agent's output.

    Looks for lines that appear to be sub-questions (starting with dashes, asterisks,
    or numbered items in the SUB-QUESTIONS section).
    """
    sub_questions = []
    in_sub_questions_section = False

    for line in plan_text.split("\n"):
        line = line.strip()

        # Detect sub-questions section
        if "SUB-QUESTION" in line.upper() or "sub-question" in line.lower():
            in_sub_questions_section = True
            continue

        # Exit section if we hit another section header or empty lines followed by uppercase
        if in_sub_questions_section and line and (line[0].isupper() and ":" in line):
            if "SUB-QUESTION" not in line.upper():
                in_sub_questions_section = False

        # Extract sub-questions
        if in_sub_questions_section and line:
            # Remove common prefixes like "- ", "* ", "1. ", etc.
            cleaned = line.lstrip("0123456789.-*) ")
            if cleaned and len(cleaned) > 5:  # Filter out very short lines
                sub_questions.append(cleaned)

    return sub_questions if sub_questions else []


# Define agents at module level for reuse
planning_agent = create_agent(
    model=create_chat_model(),
    tools=[],
    system_prompt=PLANNING_SYSTEM_PROMPT,
)

retrieval_agent = create_agent(
    model=create_chat_model(),
    tools=[retrieval_tool],
    system_prompt=RETRIEVAL_SYSTEM_PROMPT,
)

summarization_agent = create_agent(
    model=create_chat_model(),
    tools=[],
    system_prompt=SUMMARIZATION_SYSTEM_PROMPT,
)

verification_agent = create_agent(
    model=create_chat_model(),
    tools=[],
    system_prompt=VERIFICATION_SYSTEM_PROMPT,
)


def planning_node(state: QAState) -> QAState:
    """Planning Agent node: analyzes question and creates search strategy.

    This node:
    - Sends the user's question to the Planning Agent.
    - The agent decomposes complex questions into sub-questions.
    - Extracts the plan and sub-questions from the agent response.
    - Stores them in `state["plan"]` and `state["sub_questions"]`.
    """
    question = state["question"]

    result = planning_agent.invoke({"messages": [HumanMessage(content=question)]})

    messages = result.get("messages", [])
    plan = _extract_last_ai_content(messages)

    # Extract sub-questions from the plan
    sub_questions = _extract_sub_questions(plan)

    return {
        "plan": plan,
        "sub_questions": sub_questions if sub_questions else None,
    }


def retrieval_node(state: QAState) -> QAState:
    """Retrieval Agent node: gathers context from vector store.

    This node:
    - Sends the user's question to the Retrieval Agent.
    - If a plan and sub-questions exist, uses them to guide multiple retrievals.
    - The agent uses the attached retrieval tool to fetch document chunks.
    - Extracts the tool's content (CONTEXT string) from the ToolMessage.
    - Stores the consolidated context string in `state["context"]`.
    """
    question = state["question"]
    plan = state.get("plan")
    sub_questions = state.get("sub_questions")

    # Build a message that includes both the question and the plan
    if plan and sub_questions:
        user_message = f"""Question: {question}

Planning Strategy:
{plan}

Please use this strategy to retrieve relevant information. Focus on searching for each aspect mentioned in the sub-questions to ensure comprehensive coverage."""
    else:
        user_message = question

    result = retrieval_agent.invoke({"messages": [HumanMessage(content=user_message)]})

    messages = result.get("messages", [])
    context = ""

    # Prefer the last ToolMessage content (from retrieval_tool)
    for msg in reversed(messages):
        if isinstance(msg, ToolMessage):
            context = str(msg.content)
            break

    return {
        "context": context,
    }


def summarization_node(state: QAState) -> QAState:
    """Summarization Agent node: generates draft answer from context.

    This node:
    - Sends question + context to the Summarization Agent.
    - Agent responds with a draft answer grounded only in the context.
    - Stores the draft answer in `state["draft_answer"]`.
    """
    question = state["question"]
    context = state.get("context")

    user_content = f"Question: {question}\n\nContext:\n{context}"

    result = summarization_agent.invoke(
        {"messages": [HumanMessage(content=user_content)]}
    )
    messages = result.get("messages", [])
    draft_answer = _extract_last_ai_content(messages)

    return {
        "draft_answer": draft_answer,
    }


def verification_node(state: QAState) -> QAState:
    """Verification Agent node: verifies and corrects the draft answer.

    This node:
    - Sends question + context + draft_answer to the Verification Agent.
    - Agent checks for hallucinations and unsupported claims.
    - Stores the final verified answer in `state["answer"]`.
    """
    question = state["question"]
    context = state.get("context", "")
    draft_answer = state.get("draft_answer", "")

    user_content = f"""Question: {question}

Context:
{context}

Draft Answer:
{draft_answer}

Please verify and correct the draft answer, removing any unsupported claims."""

    result = verification_agent.invoke(
        {"messages": [HumanMessage(content=user_content)]}
    )
    messages = result.get("messages", [])
    answer = _extract_last_ai_content(messages)

    return {
        "answer": answer,
    }
