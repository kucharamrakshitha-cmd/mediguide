import { useState, useRef, useEffect } from "react";
import {
  Search, Camera, Upload, MessageCircle, Pill, Bell, BookOpen, User,
  AlertTriangle, Shield, Plus, X, Loader2, Send, Sparkles, Activity,
  Heart, Trash2, Check, ChevronRight, Stethoscope, ScanLine, Clock,
  ArrowRight, RotateCcw, Info, Zap, Mic, MicOff, Volume2, VolumeX,
  LogOut, Eye, EyeOff, Lock, Mail, UserCircle
} from "lucide-react";

const C = {
  bg: "#F4EFE6", surface: "#FBF8F1", surfaceAlt: "#EFE9DC",
  primary: "#1F3A2E", primaryLight: "#2D5240", primarySoft: "#DDE5DA",
  accent: "#D4843C", accentSoft: "#F5E1CA",
  warning: "#B84A2E", warningSoft: "#F5DDD2",
  ink: "#1A1A1A", muted: "#6B6B6B", border: "#E5DFD2", white: "#FFFFFF"
};
const FONTS = {
  display: "'Fraunces', Georgia, serif",
  body: "'Plus Jakarta Sans', system-ui, sans-serif"
};

const MEDICINES = {
  paracetamol: { name: "Paracetamol", aliases: ["acetaminophen","crocin","dolo","dolo 650","calpol","tylenol","panadol"], category: "Analgesic / Antipyretic", composition: "Paracetamol (Acetaminophen)", purpose: "Relieves mild to moderate pain and reduces fever. Commonly taken for headaches, body aches, toothaches, and cold or flu symptoms.", dosage: "Adults: 500–1000 mg every 4–6 hours as needed. Do not exceed 4 grams (4000 mg) in a 24-hour period. Can be taken with or without food.", agePrecautions: [{group:"Infants under 3 months",text:"Only under a doctor's direct guidance."},{group:"Children",text:"Dose is weight-based, typically 10–15 mg per kg."},{group:"Elderly",text:"Standard dosing usually fine; monitor liver function."}], diseaseWarnings: [{condition:"Liver disease",text:"Avoid or use with extreme caution — paracetamol is processed by the liver."},{condition:"Heavy alcohol use",text:"Significantly increases risk of liver damage."},{condition:"Pregnancy",text:"Generally safe at recommended doses; consult doctor."}] },
  ibuprofen: { name: "Ibuprofen", aliases: ["brufen","advil","motrin","ibugesic"], category: "NSAID (Pain & Anti-inflammatory)", composition: "Ibuprofen", purpose: "Reduces pain, fever, and inflammation. Used for headaches, muscle aches, menstrual cramps, arthritis pain, and minor injuries.", dosage: "Adults: 200–400 mg every 4–6 hours. Maximum 1200 mg per day OTC. Take with food or milk to reduce stomach upset.", agePrecautions: [{group:"Under 6 months",text:"Not recommended."},{group:"Children 6 months+",text:"Weight-based dosing under medical guidance."},{group:"Elderly (65+)",text:"Higher risk of stomach and kidney side effects."}], diseaseWarnings: [{condition:"Stomach ulcers or acidity",text:"Can cause or worsen ulcers and bleeding."},{condition:"Kidney disease",text:"Can further reduce kidney function."},{condition:"Heart disease or high BP",text:"May raise cardiovascular risk."},{condition:"Pregnancy (third trimester)",text:"Avoid — can harm the developing baby."},{condition:"Asthma",text:"Can trigger attacks in sensitive individuals."}] },
  cetirizine: { name: "Cetirizine", aliases: ["zyrtec","cetzine","alerid","okacet"], category: "Antihistamine", composition: "Cetirizine Hydrochloride", purpose: "Treats allergy symptoms — runny nose, sneezing, itching, watery eyes, hives, and hay fever.", dosage: "Adults and children 12+: 10 mg once daily. Children 6–11: 5–10 mg daily. Best taken in evening if it makes you sleepy.", agePrecautions: [{group:"Under 2 years",text:"Only on doctor's advice."},{group:"Children 2–11",text:"Half adult dose; check pediatric formulation."},{group:"Elderly",text:"May cause more drowsiness; reduce if kidney function low."}], diseaseWarnings: [{condition:"Kidney disease",text:"Dose reduction often needed."},{condition:"Pregnancy & breastfeeding",text:"Consult doctor before use."},{condition:"Driving / machinery",text:"Can cause drowsiness — avoid alcohol."}] },
  amoxicillin: { name: "Amoxicillin", aliases: ["mox","amoxil","novamox"], category: "Antibiotic (Penicillin family)", composition: "Amoxicillin trihydrate", purpose: "Treats bacterial infections — ear, throat, sinus, urinary tract, skin, and dental infections. Does NOT work on viral infections.", dosage: "Adults: typically 500 mg every 8 hours. Children: weight-based. Always complete the full course.", agePrecautions: [{group:"Infants and children",text:"Pediatric dosing weight-based — measured by your doctor."},{group:"Elderly",text:"Standard dosing; adjust for kidney function."}], diseaseWarnings: [{condition:"Penicillin allergy",text:"DO NOT TAKE — can cause severe reactions."},{condition:"Kidney disease",text:"May need dose adjustment."},{condition:"Mononucleosis",text:"Can cause a widespread rash."}] },
  omeprazole: { name: "Omeprazole", aliases: ["omez","prilosec","ocid","lomac"], category: "Proton Pump Inhibitor", composition: "Omeprazole", purpose: "Reduces stomach acid. Used for acidity, heartburn, GERD, peptic ulcers, and to protect the stomach with certain medicines.", dosage: "Adults: 20 mg once daily, 30 minutes before breakfast. Swallow whole.", agePrecautions: [{group:"Children",text:"Used only under specialist care."},{group:"Elderly",text:"Long-term use may increase fracture risk and B12 deficiency."}], diseaseWarnings: [{condition:"Liver disease",text:"Dose reduction may be needed."},{condition:"Long-term use",text:"Affects calcium, magnesium, B12 absorption."},{condition:"Pregnancy",text:"Consult doctor."}] },
  metformin: { name: "Metformin", aliases: ["glycomet","glucophage","obimet"], category: "Antidiabetic", composition: "Metformin Hydrochloride", purpose: "First-line treatment for type 2 diabetes. Helps the body use insulin better and lowers blood sugar.", dosage: "Adults: typically 500 mg twice daily with meals, gradually increased. Max 2000 mg/day. Take with food.", agePrecautions: [{group:"Children 10+",text:"Used in pediatric type 2 diabetes under specialist care."},{group:"Elderly",text:"Caution — kidney function should be monitored."}], diseaseWarnings: [{condition:"Kidney disease",text:"Risk of lactic acidosis — may need to stop."},{condition:"Liver disease",text:"Generally avoided."},{condition:"Heavy alcohol use",text:"Increases lactic acidosis risk."},{condition:"Before surgery / contrast scans",text:"May need to be paused."}] },
  aspirin: { name: "Aspirin", aliases: ["disprin","ecosprin","asa","acetylsalicylic acid"], category: "NSAID / Antiplatelet", composition: "Acetylsalicylic Acid", purpose: "Relieves pain, reduces fever, and at low doses thins blood to prevent heart attacks and strokes in at-risk adults.", dosage: "Pain/fever (adults): 325–650 mg every 4 hours. Cardio: 75–100 mg daily, only if doctor-prescribed.", agePrecautions: [{group:"Children & teens with viral illness",text:"NEVER GIVE — risk of Reye's syndrome."},{group:"Adults",text:"Standard dosing; cardio doses doctor-prescribed."},{group:"Elderly",text:"Higher bleeding risk."}], diseaseWarnings: [{condition:"Bleeding disorders",text:"Significantly increases bleeding risk."},{condition:"Stomach ulcers",text:"Can cause severe bleeding."},{condition:"Asthma",text:"May trigger attacks."},{condition:"Pregnancy (third trimester)",text:"Avoid."},{condition:"Before surgery",text:"Usually stopped 7+ days prior."}] },
  azithromycin: { name: "Azithromycin", aliases: ["azithral","zithromax","azee"], category: "Antibiotic (Macrolide)", composition: "Azithromycin", purpose: "Treats bacterial infections of respiratory tract, skin, ear, and certain STIs.", dosage: "Adults: 500 mg day 1, then 250 mg once daily for 4 more days. Take 1 hour before or 2 hours after meals. Complete the full course.", agePrecautions: [{group:"Children",text:"Pediatric weight-based dosing under doctor."},{group:"Elderly",text:"Use with caution — heart rhythm issues possible."}], diseaseWarnings: [{condition:"Heart rhythm problems",text:"Can worsen the condition."},{condition:"Liver disease",text:"May need monitoring."},{condition:"Myasthenia gravis",text:"Can worsen muscle weakness."}] },
  combiflam: { name: "Combiflam", aliases: ["ibuprofen paracetamol combination"], category: "Combination Analgesic", composition: "Ibuprofen 400 mg + Paracetamol 325 mg", purpose: "Combined pain reliever and anti-inflammatory. Used for moderate pain, fever, and inflammation.", dosage: "Adults: 1 tablet every 6–8 hours, with food. Max 3 tablets in 24 hours.", agePrecautions: [{group:"Under 12 years",text:"Not recommended without medical advice."},{group:"Elderly",text:"Higher risk of stomach bleeding and kidney issues."}], diseaseWarnings: [{condition:"Stomach ulcers",text:"Avoid — high bleeding risk."},{condition:"Kidney disease",text:"Can worsen kidney function."},{condition:"Liver disease",text:"Paracetamol component is risky."},{condition:"Pregnancy (3rd trimester)",text:"Avoid."},{condition:"Heart disease / high BP",text:"Consult doctor first."}] },
  pantoprazole: { name: "Pantoprazole", aliases: ["pan","pantocid","protonix"], category: "Proton Pump Inhibitor", composition: "Pantoprazole sodium", purpose: "Reduces stomach acid. Used for acidity, GERD, ulcers, and to protect the stomach during NSAID use.", dosage: "Adults: 40 mg once daily, before breakfast. Swallow whole.", agePrecautions: [{group:"Children",text:"Specialist supervision required."},{group:"Elderly",text:"Generally well tolerated."}], diseaseWarnings: [{condition:"Liver disease",text:"Dose reduction may be needed."},{condition:"Long-term use",text:"May reduce calcium, magnesium, B12 absorption."}] },
  atorvastatin: { name: "Atorvastatin", aliases: ["lipitor","atorlip","storvas"], category: "Cholesterol-Lowering (Statin)", composition: "Atorvastatin Calcium", purpose: "Lowers LDL cholesterol; reduces risk of heart attack and stroke in at-risk adults.", dosage: "Adults: 10–80 mg once daily, in the evening. Dose set by doctor.", agePrecautions: [{group:"Children",text:"Specific genetic conditions only, under specialist."},{group:"Elderly",text:"Monitor for muscle pain and liver function."}], diseaseWarnings: [{condition:"Pregnancy & breastfeeding",text:"AVOID — can harm baby."},{condition:"Active liver disease",text:"Contraindicated."},{condition:"Heavy alcohol use",text:"Increases liver damage risk."},{condition:"Muscle pain or weakness",text:"Report immediately."}] },
  cough_syrup: { name: "Dextromethorphan (Cough Syrup)", aliases: ["benadryl dr","benylin","dextromethorphan","robitussin dm"], category: "Cough Suppressant", composition: "Dextromethorphan HBr", purpose: "Suppresses dry irritating cough. Not effective for productive coughs.", dosage: "Adults: 10–20 mg every 4 hours, max 120 mg/day. Children's doses lower.", agePrecautions: [{group:"Under 4 years",text:"NOT RECOMMENDED."},{group:"Children 4–11",text:"Only as directed by pediatrician."},{group:"Elderly",text:"May cause drowsiness or confusion."}], diseaseWarnings: [{condition:"Asthma or chronic bronchitis",text:"Suppressing cough can be harmful."},{condition:"Liver disease",text:"Use with caution."},{condition:"MAOI antidepressants",text:"Dangerous interaction — avoid."}] }
};

