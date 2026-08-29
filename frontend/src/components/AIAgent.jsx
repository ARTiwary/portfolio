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
  const sanitizedText = text.replace(/<(?=(?:https?:\/\/))[^\s>]+>/g, (match) => match.slice(1, -1));

  const html = sanitizedText
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#c4b5fd;font-weight:700">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:#e2d9ff">$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(139,92,246,0.15);padding:1px 6px;border-radius:4px;font-size:11px;color:#a78bfa;font-family:monospace">$1</code>')
    .replace(/\[(.+?)\]\((https?:\/\/.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer" style="color:#818cf8;text-decoration:underline;text-underline-offset:2px">$1</a>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noreferrer" style="color:#818cf8;text-decoration:underline;text-underline-offset:2px">$1</a>')
    .replace(/\n/g, '<br/>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function TypewriterText({ text, onDone }) {
  const sanitizedText = text.replace(/<(?=(?:https?:\/\/))[^\s>]+>/g, (match) => match.slice(1, -1));
  const clean = sanitizedText
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

// Animated SVG Avatar
function AvatarOrb({ size = 48, pulse = false, speaking = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="avatarGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="60%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </radialGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
      </defs>
      {pulse && <circle cx="24" cy="24" r="23" fill="url(#glowGrad)" style={{ animation: 'orbitPulseRing 2s ease-in-out infinite' }} />}
      <circle cx="24" cy="24" r="20" fill="url(#avatarGrad)" />
      <circle cx="18" cy="21" r="3.5" fill="white" opacity="0.9" />
      <circle cx="30" cy="21" r="3.5" fill="white" opacity="0.9" />
      <circle cx="19.5" cy="20" r="1.2" fill="#1d4ed8" />
      <circle cx="31.5" cy="20" r="1.2" fill="#1d4ed8" />
      {speaking ? (
        <path d="M17 29 Q24 34 31 29" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" style={{ animation: 'orbitMouth 0.6s ease-in-out infinite alternate' }} />
      ) : (
        <path d="M17 29 Q24 32 31 29" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
      <circle cx="24" cy="9" r="2" fill="white" opacity="0.3" />
      <ellipse cx="12" cy="18" rx="1.5" ry="2" fill="white" opacity="0.2" />
      <ellipse cx="36" cy="18" rx="1.5" ry="2" fill="white" opacity="0.2" />
    </svg>
  );
}

const QUICK_QUESTIONS = [
  { label: '🚀 Projects', text: 'What projects have you built?' },
  { label: '⚡ Tech Stack', text: 'What is your tech stack?' },
  { label: '🤝 Hire Me', text: 'Are you available for work?' },
  { label: '🎓 Background', text: 'Tell me about your background' },
];

const INTRO_MESSAGES = [
  "Hey there! 👋 I'm Ayush's AI twin.",
  "Ask me about his projects, skills,",
  "or if he's available to hire!",
];

export default function AIAgent() {
  const [phase, setPhase] = useState('icon');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [introIndex, setIntroIndex] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Cycle intro messages on icon phase
  useEffect(() => {
    if (phase !== 'icon') return;
    const id = setInterval(() => {
      setIntroVisible(false);
      setTimeout(() => {
        setIntroIndex(i => (i + 1) % INTRO_MESSAGES.length);
        setIntroVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (phase === 'chat') setTimeout(() => inputRef.current?.focus(), 300);
  }, [phase]);

  const executeFetch = async (text, lang, currentHistory) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          detectedLanguage: lang,
          history: currentHistory.slice(0, -1).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });
      const data = await response.json();
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), 3000);
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

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const lang = detectLanguage(text);
    const userMsg = { sender: 'user', text };
    
    setMessages(prev => {
      const updatedMessages = [...prev, userMsg];
      executeFetch(text, lang, updatedMessages);
      return updatedMessages;
    });

    setInput('');
    setLoading(true);
    setSpeaking(false);
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
    <div style={{ flexShrink: 0, marginBottom: '2px' }}>
      <AvatarOrb size={24} speaking={speaking} />
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes orbitBlink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes orbitPulseRing{0%,100%{r:23;opacity:0.5}50%{r:26;opacity:0.2}}
        @keyframes orbitMouth{0%{d:path("M17 29 Q24 34 31 29")}100%{d:path("M17 30 Q24 33 31 30")}}
        @keyframes orbitRipple{0%{transform:scale(1);opacity:0.6}100%{transform:scale(2.2);opacity:0}}
        @keyframes orbitSlideUp{from{opacity:0;transform:translateY(14px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes orbitSlideIn{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
        @keyframes orbitMsg{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes orbitLetterPop{0%,100%{transform:translateY(0) scale(1);opacity:0.3;color:#7c3aed}50%{transform:translateY(-9px) scale(1.35);opacity:1;color:#c4b5fd;text-shadow:0 0 18px rgba(196,181,253,0.95)}}
        @keyframes orbitFadeToggle{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes orbitFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes orbitAurora{0%,100%{opacity:0.15;transform:scale(1)}50%{opacity:0.3;transform:scale(1.08)}}
        .orbit-scroll::-webkit-scrollbar{width:3px}
        .orbit-scroll::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.3);border-radius:4px}
        .orbit-input::placeholder{color:rgba(167,139,250,0.35);font-size:13px}
        .orbit-input:focus{outline:none}
        .orbit-msg{animation:orbitMsg 0.22s ease forwards}
        .orbit-quick:hover{background:rgba(139,92,246,0.22)!important;border-color:rgba(139,92,246,0.55)!important;transform:translateY(-1px);color:#e2d9ff!important}
        .orbit-intro{animation:orbitFadeToggle 0.4s ease forwards}
      `}</style>

      <div style={{ position:'fixed', bottom:'130px', right:'28px', zIndex:9999, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'12px' }}>

        {/* ── ICON PHASE ── */}
        {phase === 'icon' && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'12px' }}>

            {/* Speech bubble with rotating messages */}
            <div style={{
              animation: 'orbitSlideIn 0.4s ease forwards',
              background: 'rgba(8,6,20,0.93)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139,92,246,0.35)',
              borderRadius: '16px 16px 4px 16px',
              padding: '12px 18px',
              maxWidth: '220px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(139,92,246,0.1)',
              cursor: 'pointer',
            }} onClick={() => setPhase('bubble')}>
              <div key={introIndex} className={introVisible ? 'orbit-intro' : ''} style={{
                opacity: introVisible ? 1 : 0, transition: 'opacity 0.3s',
              }}>
                <p style={{ color:'#e2d9ff', fontSize:'13px', fontWeight:'500', margin:0, lineHeight:'1.5' }}>
                  {INTRO_MESSAGES[introIndex]}
                </p>
              </div>
              {/* Waveform bar */}
              <div style={{ display:'flex', gap:'3px', alignItems:'flex-end', marginTop:'8px', height:'14px' }}>
                {[6,10,14,8,12,6,10,14,8,6].map((h,i) => (
                  <div key={i} style={{
                    width:'3px', borderRadius:'2px',
                    background:`rgba(139,92,246,${0.4 + (i%3)*0.2})`,
                    height:`${h}px`,
                    animation:`orbitLetterPop ${0.8 + i*0.1}s ${i*0.08}s ease-in-out infinite`,
                  }}></div>
                ))}
              </div>
            </div>

            {/* Main avatar button */}
            <div style={{ position:'relative', cursor:'pointer' }} onClick={() => setPhase('bubble')}>
              {/* Aurora glow rings */}
              <div style={{
                position:'absolute', inset:'-8px', borderRadius:'50%',
                background:'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
                animation:'orbitAurora 3s ease-in-out infinite',
                pointerEvents:'none',
              }}></div>
              <div style={{
                position:'absolute', inset:0, borderRadius:'50%',
                border:'2px solid rgba(139,92,246,0.4)',
                animation:'orbitRipple 2.5s ease-out infinite',
              }}></div>
              <div style={{
                position:'absolute', inset:0, borderRadius:'50%',
                border:'2px solid rgba(139,92,246,0.2)',
                animation:'orbitRipple 2.5s ease-out 0.8s infinite',
              }}></div>
              <div style={{
                width:'60px', height:'60px', borderRadius:'50%',
                background:'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(37,99,235,0.2))',
                border:'2px solid rgba(139,92,246,0.5)',
                display:'flex', alignItems:'center', justifyContent:'center',
                backdropFilter:'blur(8px)',
                animation:'orbitFloat 4s ease-in-out infinite',
                boxShadow:'0 0 20px rgba(124,58,237,0.4), inset 0 0 20px rgba(139,92,246,0.1)',
              }}>
                <AvatarOrb size={44} pulse />
              </div>
              {/* Online dot */}
              <div style={{
                position:'absolute', top:'2px', right:'2px',
                width:'13px', height:'13px', borderRadius:'50%',
                background:'#22d3ee', border:'2px solid #050505',
                boxShadow:'0 0 8px #22d3ee',
                animation:'orbitBlink 2.5s infinite',
              }}></div>
            </div>
          </div>
        )}

        {/* ── BUBBLE PHASE ── */}
        {phase === 'bubble' && (
          <div style={{
            animation:'orbitSlideUp 0.25s ease forwards',
            background:'rgba(6,5,18,0.95)', backdropFilter:'blur(20px)',
            border:'1px solid rgba(139,92,246,0.25)', borderRadius:'20px',
            padding:'20px', width:'300px',
            boxShadow:'0 20px 60px rgba(0,0,0,0.6),0 0 40px rgba(139,92,246,0.1)',
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <AvatarOrb size={40} pulse />
                <div>
                  <div style={{ color:'#e2d9ff', fontSize:'14px', fontWeight:'700' }}>Ayush Orbit</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                    <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22d3ee', display:'inline-block', boxShadow:'0 0 6px #22d3ee' }}></span>
                    <span style={{ color:'#22d3ee', fontSize:'10px', letterSpacing:'1px', textTransform:'uppercase', fontWeight:'600' }}>Online • 15 Languages</span>
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
              Hi! I'm Ayush's AI agent — ask me anything about his work, projects, or skills 👇
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

        {/* ── CHAT PHASE ── */}
        {phase === 'chat' && (
          <div style={{
            width:'370px', height:'540px', display:'flex', flexDirection:'column',
            background:'rgba(5,4,16,0.96)', backdropFilter:'blur(24px)',
            border:'1px solid rgba(139,92,246,0.2)', borderRadius:'20px',
            overflow:'hidden', animation:'orbitSlideUp 0.22s ease forwards',
            boxShadow:'0 0 0 1px rgba(59,130,246,0.07),0 28px 70px rgba(0,0,0,0.75),0 0 50px rgba(139,92,246,0.1)',
          }}>
            {/* Header */}
            <div style={{
              padding:'12px 16px', borderBottom:'1px solid rgba(139,92,246,0.14)',
              background:'rgba(139,92,246,0.04)', display:'flex', alignItems:'center',
              justifyContent:'space-between', flexShrink:0,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ animation: speaking ? 'orbitFloat 0.5s ease-in-out infinite' : 'none' }}>
                  <AvatarOrb size={36} speaking={speaking} />
                </div>
                <div>
                  <div style={{ color:'#e2d9ff', fontSize:'13px', fontWeight:'700' }}>Ayush Orbit</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                    <span style={{ width:'6px', height:'6px', borderRadius:'50%', background: loading ? '#f59e0b' : '#22d3ee', display:'inline-block', boxShadow:`0 0 6px ${loading ? '#f59e0b' : '#22d3ee'}`, transition:'all 0.3s' }}></span>
                    <span style={{ color: loading ? '#f59e0b' : '#22d3ee', fontSize:'10px', letterSpacing:'1px', fontWeight:'600', transition:'all 0.3s' }}>
                      {loading ? 'THINKING...' : 'ONLINE • AI AGENT'}
                    </span>
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
                  {/* Avatar greeting */}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', marginBottom:'20px', padding:'16px 0' }}>
                    <div style={{ animation:'orbitFloat 3s ease-in-out infinite' }}>
                      <AvatarOrb size={52} pulse />
                    </div>
                    <p style={{ color:'#c4b5fd', fontSize:'13px', fontWeight:'500', textAlign:'center', margin:0 }}>
                      Hey! I'm Ayush's digital twin 👋
                    </p>
                    <p style={{ color:'#6b7280', fontSize:'12px', textAlign:'center', margin:0, lineHeight:'1.5' }}>
                      Ask me anything — I speak 15 languages!
                    </p>
                  </div>
                  <p style={{ color:'#4b5563', fontSize:'11px', textAlign:'center', marginBottom:'10px', letterSpacing:'1px', textTransform:'uppercase' }}>
                    Quick start
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

              {/* AYUSH letter loading animation */}
              {loading && (
                <div style={{ display:'flex', alignItems:'flex-end', gap:'7px' }}>
                  <BotAvatar />
                  <div style={{
                    padding:'10px 16px', background:'rgba(255,255,255,0.04)',
                    border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px 14px 14px 3px',
                    display:'flex', gap:'4px', alignItems:'flex-end', height:'38px',
                  }}>
                    {['A','Y','U','S','H','.','.','.'].map((letter, j) => (
                      <span key={j} style={{
                        color:'#7c3aed', fontSize:'14px', fontWeight:'800',
                        lineHeight:1, display:'inline-block',
                        animation:`orbitLetterPop 1.5s ${j * 0.15}s ease-in-out infinite`,
                      }}>{letter}</span>
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef}></div>
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