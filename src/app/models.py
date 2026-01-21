from pydantic import BaseModel


class QuestionRequest(BaseModel):
    """Request body for the `/qa` endpoint.

    The PRD specifies a single field named `question` that contains
    the user's natural language question about the vector databases paper.
    """

    question: str


class QAResponse(BaseModel):
    """Response body for the `/qa` endpoint.

    Exposes the final verified answer, query plan for transparency,
    and context snippets used for answer generation.
    """

    answer: str
    context: str
    plan: str | None = None
    sub_questions: list[str] | None = None