function lookupMedicine(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  for (const key in MEDICINES) {
    const m = MEDICINES[key];
    if (key === q || m.name.toLowerCase() === q) return m;
    if (m.aliases.some(a => a === q || q.includes(a) || a.includes(q))) return m;
  }
  for (const key in MEDICINES) {
    const m = MEDICINES[key];
    if (m.name.toLowerCase().includes(q) || q.includes(m.name.toLowerCase())) return m;
    if (m.aliases.some(a => a.includes(q) || q.includes(a))) return m;
  }
  return null;
}

const QUIZ_QUESTIONS = [
  { q: "What is paracetamol primarily used for?", options: ["Fighting bacterial infections","Relieving pain and reducing fever","Lowering cholesterol","Reducing stomach acid"], answer: 1, explain: "Paracetamol is a pain reliever and fever reducer." },
  { q: "Why should aspirin NEVER be given to a child with a viral illness?", options: ["It tastes bitter","It causes hair loss","It can cause Reye's syndrome — a rare but life-threatening condition","It's not strong enough"], answer: 2, explain: "Reye's syndrome causes swelling in liver and brain — strongly linked to aspirin in children with viral infections." },
  { q: "What does 'complete the full course' mean for antibiotics?", options: ["Stop when you feel better","Take only when symptoms appear","Take every prescribed dose for the full duration","Take until the bottle is empty"], answer: 2, explain: "Stopping early leaves resistant bacteria, leading to recurring infections and antibiotic resistance." },
  { q: "Which type of medicine commonly causes drowsiness?", options: ["Paracetamol","Vitamin C","Antihistamines like cetirizine","Omeprazole"], answer: 2, explain: "Antihistamines for allergies often cause drowsiness — labels warn about driving and alcohol." },
  { q: "Why tell your doctor about ALL medicines you take, including OTC and herbal?", options: ["Just paperwork","To check for harmful drug-drug interactions","So they charge more","To track shopping"], answer: 1, explain: "Many medicines and herbals interact dangerously. Your doctor needs the full list." },
  { q: "What does NSAID stand for, and why does it matter?", options: ["A type of antibiotic","Non-Steroidal Anti-Inflammatory Drug — share stomach and kidney risks","New Standard Adult Injection Drug","Natural Supplement Aiding Digestion"], answer: 1, explain: "NSAIDs like ibuprofen, aspirin, diclofenac share side effect risks. Don't combine two." },
  { q: "If you miss a dose, what's the general rule?", options: ["Take a double dose next time","Take it when remembered, unless near next dose — then skip","Stop the medicine","Crush extra tablets"], answer: 1, explain: "Doubling up risks overdose. Take if remembered soon, otherwise skip." }
];

