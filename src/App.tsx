// @ts-nocheck — Tamagui 2.0 RC has known type incompatibilities with strict TS
import { useState, useCallback, useEffect } from "react";
import { View, Text, XStack, YStack, Button, styled } from "tamagui";

const AnimatedYStack = styled(YStack, {
  transition: "quick",
} as any);

// ─── Types ───

interface KanaItem {
  char: string;
  romaji: string;
}

interface WeightedKanaItem extends KanaItem {
  weight: number;
}

interface Question {
  item: KanaItem;
  options: KanaItem[];
}

interface HistoryEntry {
  item: KanaItem;
  selected: KanaItem;
  correct: boolean;
}

type Screen = "home" | "quiz" | "practice" | "reference" | "results";
type ScriptType = "hiragana" | "katakana";
type Difficulty = "easy" | "medium" | "hard";

// ─── Data ───

const HIRAGANA: KanaItem[] = [
  { char: "あ", romaji: "a" },
  { char: "い", romaji: "i" },
  { char: "う", romaji: "u" },
  { char: "え", romaji: "e" },
  { char: "お", romaji: "o" },
  { char: "か", romaji: "ka" },
  { char: "き", romaji: "ki" },
  { char: "く", romaji: "ku" },
  { char: "け", romaji: "ke" },
  { char: "こ", romaji: "ko" },
  { char: "さ", romaji: "sa" },
  { char: "し", romaji: "shi" },
  { char: "す", romaji: "su" },
  { char: "せ", romaji: "se" },
  { char: "そ", romaji: "so" },
  { char: "た", romaji: "ta" },
  { char: "ち", romaji: "chi" },
  { char: "つ", romaji: "tsu" },
  { char: "て", romaji: "te" },
  { char: "と", romaji: "to" },
  { char: "な", romaji: "na" },
  { char: "に", romaji: "ni" },
  { char: "ぬ", romaji: "nu" },
  { char: "ね", romaji: "ne" },
  { char: "の", romaji: "no" },
  { char: "は", romaji: "ha" },
  { char: "ひ", romaji: "hi" },
  { char: "ふ", romaji: "fu" },
  { char: "へ", romaji: "he" },
  { char: "ほ", romaji: "ho" },
  { char: "ま", romaji: "ma" },
  { char: "み", romaji: "mi" },
  { char: "む", romaji: "mu" },
  { char: "め", romaji: "me" },
  { char: "も", romaji: "mo" },
  { char: "や", romaji: "ya" },
  { char: "ゆ", romaji: "yu" },
  { char: "よ", romaji: "yo" },
  { char: "ら", romaji: "ra" },
  { char: "り", romaji: "ri" },
  { char: "る", romaji: "ru" },
  { char: "れ", romaji: "re" },
  { char: "ろ", romaji: "ro" },
  { char: "わ", romaji: "wa" },
  { char: "を", romaji: "wo" },
  { char: "ん", romaji: "n" },
  { char: "が", romaji: "ga" },
  { char: "ぎ", romaji: "gi" },
  { char: "ぐ", romaji: "gu" },
  { char: "げ", romaji: "ge" },
  { char: "ご", romaji: "go" },
  { char: "ざ", romaji: "za" },
  { char: "じ", romaji: "ji" },
  { char: "ず", romaji: "zu" },
  { char: "ぜ", romaji: "ze" },
  { char: "ぞ", romaji: "zo" },
  { char: "だ", romaji: "da" },
  { char: "ぢ", romaji: "di" },
  { char: "づ", romaji: "du" },
  { char: "で", romaji: "de" },
  { char: "ど", romaji: "do" },
  { char: "ば", romaji: "ba" },
  { char: "び", romaji: "bi" },
  { char: "ぶ", romaji: "bu" },
  { char: "べ", romaji: "be" },
  { char: "ぼ", romaji: "bo" },
  { char: "ぱ", romaji: "pa" },
  { char: "ぴ", romaji: "pi" },
  { char: "ぷ", romaji: "pu" },
  { char: "ぺ", romaji: "pe" },
  { char: "ぽ", romaji: "po" },
];

