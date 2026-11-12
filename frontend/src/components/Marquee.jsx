const items = ['PyTorch', 'FastAPI', 'React', 'LangChain', 'ChromaDB', 'Next.js', 'OpenCV', 'PostgreSQL', 'Groq', 'Docker', 'TensorFlow', 'Node.js'];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-b border-line py-5" aria-hidden="true">
      <div className="marquee">
        {row.map((t, i) => (
          <span key={i} className="flex items-center font-display text-3xl text-ink/80">
            <span className="px-8">{t}</span><span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
