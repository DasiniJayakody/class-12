from pathlib import Path

from fastapi import FastAPI, File, HTTPException, Request, UploadFile, status
from fastapi.responses import JSONResponse

from .models import QuestionRequest, QAResponse
from .services.qa_service import answer_question
from .services.indexing_service import index_pdf_file


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Strategic Multi-Agent RAG (Query Decomposition)",
    description=(
        "Enhanced RAG pipeline using a strategic Query Planning Agent "
        "to decompose complex questions into targeted search sub-queries."
    ),
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from fastapi import APIRouter

api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def api_root():
    return {"message": "Strategic Multi-Agent RAG API is running."}

@api_router.get("/health")
async def health():
    return {"status": "healthy", "version": "0.1.0"}

@api_router.post("/qa", response_model=QAResponse, status_code=status.HTTP_200_OK)
async def qa_endpoint(payload: QuestionRequest) -> QAResponse:
    question = payload.question.strip()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="`question` must be a non-empty string.",
        )
    result = answer_question(question)
    return QAResponse(
        answer=result.get("answer", ""),
        context=result.get("context", ""),
        plan=result.get("plan"),
        sub_questions=result.get("sub_questions"),
    )

@api_router.post("/index-pdf", status_code=status.HTTP_200_OK)
async def index_pdf(file: UploadFile = File(...)) -> dict:
    if file.content_type not in ("application/pdf",):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported.",
        )
    import tempfile
    upload_dir = Path(tempfile.gettempdir()) / "uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / file.filename
    contents = await file.read()
    file_path.write_bytes(contents)
    chunks_indexed = index_pdf_file(file_path)
    return {
        "filename": file.filename,
        "chunks_indexed": chunks_indexed,
        "message": "PDF indexed successfully.",
    }

app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Server is running. API available at /api"}
