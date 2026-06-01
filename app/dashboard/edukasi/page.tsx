"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy, RefreshCw, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";

type QuizQuestion = {
    id: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
};

export default function EdukasiMaggot() {
    const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            const { data, error } = await supabase.from('quizzes').select('*');
            if (data) {
                setQuizData(data);
                setUserAnswers(new Array(data.length).fill(null));
            }
            setLoading(false);
        };
        fetchQuizzes();
    }, []);

    const handleOptionSelect = (optionLetter: string): void => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestion] = optionLetter;
        setUserAnswers(newAnswers);
        setError(null); 
    };

    const handleNext = () => {
        if (userAnswers[currentQuestion] === null) {
            setError("Silakan pilih jawaban terlebih dahulu!");
            return;
        }
        setError(null);
        setCurrentQuestion(currentQuestion + 1);
    };

    const calculateScore = (): number => {
        return userAnswers.reduce((score, answer, index) => {
            return answer === quizData[index].correct_answer ? score + 1 : score;
        }, 0);
    };

    const resetQuiz = (): void => {
        setCurrentQuestion(0);
        setUserAnswers(new Array(quizData.length).fill(null));
        setShowResult(false);
        setError(null);
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>;
    if (quizData.length === 0) return <div className="text-center p-10 font-bold text-gray-500">Belum ada soal kuis tersedia.</div>;

    const currentQuiz = quizData[currentQuestion];
    const options = [
        { label: 'A', text: currentQuiz.option_a },
        { label: 'B', text: currentQuiz.option_b },
        { label: 'C', text: currentQuiz.option_c },
        { label: 'D', text: currentQuiz.option_d },
    ];

    return (
        <div className="flex justify-center w-full">
            <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                {!showResult ? (
                    <div>
                        <div className="mb-8">
                            <p className="text-emerald-600 font-bold mb-2 text-sm uppercase tracking-wider">
                                Pertanyaan {currentQuestion + 1} dari {quizData.length}
                            </p>
                            <h2 className="text-xl md:text-2xl font-black text-gray-800 leading-snug">
                                {currentQuiz.question}
                            </h2>
                        </div>

                        <div className="space-y-4 mb-8">
                            {options.map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => handleOptionSelect(opt.label)}
                                    className={`w-full p-4 text-left rounded-xl border-2 transition-all font-semibold ${userAnswers[currentQuestion] === opt.label
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                            : "border-gray-100 hover:border-emerald-200 text-gray-700"
                                        }`}
                                >
                                    {opt.label}. {opt.text}
                                </button>
                            ))}
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg mb-4 font-bold text-sm">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        <div className="flex justify-between">
                            <button
                                onClick={() => { setCurrentQuestion(Math.max(0, currentQuestion - 1)); setError(null); }}
                                disabled={currentQuestion === 0}
                                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-100 text-gray-500 disabled:opacity-30 hover:bg-gray-50 font-bold transition-all"
                            >
                                <ChevronLeft size={20} /> Prev
                            </button>

                            {currentQuestion < quizData.length - 1 ? (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 font-bold transition-all"
                                >
                                    Next <ChevronRight size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (userAnswers[currentQuestion] === null) {
                                            setError("Pilih jawaban untuk menyelesaikan kuis!");
                                        } else {
                                            setShowResult(true);
                                        }
                                    }}
                                    className="px-8 py-3 rounded-full bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-all"
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
                            className="flex items-center gap-2 mx-auto bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all"
                        >
                            <RefreshCw size={20} /> Ulangi Kuis
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}