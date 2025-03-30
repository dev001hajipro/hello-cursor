"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// マレーシア語の練習テキストと日本語訳
const sampleTexts = [
  {
    malay: "Selamat pagi! Apa khabar?",
    japanese: "おはようございます！お元気ですか？",
  },
  {
    malay: "Saya suka makan nasi lemak.",
    japanese: "私はナシレマックが好きです。",
  },
  {
    malay: "Terima kasih banyak-banyak.",
    japanese: "どうもありがとうございます。",
  },
  {
    malay: "Sila duduk di sini.",
    japanese: "ここにお座りください。",
  },
  {
    malay: "Boleh saya tolong anda?",
    japanese: "お手伝いできますか？",
  },
];

export default function TypingPage() {
  const [currentText, setCurrentText] = useState("");
  const [currentTranslation, setCurrentTranslation] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 初期の音声リストを取得
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // 音声リストが後から読み込まれた場合のイベントリスナー
      window.speechSynthesis.onvoiceschanged = () => {
        const newVoices = window.speechSynthesis.getVoices();
        setVoices(newVoices);
        // マレー語の音声があれば自動選択
        const malayVoice = newVoices.find((voice) =>
          voice.lang.includes("ms-MY")
        );
        if (malayVoice) {
          setSelectedVoice(malayVoice);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (isStarted) {
      const randomIndex = Math.floor(Math.random() * sampleTexts.length);
      setCurrentText(sampleTexts[randomIndex].malay);
      setCurrentTranslation(sampleTexts[randomIndex].japanese);
    }
  }, [isStarted]);

  const handleStart = () => {
    setIsStarted(true);
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsComplete(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);

    if (!startTime) {
      setStartTime(Date.now());
    }

    // 正確性の計算
    const correct = input
      .split("")
      .filter((char, i) => char === currentText[i]).length;
    const accuracy = (correct / input.length) * 100;
    setAccuracy(Math.round(accuracy));

    // WPMの計算
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60;
      const wordsTyped = input.length / 5;
      setWpm(Math.round(wordsTyped / timeElapsed));
    }

    // 完了チェック
    if (input === currentText) {
      setIsComplete(true);
    }
  };

  const resetPractice = () => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setCurrentText(sampleTexts[randomIndex].malay);
    setCurrentTranslation(sampleTexts[randomIndex].japanese);
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsComplete(false);
  };

  const playAudio = () => {
    if (typeof window !== "undefined") {
      const utterance = new SpeechSynthesisUtterance(currentText);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        utterance.lang = "ms-MY";
      }
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          マレーシア語タイピング練習
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            音声を選択
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
            value={selectedVoice?.voiceURI || ""}
            onChange={(e) => {
              const voice = voices.find((v) => v.voiceURI === e.target.value);
              setSelectedVoice(voice || null);
            }}
          >
            <option value="">デフォルト (マレー語)</option>
            {voices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>

          {selectedVoice && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p>現在の音声：</p>
              <ul className="list-disc list-inside">
                <li>名前: {selectedVoice.name}</li>
                <li>言語: {selectedVoice.lang}</li>
                <li>デフォルト: {selectedVoice.default ? "はい" : "いいえ"}</li>
                <li>
                  ローカル: {selectedVoice.localService ? "はい" : "いいえ"}
                </li>
              </ul>
            </div>
          )}
        </div>

        {!isStarted ? (
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 mb-4">
              準備ができたらスタートボタンを押してください
            </p>
            <button
              onClick={handleStart}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              スタート
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-xl text-gray-700 text-center">
                  {currentText}
                </p>
                <button
                  onClick={playAudio}
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                  title="発音を聞く"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 text-center mb-4">
                {currentTranslation}
              </p>
              <input
                type="text"
                value={userInput}
                onChange={handleInput}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ここにタイプしてください..."
                disabled={isComplete}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">WPM</p>
                <p className="text-2xl font-bold">{wpm}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">正確性</p>
                <p className="text-2xl font-bold">{accuracy}%</p>
              </div>
            </div>
          </>
        )}

        {isComplete && (
          <div className="text-center mb-6">
            <p className="text-green-600 font-bold mb-4">
              おめでとうございます！
            </p>
            <button
              onClick={resetPractice}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              次の練習
            </button>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
