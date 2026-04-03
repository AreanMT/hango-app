import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════
// TTS
// ═══════════════════════════════════════════
let cachedVoice = null;
const getZhVoice = () => { if (cachedVoice) return cachedVoice; if (!window.speechSynthesis) return null; const v = window.speechSynthesis.getVoices(); const p = [x => x.lang==="zh-CN"&&x.name.includes("Google"), x => x.lang==="zh-CN"&&!x.localService, x => x.lang==="zh-CN", x => x.lang.startsWith("zh")]; for (const t of p) { const f = v.find(t); if (f) { cachedVoice=f; return f; } } return null; };
const speakCN = (text) => new Promise(r => { if (!text||!window.speechSynthesis){r();return;} window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text.replace(/[a-zA-Z\u0080-\u024F]/g,"").trim()||text); u.lang="zh-CN"; u.rate=0.82; u.pitch=1.1; const v=getZhVoice(); if(v)u.voice=v; u.onend=r; u.onerror=r; window.speechSynthesis.speak(u); });

// ═══════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════
const F={body:"'Outfit',sans-serif",cn:"'Noto Serif SC',serif",display:"'Sora',sans-serif"};
const C={bg:"#0F0D0C",surface:"rgba(245,240,235,0.03)",border:"rgba(245,240,235,0.07)",red:"#E84545",redDark:"#C62828",text:"#F5F0EB",textMid:"#A09890",textDim:"#6A6259",green:"#4CAF50",amber:"#FFB74D",blue:"#42A5F5",teal:"#00BCD4",tealDark:"#00838F",purple:"#9C27B0"};

