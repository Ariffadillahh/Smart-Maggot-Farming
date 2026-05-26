"use client";

import { useState } from "react";
import { Trophy, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

// Tipe data untuk struktur Kuis
type QuizQuestion = {
    question: string;
    options: string[];
    correct: number;
};

const quizData: QuizQuestion[] = [
    {
        question: "Apa makanan utama dari larva maggot BSF (Black Soldier Fly)?",
        options: ["Daging mentah", "Sampah organik/sisa makanan", "Plastik", "Logam"],
        correct: 1,
    },
    {
        question: "Berapa lama siklus hidup BSF dari telur hingga menjadi lalat dewasa?",
        options: ["5 hari", "15 hari", "40-45 hari", "1 tahun"],
        correct: 2,
    },
    {
        question: "Apa manfaat utama budidaya maggot bagi lingkungan?",
        options: ["Menghasilkan listrik", "Mengurangi sampah organik", "Membuat pupuk kimia", "Membersihkan polusi udara"],
        correct: 1,
    },
];

export default function EdukasiMaggot() {
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
        new Array(quizData.length).fill(null)
    );
    const [showResult, setShowResult] = useState<boolean>(false);

    const handleOptionSelect = (optionIndex: number): void => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestion] = optionIndex;
        setUserAnswers(newAnswers);
    };

    const calculateScore = (): number => {
        return userAnswers.reduce((score: number, answer: number | null, index: number) => {
            return answer === quizData[index].correct ? score + 1 : score;
        }, 0);
    };

    const resetQuiz = (): void => {
        setCurrentQuestion(0);
        setUserAnswers(new Array(quizData.length).fill(null));
        setShowResult(false);
    };

    return (
        <div className="flex justify-center">
            <div className="w-full bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8">
                {!showResult ? (
                    <div>
                        <div className="mb-8">
                            <p className="text-emerald-600 font-semibold mb-2 text-sm">
                                Pertanyaan {currentQuestion + 1} dari {quizData.length}
                            </p>
                            <h2 className="md:text-2xl text-lg font-black text-gray-800">
                                {quizData[currentQuestion].question}
                            </h2>
                        </div>

                        <div className="space-y-4 mb-8">
                            {quizData[currentQuestion].options.map((option: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(index)}
                                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${userAnswers[currentQuestion] === index
                                            ? "border-emerald-500 bg-emerald-50"
                                            : "border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/30"
                                        }`}
                                >
                                    <span className="font-semibold text-gray-700">{option}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                disabled={currentQuestion === 0}
                                className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-all"
                            >
                                <ChevronLeft size={20} /> Prev
                            </button>

                            {currentQuestion < quizData.length - 1 ? (
                                <button
                                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                    disabled={userAnswers[currentQuestion] === null}
                                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-600 text-white disabled:bg-gray-300 hover:bg-emerald-700 transition-all"
                                >
                                    Next <ChevronRight size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowResult(true)}
                                    disabled={userAnswers[currentQuestion] === null}
                                    className="px-6 py-2 rounded-full bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-all"
                                >
                                    Selesai
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <Trophy size={64} className="mx-auto text-yellow-500 mb-6" />
                        <h2 className="text-3xl font-black text-gray-800 mb-2">Kuis Selesai!</h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Skor Akhir Anda: <span className="font-bold text-emerald-700">{calculateScore()}</span> / {quizData.length}
                        </p>
                        <button
                            onClick={resetQuiz}
                            className="flex items-center gap-2 mx-auto bg-emerald-600 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all"
                        >
                            <RefreshCw size={20} /> Ulangi Kuis
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}