const KATAKANA: KanaItem[] = [
  { char: "ア", romaji: "a" },
  { char: "イ", romaji: "i" },
  { char: "ウ", romaji: "u" },
  { char: "エ", romaji: "e" },
  { char: "オ", romaji: "o" },
  { char: "カ", romaji: "ka" },
  { char: "キ", romaji: "ki" },
  { char: "ク", romaji: "ku" },
  { char: "ケ", romaji: "ke" },
  { char: "コ", romaji: "ko" },
  { char: "サ", romaji: "sa" },
  { char: "シ", romaji: "shi" },
  { char: "ス", romaji: "su" },
  { char: "セ", romaji: "se" },
  { char: "ソ", romaji: "so" },
  { char: "タ", romaji: "ta" },
  { char: "チ", romaji: "chi" },
  { char: "ツ", romaji: "tsu" },
  { char: "テ", romaji: "te" },
  { char: "ト", romaji: "to" },
  { char: "ナ", romaji: "na" },
  { char: "ニ", romaji: "ni" },
  { char: "ヌ", romaji: "nu" },
  { char: "ネ", romaji: "ne" },
  { char: "ノ", romaji: "no" },
  { char: "ハ", romaji: "ha" },
  { char: "ヒ", romaji: "hi" },
  { char: "フ", romaji: "fu" },
  { char: "ヘ", romaji: "he" },
  { char: "ホ", romaji: "ho" },
  { char: "マ", romaji: "ma" },
  { char: "ミ", romaji: "mi" },
  { char: "ム", romaji: "mu" },
  { char: "メ", romaji: "me" },
  { char: "モ", romaji: "mo" },
  { char: "ヤ", romaji: "ya" },
  { char: "ユ", romaji: "yu" },
  { char: "ヨ", romaji: "yo" },
  { char: "ラ", romaji: "ra" },
  { char: "リ", romaji: "ri" },
  { char: "ル", romaji: "ru" },
  { char: "レ", romaji: "re" },
  { char: "ロ", romaji: "ro" },
  { char: "ワ", romaji: "wa" },
  { char: "ヲ", romaji: "wo" },
  { char: "ン", romaji: "n" },
  { char: "ガ", romaji: "ga" },
  { char: "ギ", romaji: "gi" },
  { char: "グ", romaji: "gu" },
  { char: "ゲ", romaji: "ge" },
  { char: "ゴ", romaji: "go" },
  { char: "ザ", romaji: "za" },
  { char: "ジ", romaji: "ji" },
  { char: "ズ", romaji: "zu" },
  { char: "ゼ", romaji: "ze" },
  { char: "ゾ", romaji: "zo" },
  { char: "ダ", romaji: "da" },
  { char: "ヂ", romaji: "di" },
  { char: "ヅ", romaji: "du" },
  { char: "デ", romaji: "de" },
  { char: "ド", romaji: "do" },
  { char: "バ", romaji: "ba" },
  { char: "ビ", romaji: "bi" },
  { char: "ブ", romaji: "bu" },
  { char: "ベ", romaji: "be" },
  { char: "ボ", romaji: "bo" },
  { char: "パ", romaji: "pa" },
  { char: "ピ", romaji: "pi" },
  { char: "プ", romaji: "pu" },
  { char: "ペ", romaji: "pe" },
  { char: "ポ", romaji: "po" },
];

// ─── Helpers ───

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
};

const MODES = {
  CHAR_TO_ROMAJI: "char_to_romaji",
  ROMAJI_TO_CHAR: "romaji_to_char",
} as const;

type Mode = (typeof MODES)[keyof typeof MODES];

const generateOptions = (
  correct: KanaItem,
  pool: KanaItem[],
  count = 4,
): KanaItem[] => {
  const options: KanaItem[] = [correct];
  const filtered = pool.filter((item) => item.romaji !== correct.romaji);
  const shuffled = shuffle(filtered);
  for (let i = 0; options.length < count && i < shuffled.length; i++) {
    if (!options.find((o) => o.romaji === shuffled[i]!.romaji)) {
      options.push(shuffled[i]!);
    }
  }
  return shuffle(options);
};

// ─── Colors ───

type ThemeMode = "dark" | "light";

const DARK = {
  bg: "#1a1a1e",
  bgLight: "#2a2a2e",
  border: "#3a3a3e",
  borderLight: "#4a4a4e",
  primary: "#c44438",
  text: "#e8e4df",
  muted: "#8a857e",
  dim: "#6a655e",
  faint: "#4a4a4e",
  success: "#52b788",
  successDark: "#2d6a4f",
  overlayBg: "rgba(26,26,30,0.8)",
  refCardBg: "rgba(42,42,46,0.3)",
  checkboxActiveBg: "rgba(196,68,56,0.06)",
  checkboxActiveBorder: "rgba(196,68,56,0.25)",
  streakBg: "rgba(196,68,56,0.13)",
  correctBg: "rgba(45,106,79,0.08)",
  wrongBg: "rgba(196,68,56,0.08)",
} as const;

const LIGHT = {
  bg: "#f5f2ed",
  bgLight: "#e8e4df",
  border: "#d0cbc4",
  borderLight: "#bab5ae",
  primary: "#c44438",
  text: "#2a2420",
  muted: "#6a655e",
  dim: "#8a857e",
  faint: "#bab5ae",
  success: "#2d8a63",
  successDark: "#1e6b4a",
  overlayBg: "rgba(245,242,237,0.85)",
  refCardBg: "rgba(232,228,223,0.5)",
  checkboxActiveBg: "rgba(196,68,56,0.08)",
  checkboxActiveBorder: "rgba(196,68,56,0.3)",
  streakBg: "rgba(196,68,56,0.1)",
  correctBg: "rgba(45,138,99,0.1)",
  wrongBg: "rgba(196,68,56,0.1)",
} as const;

const getColors = (theme: ThemeMode) => (theme === "dark" ? DARK : LIGHT);