const CONDITIONS = ["Diabetes","High Blood Pressure","Heart Disease","Asthma","Liver Disease","Kidney Disease","Stomach Ulcers","Thyroid Issues"];

async function callClaude(messages, opts = {}) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: opts.max_tokens || 1200,
      system: opts.system,
      messages
    })
  });
  const data = await response.json();
  if (!data.content) throw new Error("No content");
  return data.content.filter(b => b.type === "text").map(b => b.text).join("\n");
}

async function aiGenerateMedicineCard(name) {
  const system = `You are MediGuide. Generate JSON describing a medicine. Return ONLY JSON.
Shape: {"name":"","category":"","composition":"","purpose":"","dosage":"","agePrecautions":[{"group":"","text":""}],"diseaseWarnings":[{"condition":"","text":""}]}
If unknown: {"unknown": true, "name": "<input>"}`;
  const text = await callClaude([{ role: "user", content: `Medicine: "${name}"` }], { system, max_tokens: 1500 });
  const cleaned = text.replace(/```json|```/g, "").trim();
  try { return JSON.parse(cleaned); } catch { return { unknown: true, name }; }
}

async function aiAnalyzeMedicineImage(base64Data, mediaType) {
  const system = `Identify medicine name(s) in image. Return ONLY JSON: {"names":["..."],"notes":"..."}. None visible: {"names":[],"notes":"..."}`;
  const text = await callClaude([{
    role: "user",
    content: [
      { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
      { type: "text", text: "Identify medicine name(s) visible." }
    ]
  }], { system, max_tokens: 500 });
  const cleaned = text.replace(/```json|```/g, "").trim();
  try { return JSON.parse(cleaned); } catch { return { names: [], notes: "Could not parse." }; }
}

async function aiCheckInteractions(medicines) {
  const system = `Identify clinically significant drug-drug interactions. Return ONLY JSON: {"summary":"","interactions":[{"drugs":["A","B"],"severity":"high|moderate|low","description":"","advice":""}]}. None: interactions:[].`;
  const text = await callClaude([{ role: "user", content: `Check: ${medicines.join(", ")}` }], { system, max_tokens: 1500 });
  const cleaned = text.replace(/```json|```/g, "").trim();
  try { return JSON.parse(cleaned); } catch { return { summary: "Could not analyze.", interactions: [] }; }
}

// Voice hooks
function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (e) => {
      let txt = "";
      for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
      setTranscript(txt);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recognitionRef.current = r;
    return () => { try { r.stop(); } catch {} };
  }, []);

  function start() {
    if (!recognitionRef.current) return;
    setTranscript("");
    try { recognitionRef.current.start(); setListening(true); } catch (e) {}
  }
  function stop() { try { recognitionRef.current?.stop(); } catch {}; setListening(false); }
  return { listening, transcript, supported, start, stop, setTranscript };
}

function speak(text, opts = {}) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = opts.rate || 0.95;
  u.pitch = opts.pitch || 1;
  u.volume = opts.volume || 1;
  u.lang = "en-US";
  window.speechSynthesis.speak(u);
  return u;
}
function stopSpeaking() { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }

export default function MediGuide() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("lookup");
  const [profile, setProfile] = useState({ age: "", conditions: [], allergies: "", pregnant: false });
  const [alarms, setAlarms] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [voiceMode, setVoiceMode] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, []);

  if (!user) return <AuthPage onLogin={(u) => setUser(u)} />;

  const tabs = [
    { id: "lookup", label: "Lookup", icon: Search },
    { id: "chat", label: "Ask AI", icon: MessageCircle },
    { id: "interactions", label: "Interactions", icon: Activity },
    { id: "alarms", label: "Alarms", icon: Bell },
    { id: "quiz", label: "Quiz", icon: BookOpen },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: FONTS.body, color: C.ink,
      backgroundImage: `radial-gradient(circle at 20% 10%, ${C.primarySoft}40 0%, transparent 40%), radial-gradient(circle at 80% 90%, ${C.accentSoft}30 0%, transparent 40%)`
    }}>
      <header style={{
        borderBottom: `1px solid ${C.border}`, background: `${C.surface}CC`,
        backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 50
      }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Stethoscope size={20} color={C.accent} strokeWidth={2.2} />
            </div>
            <div>
              <h1 style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 22, letterSpacing: "-0.02em", lineHeight: 1, color: C.primary }}>MediGuide</h1>
              <p style={{ fontSize: 11, color: C.muted, marginTop: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>Hi, {user.name.split(" ")[0]} · Stay aware</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => { setVoiceMode(!voiceMode); stopSpeaking(); }} title="Toggle voice" style={{
              background: voiceMode ? C.accent : "transparent",
              border: `1px solid ${voiceMode ? C.accent : C.border}`,
              color: voiceMode ? C.white : C.ink,
              padding: "7px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 5
            }}>
              {voiceMode ? <Volume2 size={13} /> : <VolumeX size={13} />}
              Voice {voiceMode ? "On" : "Off"}
            </button>
            <button onClick={() => { setUser(null); stopSpeaking(); }} title="Sign out" style={{
              background: "transparent", border: `1px solid ${C.border}`, color: C.muted,
              padding: 7, borderRadius: 999, cursor: "pointer", display: "flex"
            }}><LogOut size={14} /></button>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-3 pb-2" style={{ overflowX: "auto" }}>
          <div className="flex gap-1" style={{ minWidth: "fit-content" }}>
            {tabs.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => { setTab(t.id); stopSpeaking(); }} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                  whiteSpace: "nowrap", transition: "all 0.2s",
                  background: active ? C.primary : "transparent",
                  color: active ? C.surface : C.ink,
                  border: `1px solid ${active ? C.primary : "transparent"}`,
                  cursor: "pointer"
                }}>
                  <Icon size={14} />{t.label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">
        {tab === "lookup" && <LookupTab profile={profile} voiceMode={voiceMode} />}
        {tab === "chat" && <ChatTab profile={profile} chatHistory={chatHistory} setChatHistory={setChatHistory} voiceMode={voiceMode} />}
        {tab === "interactions" && <InteractionsTab />}
        {tab === "alarms" && <AlarmsTab alarms={alarms} setAlarms={setAlarms} />}
        {tab === "quiz" && <QuizTab />}
        {tab === "profile" && <ProfileTab profile={profile} setProfile={setProfile} />}
      </main>

      <footer style={{ borderTop: `1px solid ${C.border}`, background: C.surface, marginTop: 40, padding: "20px 20px 24px" }}>
        <div className="max-w-6xl mx-auto flex items-start gap-3" style={{ fontSize: 12, color: C.muted }}>
          <Shield size={16} color={C.primary} style={{ flexShrink: 0, marginTop: 2 }} />
          <p><strong style={{ color: C.primary }}>MediGuide is for educational awareness only.</strong> It does not replace professional medical advice. Always consult a qualified doctor or pharmacist.</p>
        </div>
      </footer>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  function submit() {
    setError("");
    if (mode === "signup" && !name.trim()) return setError("Please enter your name.");
    if (!email.includes("@") || !email.includes(".")) return setError("Please enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    onLogin({ name: name.trim() || email.split("@")[0], email });
  }

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: FONTS.body,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      backgroundImage: `radial-gradient(circle at 20% 10%, ${C.primarySoft}60 0%, transparent 45%), radial-gradient(circle at 80% 90%, ${C.accentSoft}50 0%, transparent 45%)`
    }}>
      <div style={{
        width: "100%", maxWidth: 440, background: C.surface,
        border: `1px solid ${C.border}`, borderRadius: 24,
        padding: "40px 32px", boxShadow: "0 20px 60px rgba(31, 58, 46, 0.08)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: C.primary, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <Stethoscope size={28} color={C.accent} strokeWidth={2.2} />
          </div>
          <h1 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 32, letterSpacing: "-0.02em", lineHeight: 1.1, color: C.primary, marginBottom: 6 }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p style={{ color: C.muted, fontSize: 14 }}>
            {mode === "login" ? "Sign in to continue your safe medicine journey" : "Start understanding your medicines, the smart way"}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "signup" && <AuthField icon={UserCircle} placeholder="Full name" value={name} onChange={setName} />}
          <AuthField icon={Mail} placeholder="Email address" value={email} onChange={setEmail} type="email" />
          <AuthField icon={Lock} placeholder="Password" value={password} onChange={setPassword}
            type={showPwd ? "text" : "password"} rightIcon={showPwd ? EyeOff : Eye}
            onRightClick={() => setShowPwd(!showPwd)} />
        </div>

        {error && (
          <div style={{ marginTop: 14, background: C.warningSoft, color: C.warning, padding: "10px 14px", borderRadius: 10, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        <button onClick={submit} style={{
          width: "100%", marginTop: 20, background: C.primary, color: C.surface,
          border: "none", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 600,
          cursor: "pointer", fontFamily: FONTS.body,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6
        }}>
          {mode === "login" ? "Sign in" : "Create account"} <ArrowRight size={16} />
        </button>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: C.muted }}>
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} style={{
            background: "none", border: "none", color: C.accent, fontWeight: 600,
            cursor: "pointer", fontFamily: FONTS.body, fontSize: 13, padding: 0
          }}>
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </div>

        <div style={{
          marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 11, color: C.muted, lineHeight: 1.5
        }}>
          <Shield size={14} color={C.primary} style={{ flexShrink: 0 }} />
          <span>Your information stays on this device. Educational awareness only — always consult a doctor.</span>
        </div>
      </div>
    </div>
  );
}

function AuthField({ icon: Icon, placeholder, value, onChange, type = "text", rightIcon: RightIcon, onRightClick }) {
  return (
    <div style={{ display: "flex", alignItems: "center", background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "0 14px" }}>
      <Icon size={16} color={C.muted} />
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ flex: 1, border: "none", outline: "none", padding: "13px 12px", fontSize: 14, fontFamily: FONTS.body, background: "transparent", color: C.ink }} />
      {RightIcon && <button onClick={onRightClick} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4 }}><RightIcon size={16} /></button>}
    </div>
  );
}

