import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMessageCircle } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { extraAPI } from '../services';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    extraAPI.chatHistory()
      .then(({ data }) => setMessages(data.messages))
      .catch(console.error)
      .finally(() => setInitialLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await extraAPI.chat(input);
      setMessages(data.messages);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'How do I prepare for a technical interview?',
    'Explain REST API best practices',
    'Tips to improve my resume',
    'What is System Design?',
  ];

  if (initialLoading) return <LoadingSpinner text="Loading chat..." />;

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-4">
        <FiMessageCircle className="text-2xl text-primary" />
        <div>
          <h1 className="text-xl font-bold">AI Interview Assistant</h1>
          <p className="text-text-muted text-xs">Ask about interviews, careers, and technical concepts</p>
        </div>
      </div>

      <div className="flex-1 glass-card overflow-y-auto space-y-4 mb-4 p-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-muted text-sm mb-4">Start a conversation or try a suggestion:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setInput(s)} className="px-3 py-2 bg-white/5 rounded-xl text-xs text-text-muted hover:bg-white/10 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === 'user'
                ? 'bg-primary/20 text-text rounded-br-sm'
                : 'bg-white/5 text-text-muted rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-3 rounded-2xl text-sm text-text-muted animate-pulse">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-field flex-1"
          placeholder="Ask me anything about interviews..."
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-4">
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