// ─── Styled Components ───

const ScreenContainer = styled(YStack, {
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
} as any);

const ContentWrap = styled(YStack, {
  maxWidth: 560,
  marginHorizontal: "auto",
  paddingHorizontal: 20,
  paddingVertical: 24,
  position: "relative",
  zIndex: 10,
  width: "100%",
} as any);

const Label = styled(Text, {
  fontSize: 10,
  letterSpacing: 4,
  textTransform: "uppercase",
  fontFamily: "$mono",
  marginBottom: 12,
} as any);

// ─── Subcomponents ───

function InkSplatter({ style, opacity = 0.03 }: { style?: React.CSSProperties; opacity?: number }) {
  return (
    <svg
      viewBox="0 0 200 200"
      style={{
        position: "absolute",
        opacity,
        pointerEvents: "none",
        ...style,
      }}
    >
      <circle cx="100" cy="100" r="80" fill="currentColor" />
      <circle cx="60" cy="50" r="30" fill="currentColor" />
      <circle cx="150" cy="60" r="25" fill="currentColor" />
      <circle cx="140" cy="150" r="35" fill="currentColor" />
      <circle cx="50" cy="140" r="20" fill="currentColor" />
    </svg>
  );
}

function VertLine({
  left,
  right,
  color = "#c4443820",
}: {
  left?: string;
  right?: string;
  color?: string;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        width: 1,
        left,
        right,
        background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
      }}
    />
  );
}

// ─── Main Component ───

