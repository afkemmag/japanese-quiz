import React from "react";
import ReactDOM from "react-dom/client";
import { TamaguiProvider } from "tamagui";
import config from "./tamagui.config";
import JapaneseQuiz from "./App";
import "./index.css";

console.log("main.tsx loaded");
console.log("config themes:", Object.keys(config.themes).length);

try {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <TamaguiProvider config={config} defaultTheme="dark">
        <JapaneseQuiz />
      </TamaguiProvider>
    </React.StrictMode>
  );
  console.log("render called successfully");
} catch (e) {
  console.error("render error:", e);
  document.getElementById("root")!.innerHTML = `<pre style="color:red">${e}</pre>`;
}
