import { useState, useEffect, useCallback, useRef } from "react";

const HIRAGANA = [
  { char: "あ", romaji: "a" }, { char: "い", romaji: "i" }, { char: "う", romaji: "u" }, { char: "え", romaji: "e" }, { char: "お", romaji: "o" },
  { char: "か", romaji: "ka" }, { char: "き", romaji: "ki" }, { char: "く", romaji: "ku" }, { char: "け", romaji: "ke" }, { char: "こ", romaji: "ko" },
  { char: "さ", romaji: "sa" }, { char: "し", romaji: "shi" }, { char: "す", romaji: "su" }, { char: "せ", romaji: "se" }, { char: "そ", romaji: "so" },
  { char: "た", romaji: "ta" }, { char: "ち", romaji: "chi" }, { char: "つ", romaji: "tsu" }, { char: "て", romaji: "te" }, { char: "と", romaji: "to" },
  { char: "な", romaji: "na" }, { char: "に", romaji: "ni" }, { char: "ぬ", romaji: "nu" }, { char: "ね", romaji: "ne" }, { char: "の", romaji: "no" },
  { char: "は", romaji: "ha" }, { char: "ひ", romaji: "hi" }, { char: "ふ", romaji: "fu" }, { char: "へ", romaji: "he" }, { char: "ほ", romaji: "ho" },
  { char: "ま", romaji: "ma" }, { char: "み", romaji: "mi" }, { char: "む", romaji: "mu" }, { char: "め", romaji: "me" }, { char: "も", romaji: "mo" },
  { char: "や", romaji: "ya" }, { char: "ゆ", romaji: "yu" }, { char: "よ", romaji: "yo" },
  { char: "ら", romaji: "ra" }, { char: "り", romaji: "ri" }, { char: "る", romaji: "ru" }, { char: "れ", romaji: "re" }, { char: "ろ", romaji: "ro" },
  { char: "わ", romaji: "wa" }, { char: "を", romaji: "wo" }, { char: "ん", romaji: "n" },
  // Dakuten
  { char: "が", romaji: "ga" }, { char: "ぎ", romaji: "gi" }, { char: "ぐ", romaji: "gu" }, { char: "げ", romaji: "ge" }, { char: "ご", romaji: "go" },
  { char: "ざ", romaji: "za" }, { char: "じ", romaji: "ji" }, { char: "ず", romaji: "zu" }, { char: "ぜ", romaji: "ze" }, { char: "ぞ", romaji: "zo" },
  { char: "だ", romaji: "da" }, { char: "ぢ", romaji: "di" }, { char: "づ", romaji: "du" }, { char: "で", romaji: "de" }, { char: "ど", romaji: "do" },
  { char: "ば", romaji: "ba" }, { char: "び", romaji: "bi" }, { char: "ぶ", romaji: "bu" }, { char: "べ", romaji: "be" }, { char: "ぼ", romaji: "bo" },
  { char: "ぱ", romaji: "pa" }, { char: "ぴ", romaji: "pi" }, { char: "ぷ", romaji: "pu" }, { char: "ぺ", romaji: "pe" }, { char: "ぽ", romaji: "po" },
];