function LookupTab({ profile, voiceMode }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef(null);
  const voice = useSpeechRecognition();

  useEffect(() => { if (voice.transcript) setQuery(voice.transcript); }, [voice.transcript]);
  useEffect(() => {
    if (!voice.listening && voice.transcript) {
      const t = voice.transcript;
      voice.setTranscript("");
      handleSearch(t);
    }
    // eslint-disable-next-line
  }, [voice.listening]);

  async function handleSearch(name) {
    if (!name?.trim()) return;
    setError(""); setResult(null);
    const local = lookupMedicine(name);
    if (local) {
      setResult(local);
      if (voiceMode) speak(`Here's information about ${local.name}. ${local.purpose}`);
      return;
    }
    setLoading(true);
    try {
      const ai = await aiGenerateMedicineCard(name);
      if (ai.unknown) setError(`We couldn't find detailed info on "${name}". Try another spelling or the active ingredient.`);
      else { setResult(ai); if (voiceMode) speak(`Here's information about ${ai.name}. ${ai.purpose}`); }
    } catch (e) { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  async function handleImageFile(file) {
    if (!file) return;
    setScanning(true); setError(""); setResult(null);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result.split(",")[1]);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const detected = await aiAnalyzeMedicineImage(base64, file.type || "image/jpeg");
      if (detected.names && detected.names.length > 0) {
        setQuery(detected.names[0]);
        await handleSearch(detected.names[0]);
      } else setError(detected.notes || "Could not identify a medicine in this image.");
    } catch (e) { setError("Couldn't analyze the image."); }
    finally { setScanning(false); }
  }

  return (
    <div className="space-y-6">
      <section style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${C.accentSoft} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <p style={{ fontSize: 12, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Find your medicine</p>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 32, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.primary, marginBottom: 4, maxWidth: 560 }}>
            What's in that little tablet?
          </h2>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 20, maxWidth: 520 }}>
            Type, speak, or scan. We'll explain it in plain language.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{
              flex: 1, minWidth: 240, display: "flex", alignItems: "center",
              background: C.white, border: `1px solid ${voice.listening ? C.accent : C.border}`,
              borderRadius: 12, padding: "0 14px", transition: "border-color 0.2s"
            }}>
              <Search size={18} color={C.muted} />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch(query)}
                placeholder={voice.listening ? "Listening…" : "e.g. paracetamol, dolo 650"}
                style={{ flex: 1, border: "none", outline: "none", padding: "14px 12px", fontSize: 15, fontFamily: FONTS.body, background: "transparent", color: C.ink }} />
              {voice.supported && (
                <button onClick={() => voice.listening ? voice.stop() : voice.start()} title={voice.listening ? "Stop" : "Speak"} style={{
                  background: voice.listening ? C.accent : "transparent",
                  color: voice.listening ? C.white : C.muted,
                  border: "none", borderRadius: "50%", width: 32, height: 32,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0,
                  animation: voice.listening ? "pulse 1.4s infinite" : "none"
                }}>
                  {voice.listening ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
              )}
            </div>
            <button onClick={() => handleSearch(query)} disabled={loading || !query.trim()} style={{
              background: C.primary, color: C.surface, padding: "0 22px", borderRadius: 12,
              fontSize: 14, fontWeight: 600, border: "none", cursor: loading ? "wait" : "pointer",
              opacity: loading || !query.trim() ? 0.5 : 1, display: "flex", alignItems: "center", gap: 6
            }}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              Search
            </button>
            <button onClick={() => fileInputRef.current?.click()} disabled={scanning} style={{
              background: C.accent, color: C.white, padding: "0 18px", borderRadius: 12,
              fontSize: 14, fontWeight: 600, border: "none", cursor: scanning ? "wait" : "pointer",
              display: "flex", alignItems: "center", gap: 6
            }}>
              {scanning ? <Loader2 size={16} className="animate-spin" /> : <ScanLine size={16} />}
              Scan
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={e => handleImageFile(e.target.files?.[0])} style={{ display: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.muted }}>Try:</span>
            {["Paracetamol","Ibuprofen","Cetirizine","Metformin"].map(s => (
              <button key={s} onClick={() => { setQuery(s); handleSearch(s); }} style={{
                fontSize: 12, padding: "5px 12px", borderRadius: 999,
                background: C.primarySoft, color: C.primary, border: `1px solid ${C.border}`,
                cursor: "pointer", fontWeight: 500
              }}>{s}</button>
            ))}
            {!voice.supported && <span style={{ fontSize: 11, color: C.muted, marginLeft: "auto" }}>ⓘ Voice needs Chrome/Edge/Safari</span>}
          </div>
          {voice.listening && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: C.accentSoft, borderRadius: 10, fontSize: 13, color: C.warning, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.warning, animation: "pulse 1s infinite" }} />
              Listening... say a medicine name
            </div>
          )}
        </div>
      </section>

      {(loading || scanning) && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40, textAlign: "center", color: C.muted, fontSize: 14 }}>
          <Loader2 size={28} className="animate-spin mx-auto mb-3" color={C.primary} />
          <p>{scanning ? "Analyzing the image…" : "Looking up that medicine…"}</p>
        </div>
      )}

      {error && !loading && !scanning && (
        <div style={{ background: C.warningSoft, border: `1px solid ${C.warning}40`, color: C.warning, borderRadius: 12, padding: "14px 18px", fontSize: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Info size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{error}</span>
        </div>
      )}

      {result && !loading && <MedicineCard medicine={result} profile={profile} />}
    </div>
  );
}

