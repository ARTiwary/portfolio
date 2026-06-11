import React, { useState, useRef, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function detectLanguage(text) {
  const t = text.toLowerCase().trim();
  const latinOnly = /^[a-z0-9\s.,!?'"()\-:;]+$/i.test(t);
  if (latinOnly) {
    if (/\b(yaar|bhai|kya|matlab|abhi|acha|thik|nahi|haan|kal|sab)\b/.test(t)) return 'Hinglish';
    if (/\b(aap|mujhe|batao|hain|hai|kar|raha|karo|mere|mera|hoon|kaun|apna)\b/.test(t)) return 'Hindi';
    if (/\b(tohar|hamaar|kaisan|btiyawa|naikhe|kaise bani|kawa|karela|raura)\b/.test(t)) return 'Bhojpuri';
    if (/\b(haw|ba)\b/.test(t) && /\b(bhaiya|tohar|hamaar|kahe|tani)\b/.test(t)) return 'Bhojpuri';
    if (/\b(ich|du|haben|sein|danke|bitte|wie|was|kannst)\b/.test(t)) return 'German';
    if (/\b(je|tu|vous|bonjour|merci|quelles|comment)\b/.test(t)) return 'French';
    if (/\b(yo|hola|gracias|cuáles|cómo|tengo)\b/.test(t)) return 'Spanish';
    if (/\b(sono|ciao|grazie|miei|quale)\b/.test(t)) return 'Italian';
    return 'English';
  }
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'Telugu';
  if (/[\u0600-\u06FF]/.test(text)) return 'Arabic';
  if (/[\u3040-\u30FF\u4E00-\u9FAF]/.test(text)) return 'Japanese';
  if (/[\uAC00-\uD7AF]/.test(text)) return 'Korean';
  if (/[\u0400-\u04FF]/.test(text)) return 'Russian';
  if (/[\u0980-\u09FF]/.test(text)) return 'Bengali';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'Tamil';
  return 'English';
}

function BotText({ text }) {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#c4b5fd;font-weight:700">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:#e2d9ff">$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(139,92,246,0.15);padding:1px 6px;border-radius:4px;font-size:11px;color:#a78bfa;font-family:monospace">$1</code>')
    .replace(/\[(.+?)\]\((https?:\/\/.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer" style="color:#818cf8;text-decoration:underline;text-underline-offset:2px">$1</a>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noreferrer" style="color:#818cf8;text-decoration:underline;text-underline-offset:2px">$1</a>')
    .replace(/\n/g, '<br/>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function TypewriterText({ text, onDone }) {
  const clean = text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1');
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(clean.slice(0, i));
      if (i >= clean.length) { clearInterval(id); onDone?.(); }
    }, 13);
    return () => clearInterval(id);
  }, [text]);
  return <>{displayed}<span style={{ opacity: 0.6, animation: 'orbitBlink 1s infinite' }}>▌</span></>;
}

const QUICK_QUESTIONS = [
  { label: '🚀 Projects', text: 'What projects have you built?' },
  { label: '⚡ Tech Stack', text: 'What is your tech stack?' },
  { label: '🤝 Hire Me', text: 'Are you available for work?' },
  { label: '🎓 Background', text: 'Tell me about your background' },
];

export default function AIAgent() {
  const [phase, setPhase] = useState('icon');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (phase === 'chat') setTimeout(() => inputRef.current?.focus(), 300);
  }, [phase]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const lang = detectLanguage(text);
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          detectedLanguage: lang,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.reply || 'Signal lost. Try again.',
        typed: false,
      }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Connection failed. Try again.', typed: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuick = (text) => {
    if (phase !== 'chat') setPhase('chat');
    setTimeout(() => sendMessage(text), 100);
  };

  const BotAvatar = () => (
    <div style={{
      width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, marginBottom: '2px',
      background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes orbitBlink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes orbitPulse{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.5)}70%{box-shadow:0 0 0 14px rgba(124,58,237,0)}}
        @keyframes orbitSlideUp{from{opacity:0;transform:translateY(16px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes orbitSlideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes orbitRing{0%{transform:scale(1);opacity:0.5}100%{transform:scale(2.4);opacity:0}}
        @keyframes orbitMsg{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes orbitLetterPop{
          0%,100%{transform:translateY(0) scale(1);opacity:0.3;color:#7c3aed;text-shadow:none;}
          50%{transform:translateY(-9px) scale(1.35);opacity:1;color:#c4b5fd;text-shadow:0 0 18px rgba(196,181,253,0.95),0 0 30px rgba(124,58,237,0.6);}
        }
        .orbit-scroll::-webkit-scrollbar{width:3px}
        .orbit-scroll::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.3);border-radius:4px}
        .orbit-input::placeholder{color:rgba(167,139,250,0.35);font-size:13px}
        .orbit-input:focus{outline:none}
        .orbit-msg{animation:orbitMsg 0.22s ease forwards}
        .orbit-quick:hover{background:rgba(139,92,246,0.22)!important;border-color:rgba(139,92,246,0.55)!important;transform:translateY(-1px);color:#e2d9ff!important}
      `}</style>

      <div style={{ position:'fixed', bottom:'28px', right:'28px', zIndex:9999, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'12px' }}>

        {/* ── ICON ── */}
        {phase === 'icon' && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'10px' }}>
            <div style={{
              position:'relative', animation:'orbitSlideIn 0.35s ease forwards',
              background:'rgba(10,8,25,0.92)', backdropFilter:'blur(16px)',
              border:'1px solid rgba(139,92,246,0.3)', borderRadius:'12px',
              padding:'10px 16px', color:'#c4b5fd', fontSize:'13px',
              fontWeight:'500', letterSpacing:'0.3px', cursor:'pointer',
              boxShadow:'0 8px 32px rgba(0,0,0,0.4)', whiteSpace:'nowrap',
            }} onClick={() => setPhase('bubble')}>
              💬 Ask me about Ayush
              <div style={{
                position:'absolute', right:'18px', bottom:'-6px', width:'11px', height:'11px',
                background:'rgba(10,8,25,0.92)', border:'1px solid rgba(139,92,246,0.3)',
                transform:'rotate(45deg)', borderTop:'none', borderLeft:'none',
              }}/>
            </div>
            <button onClick={() => setPhase('bubble')} style={{
              width:'58px', height:'58px', borderRadius:'50%', border:'none',
              background:'linear-gradient(135deg,#7c3aed 0%,#2563eb 100%)',
              cursor:'pointer', position:'relative',
              animation:'orbitPulse 2.5s ease-in-out infinite',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 4px 20px rgba(124,58,237,0.5)',
            }}>
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid rgba(139,92,246,0.5)', animation:'orbitRing 2s ease-out infinite' }}/>
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid rgba(139,92,246,0.3)', animation:'orbitRing 2s ease-out 0.7s infinite' }}/>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <div style={{
                position:'absolute', top:'3px', right:'3px', width:'12px', height:'12px',
                borderRadius:'50%', background:'#22d3ee', border:'2px solid #050505',
                animation:'orbitBlink 2s infinite',
              }}/>
            </button>
          </div>
        )}

        {/* ── BUBBLE ── */}
        {phase === 'bubble' && (
          <div style={{
            animation:'orbitSlideUp 0.25s ease forwards',
            background:'rgba(6,5,18,0.95)', backdropFilter:'blur(20px)',
            border:'1px solid rgba(139,92,246,0.25)', borderRadius:'20px',
            padding:'20px', width:'300px',
            boxShadow:'0 20px 60px rgba(0,0,0,0.6),0 0 40px rgba(139,92,246,0.1)',
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{
                  width:'36px', height:'36px', borderRadius:'50%',
                  background:'linear-gradient(135deg,#7c3aed,#2563eb)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 0 14px rgba(124,58,237,0.5)', flexShrink:0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                <div>
                  <div style={{ color:'#e2d9ff', fontSize:'14px', fontWeight:'700' }}>Ayush Orbit</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                    <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22d3ee', display:'inline-block', boxShadow:'0 0 6px #22d3ee' }}/>
                    <span style={{ color:'#22d3ee', fontSize:'10px', letterSpacing:'1px', textTransform:'uppercase', fontWeight:'600' }}>Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setPhase('icon')} style={{
                background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                color:'rgba(255,255,255,0.4)', width:'26px', height:'26px', borderRadius:'50%',
                cursor:'pointer', fontSize:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit',
              }}>✕</button>
            </div>
            <p style={{ color:'#9ca3af', fontSize:'13px', lineHeight:'1.6', marginBottom:'14px' }}>
              Hi! I'm Ayush's AI agent. Ask me anything or pick a topic 👇
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'7px', marginBottom:'14px' }}>
              {QUICK_QUESTIONS.map(q => (
                <button key={q.text} className="orbit-quick" onClick={() => handleQuick(q.text)} style={{
                  background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.22)',
                  borderRadius:'10px', padding:'10px 14px', color:'#c4b5fd',
                  fontSize:'13px', fontWeight:'500', cursor:'pointer', textAlign:'left',
                  transition:'all 0.18s', fontFamily:'inherit',
                }}>{q.label}</button>
              ))}
            </div>
            <button onClick={() => setPhase('chat')} style={{
              width:'100%', padding:'11px', borderRadius:'50px',
              background:'linear-gradient(135deg,#7c3aed,#2563eb)',
              border:'none', color:'white', fontSize:'13px', fontWeight:'600',
              cursor:'pointer', letterSpacing:'0.5px', fontFamily:'inherit', transition:'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity='1'}
            >Open Full Chat →</button>
          </div>
        )}

        {/* ── CHAT ── */}
        {phase === 'chat' && (
          <div style={{
            width:'370px', height:'530px', display:'flex', flexDirection:'column',
            background:'rgba(5,4,16,0.96)', backdropFilter:'blur(24px)',
            border:'1px solid rgba(139,92,246,0.2)', borderRadius:'20px',
            overflow:'hidden', animation:'orbitSlideUp 0.22s ease forwards',
            boxShadow:'0 0 0 1px rgba(59,130,246,0.07),0 28px 70px rgba(0,0,0,0.75),0 0 50px rgba(139,92,246,0.1)',
          }}>
            {/* Header */}
            <div style={{
              padding:'13px 16px', borderBottom:'1px solid rgba(139,92,246,0.14)',
              background:'rgba(139,92,246,0.04)', display:'flex', alignItems:'center',
              justifyContent:'space-between', flexShrink:0,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{
                  width:'36px', height:'36px', borderRadius:'50%',
                  background:'linear-gradient(135deg,#7c3aed,#2563eb)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 0 14px rgba(124,58,237,0.4)', flexShrink:0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                <div>
                  <div style={{ color:'#e2d9ff', fontSize:'13px', fontWeight:'700' }}>Ayush Orbit</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                    <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22d3ee', display:'inline-block', boxShadow:'0 0 6px #22d3ee' }}/>
                    <span style={{ color:'#22d3ee', fontSize:'10px', letterSpacing:'1px', fontWeight:'600' }}>ONLINE • AI AGENT</span>
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', gap:'6px' }}>
                <button onClick={() => setPhase('bubble')} title="Minimise" style={{
                  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                  color:'rgba(255,255,255,0.4)', width:'28px', height:'28px', borderRadius:'50%',
                  cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'all 0.2s', fontFamily:'inherit',
                }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.color='white';}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='rgba(255,255,255,0.4)';}}
                >−</button>
                <button onClick={() => { setPhase('icon'); setMessages([]); }} style={{
                  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                  color:'rgba(255,255,255,0.4)', width:'28px', height:'28px', borderRadius:'50%',
                  cursor:'pointer', fontSize:'12px', display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'all 0.2s', fontFamily:'inherit',
                }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,68,68,0.15)';e.currentTarget.style.color='#f87171';e.currentTarget.style.borderColor='rgba(239,68,68,0.4)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='rgba(255,255,255,0.4)';e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';}}
                >✕</button>
              </div>
            </div>

            {/* Messages */}
            <div className="orbit-scroll" style={{
              flex:1, overflowY:'auto', padding:'14px',
              display:'flex', flexDirection:'column', gap:'10px',
            }}>
              {messages.length === 0 && (
                <div style={{ padding:'8px 0' }}>
                  <p style={{ color:'#6b7280', fontSize:'12px', textAlign:'center', marginBottom:'12px', letterSpacing:'0.5px' }}>
                    — Quick Questions —
                  </p>
                  <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
                    {QUICK_QUESTIONS.map(q => (
                      <button key={q.text} className="orbit-quick" onClick={() => sendMessage(q.text)} style={{
                        background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.18)',
                        borderRadius:'10px', padding:'9px 14px', color:'#c4b5fd',
                        fontSize:'12px', fontWeight:'500', cursor:'pointer', textAlign:'left',
                        transition:'all 0.18s', fontFamily:'inherit',
                      }}>{q.label}</button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className="orbit-msg" style={{
                  display:'flex', justifyContent: msg.sender==='user' ? 'flex-end' : 'flex-start',
                  gap:'7px', alignItems:'flex-end',
                }}>
                  {msg.sender === 'bot' && <BotAvatar />}
                  <div style={{
                    maxWidth:'78%', fontSize:'13px', lineHeight:'1.65', padding:'9px 13px',
                    borderRadius: msg.sender==='user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                    ...(msg.sender==='user' ? {
                      background:'linear-gradient(135deg,rgba(124,58,237,0.35),rgba(37,99,235,0.3))',
                      border:'1px solid rgba(139,92,246,0.35)', color:'#e2d9ff',
                    } : {
                      background:'rgba(255,255,255,0.04)',
                      border:'1px solid rgba(255,255,255,0.07)', color:'#d1d5db',
                    })
                  }}>
                    {msg.sender === 'bot' && !msg.typed ? (
                      <TypewriterText text={msg.text} onDone={() =>
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, typed: true } : m))
                      }/>
                    ) : msg.sender === 'bot' ? (
                      <BotText text={msg.text} />
                    ) : msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div style={{
                      width:'22px', height:'22px', borderRadius:'50%', flexShrink:0, marginBottom:'2px',
                      background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:'#a78bfa', fontSize:'9px', fontWeight:'700',
                    }}>U</div>
                  )}
                </div>
              ))}

              {/* ── AYUSH LOADING ANIMATION ── */}
              {loading && (
                <div style={{ display:'flex', alignItems:'flex-end', gap:'7px' }}>
                  <BotAvatar />
                  <div style={{
                    padding:'10px 16px',
                    background:'rgba(255,255,255,0.04)',
                    border:'1px solid rgba(255,255,255,0.07)',
                    borderRadius:'14px 14px 14px 3px',
                    display:'flex', gap:'4px', alignItems:'flex-end', height:'38px',
                  }}>
                    {['A','Y','U','S','H','.','.', '.'].map((letter, j) => (
                      <span key={j} style={{
                        color:'#7c3aed', fontSize:'14px', fontWeight:'800',
                        lineHeight:1, display:'inline-block',
                        animation:`orbitLetterPop 1.5s ${j * 0.15}s ease-in-out infinite`,
                      }}>{letter}</span>
                    ))}
                  </div>
                </div>
              )}

              <div ref={chatEndRef}/>
            </div>

            {/* Input */}
            <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(139,92,246,0.12)', background:'rgba(139,92,246,0.03)', flexShrink:0 }}>
              <form onSubmit={handleSubmit} style={{
                display:'flex', gap:'8px', alignItems:'center',
                background:'rgba(255,255,255,0.04)', border:'1px solid rgba(139,92,246,0.2)',
                borderRadius:'50px', padding:'7px 7px 7px 16px',
              }}>
                <input
                  ref={inputRef}
                  className="orbit-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  style={{
                    flex:1, background:'transparent', border:'none',
                    color:'#e2d9ff', fontSize:'13px', fontFamily:'inherit',
                  }}
                />
                <button type="submit" disabled={loading} style={{
                  width:'32px', height:'32px', borderRadius:'50%', border:'none', flexShrink:0,
                  background: input.trim() && !loading ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(139,92,246,0.2)',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'all 0.2s',
                  boxShadow: input.trim() && !loading ? '0 0 12px rgba(124,58,237,0.4)' : 'none',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
              <p style={{ textAlign:'center', marginTop:'7px', color:'rgba(139,92,246,0.35)', fontSize:'10px', letterSpacing:'0.8px' }}>
                AYUSH ORBIT • 15 LANGUAGES
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}