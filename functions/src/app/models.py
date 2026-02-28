from pydantic import BaseModel


class QuestionRequest(BaseModel):
    """Request body for the `/qa` endpoint.

    The PRD specifies a single field named `question` that contains
    the user's natural language question about the vector databases paper.
    """

    question: str


class QAResponse(BaseModel):
    """Response body for the `/qa` endpoint.

    From the API consumer's perspective we only expose the final,
    verified answer plus the generated search plan and retrieved context.
    """

    answer: str
    context: str
    plan: str | None = None
    sub_questions: list[str] | None = None
