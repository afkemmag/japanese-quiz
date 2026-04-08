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
const InkSplatter = ({ className }) => (
  <svg viewBox="0 0 200 200" className={`absolute opacity-[0.03] pointer-events-none ${className}`}>
    <circle cx="100" cy="100" r="80" fill="currentColor" />
    <circle cx="60" cy="50" r="30" fill="currentColor" />
    <circle cx="150" cy="60" r="25" fill="currentColor" />
    <circle cx="140" cy="150" r="35" fill="currentColor" />
    <circle cx="50" cy="140" r="20" fill="currentColor" />
  </svg>
);

const getAnswerBtnClasses = (option, isSelected, isAnswered, correctItem, shakeWrong, mode) => {
  const isCorrect = option.romaji === correctItem.romaji;
  const isWrongSelected = isSelected && !isCorrect;

  const base = `rounded-[2px] transition-all duration-200 font-mono ${
    mode === MODES.ROMAJI_TO_CHAR
      ? "py-5 px-2 text-[42px] font-serif-jp"
      : "py-4 px-2 text-base tracking-[2px] font-mono"
  }`;

  if (!isAnswered) {
    return `${base} bg-transparent text-kana-text border border-kana-border cursor-pointer`;
  }

  if (isCorrect) {
    return `${base} bg-kana-success-dark/[0.08] border border-kana-success-dark text-kana-success cursor-default`;
  }

  if (isWrongSelected) {
    return `${base} bg-kana-primary/[0.08] border border-kana-primary text-kana-primary cursor-default ${shakeWrong ? "animate-shake" : ""}`;
  }

  return `${base} text-kana-faint border border-kana-bg-light cursor-default`;
};

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

  return (
    <div className="min-h-screen bg-kana-bg text-kana-text font-serif-jp relative overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet" />

      {/* Decorative lines */}
      <div className="vert-line left-[10%]" />
      <div className="vert-line right-[10%]" />

      <InkSplatter className="-top-10 -right-15 w-[300px] text-kana-primary" />
      <InkSplatter className="-bottom-5 -left-10 w-[250px] text-kana-text" />

      <div className="max-w-[560px] mx-auto px-5 py-6 relative z-10">
        {/* ─── HOME ─── */}
        {screen === "home" && (
          <div className="animate-fade-up">
            <div className="h-5" />
            <div className="text-sm tracking-[6px] uppercase text-kana-primary text-center mb-2 font-mono">
              日本語 Practice
            </div>
            <div className="text-[120px] text-center leading-none my-5 text-kana-text font-serif-jp" style={{ textShadow: "0 0 60px #c4443830" }}>
              {scriptType === "hiragana" ? "あ" : "ア"}
            </div>
            <div className="text-[13px] text-center text-kana-muted mb-10 tracking-[2px]">
              JAPANESE KANA QUIZ
            </div>

            {/* Script selection */}
            <div className="text-[10px] tracking-[4px] uppercase text-kana-dim mb-3 font-mono">Script</div>
            <div className="flex gap-2 mb-6">
              <button
                className={`flex-1 py-3.5 px-2 rounded-[2px] text-[13px] tracking-[1px] transition-all duration-200 font-inherit border ${
                  scriptType === "hiragana"
                    ? "bg-kana-primary text-white border-kana-primary"
                    : "bg-transparent text-kana-muted border-kana-border"
                }`}
                onClick={() => setScriptType("hiragana")}
              >
                ひらがな Hiragana
              </button>
              <button
                className={`flex-1 py-3.5 px-2 rounded-[2px] text-[13px] tracking-[1px] transition-all duration-200 font-inherit border ${
                  scriptType === "katakana"
                    ? "bg-kana-primary text-white border-kana-primary"
                    : "bg-transparent text-kana-muted border-kana-border"
                }`}
                onClick={() => setScriptType("katakana")}
              >
                カタカナ Katakana
              </button>
            </div>

            {/* Mode selection */}
            <div className="text-[10px] tracking-[4px] uppercase text-kana-dim mb-3 font-mono">Quiz Mode</div>
            <div className="flex gap-2 mb-6">
              <button
                className={`flex-1 py-3.5 px-2 rounded-[2px] text-[13px] tracking-[1px] transition-all duration-200 font-inherit border ${
                  mode === MODES.CHAR_TO_ROMAJI
                    ? "bg-kana-primary text-white border-kana-primary"
                    : "bg-transparent text-kana-muted border-kana-border"
                }`}
                onClick={() => setMode(MODES.CHAR_TO_ROMAJI)}
              >
                あ → Romaji
              </button>
              <button
                className={`flex-1 py-3.5 px-2 rounded-[2px] text-[13px] tracking-[1px] transition-all duration-200 font-inherit border ${
                  mode === MODES.ROMAJI_TO_CHAR
                    ? "bg-kana-primary text-white border-kana-primary"
                    : "bg-transparent text-kana-muted border-kana-border"
                }`}
                onClick={() => setMode(MODES.ROMAJI_TO_CHAR)}
              >
                Romaji → あ
              </button>
            </div>

            {/* Character sets */}
            <div className="text-[10px] tracking-[4px] uppercase text-kana-dim mb-3 font-mono">Characters</div>
            <div
              className={`flex items-center gap-2.5 py-3 px-4 rounded-[2px] cursor-pointer text-[13px] transition-all duration-200 mb-2 border ${
                includeBasic
                  ? "bg-kana-primary/[0.06] border-kana-primary/25 text-kana-text"
                  : "bg-transparent border-kana-border text-kana-dim"
              }`}
              onClick={() => {
                if (!includeBasic && !includeDakuten) return;
                setIncludeBasic(!includeBasic);
              }}
            >
              <div className={`w-[18px] h-[18px] rounded-[2px] flex items-center justify-center text-xs text-kana-primary shrink-0 border-2 ${
                includeBasic ? "border-kana-primary" : "border-kana-border-light"
              }`}>
                {includeBasic && "✓"}
              </div>
              <span>Basic (46 characters)</span>
            </div>
            <div
              className={`flex items-center gap-2.5 py-3 px-4 rounded-[2px] cursor-pointer text-[13px] transition-all duration-200 mb-2 border ${
                includeDakuten
                  ? "bg-kana-primary/[0.06] border-kana-primary/25 text-kana-text"
                  : "bg-transparent border-kana-border text-kana-dim"
              }`}
              onClick={() => {
                if (!includeDakuten && !includeBasic) return;
                setIncludeDakuten(!includeDakuten);
              }}
            >
              <div className={`w-[18px] h-[18px] rounded-[2px] flex items-center justify-center text-xs text-kana-primary shrink-0 border-2 ${
                includeDakuten ? "border-kana-primary" : "border-kana-border-light"
              }`}>
                {includeDakuten && "✓"}
              </div>
              <span>Dakuten / Handakuten (25 characters)</span>
            </div>

            <button
              className="w-full py-[18px] bg-kana-primary text-white border-none rounded-[2px] cursor-pointer text-[15px] tracking-[3px] uppercase font-mono mt-4 transition-all duration-200"
              onClick={startQuiz}
            >
              Begin Quiz
            </button>

            <div className="text-center mt-5 text-[11px] text-kana-faint tracking-[1px] font-mono">
              {TOTAL_QUESTIONS} questions · multiple choice
            </div>
          </div>
        )}

        {/* ─── QUIZ ─── */}
        {screen === "quiz" && currentQ && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <button
                className="bg-none border-none text-kana-dim cursor-pointer text-xs tracking-[2px] font-mono py-2"
                onClick={() => setScreen("home")}
              >
                ← BACK
              </button>
              <span className="text-[11px] text-kana-dim tracking-[3px] font-mono">
                {currentIndex + 1} / {questions.length}
              </span>
              <span className="text-[11px] text-kana-primary tracking-[2px] font-mono">
                {score} correct
              </span>
            </div>
            <div className="h-0.5 bg-kana-bg-light rounded-[1px] mb-8 overflow-hidden">
              <div
                className="h-full bg-kana-primary transition-[width] duration-400 ease rounded-[1px]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {streak >= 3 && (
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-1 py-1 px-2.5 bg-kana-primary/[0.13] rounded-[2px] text-[11px] text-kana-primary font-mono">
                  🔥 {streak} streak
                </span>
              </div>
            )}

            <div className={`text-center mb-10 transition-all duration-300 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"}`}>
              <div className="text-xs text-kana-dim tracking-[2px] font-mono">
                {mode === MODES.CHAR_TO_ROMAJI
                  ? "What is the romaji for"
                  : "Which character is"}
              </div>
              {mode === MODES.CHAR_TO_ROMAJI ? (
                <div className="text-[140px] leading-none mt-4 mb-2 text-kana-text font-serif-jp">
                  {currentQ.item.char}
                </div>
              ) : (
                <div className="text-5xl leading-none mt-4 mb-2 text-kana-text font-mono tracking-[6px] uppercase">
                  {currentQ.item.romaji}
                </div>
              )}
            </div>

            <div className={`grid grid-cols-2 gap-2.5 transition-opacity duration-300 delay-100 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  className={getAnswerBtnClasses(opt, selected?.romaji === opt.romaji && selected?.char === opt.char, answered, currentQ.item, shakeWrong, mode)}
                  onClick={() => handleSelect(opt)}
                >
                  {mode === MODES.CHAR_TO_ROMAJI ? opt.romaji : opt.char}
                </button>
              ))}
            </div>

            {answered && (
              <div className="animate-fade-up-fast">
                {selected?.romaji !== currentQ.item.romaji && (
                  <div className="text-center mt-4 text-[13px] text-kana-muted">
                    Correct answer: <span className="text-kana-success">
                      {currentQ.item.char} = {currentQ.item.romaji}
                    </span>
                  </div>
                )}
                <button
                  className="w-full py-4 bg-transparent text-kana-primary border border-kana-primary rounded-[2px] cursor-pointer text-xs tracking-[4px] uppercase font-mono mt-5 transition-all duration-200"
                  onClick={nextQuestion}
                >
                  {currentIndex + 1 >= questions.length ? "See Results" : "Next →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── RESULTS ─── */}
        {screen === "results" && (
          <div className="animate-fade-up">
            <div className="h-5" />
            <div className="text-sm tracking-[6px] uppercase text-kana-primary text-center mb-2 font-mono">
              Complete
            </div>
            <div className="text-7xl text-center text-kana-primary font-mono leading-none mt-5 mb-1">
              {Math.round((score / questions.length) * 100)}%
            </div>
            <div className="text-xs text-center text-kana-dim tracking-[3px] font-mono mb-8">
              {score} / {questions.length} CORRECT
            </div>

            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl text-kana-text font-mono">{bestStreak}</div>
                <div className="text-[10px] text-kana-dim tracking-[2px] font-mono mt-1">BEST STREAK</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-kana-text font-mono">
                  {score >= questions.length * 0.9 ? "素晴らしい" : score >= questions.length * 0.7 ? "いいね" : "頑張って"}
                </div>
                <div className="text-[10px] text-kana-dim tracking-[2px] font-mono mt-1">
                  {score >= questions.length * 0.9 ? "WONDERFUL" : score >= questions.length * 0.7 ? "NICE" : "KEEP GOING"}
                </div>
              </div>
            </div>

            <div className="text-[10px] tracking-[4px] uppercase text-kana-dim mb-3 font-mono">Review</div>
            <div className="border border-kana-bg-light rounded-[2px] mb-6">
              {history.map((h, i) => (
                <div key={i} className="flex items-center py-3 px-4 border-b border-kana-bg-light gap-4">
                  <div className="text-[28px] w-12 text-center font-serif-jp">{h.item.char}</div>
                  <div className="text-sm font-mono tracking-[2px] text-kana-muted flex-1">{h.item.romaji}</div>
                  <div className={`text-sm font-mono ${h.correct ? "text-kana-success" : "text-kana-primary"}`}>
                    {h.correct ? "✓" : `✗ ${h.selected.romaji}`}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2.5">
              <button
                className="flex-1 py-4 bg-transparent text-kana-primary border border-kana-primary rounded-[2px] cursor-pointer text-xs tracking-[4px] uppercase font-mono transition-all duration-200"
                onClick={() => setScreen("home")}
              >
                Menu
              </button>
              <button
                className="flex-1 py-[18px] bg-kana-primary text-white border-none rounded-[2px] cursor-pointer text-[15px] tracking-[3px] uppercase font-mono transition-all duration-200"
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