function MedicineCard({ medicine, profile }) {
  const [reading, setReading] = useState(false);
  const personalized = [];
  if (profile.age) {
    const age = parseInt(profile.age);
    if (!isNaN(age)) {
      medicine.agePrecautions?.forEach(p => {
        const t = p.group.toLowerCase();
        if ((t.includes("infant") && age < 2) || (t.includes("under 6 months") && age < 1) ||
            (t.includes("child") && age < 12 && age > 1) || (t.includes("under 2") && age < 2) ||
            (t.includes("under 4") && age < 4) || (t.includes("under 12") && age < 12) ||
            (t.includes("teen") && age >= 10 && age <= 19) || (t.includes("elderly") && age >= 65)) {
          personalized.push({ ...p, type: "age" });
        }
      });
    }
  }
  if (profile.conditions?.length) {
    medicine.diseaseWarnings?.forEach(w => {
      profile.conditions.forEach(c => {
        if (w.condition.toLowerCase().includes(c.toLowerCase()) ||
            c.toLowerCase().includes(w.condition.toLowerCase().split(" ")[0])) {
          personalized.push({ ...w, type: "condition", matched: c });
        }
      });
    });
  }
  if (profile.pregnant) {
    medicine.diseaseWarnings?.forEach(w => {
      if (w.condition.toLowerCase().includes("pregnan")) personalized.push({ ...w, type: "pregnancy" });
    });
  }

  function readAloud() {
    if (reading) { stopSpeaking(); setReading(false); return; }
    const text = `${medicine.name}. ${medicine.purpose} Dosage: ${medicine.dosage} ` +
      (personalized.length > 0 ? `Important warning for you: ${personalized.map(p => p.text).join(" ")}` : "");
    const u = speak(text);
    setReading(true);
    if (u) u.onend = () => setReading(false);
  }

  return (
    <article style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden" }}>
      <div style={{ background: C.primary, padding: "20px 28px", color: C.surface, position: "relative" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, fontWeight: 600 }}>{medicine.category || "Medicine"}</p>
        <h3 style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 4, paddingRight: 90 }}>{medicine.name}</h3>
        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85, display: "flex", alignItems: "center", gap: 6 }}>
          <Pill size={12} /><span>{medicine.composition}</span>
        </div>
        <button onClick={readAloud} style={{
          position: "absolute", top: 20, right: 20,
          background: reading ? C.accent : "transparent", color: C.surface,
          border: `1px solid ${C.surface}40`, borderRadius: 999, padding: "6px 12px",
          fontSize: 12, fontWeight: 500, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 5
        }}>
          {reading ? <VolumeX size={12} /> : <Volume2 size={12} />}
          {reading ? "Stop" : "Listen"}
        </button>
      </div>

      {personalized.length > 0 && (
        <div style={{ background: C.warningSoft, borderBottom: `1px solid ${C.warning}30`, padding: "16px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={16} color={C.warning} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.warning, letterSpacing: "0.02em" }}>Important for you, based on your profile</span>
          </div>
          <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {personalized.map((p, i) => (
              <li key={i} style={{ fontSize: 13, color: C.ink, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ fontSize: 10, background: C.warning, color: C.white, padding: "2px 8px", borderRadius: 999, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em", flexShrink: 0, marginTop: 1 }}>{p.type}</span>
                <span><strong>{p.group || p.condition}:</strong> {p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 22 }}>
        <Section title="What it's for" icon={Heart}><p style={{ fontSize: 14, lineHeight: 1.65 }}>{medicine.purpose}</p></Section>
        <Section title="General dosage guidance" icon={Pill}>
          <p style={{ fontSize: 14, lineHeight: 1.65 }}>{medicine.dosage}</p>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 8, fontStyle: "italic" }}>Always follow the dose your doctor or pharmacist gives you.</p>
        </Section>
        {medicine.agePrecautions?.length > 0 && (
          <Section title="Age-based precautions" icon={User}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {medicine.agePrecautions.map((p, i) => (
                <div key={i} style={{ background: C.surfaceAlt, borderRadius: 10, padding: "10px 14px", fontSize: 13, lineHeight: 1.5 }}>
                  <strong style={{ color: C.primary }}>{p.group}: </strong>{p.text}
                </div>
              ))}
            </div>
          </Section>
        )}
        {medicine.diseaseWarnings?.length > 0 && (
          <Section title="Disease-specific warnings" icon={AlertTriangle}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {medicine.diseaseWarnings.map((w, i) => (
                <div key={i} style={{ background: C.surfaceAlt, borderLeft: `3px solid ${C.accent}`, borderRadius: 6, padding: "10px 14px", fontSize: 13, lineHeight: 1.5 }}>
                  <strong style={{ color: C.primary }}>{w.condition}: </strong>{w.text}
                </div>
              ))}
            </div>
          </Section>
        )}
        <div style={{ background: C.primarySoft, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12, color: C.primary, lineHeight: 1.55 }}>
          <Shield size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>This is educational information, not a prescription.</span>
        </div>
      </div>
    </article>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon size={14} color={C.accent} />
        <h4 style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: C.muted }}>{title}</h4>
      </div>
      {children}
    </div>
  );
}

function ChatTab({ profile, chatHistory, setChatHistory, voiceMode }) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const voice = useSpeechRecognition();

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [chatHistory, sending]);
  useEffect(() => { if (voice.transcript) setInput(voice.transcript); }, [voice.transcript]);
  useEffect(() => {
    if (!voice.listening && voice.transcript) {
      const t = voice.transcript;
      voice.setTranscript("");
      setTimeout(() => sendMessage(t), 100);
    }
    // eslint-disable-next-line
  }, [voice.listening]);

  async function sendMessage(text) {
    const messageText = (text || input).trim();
    if (!messageText || sending) return;
    const userMsg = { role: "user", content: messageText };
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setInput("");
    setSending(true);

    const profileNote = (profile.age || profile.conditions?.length || profile.pregnant)
      ? `User profile: ${profile.age ? `age ${profile.age}` : ""}${profile.conditions?.length ? `, conditions: ${profile.conditions.join(", ")}` : ""}${profile.pregnant ? ", pregnant" : ""}${profile.allergies ? `, allergies: ${profile.allergies}` : ""}.`
      : "No profile.";

    const system = `You are MediGuide, a friendly plain-language medicine assistant. ${profileNote} Tailor warnings. End serious answers with reminder to consult a doctor. Concise (2-5 short paragraphs). Educational only.`;

    try {
      const reply = await callClaude(newHistory.map(m => ({ role: m.role, content: m.content })), { system, max_tokens: 800 });
      setChatHistory([...newHistory, { role: "assistant", content: reply }]);
      if (voiceMode) speak(reply);
    } catch (e) {
      setChatHistory([...newHistory, { role: "assistant", content: "Sorry — couldn't reach the AI service. Please try again." }]);
    } finally { setSending(false); }
  }

  const suggestions = ["Can I take paracetamol with ibuprofen?", "What to avoid on antibiotics?", "Is coffee okay with cetirizine?", "What does 'empty stomach' mean?"];

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(100vh - 220px)", minHeight: 500 }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 11, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>AI Companion</p>
          <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 500, color: C.primary, marginTop: 2 }}>Ask anything about medicines</h2>
        </div>
        {voiceMode && <span style={{ fontSize: 11, color: C.accent, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Volume2 size={12} /> Voice replies on</span>}
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {chatHistory.length === 0 && (
          <div>
            <div style={{ background: C.surfaceAlt, borderRadius: 14, padding: "16px 18px", fontSize: 14, color: C.ink, marginBottom: 16 }}>
              <Sparkles size={16} color={C.accent} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
              Hi! Tap the mic and ask out loud, or type below. <strong>Educational answers only — not prescriptions.</strong>
            </div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Try asking:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => setInput(s)} style={{ fontSize: 12, padding: "8px 12px", borderRadius: 999, background: C.white, border: `1px solid ${C.border}`, color: C.ink, cursor: "pointer", textAlign: "left" }}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%",
            background: m.role === "user" ? C.primary : C.surfaceAlt,
            color: m.role === "user" ? C.surface : C.ink,
            padding: "12px 16px", borderRadius: 14, fontSize: 14, lineHeight: 1.6,
            whiteSpace: "pre-wrap", position: "relative"
          }}>
            {m.content}
            {m.role === "assistant" && (
              <button onClick={() => speak(m.content)} title="Read aloud" style={{
                marginTop: 8, background: "transparent", border: `1px solid ${C.border}`,
                borderRadius: 999, padding: "3px 10px", fontSize: 11, color: C.muted,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 4
              }}><Volume2 size={11} /> Listen</button>
            )}
          </div>
        ))}

        {sending && (
          <div style={{ alignSelf: "flex-start", background: C.surfaceAlt, padding: "12px 16px", borderRadius: 14, fontSize: 14, color: C.muted, display: "flex", alignItems: "center", gap: 8 }}>
            <Loader2 size={14} className="animate-spin" /> thinking…
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, padding: 14 }}>
        {voice.listening && (
          <div style={{ marginBottom: 10, padding: "8px 12px", background: C.accentSoft, borderRadius: 10, fontSize: 12, color: C.warning, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.warning, animation: "pulse 1s infinite" }} />
            Listening... ask your question
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", background: C.white, border: `1px solid ${voice.listening ? C.accent : C.border}`, borderRadius: 12, padding: "0 6px 0 14px" }}>
          {voice.supported && (
            <button onClick={() => voice.listening ? voice.stop() : voice.start()} title={voice.listening ? "Stop" : "Speak"} style={{
              background: voice.listening ? C.accent : "transparent",
              color: voice.listening ? C.white : C.muted, border: "none", borderRadius: "50%",
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0
            }}>
              {voice.listening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
          )}
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder={voice.listening ? "Listening…" : "Ask about a medicine, side effects…"}
            style={{ flex: 1, border: "none", outline: "none", padding: "12px 8px", fontSize: 14, background: "transparent", color: C.ink, fontFamily: FONTS.body }} />
          <button onClick={() => sendMessage()} disabled={!input.trim() || sending} style={{
            background: C.primary, color: C.surface, border: "none", borderRadius: 8,
            padding: "8px 12px", cursor: input.trim() && !sending ? "pointer" : "default",
            opacity: input.trim() && !sending ? 1 : 0.4,
            display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600
          }}><Send size={14} /></button>
        </div>
      </div>
    </div>
  );
}

function InteractionsTab() {
  const [meds, setMeds] = useState([]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function addMed() { const v = input.trim(); if (!v || meds.includes(v)) return; setMeds([...meds, v]); setInput(""); setResult(null); }
  function removeMed(m) { setMeds(meds.filter(x => x !== m)); setResult(null); }
  async function check() {
    if (meds.length < 2) return;
    setLoading(true); setResult(null);
    try { setResult(await aiCheckInteractions(meds)); }
    catch (e) { setResult({ summary: "Couldn't analyze.", interactions: [] }); }
    finally { setLoading(false); }
  }

  const sevColor = { high: C.warning, moderate: C.accent, low: C.primary };

  return (
    <div className="space-y-6">
      <section style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
        <p style={{ fontSize: 11, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Drug Interaction Checker</p>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 500, color: C.primary, lineHeight: 1.2, marginBottom: 4 }}>Add your medicines, we'll check for clashes</h2>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Add 2 or more medicines below.</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addMed()} placeholder="Type a medicine name and press Add"
            style={{ flex: 1, border: `1px solid ${C.border}`, outline: "none", padding: "12px 14px", borderRadius: 10, background: C.white, fontSize: 14, color: C.ink, fontFamily: FONTS.body }} />
          <button onClick={addMed} disabled={!input.trim()} style={{ background: C.primary, color: C.surface, border: "none", padding: "0 18px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: input.trim() ? 1 : 0.5, display: "flex", alignItems: "center", gap: 4 }}>
            <Plus size={16} /> Add
          </button>
        </div>
        {meds.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {meds.map(m => (
              <span key={m} style={{ background: C.primarySoft, color: C.primary, padding: "6px 10px 6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                {m}
                <button onClick={() => removeMed(m)} style={{ background: C.primary, color: C.surface, border: "none", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
        <button onClick={check} disabled={meds.length < 2 || loading} style={{
          background: meds.length >= 2 ? C.accent : C.border, color: C.white, border: "none",
          padding: "12px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600,
          cursor: meds.length >= 2 && !loading ? "pointer" : "default",
          display: "flex", alignItems: "center", gap: 8
        }}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
          Check interactions
        </button>
      </section>

      {result && (
        <section style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
          <h3 style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 500, color: C.primary, marginBottom: 8 }}>Analysis</h3>
          <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.6, marginBottom: 16 }}>{result.summary}</p>
          {result.interactions?.length === 0 ? (
            <div style={{ background: C.primarySoft, color: C.primary, padding: 14, borderRadius: 10, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <Check size={16} /> No major interactions found.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {result.interactions.map((i, idx) => (
                <div key={idx} style={{ border: `1px solid ${sevColor[i.severity] || C.border}40`, borderLeft: `4px solid ${sevColor[i.severity] || C.muted}`, borderRadius: 10, padding: "12px 16px", background: C.surfaceAlt }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, background: sevColor[i.severity] || C.muted, color: C.white, padding: "2px 8px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.05em" }}>{i.severity || "info"}</span>
                    <strong style={{ color: C.primary, fontSize: 14 }}>{i.drugs?.join(" + ")}</strong>
                  </div>
                  <p style={{ fontSize: 13, color: C.ink, lineHeight: 1.55, marginBottom: 6 }}>{i.description}</p>
                  {i.advice && <p style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>→ {i.advice}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function AlarmsTab({ alarms, setAlarms }) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [freq, setFreq] = useState("Daily");
  const [notes, setNotes] = useState("");

  function add() {
    if (!name.trim() || !time) return;
    setAlarms([...alarms, { id: Date.now(), name: name.trim(), time, freq, notes: notes.trim() }]);
    setName(""); setTime(""); setNotes(""); setFreq("Daily");
  }
  function remove(id) { setAlarms(alarms.filter(a => a.id !== id)); }

  return (
    <div className="space-y-6">
      <section style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
        <p style={{ fontSize: 11, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Medication Tracker</p>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 500, color: C.primary, lineHeight: 1.2, marginBottom: 16 }}>Set a reminder so you never miss a dose</h2>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          <Field label="Medicine name"><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Metformin" style={inputStyle} /></Field>
          <Field label="Time"><input type="time" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} /></Field>
          <Field label="Frequency"><select value={freq} onChange={e => setFreq(e.target.value)} style={inputStyle}>
            <option>Daily</option><option>Twice Daily</option><option>Three Times Daily</option><option>Weekly</option><option>As Needed</option>
          </select></Field>
        </div>
        <div style={{ marginTop: 12 }}>
          <Field label="Notes (optional)"><input value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. take with food" style={inputStyle} /></Field>
        </div>
        <button onClick={add} disabled={!name.trim() || !time} style={{
          marginTop: 16, background: C.primary, color: C.surface, border: "none",
          padding: "12px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600,
          cursor: name.trim() && time ? "pointer" : "default",
          opacity: name.trim() && time ? 1 : 0.5, display: "flex", alignItems: "center", gap: 6
        }}><Plus size={16} /> Add reminder</button>
      </section>

      {alarms.length > 0 && (
        <section>
          <h3 style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 500, color: C.primary, marginBottom: 12 }}>Your reminders</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alarms.map(a => (
              <div key={a.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: C.primarySoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={20} color={C.primary} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{a.time} · {a.freq}{a.notes ? ` · ${a.notes}` : ""}</div>
                </div>
                <button onClick={() => remove(a.id)} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, cursor: "pointer", color: C.warning }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {alarms.length === 0 && (
        <div style={{ background: C.surface, border: `1px dashed ${C.border}`, borderRadius: 16, padding: 28, textAlign: "center", color: C.muted, fontSize: 14 }}>
          <Bell size={28} color={C.muted} style={{ margin: "0 auto 8px" }} />
          No reminders yet.
        </div>
      )}
    </div>
  );
}

function QuizTab() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [shuffled, setShuffled] = useState(QUIZ_QUESTIONS);

  useEffect(() => { setShuffled([...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5)); }, []);
  const q = shuffled[idx];

  function pick(i) { if (picked !== null) return; setPicked(i); if (i === q.answer) setScore(score + 1); }
  function next() { if (idx + 1 < shuffled.length) { setIdx(idx + 1); setPicked(null); } else setDone(true); }
  function reset() { setShuffled([...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5)); setIdx(0); setPicked(null); setScore(0); setDone(false); }

  if (done) {
    const pct = Math.round((score / shuffled.length) * 100);
    return (
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 40, textAlign: "center" }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 64, fontWeight: 600, color: C.primary, lineHeight: 1 }}>{pct}%</div>
        <p style={{ marginTop: 8, fontSize: 16 }}>You got <strong>{score} of {shuffled.length}</strong> right.</p>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 12, maxWidth: 400, margin: "12px auto 0" }}>
          {pct >= 80 ? "Excellent — you're a savvy medicine user!" : pct >= 60 ? "Solid foundation. Keep learning." : "Worth brushing up — knowing your medicines keeps you safer."}
        </p>
        <button onClick={reset} style={{ marginTop: 20, background: C.primary, color: C.surface, border: "none", padding: "12px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <RotateCcw size={14} /> Play again
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Awareness Quiz</p>
        <span style={{ fontSize: 12, color: C.muted }}>Q{idx + 1}/{shuffled.length} · Score: {score}</span>
      </div>
      <div style={{ height: 4, background: C.border, borderRadius: 999, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ height: "100%", width: `${((idx + (picked !== null ? 1 : 0)) / shuffled.length) * 100}%`, background: C.accent, transition: "width 0.4s" }} />
      </div>
      <h3 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 500, color: C.primary, lineHeight: 1.3, marginBottom: 20, letterSpacing: "-0.01em" }}>{q.q}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = picked !== null && i === q.answer;
          const isWrongPick = isPicked && i !== q.answer;
          const bg = isCorrect ? C.primarySoft : isWrongPick ? C.warningSoft : C.surfaceAlt;
          const border = isCorrect ? C.primary : isWrongPick ? C.warning : C.border;
          return (
            <button key={i} onClick={() => pick(i)} disabled={picked !== null} style={{
              background: bg, border: `1px solid ${border}`, borderRadius: 12,
              padding: "14px 16px", fontSize: 14, textAlign: "left", color: C.ink,
              cursor: picked === null ? "pointer" : "default", fontFamily: FONTS.body,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 10, transition: "all 0.2s"
            }}>
              <span>{opt}</span>
              {isCorrect && <Check size={18} color={C.primary} />}
              {isWrongPick && <X size={18} color={C.warning} />}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div style={{ marginTop: 18, background: C.surfaceAlt, borderLeft: `3px solid ${picked === q.answer ? C.primary : C.accent}`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.ink, lineHeight: 1.55 }}>
          <strong>{picked === q.answer ? "Correct! " : "Not quite. "}</strong>{q.explain}
        </div>
      )}
      {picked !== null && (
        <button onClick={next} style={{ marginTop: 20, background: C.primary, color: C.surface, border: "none", padding: "12px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
          {idx + 1 < shuffled.length ? "Next question" : "See results"}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

function ProfileTab({ profile, setProfile }) {
  function toggleCondition(c) {
    const has = profile.conditions.includes(c);
    setProfile({ ...profile, conditions: has ? profile.conditions.filter(x => x !== c) : [...profile.conditions, c] });
  }

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
      <p style={{ fontSize: 11, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Your Profile</p>
      <h2 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 500, color: C.primary, lineHeight: 1.2, marginBottom: 4 }}>Personalize your warnings</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 24, maxWidth: 500 }}>Share a few things so we can highlight medicine warnings that matter for you.</p>
      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <Field label="Age"><input type="number" value={profile.age} onChange={e => setProfile({ ...profile, age: e.target.value })} placeholder="e.g. 28" style={inputStyle} /></Field>
        <Field label="Known allergies"><input value={profile.allergies} onChange={e => setProfile({ ...profile, allergies: e.target.value })} placeholder="e.g. penicillin" style={inputStyle} /></Field>
      </div>
      <div style={{ marginTop: 22 }}>
        <label style={labelStyle}>Health conditions</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {CONDITIONS.map(c => {
            const on = profile.conditions.includes(c);
            return (
              <button key={c} onClick={() => toggleCondition(c)} style={{
                padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                background: on ? C.primary : C.white, color: on ? C.surface : C.ink,
                border: `1px solid ${on ? C.primary : C.border}`,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 5
              }}>
                {on && <Check size={12} />}{c}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 22 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input type="checkbox" checked={profile.pregnant} onChange={e => setProfile({ ...profile, pregnant: e.target.checked })} style={{ width: 18, height: 18, accentColor: C.primary }} />
          <span style={{ fontSize: 14 }}>I am currently pregnant</span>
        </label>
      </div>
      <div style={{ marginTop: 28, background: C.primarySoft, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: C.primary, lineHeight: 1.55 }}>
        <Shield size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>When you look up a medicine, MediGuide highlights age, condition, and pregnancy warnings just for you.</span>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: C.muted, display: "block" };
const inputStyle = { width: "100%", border: `1px solid ${C.border}`, outline: "none", padding: "10px 12px", borderRadius: 10, background: C.white, fontSize: 14, color: C.ink, fontFamily: FONTS.body, boxSizing: "border-box" };

function Field({ label, children }) {
  return <div><label style={labelStyle}>{label}</label><div style={{ marginTop: 6 }}>{children}</div></div>;
}