export default function JapaneseQuiz() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem("kana-theme") as ThemeMode) || "dark";
    } catch {
      return "dark";
    }
  });
  const C = getColors(themeMode);

  useEffect(() => {
    document.body.style.background = C.bg;
    try {
      localStorage.setItem("kana-theme", themeMode);
    } catch {}
  }, [themeMode, C.bg]);

  const toggleTheme = () =>
    setThemeMode((t) => (t === "dark" ? "light" : "dark"));

  const [screen, setScreen] = useState<Screen>("home");
  const [scriptType, setScriptType] = useState<ScriptType>("hiragana");
  const [mode, setMode] = useState<Mode>(MODES.CHAR_TO_ROMAJI);
  const [includeBasic, setIncludeBasic] = useState(true);
  const [includeDakuten, setIncludeDakuten] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<KanaItem | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  // Practice mode
  const [practiceDeck, setPracticeDeck] = useState<WeightedKanaItem[]>([]);
  const [practiceRevealed, setPracticeRevealed] = useState(false);
  const [practiceCount, setPracticeCount] = useState(0);
  const [practiceFade, setPracticeFade] = useState(true);

  // Reference overlay
  const [refOverlay, setRefOverlay] = useState<KanaItem | null>(null);

  const TOTAL_QUESTIONS = 15;

  // Theme-aware button props
  const btnProps = (kind: "primary" | "outline" | "outlineSm" | "muted") => ({
    width: "100%" as any,
    borderRadius: 2,
    fontFamily: "$mono" as const,
    textTransform: "uppercase" as const,
    hoverStyle: { opacity: 0.85 },
    pressStyle: { opacity: 0.9 },
    ...(kind === "primary"
      ? {
          backgroundColor: C.primary,
          paddingVertical: 18,
          fontSize: 15,
          letterSpacing: 3,
          color: "white" as const,
          borderWidth: 0,
        }
      : kind === "outline"
        ? {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: C.primary,
            paddingVertical: 18,
            fontSize: 15,
            letterSpacing: 3,
            color: C.primary,
          }
        : kind === "outlineSm"
          ? {
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: C.primary,
              paddingVertical: 18,
              fontSize: 12,
              letterSpacing: 4,
              color: C.primary,
            }
          : {
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: C.border,
              paddingVertical: 14,
              fontSize: 13,
              letterSpacing: 3,
              color: C.muted,
            }),
  });

  const getPool = useCallback((): KanaItem[] => {
    const source = scriptType === "hiragana" ? HIRAGANA : KATAKANA;
    const basic = source.slice(0, 46);
    const dakuten = source.slice(46);
    let pool: KanaItem[] = [];
    if (includeBasic) pool = [...pool, ...basic];
    if (includeDakuten) pool = [...pool, ...dakuten];
    if (pool.length === 0) pool = basic;
    return pool;
  }, [scriptType, includeBasic, includeDakuten]);

  const startPractice = () => {
    const pool = getPool();
    const deck = shuffle(pool).map((item) => ({ ...item, weight: 1 }));
    setPracticeDeck(deck);
    setPracticeRevealed(false);
    setPracticeCount(0);
    setPracticeFade(true);
    setScreen("practice");
  };

  const pickNextCard = (deck: WeightedKanaItem[]): WeightedKanaItem => {
    const totalWeight = deck.reduce((sum, c) => sum + c.weight, 0);
    let r = Math.random() * totalWeight;
    for (const card of deck) {
      r -= card.weight;
      if (r <= 0) return card;
    }
    return deck[0]!;
  };

  const ratePractice = (difficulty: Difficulty) => {
    setPracticeFade(false);
    const current = practiceDeck[0]!;
    setTimeout(() => {
      setPracticeDeck((prev) => {
        const updated = prev.map((c) => {
          if (c.char !== current.char) return c;
          if (difficulty === "easy")
            return { ...c, weight: Math.max(0.2, c.weight * 0.5) };
          if (difficulty === "hard")
            return { ...c, weight: Math.min(5, c.weight * 2) };
          return c;
        });
        const next = pickNextCard(updated);
        const rest = updated.filter((c) => c.char !== next.char);
        return [next, ...rest];
      });
      setPracticeRevealed(false);
      setPracticeCount((c) => c + 1);
      setPracticeFade(true);
    }, 150);
  };

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

  const handleSelect = (option: KanaItem) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const correct = option.romaji === questions[currentIndex]!.item.romaji;
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
      { item: questions[currentIndex]!.item, selected: option, correct },
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
  const progress =
    questions.length > 0
      ? ((currentIndex + (answered ? 1 : 0)) / questions.length) * 100
      : 0;
  const canStart = includeBasic || includeDakuten;

  return (
    <ScreenContainer backgroundColor={C.bg}>
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <VertLine
        left="10%"
        color={themeMode === "dark" ? "#c4443820" : "#c4443812"}
      />
      <VertLine
        right="10%"
        color={themeMode === "dark" ? "#c4443820" : "#c4443812"}
      />
      <InkSplatter
        style={{ top: -40, right: -60, width: 300, color: C.primary }}
        opacity={themeMode === "dark" ? 0.03 : 0.08}
      />
      <InkSplatter
        style={{ bottom: -20, left: -40, width: 250, color: C.text }}
        opacity={themeMode === "dark" ? 0.03 : 0.08}
      />

      {/* Theme toggle */}
      <Button
        // @ts-ignore – Tamagui maps this to CSS position:fixed on web
        position="fixed"
        bottom={24}
        right={24}
        zIndex={9999}
        width={36}
        height={36}
        padding={0}
        borderRadius={2}
        borderWidth={1}
        borderColor={C.border}
        backgroundColor={`${C.bg}88`}
        color={C.muted}
        fontFamily="$mono"
        fontSize={11}
        letterSpacing={2}
        hoverStyle={{ opacity: 0.85 }}
        pressStyle={{ opacity: 0.9 }}
        onPress={toggleTheme}
      >
        {themeMode === "dark" ? "☀" : "☾"}
      </Button>

      <ContentWrap>
        {/* ─── HOME ─── */}
        {screen === "home" && (
          <AnimatedYStack enterStyle={{ opacity: 0, y: 20 }} opacity={1} y={0}>
            <View height={20} />
            <Text
              fontSize={14}
              letterSpacing={6}
              textTransform="uppercase"
              color={C.primary}
              textAlign="center"
              marginBottom={8}
              fontFamily="$mono"
            >
              日本語 Practice
            </Text>
            <Text
              fontSize={120}
              textAlign="center"
              lineHeight={120}
              marginVertical={20}
              color={C.text}
              fontFamily="$serifJp"
              style={{ textShadow: "0 0 60px #c4443830" }}
            >
              {scriptType === "hiragana" ? "あ" : "ア"}
            </Text>
            <Text
              fontSize={13}
              textAlign="center"
              color={C.muted}
              marginBottom={40}
              letterSpacing={2}
            >
              JAPANESE KANA QUIZ
            </Text>

            <Label color={C.dim}>Script</Label>
            <XStack gap={8} marginBottom={24}>
              {(["hiragana", "katakana"] as const).map((s) => (
                <View
                  key={s}
                  flex={1}
                  paddingVertical={14}
                  borderRadius={2}
                  borderWidth={1}
                  alignItems="center"
                  cursor="pointer"
                  backgroundColor={scriptType === s ? C.primary : "transparent"}
                  borderColor={scriptType === s ? C.primary : C.border}
                  onPress={() => setScriptType(s)}
                  hoverStyle={{ opacity: 0.85 }}
                >
                  <Text
                    fontSize={13}
                    letterSpacing={1}
                    color={scriptType === s ? "white" : C.muted}
                    fontFamily="$serifJp"
                  >
                    {s === "hiragana"
                      ? "ひらがな Hiragana"
                      : "カタカナ Katakana"}
                  </Text>
                </View>
              ))}
            </XStack>

            <Label color={C.dim}>Quiz Mode</Label>
            <XStack gap={8} marginBottom={24}>
              {([MODES.CHAR_TO_ROMAJI, MODES.ROMAJI_TO_CHAR] as const).map(
                (m) => (
                  <View
                    key={m}
                    flex={1}
                    paddingVertical={14}
                    borderRadius={2}
                    borderWidth={1}
                    alignItems="center"
                    cursor="pointer"
                    backgroundColor={mode === m ? C.primary : "transparent"}
                    borderColor={mode === m ? C.primary : C.border}
                    onPress={() => setMode(m)}
                    hoverStyle={{ opacity: 0.85 }}
                  >
                    <Text
                      fontSize={13}
                      letterSpacing={1}
                      color={mode === m ? "white" : C.muted}
                      fontFamily="$serifJp"
                    >
                      {m === MODES.CHAR_TO_ROMAJI
                        ? "あ → Romaji"
                        : "Romaji → あ"}
                    </Text>
                  </View>
                ),
              )}
            </XStack>

            <Label color={C.dim}>Characters</Label>
            {(
              [
                {
                  label: "Basic (46 characters)",
                  value: includeBasic,
                  toggle: () => setIncludeBasic(!includeBasic),
                },
                {
                  label: "Dakuten / Handakuten (25 characters)",
                  value: includeDakuten,
                  toggle: () => setIncludeDakuten(!includeDakuten),
                },
              ] as const
            ).map((opt) => (
              <View
                key={opt.label}
                flexDirection="row"
                alignItems="center"
                gap={10}
                paddingVertical={12}
                paddingHorizontal={16}
                borderRadius={2}
                cursor="pointer"
                marginBottom={8}
                borderWidth={1}
                backgroundColor={opt.value ? C.checkboxActiveBg : "transparent"}
                borderColor={opt.value ? C.checkboxActiveBorder : C.border}
                onPress={opt.toggle}
              >
                <View
                  width={18}
                  height={18}
                  borderRadius={2}
                  alignItems="center"
                  justifyContent="center"
                  borderWidth={2}
                  borderColor={opt.value ? C.primary : C.borderLight}
                >
                  {opt.value && (
                    <Text fontSize={12} color={C.primary}>
                      ✓
                    </Text>
                  )}
                </View>
                <Text fontSize={13} color={opt.value ? C.text : C.dim}>
                  {opt.label}
                </Text>
              </View>
            ))}

            <Button
              {...btnProps("primary")}
              marginTop={16}
              opacity={canStart ? 1 : 0.4}
              onPress={canStart ? startQuiz : undefined}
            >
              Begin Quiz
            </Button>
            <Button
              {...btnProps("outline")}
              marginTop={10}
              opacity={canStart ? 1 : 0.4}
              onPress={canStart ? startPractice : undefined}
            >
              Practice Mode
            </Button>
            <Button
              {...btnProps("muted")}
              marginTop={10}
              opacity={canStart ? 1 : 0.4}
              onPress={canStart ? () => setScreen("reference") : undefined}
            >
              Reference
            </Button>

            <Text
              textAlign="center"
              marginTop={20}
              fontSize={11}
              color={C.faint}
              letterSpacing={1}
              fontFamily="$mono"
            >
              {TOTAL_QUESTIONS} questions · multiple choice
            </Text>
          </AnimatedYStack>
        )}

        {/* ─── QUIZ ─── */}
        {screen === "quiz" && currentQ && (
          <YStack>
            <XStack
              justifyContent="space-between"
              alignItems="center"
              marginBottom={8}
            >
              <Text
                color={C.dim}
                cursor="pointer"
                fontSize={12}
                letterSpacing={2}
                fontFamily="$mono"
                paddingVertical={8}
                onPress={() => setScreen("home")}
              >
                ← BACK
              </Text>
              <Text
                fontSize={11}
                color={C.dim}
                letterSpacing={3}
                fontFamily="$mono"
              >
                {currentIndex + 1} / {questions.length}
              </Text>
              <Text
                fontSize={11}
                color={C.primary}
                letterSpacing={2}
                fontFamily="$mono"
              >
                {score} correct
              </Text>
            </XStack>

            <View
              height={2}
              backgroundColor={C.bgLight}
              borderRadius={1}
              marginBottom={32}
              overflow="hidden"
            >
              <View
                height="100%"
                backgroundColor={C.primary}
                borderRadius={1}
                width={`${progress}%` as any}
              />
            </View>

            {streak >= 3 && (
              <XStack justifyContent="center" marginBottom={16}>
                <View
                  paddingVertical={4}
                  paddingHorizontal={10}
                  backgroundColor={C.streakBg}
                  borderRadius={2}
                >
                  <Text fontSize={11} color={C.primary} fontFamily="$mono">
                    🔥 {streak} streak
                  </Text>
                </View>
              </XStack>
            )}

            <AnimatedYStack
              alignItems="center"
              marginBottom={40}
              opacity={fadeIn ? 1 : 0}
              y={fadeIn ? 0 : 10}
            >
              <Text
                fontSize={12}
                color={C.dim}
                letterSpacing={2}
                fontFamily="$mono"
              >
                {mode === MODES.CHAR_TO_ROMAJI
                  ? "What is the romaji for"
                  : "Which character is"}
              </Text>
              {mode === MODES.CHAR_TO_ROMAJI ? (
                <Text
                  fontSize={140}
                  lineHeight={140}
                  marginTop={16}
                  marginBottom={8}
                  color={C.text}
                  fontFamily="$serifJp"
                >
                  {currentQ.item.char}
                </Text>
              ) : (
                <Text
                  fontSize={48}
                  lineHeight={48}
                  marginTop={16}
                  marginBottom={8}
                  color={C.text}
                  fontFamily="$mono"
                  letterSpacing={6}
                  textTransform="uppercase"
                >
                  {currentQ.item.romaji}
                </Text>
              )}
            </AnimatedYStack>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                opacity: fadeIn ? 1 : 0,
                transition: "opacity 0.3s",
              }}
            >
              {currentQ.options.map((opt, i) => {
                const isCorrect = opt.romaji === currentQ.item.romaji;
                const isWrongSelected =
                  selected?.romaji === opt.romaji &&
                  selected?.char === opt.char &&
                  !isCorrect;
                let bg: string = "transparent";
                let border: string = C.border;
                let textColor: string = C.text;

                if (answered) {
                  if (isCorrect) {
                    bg = C.correctBg;
                    border = C.successDark;
                    textColor = C.success;
                  } else if (isWrongSelected) {
                    bg = C.wrongBg;
                    border = C.primary;
                    textColor = C.primary;
                  } else {
                    textColor = C.faint;
                    border = C.bgLight;
                  }
                }

                return (
                  <View
                    key={i}
                    borderRadius={2}
                    borderWidth={1}
                    borderColor={border as any}
                    backgroundColor={bg as any}
                    cursor={answered ? "default" : "pointer"}
                    alignItems="center"
                    justifyContent="center"
                    paddingVertical={mode === MODES.ROMAJI_TO_CHAR ? 20 : 16}
                    onPress={() => handleSelect(opt)}
                    hoverStyle={answered ? {} : { opacity: 0.85 }}
                  >
                    <Text
                      color={textColor as any}
                      fontFamily={
                        mode === MODES.ROMAJI_TO_CHAR ? "$serifJp" : "$mono"
                      }
                      fontSize={mode === MODES.ROMAJI_TO_CHAR ? 42 : 16}
                      letterSpacing={mode === MODES.ROMAJI_TO_CHAR ? 0 : 2}
                    >
                      {mode === MODES.CHAR_TO_ROMAJI ? opt.romaji : opt.char}
                    </Text>
                  </View>
                );
              })}
            </div>

            {answered && (
              <AnimatedYStack
                enterStyle={{ opacity: 0, y: 10 }}
                opacity={1}
                y={0}
              >
                {selected?.romaji !== currentQ.item.romaji && (
                  <Text
                    textAlign="center"
                    marginTop={16}
                    fontSize={13}
                    color={C.muted}
                  >
                    Correct answer:{" "}
                    <Text color={C.success}>
                      {currentQ.item.char} = {currentQ.item.romaji}
                    </Text>
                  </Text>
                )}
                <Button
                  {...btnProps("outlineSm")}
                  marginTop={20}
                  onPress={nextQuestion}
                >
                  {currentIndex + 1 >= questions.length
                    ? "See Results"
                    : "Next →"}
                </Button>
              </AnimatedYStack>
            )}
          </YStack>
        )}

        {/* ─── PRACTICE ─── */}
        {screen === "practice" && practiceDeck.length > 0 && (
          <YStack>
            <XStack
              justifyContent="space-between"
              alignItems="center"
              marginBottom={8}
            >
              <Text
                color={C.dim}
                cursor="pointer"
                fontSize={12}
                letterSpacing={2}
                fontFamily="$mono"
                paddingVertical={8}
                onPress={() => setScreen("home")}
              >
                ← BACK
              </Text>
              <Text
                fontSize={11}
                color={C.primary}
                letterSpacing={3}
                fontFamily="$mono"
                textTransform="uppercase"
              >
                Practice
              </Text>
              <Text
                fontSize={11}
                color={C.dim}
                letterSpacing={2}
                fontFamily="$mono"
              >
                {practiceCount} reviewed
              </Text>
            </XStack>

            <AnimatedYStack
              opacity={practiceFade ? 1 : 0}
              y={practiceFade ? 0 : 10}
            >
              <View
                marginTop={32}
                marginBottom={24}
                borderWidth={1}
                borderColor={C.border}
                borderRadius={2}
                cursor="pointer"
                onPress={() => setPracticeRevealed(true)}
              >
                <YStack paddingVertical={40} alignItems="center">
                  <Text
                    fontSize={10}
                    letterSpacing={4}
                    textTransform="uppercase"
                    color={C.dim}
                    marginBottom={8}
                    fontFamily="$mono"
                  >
                    {practiceRevealed ? "Answer" : "Tap to reveal"}
                  </Text>
                  <Text
                    fontSize={120}
                    lineHeight={120}
                    color={C.text}
                    fontFamily="$serifJp"
                  >
                    {practiceDeck[0]!.char}
                  </Text>
                </YStack>

                <YStack
                  width="100%"
                  borderTopWidth={1}
                  borderColor={C.border}
                  paddingVertical={24}
                  alignItems="center"
                  opacity={practiceRevealed ? 1 : 0}
                >
                  <Text
                    fontSize={30}
                    fontFamily="$mono"
                    letterSpacing={6}
                    color={C.text}
                    textTransform="uppercase"
                  >
                    {practiceDeck[0]!.romaji}
                  </Text>
                </YStack>
              </View>

              {practiceRevealed && (
                <AnimatedYStack
                  enterStyle={{ opacity: 0, y: 10 }}
                  opacity={1}
                  y={0}
                >
                  <Text
                    fontSize={10}
                    letterSpacing={4}
                    textTransform="uppercase"
                    color={C.dim}
                    marginBottom={12}
                    fontFamily="$mono"
                    textAlign="center"
                  >
                    How well did you know it?
                  </Text>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 10,
                    }}
                  >
                    {[
                      {
                        d: "hard" as Difficulty,
                        color: C.primary,
                        bg: C.wrongBg,
                      },
                      {
                        d: "medium" as Difficulty,
                        color: C.muted,
                        bg: "transparent",
                      },
                      {
                        d: "easy" as Difficulty,
                        color: C.success,
                        bg: C.correctBg,
                      },
                    ].map(({ d, color, bg }) => (
                      <View
                        key={d}
                        paddingVertical={16}
                        borderRadius={2}
                        borderWidth={1}
                        borderColor={
                          (d === "medium"
                            ? C.border
                            : d === "hard"
                              ? C.primary
                              : C.successDark) as any
                        }
                        backgroundColor={bg as any}
                        alignItems="center"
                        cursor="pointer"
                        onPress={() => ratePractice(d)}
                        hoverStyle={{ opacity: 0.85 }}
                      >
                        <Text
                          fontSize={12}
                          letterSpacing={3}
                          textTransform="uppercase"
                          fontFamily="$mono"
                          color={color}
                        >
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </Text>
                      </View>
                    ))}
                  </div>
                </AnimatedYStack>
              )}
            </AnimatedYStack>
          </YStack>
        )}

        {/* ─── REFERENCE ─── */}
        {screen === "reference" && (
          <AnimatedYStack enterStyle={{ opacity: 0, y: 20 }} opacity={1} y={0}>
            <XStack
              justifyContent="space-between"
              alignItems="center"
              marginBottom={24}
            >
              <Text
                color={C.dim}
                cursor="pointer"
                fontSize={12}
                letterSpacing={2}
                fontFamily="$mono"
                paddingVertical={8}
                onPress={() => setScreen("home")}
              >
                ← BACK
              </Text>
              <Text
                fontSize={11}
                color={C.primary}
                letterSpacing={3}
                fontFamily="$mono"
                textTransform="uppercase"
              >
                {scriptType === "hiragana" ? "ひらがな" : "カタカナ"} Reference
              </Text>
            </XStack>

            {includeBasic && (
              <>
                <Label color={C.dim}>Basic Characters</Label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 6,
                    marginBottom: 24,
                  }}
                >
                  {(scriptType === "hiragana" ? HIRAGANA : KATAKANA)
                    .slice(0, 46)
                    .map((item, i) => (
                      <View
                        key={i}
                        flexDirection="column"
                        alignItems="center"
                        paddingVertical={12}
                        paddingHorizontal={4}
                        borderRadius={2}
                        borderWidth={1}
                        borderColor={C.border}
                        backgroundColor={C.refCardBg}
                        cursor="pointer"
                        onPress={() => setRefOverlay(item)}
                        pressStyle={{ scale: 0.95 }}
                      >
                        <Text
                          fontSize={28}
                          fontFamily="$serifJp"
                          lineHeight={28}
                          marginBottom={6}
                          color={C.text}
                        >
                          {item.char}
                        </Text>
                        <Text
                          fontSize={11}
                          fontFamily="$mono"
                          color={C.muted}
                          letterSpacing={1}
                        >
                          {item.romaji}
                        </Text>
                      </View>
                    ))}
                </div>
              </>
            )}

            {includeDakuten && (
              <>
                <Label color={C.dim}>Dakuten / Handakuten</Label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 6,
                    marginBottom: 24,
                  }}
                >
                  {(scriptType === "hiragana" ? HIRAGANA : KATAKANA)
                    .slice(46)
                    .map((item, i) => (
                      <View
                        key={i}
                        flexDirection="column"
                        alignItems="center"
                        paddingVertical={12}
                        paddingHorizontal={4}
                        borderRadius={2}
                        borderWidth={1}
                        borderColor={C.border}
                        backgroundColor={C.refCardBg}
                        cursor="pointer"
                        onPress={() => setRefOverlay(item)}
                        pressStyle={{ scale: 0.95 }}
                      >
                        <Text
                          fontSize={28}
                          fontFamily="$serifJp"
                          lineHeight={28}
                          marginBottom={6}
                          color={C.text}
                        >
                          {item.char}
                        </Text>
                        <Text
                          fontSize={11}
                          fontFamily="$mono"
                          color={C.muted}
                          letterSpacing={1}
                        >
                          {item.romaji}
                        </Text>
                      </View>
                    ))}
                </div>
              </>
            )}

            <Button {...btnProps("primary")} onPress={startQuiz}>
              Start Quiz
            </Button>

            {/* Zoom overlay */}
            {refOverlay && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => setRefOverlay(null)}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: C.overlayBg,
                    backdropFilter: "blur(4px)",
                  }}
                />
                <AnimatedYStack
                  alignItems="center"
                  enterStyle={{ opacity: 0, scale: 0.6 }}
                  opacity={1}
                  scale={1}
                  zIndex={1}
                >
                  <YStack
                    borderWidth={1}
                    borderColor={C.border}
                    borderRadius={2}
                    backgroundColor={C.bg}
                    paddingHorizontal={48}
                    paddingVertical={40}
                    alignItems="center"
                  >
                    <Text
                      fontSize={140}
                      fontFamily="$serifJp"
                      lineHeight={140}
                      marginBottom={16}
                      color={C.text}
                    >
                      {refOverlay.char}
                    </Text>
                    <Text
                      fontSize={24}
                      fontFamily="$mono"
                      color={C.muted}
                      letterSpacing={6}
                      textTransform="uppercase"
                    >
                      {refOverlay.romaji}
                    </Text>
                  </YStack>
                  <Text
                    fontSize={10}
                    color={C.dim}
                    letterSpacing={3}
                    fontFamily="$mono"
                    marginTop={16}
                    textTransform="uppercase"
                  >
                    Tap to close
                  </Text>
                </AnimatedYStack>
              </div>
            )}
          </AnimatedYStack>
        )}

        {/* ─── RESULTS ─── */}
        {screen === "results" && (
          <AnimatedYStack enterStyle={{ opacity: 0, y: 20 }} opacity={1} y={0}>
            <View height={20} />
            <Text
              fontSize={14}
              letterSpacing={6}
              textTransform="uppercase"
              color={C.primary}
              textAlign="center"
              marginBottom={8}
              fontFamily="$mono"
            >
              Complete
            </Text>
            <Text
              fontSize={72}
              textAlign="center"
              color={C.primary}
              fontFamily="$mono"
              lineHeight={72}
              marginTop={20}
              marginBottom={4}
            >
              {Math.round((score / questions.length) * 100)}%
            </Text>
            <Text
              fontSize={12}
              textAlign="center"
              color={C.dim}
              letterSpacing={3}
              fontFamily="$mono"
              marginBottom={32}
            >
              {score} / {questions.length} CORRECT
            </Text>

            <XStack justifyContent="center" gap={32} marginBottom={32}>
              <YStack alignItems="center">
                <Text fontSize={24} color={C.text} fontFamily="$mono">
                  {bestStreak}
                </Text>
                <Text
                  fontSize={10}
                  color={C.dim}
                  letterSpacing={2}
                  fontFamily="$mono"
                  marginTop={4}
                >
                  BEST STREAK
                </Text>
              </YStack>
              <YStack alignItems="center">
                <Text fontSize={24} color={C.text} fontFamily="$mono">
                  {score >= questions.length * 0.9
                    ? "素晴らしい"
                    : score >= questions.length * 0.7
                      ? "いいね"
                      : "頑張って"}
                </Text>
                <Text
                  fontSize={10}
                  color={C.dim}
                  letterSpacing={2}
                  fontFamily="$mono"
                  marginTop={4}
                >
                  {score >= questions.length * 0.9
                    ? "WONDERFUL"
                    : score >= questions.length * 0.7
                      ? "NICE"
                      : "KEEP GOING"}
                </Text>
              </YStack>
            </XStack>

            <Label color={C.dim}>Review</Label>
            <YStack
              borderWidth={1}
              borderColor={C.bgLight}
              borderRadius={2}
              marginBottom={24}
            >
              {history.map((h, i) => (
                <XStack
                  key={i}
                  alignItems="center"
                  paddingVertical={12}
                  paddingHorizontal={16}
                  borderBottomWidth={1}
                  borderColor={C.bgLight}
                  gap={16}
                >
                  <Text
                    fontSize={28}
                    width={48}
                    textAlign="center"
                    fontFamily="$serifJp"
                  >
                    {h.item.char}
                  </Text>
                  <Text
                    fontSize={14}
                    fontFamily="$mono"
                    letterSpacing={2}
                    color={C.muted}
                    flex={1}
                  >
                    {h.item.romaji}
                  </Text>
                  <Text
                    fontSize={14}
                    fontFamily="$mono"
                    color={h.correct ? C.success : C.primary}
                  >
                    {h.correct ? "✓" : `✗ ${h.selected.romaji}`}
                  </Text>
                </XStack>
              ))}
            </YStack>

            <XStack gap={10}>
              <Button
                {...btnProps("outlineSm")}
                flex={1}
                onPress={() => setScreen("home")}
              >
                Menu
              </Button>
              <Button {...btnProps("primary")} flex={1} onPress={startQuiz}>
                Retry
              </Button>
            </XStack>
          </AnimatedYStack>
        )}
      </ContentWrap>
    </ScreenContainer>
  );
}