// ═══════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════
const Ic={
  home:<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  chat:<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  story:<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  brush:<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>,
  meme:<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  convo:<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  send:<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
  vol:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  arrow:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  share:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  refresh:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  trash:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  ig:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  mail:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  check:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ═══════════════════════════════════════════
// 1. AI STORIES 📖
// ═══════════════════════════════════════════

const STORY_PROMPT = `Genera un cuento corto en chino mandarín para un estudiante hispanohablante con ~9 meses de estudio (HSK1-2).

FORMATO OBLIGATORIO — responde SOLO con este JSON, sin markdown ni texto extra:
{
  "title_cn": "título en chino (máx 6 caracteres)",
  "title_es": "título en español",
  "emoji": "emoji que represente la historia",
  "sentences": [
    {"cn": "oración en chino (máx 15 caracteres)", "pinyin": "pinyin", "es": "traducción"},
    ...
  ],
  "new_words": [
    {"char": "carácter", "pinyin": "pinyin", "meaning": "significado"},
    ...
  ],
  "moral": "moraleja o dato cultural en español (1 oración)"
}

REGLAS:
- 6-8 oraciones, CORTAS (máx 15 caracteres cada una)
- 3-4 palabras nuevas nivel HSK2-3
- Historia interesante: puede ser graciosa, cultural, o sorprendente
- Vocabulario base HSK1-2 con algunas palabras nuevas resaltadas`;

function StoriesSection() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playingIdx, setPlayingIdx] = useState(-1);
  const [theme, setTheme] = useState(null);

  const themes = [
    { emoji: "🍜", label: "Comida china", prompt: "sobre un malentendido gracioso pidiendo comida en China" },
    { emoji: "✈️", label: "Viaje a China", prompt: "sobre un turista latino perdido en Beijing" },
    { emoji: "😂", label: "Malentendido", prompt: "sobre un malentendido cultural gracioso entre un latino y un chino" },
    { emoji: "❤️", label: "Amistad", prompt: "sobre una amistad entre un estudiante latino y un compañero chino" },
    { emoji: "🎉", label: "Festival", prompt: "sobre un festival tradicional chino" },
    { emoji: "🏮", label: "Leyenda china", prompt: "una leyenda tradicional china simplificada" },
    { emoji: "🎲", label: "Sorpréndeme", prompt: "sobre un tema sorprendente y original" },
  ];

  const generateStory = async (t) => {
    setTheme(t);
    setLoading(true);
    setStory(null);
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  max_tokens: 800, system: STORY_PROMPT, messages: [{ role: "user", content: `Genera una historia ${t.prompt}` }] }),
      });
      const d = await r.json();
      const text = d.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setStory(parsed);
    } catch (e) {
      setStory({ error: true });
    }
    setLoading(false);
  };

  const playSentence = async (idx) => {
    if (playingIdx >= 0) return;
    setPlayingIdx(idx);
    await speakCN(story.sentences[idx].cn);
    setPlayingIdx(-1);
  };

  const playAll = async () => {
    if (!story?.sentences) return;
    for (let i = 0; i < story.sentences.length; i++) {
      setPlayingIdx(i);
      await speakCN(story.sentences[i].cn);
    }
    setPlayingIdx(-1);
  };

  if (!theme) return (
    <div style={{ minHeight: "100vh", maxWidth: 520, margin: "0 auto", padding: "24px 16px 100px" }}>
      <h2 style={{ fontFamily: F.display, fontSize: 26, fontWeight: 800, color: C.text, margin: "0 0 4px" }}>Historias <span style={{ color: C.amber }}>故事</span></h2>
      <p style={{ fontFamily: F.body, fontSize: 14, color: C.textDim, margin: "0 0 28px" }}>La IA crea un cuento en chino adaptado a tu nivel. Toca cada oración para escucharla.</p>
      <p style={{ fontFamily: F.body, fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 12px" }}>Elige un tema</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {themes.map((t, i) => (
          <button key={i} onClick={() => generateStory(t)} style={{ padding: "16px", borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14, transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,183,77,0.3)"; e.currentTarget.style.background = "rgba(255,183,77,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}>
            <span style={{ fontSize: 28 }}>{t.emoji}</span>
            <span style={{ fontFamily: F.body, fontSize: 15, fontWeight: 600, color: C.text }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", maxWidth: 520, margin: "0 auto", padding: "24px 16px 100px" }}>
      <button onClick={() => { setTheme(null); setStory(null); }} style={{ fontFamily: F.body, fontSize: 12, color: C.textDim, background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}>← Elegir otro tema</button>

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ fontFamily: F.cn, fontSize: 36, color: C.amber, marginBottom: 12 }}>故事</p>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 12 }}>
            {[0, 1, 2].map(d => <span key={d} style={{ width: 10, height: 10, borderRadius: "50%", background: C.amber, animation: `pulse 1.2s ease-in-out ${d * .2}s infinite` }} />)}
          </div>
          <p style={{ fontFamily: F.body, fontSize: 14, color: C.textDim }}>Escribiendo tu historia {theme.emoji}...</p>
        </div>
      )}

      {story?.error && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p style={{ fontFamily: F.body, fontSize: 14, color: C.red }}>Error generando historia. Intenta de nuevo.</p>
          <button onClick={() => generateStory(theme)} style={{ fontFamily: F.body, fontSize: 14, padding: "10px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.amber},#F57C00)`, color: "white", cursor: "pointer", marginTop: 12 }}>Reintentar</button>
        </div>
      )}

      {story && !story.error && (
        <div style={{ animation: "fadeUp .5s" }}>
          {/* Title */}
          <div style={{ background: "linear-gradient(135deg,rgba(255,183,77,0.12),rgba(255,183,77,0.04))", borderRadius: 18, padding: "20px", border: "1px solid rgba(255,183,77,0.2)", marginBottom: 16, textAlign: "center" }}>
            <span style={{ fontSize: 40 }}>{story.emoji}</span>
            <button onClick={() => speakCN(story.title_cn)} style={{ background: "none", border: "none", cursor: "pointer", display: "block", margin: "8px auto 0" }}>
              <p style={{ fontFamily: F.cn, fontSize: 28, color: C.text, margin: "0 0 2px" }}>{story.title_cn}</p>
            </button>
            <p style={{ fontFamily: F.body, fontSize: 15, color: C.amber, margin: 0 }}>{story.title_es}</p>
          </div>

          {/* Play all */}
          <button onClick={playAll} disabled={playingIdx >= 0} style={{ width: "100%", padding: "12px", borderRadius: 12, border: `1px solid rgba(255,183,77,0.2)`, background: "rgba(255,183,77,0.06)", cursor: "pointer", fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.amber, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {Ic.vol} Escuchar historia completa
          </button>

          {/* Sentences */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {story.sentences?.map((s, i) => (
              <div key={i} onClick={() => playSentence(i)} style={{
                padding: "14px 16px", borderRadius: 12, cursor: "pointer", transition: "all .2s",
                background: playingIdx === i ? "rgba(255,183,77,0.1)" : C.surface,
                border: `1px solid ${playingIdx === i ? "rgba(255,183,77,0.3)" : C.border}`,
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontFamily: F.body, fontSize: 11, color: C.textDim, fontWeight: 700, marginTop: 4, minWidth: 18 }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: F.cn, fontSize: 20, color: C.text, margin: "0 0 3px", lineHeight: 1.4 }}>{s.cn}</p>
                    <p style={{ fontFamily: F.body, fontSize: 12, color: C.teal, margin: "0 0 2px" }}>{s.pinyin}</p>
                    <p style={{ fontFamily: F.body, fontSize: 12, color: C.textMid, margin: 0, fontStyle: "italic" }}>{s.es}</p>
                  </div>
                  <span style={{ color: playingIdx === i ? C.amber : C.textDim, fontSize: 12, flexShrink: 0, marginTop: 4 }}>
                    {playingIdx === i ? "🔊" : "🔈"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* New words */}
          {story.new_words?.length > 0 && (
            <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 14, background: "rgba(0,188,212,0.04)", border: "1px solid rgba(0,188,212,0.12)" }}>
              <p style={{ fontFamily: F.body, fontSize: 11, fontWeight: 700, color: C.teal, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 10px" }}>📝 Palabras nuevas</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {story.new_words.map((w, i) => (
                  <button key={i} onClick={() => speakCN(w.char)} style={{ padding: "8px 14px", borderRadius: 10, background: "rgba(0,188,212,0.06)", border: "1px solid rgba(0,188,212,0.15)", cursor: "pointer", textAlign: "center" }}>
                    <span style={{ fontFamily: F.cn, fontSize: 18, color: C.text, display: "block" }}>{w.char}</span>
                    <span style={{ fontFamily: F.body, fontSize: 10, color: C.teal }}>{w.pinyin} = {w.meaning}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Moral */}
          {story.moral && (
            <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 12, background: "rgba(255,183,77,0.04)", border: "1px solid rgba(255,183,77,0.1)", textAlign: "center" }}>
              <p style={{ fontFamily: F.body, fontSize: 13, color: C.amber, margin: 0 }}>🏮 {story.moral}</p>
            </div>
          )}

          {/* New story */}
          <button onClick={() => generateStory(theme)} style={{ width: "100%", marginTop: 16, padding: "14px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${C.amber},#F57C00)`, color: "white", cursor: "pointer", fontFamily: F.body, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {Ic.refresh} Generar otra historia
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// 2. STROKE RECOGNITION ✍️
// ═══════════════════════════════════════════

const STROKE_CHARS = [
  { char: "人", name: "persona", strokes: 2, order: "Primero 丿 (piě), luego ㇏ (nà)", hint: "Como un techo: diagonal izquierda, diagonal derecha" },
  { char: "大", name: "grande", strokes: 3, order: "一 horizontal, 丿 diagonal izq, ㇏ diagonal der", hint: "Una persona con brazos abiertos" },
  { char: "口", name: "boca", strokes: 3, order: "丨 vertical izq, ㇕ esquina, 一 horizontal abajo", hint: "Un cuadrado: izquierda, arriba+derecha, abajo" },
  { char: "日", name: "sol/día", strokes: 4, order: "丨 izq, ㇕ arriba+der, 一 medio, 一 abajo", hint: "Como 口 pero con una línea en medio" },
  { char: "山", name: "montaña", strokes: 3, order: "丨 centro, ㇕ izq+abajo, 丨 derecha", hint: "Tres picos: centro alto, izq bajo, der bajo" },
  { char: "水", name: "agua", strokes: 4, order: "㇚ centro, 丿 izq-arr, 丿 izq-abajo, ㇏ derecha", hint: "Una línea central con salpicaduras a los lados" },
  { char: "火", name: "fuego", strokes: 4, order: "丿 izq-arr, 丿 der-arr, 丿 izq-abajo, ㇏ der-abajo", hint: "Llamas: dos chispas arriba, dos abajo" },
  { char: "木", name: "árbol", strokes: 4, order: "一 horizontal, 丨 vertical, 丿 diagonal izq, ㇏ diagonal der", hint: "Cruz + raíces: horizontal, vertical, dos diagonales" },
  { char: "中", name: "centro/China", strokes: 4, order: "丨 izq, ㇕ arriba+der, 一 abajo, 丨 centro", hint: "Un rectángulo con una línea vertical que lo atraviesa" },
  { char: "天", name: "cielo", strokes: 4, order: "一 horizontal arr, 一 horizontal abajo, 丿 diagonal izq, ㇏ diagonal der", hint: "Dos horizontales + persona debajo" },
];

function StrokeSection() {
  const canvasRef = useRef(null);
  const [charIdx, setCharIdx] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [result, setResult] = useState(null);
  const lastPos = useRef(null);

  const ch = STROKE_CHARS[charIdx];

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e) => {
    e.preventDefault();
    if (result) return;
    setDrawing(true);
    const pos = getPos(e);
    lastPos.current = pos;
    setCurrentStroke([pos]);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing || result) return;
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = "#E84545";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
    setCurrentStroke(p => [...p, pos]);
  };

  const endDraw = (e) => {
    e?.preventDefault();
    if (!drawing) return;
    setDrawing(false);
    if (currentStroke.length > 2) {
      setStrokes(p => [...p, currentStroke]);
    }
    setCurrentStroke([]);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 300, 300);
    drawGuide();
    setStrokes([]);
    setResult(null);
    setShowOrder(false);
  };

  const drawGuide = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 300, 300);
    // Grid lines
    ctx.strokeStyle = "rgba(245,240,235,0.06)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(150, 0); ctx.lineTo(150, 300);
    ctx.moveTo(0, 150); ctx.lineTo(300, 150);
    ctx.stroke();
    ctx.setLineDash([]);
    // Ghost character
    ctx.font = "180px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(245,240,235,0.05)";
    ctx.fillText(ch.char, 150, 160);
  };

  useEffect(() => { drawGuide(); }, [charIdx]);

  const checkStrokes = () => {
    const count = strokes.length;
    const expected = ch.strokes;
    if (count === expected) {
      setResult("perfect");
    } else if (Math.abs(count - expected) <= 1) {
      setResult("close");
    } else {
      setResult("retry");
    }
  };

  const nextChar = () => {
    setCharIdx(p => (p + 1) % STROKE_CHARS.length);
    clearCanvas();
  };

  return (
    <div style={{ minHeight: "100vh", maxWidth: 480, margin: "0 auto", padding: "24px 16px 100px" }}>
      <h2 style={{ fontFamily: F.display, fontSize: 26, fontWeight: 800, color: C.text, margin: "0 0 4px" }}>Trazos <span style={{ color: C.red }}>笔画</span></h2>
      <p style={{ fontFamily: F.body, fontSize: 14, color: C.textDim, margin: "0 0 20px" }}>Dibuja el carácter con el dedo o mouse</p>

      {/* Target character */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => speakCN(ch.char)} style={{ background: "rgba(232,69,69,0.06)", border: "none", borderRadius: 12, padding: "8px 16px", cursor: "pointer" }}>
            <span style={{ fontFamily: F.cn, fontSize: 40, color: C.text }}>{ch.char}</span>
          </button>
          <div>
            <p style={{ fontFamily: F.body, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{ch.name}</p>
            <p style={{ fontFamily: F.body, fontSize: 12, color: C.textDim, margin: 0 }}>{ch.strokes} trazos · 🔊 toca para escuchar</p>
          </div>
        </div>
        <span style={{ fontFamily: F.body, fontSize: 12, color: C.textDim }}>{charIdx + 1}/{STROKE_CHARS.length}</span>
      </div>

      {/* Canvas */}
      <div style={{ borderRadius: 18, border: `2px solid ${result === "perfect" ? "rgba(76,175,80,0.4)" : result === "close" ? "rgba(255,183,77,0.4)" : C.border}`, overflow: "hidden", background: "rgba(245,240,235,0.02)", marginBottom: 12, touchAction: "none" }}>
        <canvas ref={canvasRef} width={300} height={300} style={{ width: "100%", display: "block", cursor: "crosshair" }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
      </div>

      {/* Stroke count */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: F.body, fontSize: 13, color: C.textMid }}>Tus trazos: <span style={{ color: C.text, fontWeight: 700 }}>{strokes.length}</span> / {ch.strokes}</span>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: ch.strokes }, (_, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i < strokes.length ? C.red : C.border }} />
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div style={{ padding: "14px 16px", borderRadius: 12, marginBottom: 12, textAlign: "center", animation: "fadeUp .3s",
          background: result === "perfect" ? "rgba(76,175,80,0.08)" : result === "close" ? "rgba(255,183,77,0.08)" : "rgba(232,69,69,0.08)",
          border: `1px solid ${result === "perfect" ? "rgba(76,175,80,0.2)" : result === "close" ? "rgba(255,183,77,0.2)" : "rgba(232,69,69,0.2)"}`,
        }}>
          <p style={{ fontFamily: F.body, fontSize: 20, margin: "0 0 4px" }}>
            {result === "perfect" ? "🎉 ¡Perfecto!" : result === "close" ? "👍 ¡Casi!" : "💪 Intenta de nuevo"}
          </p>
          <p style={{ fontFamily: F.body, fontSize: 13, color: C.textMid, margin: 0 }}>
            {result === "perfect" ? `${ch.strokes} trazos correctos` : result === "close" ? "El número de trazos está cerca" : `Necesitas ${ch.strokes} trazos, hiciste ${strokes.length}`}
          </p>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={clearCanvas} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, color: C.textMid, cursor: "pointer", fontFamily: F.body, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{Ic.trash} Borrar</button>
        <button onClick={checkStrokes} disabled={strokes.length === 0} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: strokes.length > 0 ? `linear-gradient(135deg,${C.red},${C.redDark})` : C.surface, color: strokes.length > 0 ? "white" : C.textDim, cursor: strokes.length > 0 ? "pointer" : "default", fontFamily: F.body, fontSize: 13, fontWeight: 600 }}>Verificar</button>
        <button onClick={nextChar} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid rgba(0,188,212,0.2)`, background: "rgba(0,188,212,0.06)", color: C.teal, cursor: "pointer", fontFamily: F.body, fontSize: 13, fontWeight: 600 }}>Siguiente</button>
      </div>

      {/* Hint & Order */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setShowHint(p => !p)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1px solid ${C.border}`, background: showHint ? "rgba(255,183,77,0.06)" : C.surface, color: showHint ? C.amber : C.textDim, cursor: "pointer", fontFamily: F.body, fontSize: 12 }}>💡 Pista</button>
        <button onClick={() => setShowOrder(p => !p)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1px solid ${C.border}`, background: showOrder ? "rgba(66,165,245,0.06)" : C.surface, color: showOrder ? C.blue : C.textDim, cursor: "pointer", fontFamily: F.body, fontSize: 12 }}>📋 Orden de trazos</button>
      </div>

      {showHint && (
        <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(255,183,77,0.04)", border: "1px solid rgba(255,183,77,0.1)", animation: "fadeUp .2s" }}>
          <p style={{ fontFamily: F.body, fontSize: 13, color: C.amber, margin: 0 }}>💡 {ch.hint}</p>
        </div>
      )}

      {showOrder && (
        <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(66,165,245,0.04)", border: "1px solid rgba(66,165,245,0.1)", animation: "fadeUp .2s" }}>
          <p style={{ fontFamily: F.body, fontSize: 13, color: C.blue, margin: 0 }}>📋 {ch.order}</p>
        </div>
      )}

      {/* Character selector */}
      <div style={{ marginTop: 20 }}>
        <p style={{ fontFamily: F.body, fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 10px" }}>Todos los caracteres</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {STROKE_CHARS.map((c, i) => (
            <button key={i} onClick={() => { setCharIdx(i); clearCanvas(); }} style={{
              width: 48, height: 48, borderRadius: 10, cursor: "pointer",
              border: `1px solid ${i === charIdx ? C.red : C.border}`,
              background: i === charIdx ? "rgba(232,69,69,0.08)" : C.surface,
              fontFamily: F.cn, fontSize: 22, color: i === charIdx ? C.red : C.text,
            }}>{c.char}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// 3. BILINGUAL MEMES 😂
// ═══════════════════════════════════════════

const MEMES = [
  { id: 1, emoji: "🔊", title: "Los 4 tonos", setup: "Cuando aprendes que:", cn: "妈 麻 马 骂", pinyin: "mā má mǎ mà", punchline: "Mamá, cáñamo, caballo, regañar... TODO suena igual pero TODO es diferente 😵", tip: "Los tonos pueden ser la diferencia entre llamar a tu mamá y llamarla caballo", tags: ["#AprendeChino", "#Tonos", "#HanGo"], color: "rgba(232,69,69,0.08)", borderColor: "rgba(232,69,69,0.2)" },
  { id: 2, emoji: "🍜", title: "En el restaurante", setup: "Yo: Quiero arroz sin picante", cn: "我要米饭，不要辣的", pinyin: "Wǒ yào mǐfàn, bú yào là de", punchline: "El mesero: *trae el plato más picante del menú* 🌶️🌶️🌶️\nYo: 太辣了！！！", tip: "En China, 'no picante' (不辣) es relativo. Lo que ellos consideran 'poco picante' puede ser nivel volcán para nosotros", tags: ["#ChinoReal", "#Comida", "#HanGo"], color: "rgba(255,183,77,0.08)", borderColor: "rgba(255,183,77,0.2)" },
  { id: 3, emoji: "🤦", title: "La pregunta trampa", setup: "Cuando un chino te pregunta:", cn: "你吃了吗？", pinyin: "Nǐ chī le ma?", punchline: "Y tú empiezas a describir todo tu almuerzo... pero solo era un SALUDO 😂\nEs como decir '¿Qué tal?' — nadie espera tu biografía", tip: "你吃了吗 es el '¿Cómo estás?' chino. La respuesta correcta es 吃了 (ya comí) y listo", tags: ["#CulturaChina", "#Saludos", "#HanGo"], color: "rgba(0,188,212,0.08)", borderColor: "rgba(0,188,212,0.2)" },
  { id: 4, emoji: "💰", title: "El número de la suerte", setup: "En China:", cn: "888 = 发发发", pinyin: "bā bā bā = fā fā fā", punchline: "El 8 suena como 'prosperar' 🤑\nMientras tanto el 4 (四 sì) suena como 'morir' (死 sǐ)\nPor eso no hay piso 4 en muchos edificios 🏢", tip: "Las placas de auto con 8888 se subastan por fortunas en China", tags: ["#DatosCulturales", "#Números", "#HanGo"], color: "rgba(76,175,80,0.08)", borderColor: "rgba(76,175,80,0.2)" },
  { id: 5, emoji: "📱", title: "WeChat vs WhatsApp", setup: "Los latinos:", cn: "你有WhatsApp吗？", pinyin: "Nǐ yǒu WhatsApp ma?", punchline: "Los chinos: WhatsApp? 什么是WhatsApp? 🤔\nEn China TODO es WeChat: chat, pagar, taxi, comida, gobierno... LITERALMENTE todo", tip: "WeChat (微信 wēixìn) tiene 1.3 mil millones de usuarios. Si no lo tienes en China, no existes", tags: ["#TecnologíaChina", "#WeChat", "#HanGo"], color: "rgba(156,39,176,0.08)", borderColor: "rgba(156,39,176,0.2)" },
  { id: 6, emoji: "🎂", title: "Fideos de cumpleaños", setup: "En tu cumpleaños en China:", cn: "生日快乐！吃长寿面！", pinyin: "Shēngrì kuàilè! Chī chángshòu miàn!", punchline: "En vez de pastel 🎂 te dan FIDEOS 🍜\n¡Y NO PUEDES CORTARLOS porque representan larga vida! Si los cortas, cortas tus años 😱", tip: "Los fideos de cumpleaños (长寿面) son tradición. Más largos = más años de vida", tags: ["#CulturaChina", "#Cumpleaños", "#HanGo"], color: "rgba(255,183,77,0.08)", borderColor: "rgba(255,183,77,0.2)" },
  { id: 7, emoji: "🥢", title: "Los palillos", setup: "Lo que NO debes hacer:", cn: "不要把筷子插在饭里！", pinyin: "Bú yào bǎ kuàizi chā zài fàn lǐ!", punchline: "JAMÁS claves los palillos en el arroz verticalmente 🚫\nParece incienso en un funeral y es de MUY mala suerte 💀", tip: "Es como poner los zapatos en la mesa en Latinoamérica — simplemente NO", tags: ["#Etiqueta", "#Palillos", "#HanGo"], color: "rgba(232,69,69,0.08)", borderColor: "rgba(232,69,69,0.2)" },
  { id: 8, emoji: "🫖", title: "Agua caliente", setup: "Tú: Me duele el estómago\nTu amigo chino:", cn: "多喝热水！", pinyin: "Duō hē rè shuǐ!", punchline: "¿Tienes gripe? 多喝热水\n¿Estás triste? 多喝热水\n¿Se acabó el mundo? 多喝热水\n\n'Toma más agua caliente' es la cura universal china 😂☕", tip: "En China rara vez toman agua fría. El agua caliente (热水) es medicina, cultura y estilo de vida", tags: ["#AguaCaliente", "#CulturaChina", "#HanGo"], color: "rgba(0,188,212,0.08)", borderColor: "rgba(0,188,212,0.2)" },
];

function MemesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const meme = MEMES[activeIdx];

  return (
    <div style={{ minHeight: "100vh", maxWidth: 520, margin: "0 auto", padding: "24px 16px 100px" }}>
      <h2 style={{ fontFamily: F.display, fontSize: 26, fontWeight: 800, color: C.text, margin: "0 0 4px" }}>Memes <span style={{ color: C.purple }}>搞笑</span></h2>
      <p style={{ fontFamily: F.body, fontSize: 14, color: C.textDim, margin: "0 0 20px" }}>Aprende cultura china riéndote. Comparte en Instagram.</p>

      {/* Main meme card */}
      <div style={{ borderRadius: 20, overflow: "hidden", background: meme.color, border: `1px solid ${meme.borderColor}`, marginBottom: 16, animation: "fadeUp .3s" }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>{meme.emoji}</span>
            <span style={{ fontFamily: F.display, fontSize: 16, fontWeight: 800, color: C.text }}>{meme.title}</span>
          </div>
          <p style={{ fontFamily: F.body, fontSize: 14, color: C.textMid, margin: "0 0 12px" }}>{meme.setup}</p>
        </div>

        {/* Chinese */}
        <div style={{ padding: "0 20px" }}>
          <button onClick={() => speakCN(meme.cn)} style={{ background: "rgba(0,0,0,0.15)", borderRadius: 12, padding: "14px 18px", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}>
            <p style={{ fontFamily: F.cn, fontSize: 24, color: C.text, margin: "0 0 4px", lineHeight: 1.3 }}>{meme.cn}</p>
            <p style={{ fontFamily: F.body, fontSize: 12, color: C.teal, margin: 0 }}>{meme.pinyin} · 🔊</p>
          </button>
        </div>

        {/* Punchline */}
        <div style={{ padding: "14px 20px" }}>
          <p style={{ fontFamily: F.body, fontSize: 15, color: C.text, margin: 0, lineHeight: 1.6, whiteSpace: "pre-line" }}>{meme.punchline}</p>
        </div>

        {/* Tip */}
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ background: "rgba(0,0,0,0.1)", borderRadius: 10, padding: "10px 14px" }}>
            <p style={{ fontFamily: F.body, fontSize: 12, color: C.text, margin: 0, lineHeight: 1.5 }}>💡 {meme.tip}</p>
          </div>
        </div>

        {/* Tags */}
        <div style={{ padding: "0 20px 16px", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {meme.tags.map((t, i) => (
            <span key={i} style={{ fontFamily: F.body, fontSize: 11, color: C.textDim, background: "rgba(0,0,0,0.08)", padding: "3px 8px", borderRadius: 6 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Share button */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => speakCN(meme.cn)} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, color: C.teal, cursor: "pointer", fontFamily: F.body, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{Ic.vol} Escuchar</button>
        <a href="https://instagram.com/hangoworld" target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#833AB4,#FD1D1D,#F77737)", color: "white", cursor: "pointer", fontFamily: F.body, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>{Ic.ig} @hangoworld</a>
      </div>

      {/* Meme selector */}
      <p style={{ fontFamily: F.body, fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 10px" }}>Más memes</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {MEMES.map((m, i) => (
          <button key={m.id} onClick={() => setActiveIdx(i)} style={{
            padding: "12px 14px", borderRadius: 12, cursor: "pointer", textAlign: "left",
            display: "flex", alignItems: "center", gap: 12,
            background: i === activeIdx ? m.color : C.surface,
            border: `1px solid ${i === activeIdx ? m.borderColor : C.border}`,
          }}>
            <span style={{ fontSize: 22 }}>{m.emoji}</span>
            <span style={{ fontFamily: F.body, fontSize: 13, fontWeight: i === activeIdx ? 700 : 400, color: C.text }}>{m.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// AVATAR (animated face)
// ═══════════════════════════════════════════

function Avatar({ speaking, mood, size = 180, listening }) {
  const [blink, setBlink] = useState(false);
  const [mouth, setMouth] = useState(false);

  useEffect(() => {
    const id = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 180); }, 2800 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!speaking) { setMouth(false); return; }
    const id = setInterval(() => setMouth(p => !p), 130 + Math.random() * 80);
    return () => clearInterval(id);
  }, [speaking]);

  const rc = listening ? "rgba(76,175,80,0.35)" : speaking ? "rgba(0,188,212,0.35)" : "transparent";
  const rc2 = listening ? "rgba(76,175,80,0.15)" : speaking ? "rgba(0,188,212,0.15)" : "transparent";

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      {(listening || speaking) && <>
        <div style={{ position: "absolute", inset: -14, borderRadius: "50%", border: "2px solid " + rc, animation: "ring 2s ease-out infinite" }} />
        <div style={{ position: "absolute", inset: -7, borderRadius: "50%", border: "2px solid " + rc2, animation: "ring 2s ease-out .5s infinite" }} />
      </>}
      <svg width={size} height={size} viewBox="0 0 120 120" style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}>
        <defs>
          <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFE0BD"/><stop offset="100%" stopColor="#FFCBA4"/></linearGradient>
          <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1A1A2E"/><stop offset="100%" stopColor="#16213E"/></linearGradient>
        </defs>
        <ellipse cx="60" cy="52" rx="46" ry="48" fill="url(#hg)"/>
        <ellipse cx="60" cy="62" rx="36" ry="38" fill="url(#sg)"/>
        <path d="M22 44Q30 20,60 18Q90 20,98 44Q90 32,60 30Q30 32,22 44" fill="url(#hg)"/>
        <path d="M20 44Q14 60,18 80Q22 70,24 55Z" fill="url(#hg)"/>
        <path d="M100 44Q106 60,102 80Q98 70,96 55Z" fill="url(#hg)"/>
        <path d={mood==="surprised"?"M38 46Q43 42,50 44":"M38 48Q43 45,50 47"} stroke="#5D4E37" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d={mood==="surprised"?"M70 44Q77 42,82 46":"M70 47Q77 45,82 48"} stroke="#5D4E37" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="44" cy="56" rx="5.5" ry={blink?.8:5.5} fill="#1A1A2E"/>
        <ellipse cx="76" cy="56" rx="5.5" ry={blink?.8:5.5} fill="#1A1A2E"/>
        {!blink&&<><circle cx="46" cy="54" r="2.2" fill="white" opacity=".9"/><circle cx="78" cy="54" r="2.2" fill="white" opacity=".9"/></>}
        <ellipse cx="36" cy="68" rx="8" ry="4" fill="#FF6B6B" opacity={speaking?.35:.18}/>
        <ellipse cx="84" cy="68" rx="8" ry="4" fill="#FF6B6B" opacity={speaking?.35:.18}/>
        <path d="M58 65Q60 68,62 65" stroke="#D4A574" strokeWidth="1" fill="none" strokeLinecap="round"/>
        {speaking ? <ellipse cx="60" cy="78" rx={mouth?7:4} ry={mouth?5:2} fill="#E57373" opacity=".9"/>
        : mood==="happy" ? <path d="M52 76Q60 84,68 76" stroke="#E57373" strokeWidth="2" fill="none" strokeLinecap="round"/>
        : <path d="M54 77Q60 82,66 77" stroke="#E57373" strokeWidth="2" fill="none" strokeLinecap="round"/>}
        <circle cx="88" cy="38" r="5" fill="#FF6B6B"/><circle cx="88" cy="38" r="3" fill="#FF8A80"/>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════
// 小美 VOICE CONVERSATION (IMMERSIVE)
// ═══════════════════════════════════════════

const CONVO_PROMPT = "Eres 小美 (Xiǎo Měi), amiga china de 25 años en Beijing. Simpática, curiosa.\n\n" +
  "FORMATO OBLIGATORIO:\n\n" +
  "[MSG]\nchinese: (1-2 oraciones CORTAS, máx 20 caracteres)\npinyin: (pinyin)\nspanish: (traducción)\nmood: (happy/thinking/surprised/neutral)\n[/MSG]\n\n" +
  "REGLAS: Oraciones MUY CORTAS (conversación hablada). Casual como amiga. HSK1-HSK3. Si hablan español, responde en chino. Usa 哈哈 对对对 是吗? 太好了. UNA pregunta por mensaje. AMIGA no profesora.";

function ConvoSection() {
  const [msgs, setMsgs] = useState([]);
  const [started, setStarted] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [mood, setMood] = useState("happy");
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showSubs, setShowSubs] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [lastMsg, setLastMsg] = useState(null);
  const [status, setStatus] = useState("");
  const recRef = useRef(null);
  const msgsRef = useRef([]);
  const transcriptRef = useRef("");

  useEffect(() => { msgsRef.current = msgs; }, [msgs]);
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);

  const parseResp = (c) => {
    const m = c.match(/\[MSG\]([\s\S]*?)\[\/MSG\]/i);
    if (!m) return null;
    const o = {};
    m[1].split("\n").forEach(l => { const idx = l.indexOf(":"); if (idx > 0) o[l.slice(0, idx).trim()] = l.slice(idx + 1).trim(); });
    return o;
  };

  const callAI = async (userMsg) => {
    const newMsgs = [...msgsRef.current, { role: "user", content: userMsg }];
    setMsgs(newMsgs);
    setLoading(true);
    setMood("thinking");
    setStatus("小美 pensando...");
    try {
      const apiMsgs = newMsgs.filter(m => !m.hidden).map(m => ({ role: m.role, content: m.content }));
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  max_tokens: 500, system: CONVO_PROMPT, messages: apiMsgs }),
      });
      const d = await r.json();
      const text = d.content?.map(i => i.text || "").join("\n") || "";
      setMsgs(p => [...p, { role: "assistant", content: text }]);
      setLoading(false);
      const parsed = parseResp(text);
      if (parsed) {
        setLastMsg(parsed);
        setMood(parsed.mood || "happy");
        setStatus("小美 hablando...");
        setSpeaking(true);
        await speakCN(parsed.chinese);
        setSpeaking(false);
        setStatus("Tu turno");
      }
    } catch {
      setLoading(false);
      setStatus("Error — intenta de nuevo");
    }
  };

  const startConvo = async (topic) => {
    setStarted(true);
    setLoading(true);
    setMood("thinking");
    setStatus("Conectando con 小美...");
    const prompt = topic || "Preséntate y pregúntale algo casual.";
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  max_tokens: 500, system: CONVO_PROMPT, messages: [{ role: "user", content: prompt }] }),
      });
      const d = await r.json();
      const text = d.content?.map(i => i.text || "").join("\n") || "";
      setMsgs([{ role: "user", content: prompt, hidden: true }, { role: "assistant", content: text }]);
      setLoading(false);
      const parsed = parseResp(text);
      if (parsed) {
        setLastMsg(parsed);
        setMood(parsed.mood || "happy");
        setSpeaking(true);
        setStatus("小美 hablando...");
        await speakCN(parsed.chinese);
        setSpeaking(false);
        setStatus("Tu turno");
      }
    } catch { setLoading(false); setStatus("Error de conexión"); }
  };

  const startListening = () => {
    if (speaking || loading) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setTextMode(true); setStatus("Mic no disponible — usa teclado"); return; }
    try {
      const rec = new SR();
      rec.lang = "zh-CN";
      rec.interimResults = true;
      rec.continuous = false;
      rec.onstart = () => { setListening(true); setTranscript(""); setStatus("Escuchando..."); };
      rec.onresult = (e) => {
        let f = "";
        for (let i = 0; i < e.results.length; i++) f += e.results[i][0].transcript;
        setTranscript(f);
      };
      rec.onend = () => {
        setListening(false);
        const t = transcriptRef.current;
        if (t && t.trim()) callAI(t.trim());
        else setStatus("No escuché — intenta de nuevo");
      };
      rec.onerror = () => { setListening(false); setTextMode(true); setStatus("Usa el teclado"); };
      recRef.current = rec;
      rec.start();
    } catch { setTextMode(true); setStatus("Mic no disponible — usa teclado"); }
  };

  const stopListening = () => { recRef.current?.stop(); };
  const sendText = () => { if (!textInput.trim()) return; callAI(textInput.trim()); setTextInput(""); };

  // Landing
  if (!started) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 16px 100px", maxWidth: 440, margin: "0 auto" }}>
      <Avatar speaking={false} mood="happy" size={150} listening={false} />
      <h2 style={{ fontFamily: F.display, fontSize: 24, fontWeight: 800, color: C.text, margin: "20px 0 4px" }}>Habla con <span style={{ color: C.teal }}>小美</span></h2>
      <p style={{ fontFamily: F.body, fontSize: 13, color: C.teal, margin: "0 0 4px" }}>Conversación por voz en mandarín</p>
      <p style={{ fontFamily: F.body, fontSize: 13, color: C.textMid, margin: "0 0 28px", textAlign: "center", lineHeight: 1.6 }}>Ella habla en chino, tú respondes. Avatar + voz. Sin texto.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
        {[
          { e: "👋", l: "Chat libre", t: null },
          { e: "🍜", l: "En un restaurante", t: "Están en un restaurante" },
          { e: "✈️", l: "Viajando a China", t: "Quieres viajar a China" },
          { e: "💼", l: "Sobre trabajo", t: "Habla sobre tu trabajo" },
          { e: "🎬", l: "Películas", t: "Películas y series" },
        ].map((x, i) => (
          <button key={i} onClick={() => startConvo(x.t)} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid " + (x.t === null ? "rgba(0,188,212,0.25)" : C.border), background: x.t === null ? "rgba(0,188,212,0.08)" : C.surface, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>{x.e}</span>
            <span style={{ fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.text }}>{x.l}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Immersive voice screen
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>
      {/* Top bar */}
      <div style={{ padding: "10px 0", width: "100%", display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
        <button onClick={() => { setStarted(false); setMsgs([]); setLastMsg(null); }} style={{ fontFamily: F.body, fontSize: 11, color: C.textDim, background: "rgba(245,240,235,0.04)", border: "1px solid " + C.border, borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}>← Salir</button>
        <button onClick={() => setShowSubs(p => !p)} style={{ fontFamily: F.body, fontSize: 11, color: C.textDim, background: "rgba(245,240,235,0.04)", border: "1px solid " + C.border, borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}>
          {showSubs ? "Ocultar texto" : "Subtítulos"}
        </button>
      </div>

      {/* Avatar centered */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", gap: 16 }}>
        <Avatar speaking={speaking} mood={mood} size={200} listening={listening} />

        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: F.display, fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>小美</p>
          <p style={{ fontFamily: F.body, fontSize: 13, margin: "4px 0 0", color: listening ? C.green : speaking ? C.teal : loading ? C.amber : C.textDim, fontWeight: 600 }}>{status}</p>
        </div>

        {listening && transcript && (
          <p style={{ fontFamily: F.cn, fontSize: 18, color: C.green, textAlign: "center", animation: "fadeUp .2s" }}>🎙️ {transcript}</p>
        )}

        {loading && (
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2].map(d => <span key={d} style={{ width: 10, height: 10, borderRadius: "50%", background: C.teal, animation: "pulse 1.2s ease-in-out " + (d * .2) + "s infinite" }} />)}
          </div>
        )}

        {showSubs && lastMsg && !listening && !loading && (
          <div style={{ textAlign: "center", animation: "fadeUp .3s", maxWidth: "100%", padding: "12px 16px", background: "rgba(0,0,0,0.4)", borderRadius: 14, backdropFilter: "blur(8px)" }}>
            <button onClick={() => { setSpeaking(true); speakCN(lastMsg.chinese).then(() => setSpeaking(false)); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <p style={{ fontFamily: F.cn, fontSize: 26, color: C.text, margin: "0 0 4px" }}>{lastMsg.chinese}</p>
            </button>
            <p style={{ fontFamily: F.body, fontSize: 13, color: C.teal, margin: "0 0 3px" }}>{lastMsg.pinyin}</p>
            <p style={{ fontFamily: F.body, fontSize: 13, color: C.textMid, margin: 0, fontStyle: "italic" }}>{lastMsg.spanish}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ padding: "12px 0 20px", flexShrink: 0, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {textMode ? (
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <input value={textInput} onChange={e => setTextInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendText()} placeholder="Escribe en chino o español..." style={{ flex: 1, fontFamily: F.body, fontSize: 14, padding: "13px 16px", borderRadius: 14, border: "1px solid " + C.border, background: "rgba(245,240,235,0.04)", color: C.text, outline: "none" }} />
            <button onClick={sendText} disabled={!textInput.trim() || loading} style={{ width: 48, height: 48, borderRadius: 14, border: "none", background: textInput.trim() ? "linear-gradient(135deg,#00BCD4,#00838F)" : C.surface, color: "white", cursor: textInput.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>{Ic.send}</button>
            <button onClick={() => setTextMode(false)} style={{ width: 48, height: 48, borderRadius: 14, border: "1px solid " + C.border, background: C.surface, color: C.textDim, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{Ic.convo}</button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setTextMode(true)} style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid " + C.border, background: C.surface, color: C.textDim, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⌨️</button>

            <button
              onMouseDown={startListening} onMouseUp={stopListening}
              onTouchStart={e => { e.preventDefault(); startListening(); }}
              onTouchEnd={e => { e.preventDefault(); stopListening(); }}
              disabled={speaking || loading}
              style={{
                width: 76, height: 76, borderRadius: "50%",
                border: listening ? "3px solid rgba(76,175,80,0.6)" : "3px solid transparent",
                background: listening ? "linear-gradient(135deg,#66BB6A,#43A047)" : speaking || loading ? "rgba(245,240,235,0.06)" : "linear-gradient(135deg,#00BCD4,#00838F)",
                color: "white", cursor: speaking || loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: listening ? "0 0 30px rgba(76,175,80,0.4)" : speaking ? "none" : "0 4px 24px rgba(0,188,212,0.3)",
                opacity: speaking || loading ? 0.35 : 1,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </button>

            <button onClick={() => { if (lastMsg) { setSpeaking(true); speakCN(lastMsg.chinese).then(() => setSpeaking(false)); } }} disabled={!lastMsg || speaking} style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid " + C.border, background: C.surface, color: lastMsg && !speaking ? C.teal : C.textDim, cursor: lastMsg && !speaking ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", opacity: lastMsg ? 1 : 0.3 }}>🔊</button>
          </div>
        )}
        <p style={{ fontFamily: F.body, fontSize: 10, color: C.textDim }}>
          {textMode ? "Escribe tu mensaje" : listening ? "Suelta para enviar" : "Mantén presionado para hablar"}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TUTOR (simplified)
// ═══════════════════════════════════════════

const colorMap={blue:{bg:"rgba(66,165,245,0.06)",border:"rgba(66,165,245,0.18)",accent:"#42A5F5",text:"#B3D9F7"},amber:{bg:"rgba(255,183,77,0.06)",border:"rgba(255,183,77,0.18)",accent:"#FFB74D",text:"#F5DEB3"},red:{bg:"rgba(232,69,69,0.06)",border:"rgba(232,69,69,0.18)",accent:"#E84545",text:"#F5C4C4"},teal:{bg:"rgba(0,188,212,0.06)",border:"rgba(0,188,212,0.18)",accent:"#00BCD4",text:"#B2EBF2"}};
function rB(t){return t.split(/(\*\*[^*]+\*\*)/g).map((p,i)=>{if(p.startsWith("**")&&p.endsWith("**")){const inner=p.slice(2,-2);const cn=/[\u4e00-\u9fff]/.test(inner);return <span key={i} style={{fontWeight:700,color:cn?C.red:C.text,fontFamily:cn?F.cn:F.body,cursor:cn?"pointer":"default"}} onClick={()=>cn&&speakCN(inner)}>{inner}</span>;}return <span key={i}>{p}</span>;});}

function TutorMsg({ c }) {
  const heroRe = /\[HERO\]([\s\S]*?)\[\/HERO\]/i;
  const secRe = /\[SECTION\s+color=(\w+)\s+icon=(\S+)\s+title=([^\]]+)\]([\s\S]*?)\[\/SECTION\]/gi;
  const exRe = /\[EXAMPLES\]([\s\S]*?)\[\/EXAMPLES\]/i;

  const hero = c.match(heroRe);
  const exM = c.match(exRe);
  let has = false, h = {}, secs = [], exs = [];

  if (hero) {
    has = true;
    hero[1].split("\n").forEach(l => {
      const idx = l.indexOf(":");
      if (idx > 0) h[l.slice(0, idx).trim()] = l.slice(idx + 1).trim();
    });
  }

  let m;
  while ((m = secRe.exec(c)) !== null) {
    has = true;
    secs.push({ color: m[1], icon: m[2], title: m[3].trim(), body: m[4].trim() });
  }

  if (exM) {
    has = true;
    exs = exM[1].split("\n").filter(l => l.includes("|")).map(l => {
      const p = l.split("|").map(x => x.trim());
      return { emoji: p[0], chars: p[1], pinyin: p[2], meaning: p[3] };
    });
  }

  if (!has) {
    return (
      <div style={{ background: C.surface, borderRadius: 14, padding: "14px 16px", border: "1px solid " + C.border, fontFamily: F.body, fontSize: 14, color: "#D5CEC8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
        {c}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {h.title && (
        <div style={{ background: "linear-gradient(135deg,rgba(232,69,69,0.14),rgba(198,40,40,0.05))", borderRadius: 16, padding: "18px 16px", border: "1px solid rgba(232,69,69,0.2)", position: "relative", overflow: "hidden" }}>
          {h.subtitle && <span style={{ position: "absolute", right: -8, top: -14, fontSize: 90, opacity: .04, fontFamily: F.cn, color: C.red, pointerEvents: "none" }}>{h.subtitle}</span>}
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 34 }}>{h.emoji || "📚"}</span>
            <div>
              <span style={{ fontFamily: F.display, fontSize: 18, fontWeight: 800, color: C.text }}>{h.title}</span>
              {h.subtitle && (
                <button onClick={() => speakCN(h.subtitle)} style={{ background: "none", border: "none", cursor: "pointer", padding: "3px 0 0", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontFamily: F.cn, fontSize: 24, color: C.red }}>{h.subtitle}</span>
                  <span style={{ fontSize: 10 }}>🔊</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {secs.map((s, i) => {
        const cm = colorMap[s.color] || colorMap.blue;
        return (
          <div key={i} style={{ background: cm.bg, borderRadius: 12, padding: "12px 14px", border: "1px solid " + cm.border, borderLeft: "3px solid " + cm.accent }}>
            <p style={{ fontFamily: F.body, fontSize: 10, fontWeight: 700, color: cm.accent, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 6px" }}>{s.icon} {s.title}</p>
            {s.body.split("\n").filter(l => l.trim()).map((l, j) => (
              <p key={j} style={{ fontFamily: F.body, fontSize: 13, color: cm.text, lineHeight: 1.55, margin: "0 0 3px" }}>{rB(l)}</p>
            ))}
          </div>
        );
      })}

      {exs.length > 0 && (
        <div style={{ background: "rgba(76,175,80,0.04)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(76,175,80,0.15)", borderLeft: "3px solid #4CAF50" }}>
          <p style={{ fontFamily: F.body, fontSize: 10, fontWeight: 700, color: "#4CAF50", textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 8px" }}>📝 Ejemplos</p>
          {exs.map((e, i) => (
            <div key={i} onClick={() => speakCN(e.chars)} style={{ background: "rgba(245,240,235,0.02)", borderRadius: 8, padding: "10px 12px", cursor: "pointer", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{e.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: F.cn, fontSize: 16, color: C.text, margin: "0 0 1px" }}>{e.chars}</p>
                  <p style={{ fontFamily: F.body, fontSize: 11, color: "#4CAF50", margin: "0 0 1px" }}>{e.pinyin}</p>
                  <p style={{ fontFamily: F.body, fontSize: 11, color: C.textMid, margin: 0, fontStyle: "italic" }}>{e.meaning}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const TUTOR_PROMPT = "Eres HanGo AI, tutor visual de chino. Español, ~9 meses.\nSIEMPRE:\n" +
  "[HERO]\nemoji: (emoji)\ntitle: (título)\nsubtitle: (chino)\n[/HERO]\n" +
  "[SECTION color=blue icon=💡 title=Explicación]\n(Explicación. **negrita** chino.)\n[/SECTION]\n" +
  "[EXAMPLES]\nemoji | chino | pinyin | español\n[/EXAMPLES]\n" +
  "[SECTION color=amber icon=🔗 title=Relacionadas]\ncarácter (pinyin) = significado\n[/SECTION]\n" +
  "[SECTION color=red icon=⚠️ title=Errores comunes]\n(errores)\n[/SECTION]\n" +
  "[SECTION color=teal icon=🏮 title=Dato curioso]\n(cultura)\n[/SECTION]";

const WELCOME_MSG = "[HERO]\nemoji: 🎓\ntitle: ¡Bienvenido!\nsubtitle: 欢迎\n[/HERO]\n\n" +
  "[SECTION color=blue icon=💡 title=Pregúntame lo que quieras]\nVocabulario, gramática, expresiones. Te doy una lección visual.\n[/SECTION]\n\n" +
  "[EXAMPLES]\n📝 | 可能 | kěnéng | Explícame 可能\n📖 | 怎么用了 | zěnme yòng le | ¿Cómo uso 了?\n🍜 | 点菜 | diǎn cài | ¿Cómo pido comida?\n[/EXAMPLES]";

function ChatSection() {
  const [msgs, setMsgs] = useState([{ role: "assistant", content: WELCOME_MSG }]);
  const [inp, setInp] = useState("");
  const [ld, setLd] = useState(false);
  const end = useRef(null);
  const inpR = useRef(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!inp.trim() || ld) return;
    const u = inp.trim();
    setInp("");
    setMsgs(p => [...p, { role: "user", content: u }]);
    setLd(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          
          max_tokens: 1000,
          system: TUTOR_PROMPT,
          messages: [...msgs, { role: "user", content: u }].map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const d = await r.json();
      const text = d.content?.map(i => i.text || "").join("\n") || "Error";
      setMsgs(p => [...p, { role: "assistant", content: text }]);
    } catch {
      setMsgs(p => [...p, { role: "assistant", content: "Error de conexión." }]);
    }
    setLd(false);
    inpR.current?.focus();
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", maxWidth: 720, margin: "0 auto", padding: "0 16px" }}>
      <div style={{ padding: "12px 0", borderBottom: "1px solid " + C.border, flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg," + C.red + "," + C.redDark + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "white", fontFamily: F.cn }}>汉</div>
        <p style={{ fontFamily: F.body, fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>HanGo Tutor</p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp .3s" }}>
            {m.role === "user" ? (
              <div style={{ maxWidth: "80%", padding: "11px 15px", borderRadius: "16px 16px 4px 16px", background: "linear-gradient(135deg," + C.red + "," + C.redDark + ")", color: "white", fontFamily: F.body, fontSize: 14 }}>{m.content}</div>
            ) : (
              <div style={{ maxWidth: "94%", width: "100%" }}><TutorMsg c={m.content} /></div>
            )}
          </div>
        ))}
        {ld && (
          <div style={{ display: "flex", gap: 5, padding: 12 }}>
            {[0, 1, 2].map(d => <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: C.red, animation: "pulse 1.2s ease-in-out " + (d * .2) + "s infinite" }} />)}
          </div>
        )}
        <div ref={end} />
      </div>
      <div style={{ padding: "10px 0 14px", borderTop: "1px solid " + C.border, display: "flex", gap: 8, flexShrink: 0 }}>
        <input ref={inpR} value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Pregunta sobre chino..." style={{ flex: 1, fontFamily: F.body, fontSize: 14, padding: "12px 14px", borderRadius: 12, border: "1px solid " + C.border, background: "rgba(245,240,235,0.04)", color: C.text, outline: "none" }} />
        <button onClick={send} disabled={!inp.trim()} style={{ width: 46, height: 46, borderRadius: 12, border: "none", background: inp.trim() ? "linear-gradient(135deg," + C.red + "," + C.redDark + ")" : C.surface, color: inp.trim() ? "white" : C.textDim, cursor: inp.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{Ic.send}</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════

function Home({nav}){
  const [em,setEm]=useState("");const[sub,setSub]=useState(false);
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"40px 20px 100px"}}>
      <div style={{textAlign:"center",maxWidth:700,animation:"fadeUp .8s"}}>
        <div style={{width:68,height:68,borderRadius:16,background:`linear-gradient(135deg,${C.red},${C.redDark})`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:34,fontWeight:900,color:"white",fontFamily:F.cn,boxShadow:"0 8px 32px rgba(232,69,69,0.35)",marginBottom:24}}>汉</div>
        <h1 style={{fontFamily:F.display,fontSize:"clamp(44px,9vw,72px)",fontWeight:800,color:C.text,lineHeight:1.02,margin:"0 0 8px",letterSpacing:-3}}>Han<span style={{color:C.red}}>Go</span></h1>
        <p style={{fontFamily:F.body,fontSize:"clamp(13px,2.5vw,16px)",color:C.textDim,margin:"0 0 10px",letterSpacing:4,textTransform:"uppercase"}}>Aprende chino sin complicarte</p>
        <p style={{fontFamily:F.body,fontSize:15,color:C.textDim,margin:"0 auto 32px",maxWidth:460,lineHeight:1.6}}>Tutor IA visual, historias interactivas, practica trazos y aprende con memes. Todo en español.</p>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,maxWidth:400,margin:"0 auto 36px"}}>
          {[
            {id:"chat",emoji:"🎓",l:"Tutor IA",d:"Lecciones visuales",c:"linear-gradient(135deg,"+C.red+","+C.redDark+")"},
            {id:"convo",emoji:"💬",l:"小美",d:"Conversa en chino",c:"linear-gradient(135deg,#00BCD4,#00838F)"},
            {id:"stories",emoji:"📖",l:"Historias",d:"Cuentos con IA",c:"linear-gradient(135deg,"+C.amber+",#F57C00)"},
            {id:"strokes",emoji:"✍️",l:"Trazos",d:"Dibuja caracteres",c:"linear-gradient(135deg,#7B1FA2,#4A148C)"},
            {id:"memes",emoji:"😂",l:"Memes",d:"Aprende riendo",c:"linear-gradient(135deg,"+C.teal+","+C.tealDark+")"},
          ].map(b=>(
            <button key={b.id} onClick={()=>nav(b.id)} style={{padding:"18px 14px",borderRadius:16,border:"none",cursor:"pointer",background:b.c,color:"white",textAlign:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>
              <span style={{fontSize:28,display:"block",marginBottom:6}}>{b.emoji}</span>
              <span style={{fontFamily:F.body,fontSize:14,fontWeight:700,display:"block"}}>{b.l}</span>
              <span style={{fontFamily:F.body,fontSize:11,opacity:.8}}>{b.d}</span>
            </button>
          ))}
        </div>

        <div style={{background:"rgba(232,69,69,0.04)",borderRadius:16,border:"1px solid rgba(232,69,69,0.1)",padding:"22px"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center",marginBottom:6}}>{Ic.mail}<p style={{fontFamily:F.body,fontSize:15,fontWeight:700,color:C.text,margin:0}}>Únete a HanGo</p></div>
          <p style={{fontFamily:F.body,fontSize:12,color:C.textDim,margin:"0 0 12px"}}>Recursos gratis cada semana</p>
          {sub?<p style={{fontFamily:F.body,fontSize:14,color:C.green,margin:0,fontWeight:600}}>✓ ¡Bienvenido! 🎉</p>:
          <div style={{display:"flex",gap:8,maxWidth:360,margin:"0 auto"}}><input value={em} onChange={e=>setEm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&em.includes("@")&&(setSub(true),setEm(""))} placeholder="tu@email.com" style={{flex:1,fontFamily:F.body,fontSize:13,padding:"10px 14px",borderRadius:10,border:`1px solid ${C.border}`,background:"rgba(245,240,235,0.04)",color:C.text,outline:"none"}}/><button onClick={()=>em.includes("@")&&(setSub(true),setEm(""))} style={{fontFamily:F.body,fontSize:13,fontWeight:700,padding:"10px 18px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.red},${C.redDark})`,color:"white",cursor:"pointer"}}>Unirme</button></div>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

export default function HanGoApp(){
  const [page,setPage]=useState("home");
  useEffect(()=>{if(window.speechSynthesis){window.speechSynthesis.getVoices();window.speechSynthesis.onvoiceschanged=()=>{cachedVoice=null;getZhVoice();};}}, []);

  const nav=[{id:"home",icon:Ic.home,l:"Inicio"},{id:"chat",icon:Ic.chat,l:"Tutor"},{id:"convo",icon:Ic.convo,l:"小美"},{id:"stories",icon:Ic.story,l:"Historias"},{id:"strokes",icon:Ic.brush,l:"Trazos"},{id:"memes",icon:Ic.meme,l:"Memes"}];

  return(
    <div style={{minHeight:"100vh",background:C.bg}}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Outfit:wght@400;500;600;700;800&family=Noto+Serif+SC:wght@400;600;700;900&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:rgba(232,69,69,0.2);border-radius:3px;}::placeholder{color:#6A6259;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}@keyframes pulse{0%,80%,100%{transform:scale(.6);opacity:.3;}40%{transform:scale(1);opacity:1;}}@keyframes ring{0%{transform:scale(1);opacity:.5;}100%{transform:scale(1.3);opacity:0;}}`}</style>
      <nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(15,13,12,0.95)",backdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,padding:"4px 4px env(safe-area-inset-bottom,4px)",display:"flex",justifyContent:"center"}}>
        {nav.map(n=><button key={n.id} onClick={()=>setPage(n.id)} style={{fontFamily:F.body,fontSize:9,fontWeight:600,padding:"5px 6px",minWidth:44,border:"none",borderRadius:8,cursor:"pointer",background:page===n.id?(n.id==="convo"?"rgba(0,188,212,0.12)":"rgba(232,69,69,0.12)"):"transparent",color:page===n.id?(n.id==="convo"?C.teal:C.red):C.textDim,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>{n.icon}<span>{n.l}</span></button>)}
      </nav>
      {page==="home"&&<div style={{position:"fixed",bottom:50,left:0,right:0,textAlign:"center",padding:"6px 0",zIndex:99}}><a href="https://instagram.com/hangoworld" target="_blank" rel="noopener noreferrer" style={{fontFamily:F.body,fontSize:10,color:C.textDim,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:12,background:"rgba(245,240,235,0.03)",border:`1px solid ${C.border}`}}>{Ic.ig} @hangoworld</a></div>}
      <div style={{paddingBottom:60}}>
        {page==="home"&&<Home nav={setPage}/>}
        {page==="chat"&&<ChatSection/>}
        {page==="convo"&&<ConvoSection/>}
        {page==="stories"&&<StoriesSection/>}
        {page==="strokes"&&<StrokeSection/>}
        {page==="memes"&&<MemesSection/>}
      </div>
    </div>
  );
}
