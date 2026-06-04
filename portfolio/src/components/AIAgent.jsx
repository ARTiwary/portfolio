import React, { useState, useRef, useEffect } from 'react';

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi! I'm Ayush's digital twin. Ask me anything about his AI/ML models, Full-Stack projects, or tech stack!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          history: messages.slice(1)
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'bot', text: "Something went wrong. Let's try again!" }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: "Can't connect to my brain right now. Try again later!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans text-white">
      
      {/* 🤖 Custom Floating Pill Button with Animated AI Agent Figure */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-5 py-3 rounded-full border border-white/20 bg-slate-900 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-105 hover:bg-slate-800 hover:border-cyan-500/50 active:scale-95 group"
        >
          {/* AI Agent Figure Container */}
          <div className="relative w-7 h-7 flex items-center justify-center rounded-lg bg-black/40 border border-white/10 overflow-hidden group-hover:border-cyan-500/30 transition-colors">
            
            {/* 💾 Animated Horizontal Core Scanner Matrix Line */}
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-0 animate-[bounce_2s_infinite] opacity-60 pointer-events-none" />

            {/* 🎭 Robo-Mask Structure Shape */}
            <div className="w-4 h-4 rounded-md border-2 border-slate-400 flex items-center justify-center gap-[3px] bg-slate-950 p-[2px] group-hover:border-cyan-400 transition-colors">
              {/* Left Eye (Blinking Animation) */}
              <div className="w-1 h-1.5 rounded-sm bg-cyan-400 animate-[pulse_1.5s_infinite]" />
              {/* Right Eye (Blinking Animation) */}
              <div className="w-1 h-1.5 rounded-sm bg-cyan-400 animate-[pulse_1.5s_infinite]" />
            </div>

            {/* Micro Audio Waveform Dots on Bottom of Figure */}
            <div className="absolute bottom-1 flex items-end gap-[2px] h-[4px]">
              <div className="w-[1.5px] bg-cyan-400/60 animate-[pulse_0.8s_infinite]" style={{ height: '60%' }} />
              <div className="w-[1.5px] bg-cyan-400 animate-[pulse_0.5s_infinite]" style={{ height: '100%' }} />
              <div className="w-[1.5px] bg-cyan-400/60 animate-[pulse_0.7s_infinite]" style={{ height: '40%' }} />
            </div>
          </div>

          {/* Text Identifier Label */}
          <span className="text-sm font-semibold tracking-wide text-gray-200 group-hover:text-cyan-400 transition-colors">
            Ayush Orbit
          </span>
        </button>
      )}

      {/* 🔮 Ultra-Transparent Glassmorphic Chat Window */}
      {isOpen && (
        <div className="flex h-[480px] w-[360px] flex-col rounded-2xl border border-white/10 bg-slate-950/75 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-3">
              {/* Miniature Operating Avatar on Header */}
              <div className="relative w-6 h-6 flex items-center justify-center rounded-md bg-black/40 border border-cyan-500/20 overflow-hidden">
                <div className="absolute inset-x-0 h-[1.5px] bg-cyan-400 top-0 animate-[bounce_1.5s_infinite] opacity-40" />
                <div className="w-3 h-3 rounded-sm border border-cyan-400 flex items-center justify-center gap-[2px] bg-slate-950">
                  <div className="w-[1.5px] h-1 bg-cyan-400" />
                  <div className="w-[1.5px] h-1 bg-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm tracking-wide text-white">Ayush Orbit</h3>
                <span className="text-[10px] text-cyan-400 tracking-wider uppercase font-bold">Ask Anything</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="h-7 w-7 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs"
            >
              ✕
            </button>
          </div>

          {/* Messages Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 bg-black/20">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs font-normal leading-relaxed shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none border border-cyan-500 shadow-cyan-950/50'
                      : 'bg-slate-900/90 text-gray-100 border border-white/10 rounded-bl-none shadow-black/40'
                  }`}
                  style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-900/90 border border-white/10 rounded-xl rounded-bl-none px-3.5 py-2.5 text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-slate-950 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me a question..."
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:bg-white/[0.08] transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 disabled:opacity-40 text-white px-4 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md"
            >
              Send
            </button>
          </form>

        </div>
      )}
    </div>
  );
}