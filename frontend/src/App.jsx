import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, FileText, Bot, User, CheckCircle2, AlertCircle, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: "Hello! I'm your Multi-Agent RAG assistant. Upload a PDF paper to get started, or ask me questions if documents are already indexed." }
    ]);
    const [input, setInput] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isAsking, setIsAsking] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isAsking) return;

        const userMessage = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsAsking(true);

        const apiBaseUrl = import.meta.env.VITE_API_URL || '';
        try {
            const response = await fetch(`${apiBaseUrl}/qa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: input })
            });

            if (!response.ok) throw new Error('Failed to get answer');

            const data = await response.json();

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: data.answer,
                context: data.context,
                plan: data.plan,
                sub_questions: data.sub_questions
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: "Sorry, I encountered an error while processing your request.",
                isError: true
            }]);
        } finally {
            setIsAsking(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadStatus('uploading');

        const formData = new FormData();
        formData.append('file', file);

        const apiBaseUrl = import.meta.env.VITE_API_URL || '';
        try {
            const response = await fetch(`${apiBaseUrl}/index-pdf`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setUploadStatus('success');
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'bot',
                text: `Successfully indexed: ${file.name}. ${data.chunks_indexed} chunks added to the vector store.`
            }]);

            setTimeout(() => setUploadStatus(null), 3000);
        } catch (error) {
            setUploadStatus('error');
            setTimeout(() => setUploadStatus(null), 3000);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="app-container">
            {/* Sidebar / Document Upload */}
            <aside className="sidebar">
                <div className="logo">
                    <Search className="logo-icon" />
                    <span>Strategic RAG</span>
                </div>

                <div className="upload-section">
                    <h3>Knowledge Base</h3>
                    <p>Upload PDFs to index them into Pinecone.</p>

                    <label className={`upload-card ${uploadStatus}`}>
                        <input type="file" onChange={handleFileUpload} accept=".pdf" disabled={isUploading} />
                        {isUploading ? (
                            <Loader2 className="animate-spin icon" />
                        ) : uploadStatus === 'success' ? (
                            <CheckCircle2 className="icon success" />
                        ) : uploadStatus === 'error' ? (
                            <AlertCircle className="icon error" />
                        ) : (
                            <Upload className="icon" />
                        )}
                        <span>{isUploading ? 'Indexing...' : 'Upload PDF'}</span>
                    </label>
                </div>

                <div className="stats">
                    <div className="stat-item">
                        <Search className="stat-icon" />
                        <div>
                            <span>Agentic Pipeline</span>
                            <small>Planning → Retrieval → Summary → Verifier</small>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="chat-main">
                <header className="chat-header">
                    <h2>Query Planning & Decomposition</h2>
                    <div className="status-badge">Strategic Multi-Agent Pipeline</div>
                </header>

                <div className="messages-container">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`message-wrapper ${msg.type}`}
                            >
                                <div className="avatar">
                                    {msg.type === 'bot' ? <Bot size={18} /> : <User size={18} />}
                                </div>
                                <div className="message-content">
                                    <div className="bubble">
                                        {msg.plan && (
                                            <div className="plan-section">
                                                <div className="plan-badge">Search Plan</div>
                                                <p className="plan-text">{msg.plan}</p>
                                                {msg.sub_questions && (
                                                    <div className="sub-questions-list">
                                                        {msg.sub_questions.map((sq, i) => (
                                                            <div key={i} className="sub-q-item">
                                                                <Search size={10} /> {sq}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {msg.text}
                                    </div>
                                    {msg.context && (
                                        <details className="context-expander">
                                            <summary><FileText size={12} /> View Retrieved Context</summary>
                                            <pre className="context-text">{msg.context}</pre>
                                        </details>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isAsking && (
                        <div className="message-wrapper bot">
                            <div className="avatar"><Bot size={18} /></div>
                            <div className="bubble loading">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <footer className="chat-input-area">
                    <form onSubmit={handleSendMessage} className="input-form">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question about the documents..."
                            disabled={isAsking}
                        />
                        <button type="submit" disabled={isAsking || !input.trim()}>
                            {isAsking ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </form>
                </footer>
            </main>
        </div>
    );
}

export default App;
