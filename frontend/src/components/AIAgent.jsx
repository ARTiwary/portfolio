import { useEffect, useRef, useState } from 'react';
import Ayu from './Ayu';
import { pointer } from '../pointer';

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

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const unwrapLinks = (t) => t.replace(/<(?=(?:https?:\/\/))[^\s>]+>/g, (m) => m.slice(1, -1));

// Bot replies arrive as light markdown. Escape first, then format, so model output can never inject markup.
function BotText({ text }) {
  const html = esc(unwrapLinks(text))
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((https?:\/\/.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/(^|[\s(])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noreferrer">$2</a>')
    .replace(/\n/g, '<br/>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function TypewriterText({ text, onDone, onTick }) {
  const clean = unwrapLinks(text).replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/`(.+?)`/g, '$1').replace(/\[(.+?)\]\(.+?\)/g, '$1');
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0;
    const step = Math.max(1, Math.ceil(clean.length / 380));   // long answers don't take forever
    const id = setInterval(() => {
      i += step; setShown(clean.slice(0, i));
      if (i % 24 < step) onTick?.();
      if (i >= clean.length) { clearInterval(id); onDone?.(); }
    }, 14);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  return <>{shown}<span className="twin-caret" /></>;
}

const QUICK = [
  { q: 'What projects have you built?', icon: 'spark' },
  { q: 'What is your tech stack?', icon: 'layers' },
  { q: 'Are you available for work?', icon: 'bag' },
  { q: 'Tell me about your background', icon: 'cap' },
];
const GREETING = "Hi! I'm Ayu, Ayush's AI twin. Ask me anything about his work.";
const seen = () => { try { return localStorage.getItem('ayu-seen') === '1'; } catch { return false; } };
const markSeen = () => { try { localStorage.setItem('ayu-seen', '1'); } catch { /* private mode */ } };
const HINTS = ["Hi, I'm Ayu", 'Ask me about Ayush', 'Is he open to work?', 'Try Hindi, Tamil or German'];

const ICON = {
  spark: <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 13 9 5 9-5" /></>,
  bag: <><rect x="3" y="7" width="18" height="13" rx="3" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 13h18" /></>,
  cap: <><path d="m2 9 10-5 10 5-10 5L2 9z" /><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" /></>,
};
const Icon = ({ n }) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON[n]}</svg>);

export default function AIAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState(0);
  const [asleep, setAsleep] = useState(false);
  const endRef = useRef(null), inputRef = useRef(null);
  // first visit: wait -> drop & bounce -> settle -> type a greeting -> normal hints
  const [intro, setIntro] = useState(() => (seen() ? 'done' : 'wait'));
  const [hello, setHello] = useState('');
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    if (intro === 'done') return;
    const timers = [];
    const at = (fn, ms) => timers.push(setTimeout(fn, ms));
    if (intro === 'wait') at(() => setIntro('drop'), 1600);
    if (intro === 'drop') at(() => setIntro('dots'), reduced ? 300 : 2000);
    if (intro === 'dots') at(() => setIntro('type'), 1000);
    if (intro === 'type') {
      let i = 0;
      const id = setInterval(() => {
        i++; setHello(GREETING.slice(0, i));
        if (i >= GREETING.length) { clearInterval(id); at(() => { setIntro('done'); markSeen(); }, 5200); }
      }, 38);
      timers.push(id);
    }
    return () => timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
  }, [intro, reduced]);
  useEffect(() => { if (open && intro !== 'done') { setIntro('done'); markSeen(); } }, [open, intro]);

  const typing = messages.some((m) => m.sender === 'bot' && !m.typed);
  const mood = loading ? 'think' : typing ? 'speak' : 'idle';
  const toEnd = () => endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });

  // closed: rotate hints, and doze off if nobody has touched the page for a while
  useEffect(() => {
    if (open) { setAsleep(false); return; }
    const t0 = performance.now();
    const a = setInterval(() => setHint((h) => (h + 1) % HINTS.length), 4200);
    const b = setInterval(() => setAsleep(performance.now() - Math.max(pointer.t, t0) > 25000), 1500);
    return () => { clearInterval(a); clearInterval(b); };
  }, [open]);
  useEffect(() => { toEnd(); }, [messages, loading]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 280); }, [open]);
  useEffect(() => {
    if (!open) return;
    const k = (e) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [open]);

  const ask = async (text, lang, history) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text, detectedLanguage: lang,
          history: history.slice(0, -1).map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
        }),
      });
      const data = await res.json();
      setMessages((p) => [...p, { sender: 'bot', text: data.reply || 'Hmm, nothing came back. Try asking again.', typed: false }]);
    } catch {
      setMessages((p) => [...p, { sender: 'bot', text: "I can't reach the server right now. Check your connection and try again.", typed: true }]);
    } finally { setLoading(false); }
  };

  const send = (text) => {
    if (!text.trim() || loading) return;
    const history = [...messages, { sender: 'user', text }];   // built outside the state updater so the request fires once
    setMessages(history); setInput(''); setLoading(true);
    ask(text, detectLanguage(text), history);
  };

  const sub = loading ? <>Ayu is thinking<span className="twin-dots" /></> : typing ? 'Typing' : 'Ayush\u2019s AI twin';

  return (
    <>
      {!open && (
        <button className={`twin-launch ${intro === 'wait' ? 'is-hidden' : ''}`} onClick={() => setOpen(true)} aria-label="Chat with Ayu, Ayush's AI twin">
          {intro === 'dots' && <span className="twin-hint twin-greet" key="d"><span className="twin-dots" /></span>}
          {intro === 'type' && <span className="twin-hint twin-greet" key="t">{hello}<span className="twin-caret" /></span>}
          {intro === 'done' && <span className="twin-hint" key={asleep ? 'z' : hint}>{asleep ? 'Psst, tap to wake me' : HINTS[hint]}</span>}
          <span className={`twin-launch-ayu ${intro === 'drop' ? 'is-drop' : ''}`}><Ayu size={88} mood={asleep ? 'sleep' : 'idle'} wave={intro === 'dots'} /></span>
        </button>
      )}

      {open && (
        <section className="twin-panel" role="dialog" aria-label="Chat with Ayu">
          <header className="twin-head">
            <Ayu size={58} mood={mood} className="twin-head-ayu" />
            <div className="twin-title"><h2>Ayu</h2><p>{sub}</p></div>
            {messages.length > 0 && (
              <button className="twin-icon" onClick={() => { setMessages([]); setLoading(false); }} aria-label="Start a new chat" title="New chat">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
              </button>
            )}
            <button className="twin-icon" onClick={() => setOpen(false)} aria-label="Close chat" title="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </header>

          <div className="twin-body" aria-live="polite">
            {messages.length === 0 && (
              <div className="twin-empty">
                <Ayu size={104} wave className="twin-hero-ayu" />
                <p className="twin-lead">Hi, I&rsquo;m Ayu.</p>
                <p className="twin-sub">Ayush&rsquo;s AI twin. Ask me about his projects, his stack, or whether he&rsquo;s free to join your team. Any language works.</p>
                <ul className="twin-chips">
                  {QUICK.map(({ q, icon }) => (<li key={q}><button onClick={() => send(q)}><span className="twin-chip-ico"><Icon n={icon} /></span><span>{q}</span></button></li>))}
                </ul>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`twin-msg ${m.sender === 'user' ? 'you' : 'bot'}`}>
                {m.sender === 'bot' && <Ayu size={32} mini look={false} mood={i === messages.length - 1 && !m.typed ? 'speak' : 'idle'} className="twin-av" />}
                <div className="twin-text">
                  {m.sender === 'user' ? m.text : m.typed ? <BotText text={m.text} /> : (
                    <TypewriterText text={m.text} onTick={toEnd} onDone={() => setMessages((p) => p.map((x, k) => (k === i ? { ...x, typed: true } : x)))} />
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="twin-msg bot">
                <Ayu size={32} mini look={false} mood="think" className="twin-av" />
                <div className="twin-text twin-bounce" aria-label="Ayu is thinking"><i /><i /><i /></div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form className="twin-form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <div className="twin-field">
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Say hi to Ayu" aria-label="Your message" />
              <button type="submit" disabled={!input.trim() || loading} aria-label="Send message">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              </button>
            </div>
            <p className="twin-note">Ayu is an AI. Confirm anything important with Ayush.</p>
          </form>
        </section>
      )}
    </>
  );
}
