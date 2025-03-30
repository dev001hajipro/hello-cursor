"use client";

import Link from "next/link";
import { useState } from "react";

export default function CounterPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">カウンター</h1>

        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-gray-800">{count}</p>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setCount(count - 1)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            -1
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            +1
          </button>
        </div>

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
