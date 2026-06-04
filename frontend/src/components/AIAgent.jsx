import React, { useState, useRef, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function TypewriterText({ text, onDone }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); onDone && onDone(); }
    }, 14);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}<span style={{ opacity: 0.7, animation: 'blink 1s infinite' }}>▌</span></span>;
}

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'ORBIT ONLINE. Ask me anything about Ayush — projects, skills, or opportunities.', typed: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          history: messages.slice(1).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });
      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply, typed: false }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Signal lost. Try again.', typed: true }]);
      }
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Connection failed. Try again.', typed: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 8px rgba(139,92,246,0.6)} 50%{box-shadow:0 0 20px rgba(139,92,246,1),0 0 40px rgba(59,130,246,0.4)} }
        @keyframes dotBounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-5px);opacity:1} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .orbit-msg { animation: fadeSlideUp 0.25s ease forwards; }
        .orbit-input::placeholder { color: rgba(167,139,250,0.4); }
        .orbit-input:focus { outline: none; }
        .orbit-scroll::-webkit-scrollbar { width: 3px; }
        .orbit-scroll::-webkit-scrollbar-track { background: transparent; }
        .orbit-scroll::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 2px; }
      `}</style>

      <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999 }}>

        {/* Floating button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 22px', borderRadius: '50px',
              background: 'rgba(10,8,20,0.85)',
              border: '1px solid rgba(139,92,246,0.6)',
              color: '#e2d9ff', cursor: 'pointer',
              fontSize: '13px', fontWeight: '600',
              letterSpacing: '1.5px', textTransform: 'uppercase',
              backdropFilter: 'blur(16px)',
              animation: 'pulseGlow 3s ease-in-out infinite',
              transition: 'transform 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* Avatar icon */}
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <span>Ayush Orbit</span>
            {/* Live dot */}
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#22d3ee', display: 'inline-block',
              boxShadow: '0 0 8px #22d3ee',
              animation: 'blink 2s infinite',
            }} />
          </button>
        )}

        {/* Chat window */}
        {isOpen && (
          <div style={{
            width: '370px', height: '520px',
            display: 'flex', flexDirection: 'column',
            background: 'rgba(6,5,18,0.92)',
            border: '1px solid rgba(139,92,246,0.35)',
            borderRadius: '16px', overflow: 'hidden',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 0 1px rgba(59,130,246,0.1), 0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(139,92,246,0.15)',
            animation: 'fadeSlideUp 0.2s ease forwards',
          }}>

            {/* Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(139,92,246,0.2)',
              background: 'rgba(139,92,246,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(139,92,246,0.5)',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                <div>
                  <div style={{ color: '#e2d9ff', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>
                    Ayush Orbit
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3ee', display: 'inline-block', boxShadow: '0 0 6px #22d3ee' }} />
                    <span style={{ color: '#22d3ee', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '600' }}>Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)', width: '28px', height: '28px',
                  borderRadius: '50%', cursor: 'pointer', fontSize: '13px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >✕</button>
            </div>

            {/* Messages */}
            <div className="orbit-scroll" style={{
              flex: 1, overflowY: 'auto', padding: '16px 14px',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              {messages.map((msg, i) => (
                <div key={i} className="orbit-msg" style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '8px', alignItems: 'flex-end',
                }}>
                  {/* Bot avatar */}
                  {msg.sender === 'bot' && (
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '2px',
                    }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                    </div>
                  )}

                  <div style={{
                    maxWidth: '78%', fontSize: '13px', lineHeight: '1.65',
                    padding: '10px 14px', borderRadius: msg.sender === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    ...(msg.sender === 'user' ? {
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.25))',
                      border: '1px solid rgba(139,92,246,0.4)',
                      color: '#e2d9ff',
                    } : {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#d1d5db',
                    })
                  }}>
                    {msg.sender === 'bot' && !msg.typed ? (
                      <TypewriterText text={msg.text} onDone={() => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, typed: true } : m));
                      }} />
                    ) : msg.text}
                  </div>

                  {/* User avatar */}
                  {msg.sender === 'user' && (
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', color: '#a78bfa', marginBottom: '2px',
                    }}>U</div>
                  )}
                </div>
              ))}

              {/* Loading dots */}
              {loading && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </div>
                  <div style={{
                    padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px 14px 14px 4px',
                    display: 'flex', gap: '5px', alignItems: 'center',
                  }}>
                    {[0,1,2].map(i => (
                      <span key={i} style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: '#8b5cf6', display: 'inline-block',
                        animation: `dotBounce 1.2s ${i * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(139,92,246,0.15)', flexShrink: 0 }} />

            {/* Input area */}
            <div style={{
              padding: '12px 14px', background: 'rgba(139,92,246,0.04)', flexShrink: 0,
            }}>
              <form onSubmit={handleSendMessage} style={{
                display: 'flex', gap: '8px', alignItems: 'center',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: '50px', padding: '8px 8px 8px 16px',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'}
              >
                <input
                  className="orbit-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  style={{
                    flex: 1, background: 'transparent', border: 'none',
                    color: '#e2d9ff', fontSize: '13px',
                    fontFamily: 'inherit', letterSpacing: '0.2px',
                  }}
                />
                <button type="submit" disabled={loading} style={{
                  width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                  background: loading ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 0 12px rgba(139,92,246,0.5)',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.08)'; }}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <span style={{ color: 'rgba(139,92,246,0.4)', fontSize: '10px', letterSpacing: '1px' }}>
                  POWERED BY AYUSH ORBIT AI
                </span>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}