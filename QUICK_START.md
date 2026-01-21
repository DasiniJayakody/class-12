# Quick Reference Guide

## 🚀 Get Started in 5 Minutes

### 1. Clone/Download Project

```bash
cd "d:\AI Bootcamp\class-12"
```

### 2. Run Quick Start

**Windows:**

```bash
quickstart.bat
```

**Linux/Mac:**

```bash
bash quickstart.sh
```

### 3. Configure Environment

Edit `.env` file with:

```
OPENAI_API_KEY=your_key
PINECONE_API_KEY=your_key
PINECONE_INDEX_NAME=your_index_name
PINECONE_ENVIRONMENT=your_env
```

### 4. Start Backend (Terminal 1)

```bash
uvicorn src.app.api:app --reload
# Backend: http://localhost:8000
```

### 5. Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
# Frontend: http://localhost:5173
```

### 6. Open Browser

```
http://localhost:5173
```

## 📝 Test Questions

### Simple (Direct Search)

```
"What are vector databases?"
```

### Complex (Demonstrates Planning)

```
"What are the advantages of vector databases compared to traditional
databases, and how do they handle scalability?"
```

### Use Cases

```
"How are vector databases used in semantic search and
recommendation systems?"
```

## 🔑 API Endpoints

### Ask Question

```bash
curl -X POST http://localhost:8000/qa \
  -H "Content-Type: application/json" \
  -d '{"question": "Your question here?"}'
```

### Upload PDF

```bash
curl -X POST http://localhost:8000/index-pdf \
  -F "file=@document.pdf"
```

## 📂 Project Structure

```
class-12/
├── src/app/core/agents/
│   ├── agents.py        ← Planning agent here
│   ├── graph.py         ← Planning in flow
│   ├── prompts.py       ← Planning prompt
│   └── state.py         ← Plan fields
├── frontend/            ← React UI
│   └── src/components/
│       └── QueryPlan.jsx ← Planning display
├── SETUP_GUIDE.md       ← Full documentation
└── README.md            ← Quick start
```

## 🆘 Troubleshooting

### Backend Won't Start

```bash
# Check Python 3.11+
python --version

# Install dependencies
pip install uv
uv sync

# Check env vars
echo %OPENAI_API_KEY%  # Windows
echo $OPENAI_API_KEY   # Linux/Mac
```

### Frontend Won't Connect

- Ensure backend running on port 8000
- Check vite.config.js proxy settings
- Clear browser cache

### No Results

- Verify Pinecone API key
- Check document is indexed
- Review backend logs

### Planning Not Showing

- Refresh browser (Ctrl+F5)
- Check browser console for errors
- Verify API response includes plan

## 📊 Response Format

```json
{
  "answer": "Final verified answer",
  "context": "Retrieved document chunks",
  "plan": "Query planning strategy",
  "sub_questions": ["sub question 1", "sub question 2"]
}
```

## 🎯 What's New

**Feature:** Query Planning & Decomposition

- ✅ Analyzes complex questions
- ✅ Decomposes into sub-questions
- ✅ Creates search strategy
- ✅ Improves retrieval relevance

**Benefits:**

- Better answers for complex questions
- Transparent search strategy
- Multiple targeted retrievals
- No changes to existing agents

## 📚 Documentation

| Document                  | Purpose                     |
| ------------------------- | --------------------------- |
| SETUP_GUIDE.md            | Complete setup & deployment |
| FEATURE_DOCUMENTATION.md  | Feature details & examples  |
| IMPLEMENTATION_SUMMARY.md | What was built              |
| README.md                 | Quick start & overview      |
| This file                 | Quick reference             |

## 🔧 Common Tasks

### Upload a PDF

1. Prepare PDF file
2. Use `/index-pdf` endpoint or UI
3. Ask questions about the PDF

### Customize Planning Prompt

Edit `src/app/core/agents/prompts.py`:

```python
PLANNING_SYSTEM_PROMPT = """Your custom prompt here"""
```

### Change Frontend Port

Edit `frontend/vite.config.js`:

```javascript
server: {
  port: 3000; // Change this
}
```

### Deploy to Production

```bash
# Build frontend
cd frontend
npm run build

# Use Docker
docker-compose up -d
```

## 🎓 Key Files Modified

### Backend

- `state.py` - Added plan & sub_questions fields
- `prompts.py` - Added planning prompt
- `agents.py` - Added planning_node function
- `graph.py` - Added planning in flow
- `models.py` - Added plan to response

### Frontend

- All files in `frontend/src/` are new
- New React application for UI

## ✅ Verification Checklist

- [ ] .env file exists with API keys
- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] Can submit questions
- [ ] Get answers with planning info
- [ ] Planning section is visible
- [ ] Sub-questions are displayed

## 🚀 Deploy

### Local

```bash
# Terminal 1
uvicorn src.app.api:app --reload

# Terminal 2
cd frontend && npm run dev
```

### Docker

```bash
docker-compose up
```

### Production

See SETUP_GUIDE.md "Deployment" section

## 💡 Tips

1. Use complex questions to see planning in action
2. Check backend logs for debugging
3. Use browser DevTools to inspect API responses
4. Test with different document types
5. Customize planning prompt for your domain

## 📞 Need Help?

1. Check SETUP_GUIDE.md troubleshooting section
2. Review FEATURE_DOCUMENTATION.md for details
3. Run test_api.py to validate setup
4. Check logs: `uvicorn logs` or browser console

## 🎉 You're All Set!

The system is ready to use. Start with a simple question, then try complex ones to see the query planning in action.

---

**Quick Links:**

- Full Setup: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Feature Details: [FEATURE_DOCUMENTATION.md](FEATURE_DOCUMENTATION.md)
- Build Summary: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

**Status:** ✅ Ready to Deploy