const KATAKANA = [
  { char: "ア", romaji: "a" }, { char: "イ", romaji: "i" }, { char: "ウ", romaji: "u" }, { char: "エ", romaji: "e" }, { char: "オ", romaji: "o" },
  { char: "カ", romaji: "ka" }, { char: "キ", romaji: "ki" }, { char: "ク", romaji: "ku" }, { char: "ケ", romaji: "ke" }, { char: "コ", romaji: "ko" },
  { char: "サ", romaji: "sa" }, { char: "シ", romaji: "shi" }, { char: "ス", romaji: "su" }, { char: "セ", romaji: "se" }, { char: "ソ", romaji: "so" },
  { char: "タ", romaji: "ta" }, { char: "チ", romaji: "chi" }, { char: "ツ", romaji: "tsu" }, { char: "テ", romaji: "te" }, { char: "ト", romaji: "to" },
  { char: "ナ", romaji: "na" }, { char: "ニ", romaji: "ni" }, { char: "ヌ", romaji: "nu" }, { char: "ネ", romaji: "ne" }, { char: "ノ", romaji: "no" },
  { char: "ハ", romaji: "ha" }, { char: "ヒ", romaji: "hi" }, { char: "フ", romaji: "fu" }, { char: "ヘ", romaji: "he" }, { char: "ホ", romaji: "ho" },
  { char: "マ", romaji: "ma" }, { char: "ミ", romaji: "mi" }, { char: "ム", romaji: "mu" }, { char: "メ", romaji: "me" }, { char: "モ", romaji: "mo" },
  { char: "ヤ", romaji: "ya" }, { char: "ユ", romaji: "yu" }, { char: "ヨ", romaji: "yo" },
  { char: "ラ", romaji: "ra" }, { char: "リ", romaji: "ri" }, { char: "ル", romaji: "ru" }, { char: "レ", romaji: "re" }, { char: "ロ", romaji: "ro" },
  { char: "ワ", romaji: "wa" }, { char: "ヲ", romaji: "wo" }, { char: "ン", romaji: "n" },
  // Dakuten
  { char: "ガ", romaji: "ga" }, { char: "ギ", romaji: "gi" }, { char: "グ", romaji: "gu" }, { char: "ゲ", romaji: "ge" }, { char: "ゴ", romaji: "go" },
  { char: "ザ", romaji: "za" }, { char: "ジ", romaji: "ji" }, { char: "ズ", romaji: "zu" }, { char: "ゼ", romaji: "ze" }, { char: "ゾ", romaji: "zo" },
  { char: "ダ", romaji: "da" }, { char: "ヂ", romaji: "di" }, { char: "ヅ", romaji: "du" }, { char: "デ", romaji: "de" }, { char: "ド", romaji: "do" },
  { char: "バ", romaji: "ba" }, { char: "ビ", romaji: "bi" }, { char: "ブ", romaji: "bu" }, { char: "ベ", romaji: "be" }, { char: "ボ", romaji: "bo" },
  { char: "パ", romaji: "pa" }, { char: "ピ", romaji: "pi" }, { char: "プ", romaji: "pu" }, { char: "ペ", romaji: "pe" }, { char: "ポ", romaji: "po" },
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const MODES = {
  CHAR_TO_ROMAJI: "char_to_romaji",
  ROMAJI_TO_CHAR: "romaji_to_char",
};

const generateOptions = (correct, pool, count = 4) => {
  const options = [correct];
  const filtered = pool.filter((item) => item.romaji !== correct.romaji);
  const shuffled = shuffle(filtered);
  for (let i = 0; options.length < count && i < shuffled.length; i++) {
    if (!options.find((o) => o.romaji === shuffled[i].romaji)) {
      options.push(shuffled[i]);
    }
  }
  return shuffle(options);
};

// Ink splatter SVG component
const InkSplatter = ({ style }) => (
  <svg viewBox="0 0 200 200" style={{ position: "absolute", opacity: 0.03, pointerEvents: "none", ...style }}>
    <circle cx="100" cy="100" r="80" fill="currentColor" />
    <circle cx="60" cy="50" r="30" fill="currentColor" />
    <circle cx="150" cy="60" r="25" fill="currentColor" />
    <circle cx="140" cy="150" r="35" fill="currentColor" />
    <circle cx="50" cy="140" r="20" fill="currentColor" />
  </svg>
);

export default function JapaneseQuiz() {
  const [screen, setScreen] = useState("home");
  const [scriptType, setScriptType] = useState("hiragana");
  const [mode, setMode] = useState(MODES.CHAR_TO_ROMAJI);
  const [includeBasic, setIncludeBasic] = useState(true);
  const [includeDakuten, setIncludeDakuten] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [history, setHistory] = useState([]);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const inputRef = useRef(null);

  const TOTAL_QUESTIONS = 15;

  const getPool = useCallback(() => {
    const source = scriptType === "hiragana" ? HIRAGANA : KATAKANA;
    const basic = source.slice(0, 46);
    const dakuten = source.slice(46);
    let pool = [];
    if (includeBasic) pool = [...pool, ...basic];
    if (includeDakuten) pool = [...pool, ...dakuten];
    if (pool.length === 0) pool = basic;
    return pool;
  }, [scriptType, includeBasic, includeDakuten]);

  const startQuiz = () => {
    const pool = getPool();
    const shuffled = shuffle(pool).slice(0, TOTAL_QUESTIONS);
    const qs = shuffled.map((item) => ({
      item,
      options: generateOptions(item, pool),
    }));
    setQuestions(qs);
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setAnswered(false);
    setHistory([]);
    setFadeIn(true);
    setScreen("quiz");
  };

  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const correct = option.romaji === questions[currentIndex].item.romaji;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
    }
    setHistory((h) => [
      ...h,
      {
        item: questions[currentIndex].item,
        selected: option,
        correct,
      },
    ]);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setScreen("results");
    } else {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
        setAnswered(false);
        setFadeIn(true);
      }, 150);
    }
  };

  const currentQ = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + (answered ? 1 : 0)) / questions.length) * 100 : 0;

  const styles = {
    app: {
      minHeight: "100vh",
      background: "#1a1a1e",
      color: "#e8e4df",
      fontFamily: "'Noto Serif JP', 'Georgia', serif",
      position: "relative",
      overflow: "hidden",
    },
    container: {
      maxWidth: 560,
      margin: "0 auto",
      padding: "24px 20px",
      position: "relative",
      zIndex: 1,
    },
    // Decorative vertical line
    vertLine: {
      position: "fixed",
      top: 0,
      bottom: 0,
      width: 1,
      background: "linear-gradient(to bottom, transparent, #c4443820, transparent)",
    },
    // Home screen
    homeTitle: {
      fontSize: 14,
      letterSpacing: 6,
      textTransform: "uppercase",
      color: "#c44438",
      textAlign: "center",
      marginBottom: 8,
      fontFamily: "'Courier New', monospace",
    },
    heroChar: {
      fontSize: 120,
      textAlign: "center",
      lineHeight: 1,
      margin: "20px 0",
      color: "#e8e4df",
      textShadow: "0 0 60px #c4443830",
      fontFamily: "'Noto Serif JP', serif",
    },
    subtitle: {
      fontSize: 13,
      textAlign: "center",
      color: "#8a857e",
      marginBottom: 40,
      letterSpacing: 2,
    },
    sectionLabel: {
      fontSize: 10,
      letterSpacing: 4,
      textTransform: "uppercase",
      color: "#6a655e",
      marginBottom: 12,
      fontFamily: "'Courier New', monospace",
    },
    optionGroup: {
      display: "flex",
      gap: 8,
      marginBottom: 24,
    },
    toggleBtn: (active) => ({
      flex: 1,
      padding: "14px 8px",
      background: active ? "#c44438" : "transparent",
      color: active ? "#fff" : "#8a857e",
      border: active ? "1px solid #c44438" : "1px solid #3a3a3e",
      borderRadius: 2,
      cursor: "pointer",
      fontSize: 13,
      letterSpacing: 1,
      transition: "all 0.2s",
      fontFamily: "inherit",
    }),
    checkbox: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 16px",
      background: active ? "#c4443810" : "transparent",
      border: active ? "1px solid #c4443840" : "1px solid #3a3a3e",
      borderRadius: 2,
      cursor: "pointer",
      fontSize: 13,
      color: active ? "#e8e4df" : "#6a655e",
      transition: "all 0.2s",
      marginBottom: 8,
    }),
    checkMark: (active) => ({
      width: 18,
      height: 18,
      borderRadius: 2,
      border: active ? "2px solid #c44438" : "2px solid #4a4a4e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      color: "#c44438",
      flexShrink: 0,
    }),
    startBtn: {
      width: "100%",
      padding: "18px",
      background: "#c44438",
      color: "#fff",
      border: "none",
      borderRadius: 2,
      cursor: "pointer",
      fontSize: 15,
      letterSpacing: 3,
      textTransform: "uppercase",
      fontFamily: "'Courier New', monospace",
      marginTop: 16,
      transition: "all 0.2s",
    },
    // Quiz screen
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    progressTrack: {
      height: 2,
      background: "#2a2a2e",
      borderRadius: 1,
      marginBottom: 32,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      background: "#c44438",
      transition: "width 0.4s ease",
      borderRadius: 1,
    },
    questionNum: {
      fontSize: 11,
      color: "#6a655e",
      letterSpacing: 3,
      fontFamily: "'Courier New', monospace",
    },
    scoreDisplay: {
      fontSize: 11,
      color: "#c44438",
      letterSpacing: 2,
      fontFamily: "'Courier New', monospace",
    },
    streakBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 10px",
      background: "#c4443820",
      borderRadius: 2,
      fontSize: 11,
      color: "#c44438",
      fontFamily: "'Courier New', monospace",
    },
    questionCard: {
      textAlign: "center",
      marginBottom: 40,
      opacity: fadeIn ? 1 : 0,
      transform: fadeIn ? "translateY(0)" : "translateY(10px)",
      transition: "all 0.3s ease",
    },
    bigChar: {
      fontSize: 140,
      lineHeight: 1,
      margin: "16px 0 8px",
      color: "#e8e4df",
      fontFamily: "'Noto Serif JP', serif",
    },
    bigRomaji: {
      fontSize: 48,
      lineHeight: 1,
      margin: "16px 0 8px",
      color: "#e8e4df",
      fontFamily: "'Courier New', monospace",
      letterSpacing: 6,
      textTransform: "uppercase",
    },
    prompt: {
      fontSize: 12,
      color: "#6a655e",
      letterSpacing: 2,
      fontFamily: "'Courier New', monospace",
    },
    answersGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      opacity: fadeIn ? 1 : 0,
      transition: "opacity 0.3s ease 0.1s",
    },
    answerBtn: (option, isSelected, isAnswered, correctItem) => {
      const isCorrect = option.romaji === correctItem.romaji;
      const isWrongSelected = isSelected && !isCorrect;
      let bg = "transparent";
      let border = "1px solid #3a3a3e";
      let color = "#e8e4df";

      if (isAnswered) {
        if (isCorrect) {
          bg = "#2d6a4f15";
          border = "1px solid #2d6a4f";
          color = "#52b788";
        } else if (isWrongSelected) {
          bg = "#c4443815";
          border = "1px solid #c44438";
          color = "#c44438";
        } else {
          color = "#4a4a4e";
          border = "1px solid #2a2a2e";
        }
      }

      return {
        padding: mode === MODES.ROMAJI_TO_CHAR ? "20px 8px" : "16px 8px",
        background: bg,
        color,
        border,
        borderRadius: 2,
        cursor: isAnswered ? "default" : "pointer",
        fontSize: mode === MODES.ROMAJI_TO_CHAR ? 42 : 16,
        fontFamily: mode === MODES.ROMAJI_TO_CHAR ? "'Noto Serif JP', serif" : "'Courier New', monospace",
        letterSpacing: mode === MODES.ROMAJI_TO_CHAR ? 0 : 2,
        transition: "all 0.2s",
        animation: isWrongSelected && shakeWrong ? "shake 0.4s ease" : "none",
      };
    },
    nextBtn: {
      width: "100%",
      padding: "16px",
      background: "transparent",
      color: "#c44438",
      border: "1px solid #c44438",
      borderRadius: 2,
      cursor: "pointer",
      fontSize: 12,
      letterSpacing: 4,
      textTransform: "uppercase",
      fontFamily: "'Courier New', monospace",
      marginTop: 20,
      transition: "all 0.2s",
    },
    // Results
    resultScore: {
      fontSize: 72,
      textAlign: "center",
      color: "#c44438",
      fontFamily: "'Courier New', monospace",
      lineHeight: 1,
      margin: "20px 0 4px",
    },
    resultLabel: {
      fontSize: 12,
      textAlign: "center",
      color: "#6a655e",
      letterSpacing: 3,
      fontFamily: "'Courier New', monospace",
      marginBottom: 32,
    },
    statsRow: {
      display: "flex",
      justifyContent: "center",
      gap: 32,
      marginBottom: 32,
    },
    stat: {
      textAlign: "center",
    },
    statValue: {
      fontSize: 24,
      color: "#e8e4df",
      fontFamily: "'Courier New', monospace",
    },
    statLabel: {
      fontSize: 10,
      color: "#6a655e",
      letterSpacing: 2,
      fontFamily: "'Courier New', monospace",
      marginTop: 4,
    },
    reviewItem: (correct) => ({
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      borderBottom: "1px solid #2a2a2e",
      gap: 16,
    }),
    reviewChar: {
      fontSize: 28,
      width: 48,
      textAlign: "center",
      fontFamily: "'Noto Serif JP', serif",
    },
    reviewRomaji: {
      fontSize: 14,
      fontFamily: "'Courier New', monospace",
      letterSpacing: 2,
      color: "#8a857e",
      flex: 1,
    },
    reviewIcon: (correct) => ({
      fontSize: 14,
      color: correct ? "#52b788" : "#c44438",
      fontFamily: "'Courier New', monospace",
    }),
    backBtn: {
      background: "none",
      border: "none",
      color: "#6a655e",
      cursor: "pointer",
      fontSize: 12,
      letterSpacing: 2,
      fontFamily: "'Courier New', monospace",
      padding: "8px 0",
    },
  };

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button:hover { filter: brightness(1.15); }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3a3a3e; border-radius: 2px; }
      `}</style>

      {/* Decorative lines */}
      <div style={{ ...styles.vertLine, left: "10%" }} />
      <div style={{ ...styles.vertLine, right: "10%" }} />

      <InkSplatter style={{ top: -40, right: -60, width: 300, color: "#c44438" }} />
      <InkSplatter style={{ bottom: -20, left: -40, width: 250, color: "#e8e4df" }} />

      <div style={styles.container}>
        {/* ─── HOME ─── */}
        {screen === "home" && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>
            <div style={{ height: 20 }} />
            <div style={styles.homeTitle}>日本語 Practice</div>
            <div style={styles.heroChar}>
              {scriptType === "hiragana" ? "あ" : "ア"}
            </div>
            <div style={styles.subtitle}>
              JAPANESE KANA QUIZ
            </div>

            {/* Script selection */}
            <div style={styles.sectionLabel}>Script</div>
            <div style={styles.optionGroup}>
              <button
                style={styles.toggleBtn(scriptType === "hiragana")}
                onClick={() => setScriptType("hiragana")}
              >
                ひらがな Hiragana
              </button>
              <button
                style={styles.toggleBtn(scriptType === "katakana")}
                onClick={() => setScriptType("katakana")}
              >
                カタカナ Katakana
              </button>
            </div>

            {/* Mode selection */}
            <div style={styles.sectionLabel}>Quiz Mode</div>
            <div style={styles.optionGroup}>
              <button
                style={styles.toggleBtn(mode === MODES.CHAR_TO_ROMAJI)}
                onClick={() => setMode(MODES.CHAR_TO_ROMAJI)}
              >
                あ → Romaji
              </button>
              <button
                style={styles.toggleBtn(mode === MODES.ROMAJI_TO_CHAR)}
                onClick={() => setMode(MODES.ROMAJI_TO_CHAR)}
              >
                Romaji → あ
              </button>
            </div>

            {/* Character sets */}
            <div style={styles.sectionLabel}>Characters</div>
            <div
              style={styles.checkbox(includeBasic)}
              onClick={() => {
                if (!includeBasic && !includeDakuten) return;
                setIncludeBasic(!includeBasic);
              }}
            >
              <div style={styles.checkMark(includeBasic)}>
                {includeBasic && "✓"}
              </div>
              <span>Basic (46 characters)</span>
            </div>
            <div
              style={styles.checkbox(includeDakuten)}
              onClick={() => {
                if (!includeDakuten && !includeBasic) return;
                setIncludeDakuten(!includeDakuten);
              }}
            >
              <div style={styles.checkMark(includeDakuten)}>
                {includeDakuten && "✓"}
              </div>
              <span>Dakuten / Handakuten (25 characters)</span>
            </div>

            <button style={styles.startBtn} onClick={startQuiz}>
              Begin Quiz
            </button>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#4a4a4e", letterSpacing: 1, fontFamily: "'Courier New', monospace" }}>
              {TOTAL_QUESTIONS} questions · multiple choice
            </div>
          </div>
        )}

        {/* ─── QUIZ ─── */}
        {screen === "quiz" && currentQ && (
          <div>
            <div style={styles.topBar}>
              <button style={styles.backBtn} onClick={() => setScreen("home")}>
                ← BACK
              </button>
              <span style={styles.questionNum}>
                {currentIndex + 1} / {questions.length}
              </span>
              <span style={styles.scoreDisplay}>
                {score} correct
              </span>
            </div>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>

            {streak >= 3 && (
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <span style={styles.streakBadge}>
                  🔥 {streak} streak
                </span>
              </div>
            )}

            <div style={styles.questionCard}>
              <div style={styles.prompt}>
                {mode === MODES.CHAR_TO_ROMAJI
                  ? "What is the romaji for"
                  : "Which character is"}
              </div>
              {mode === MODES.CHAR_TO_ROMAJI ? (
                <div style={styles.bigChar}>{currentQ.item.char}</div>
              ) : (
                <div style={styles.bigRomaji}>{currentQ.item.romaji}</div>
              )}
            </div>

            <div style={styles.answersGrid}>
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  style={styles.answerBtn(opt, selected?.romaji === opt.romaji && selected?.char === opt.char, answered, currentQ.item)}
                  onClick={() => handleSelect(opt)}
                >
                  {mode === MODES.CHAR_TO_ROMAJI ? opt.romaji : opt.char}
                </button>
              ))}
            </div>

            {answered && (
              <div style={{ animation: "fadeUp 0.2s ease" }}>
                {selected?.romaji !== currentQ.item.romaji && (
                  <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#8a857e" }}>
                    Correct answer: <span style={{ color: "#52b788" }}>
                      {currentQ.item.char} = {currentQ.item.romaji}
                    </span>
                  </div>
                )}
                <button style={styles.nextBtn} onClick={nextQuestion}>
                  {currentIndex + 1 >= questions.length ? "See Results" : "Next →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── RESULTS ─── */}
        {screen === "results" && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>
            <div style={{ height: 20 }} />
            <div style={styles.homeTitle}>Complete</div>
            <div style={styles.resultScore}>
              {Math.round((score / questions.length) * 100)}%
            </div>
            <div style={styles.resultLabel}>
              {score} / {questions.length} CORRECT
            </div>

            <div style={styles.statsRow}>
              <div style={styles.stat}>
                <div style={styles.statValue}>{bestStreak}</div>
                <div style={styles.statLabel}>BEST STREAK</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statValue}>
                  {score >= questions.length * 0.9 ? "素晴らしい" : score >= questions.length * 0.7 ? "いいね" : "頑張って"}
                </div>
                <div style={styles.statLabel}>
                  {score >= questions.length * 0.9 ? "WONDERFUL" : score >= questions.length * 0.7 ? "NICE" : "KEEP GOING"}
                </div>
              </div>
            </div>

            <div style={styles.sectionLabel}>Review</div>
            <div style={{ border: "1px solid #2a2a2e", borderRadius: 2, marginBottom: 24 }}>
              {history.map((h, i) => (
                <div key={i} style={styles.reviewItem(h.correct)}>
                  <div style={styles.reviewChar}>{h.item.char}</div>
                  <div style={styles.reviewRomaji}>{h.item.romaji}</div>
                  <div style={styles.reviewIcon(h.correct)}>
                    {h.correct ? "✓" : `✗ ${h.selected.romaji}`}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                style={{ ...styles.nextBtn, flex: 1 }}
                onClick={() => setScreen("home")}
              >
                Menu
              </button>
              <button
                style={{ ...styles.startBtn, flex: 1, marginTop: 0 }}
                onClick={startQuiz}
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
