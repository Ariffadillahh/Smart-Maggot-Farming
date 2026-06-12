'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { useRoleGuard } from '@/hooks/useRoleGuard';

export default function QuizManagement() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [optionA, setOptionA] = useState('');
    const [optionB, setOptionB] = useState('');
    const [optionC, setOptionC] = useState('');
    const [optionD, setOptionD] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('A');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isGuardLoading = useRoleGuard('admin');

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setQuizzes(data);
        setLoading(false);
    };

    const handleCreateQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { error } = await supabase.from('quizzes').insert([
            {
                title,
                question,
                option_a: optionA,
                option_b: optionB,
                option_c: optionC,
                option_d: optionD,
                correct_answer: correctAnswer
            }
        ]);

        if (!error) {
            setTitle(''); setQuestion(''); setOptionA(''); setOptionB('');
            setOptionC(''); setOptionD(''); setCorrectAnswer('A');
            fetchQuizzes();
        } else {
            alert('Gagal menambah quiz: ' + error.message);
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus soal ini?')) return;

        const { error } = await supabase.from('quizzes').delete().eq('id', id);
        if (!error) fetchQuizzes();
    };

    if (isGuardLoading || loading) {
        return <div className="p-10 text-center font-medium text-gray-500">Memuat halaman kuis...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Plus size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Tambah Soal Baru</h3>
                </div>

                <form onSubmit={handleCreateQuiz} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Judul Topik</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black" placeholder="Contoh: Dasar Budidaya Maggot" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Pertanyaan</label>
                        <textarea value={question} onChange={e => setQuestion(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black" rows={2} placeholder="Tuliskan pertanyaan di sini..." />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Pilihan A</label>
                        <input type="text" value={optionA} onChange={e => setOptionA(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-xl outline-none text-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Pilihan B</label>
                        <input type="text" value={optionB} onChange={e => setOptionB(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-xl outline-none text-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Pilihan C</label>
                        <input type="text" value={optionC} onChange={e => setOptionC(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-xl outline-none text-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Pilihan D</label>
                        <input type="text" value={optionD} onChange={e => setOptionD(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-xl outline-none text-black" />
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-bold text-gray-700">Jawaban Benar:</label>
                            <select value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} className="p-2 border border-gray-300 rounded-lg font-bold outline-none text-black cursor-pointer">
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-50">
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Soal'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <BookOpen size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Daftar Soal Quiz</h3>
                </div>

                <div className="space-y-4">
                    {quizzes.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Belum ada data soal.</p>
                    ) : (
                        quizzes.map((quiz) => (
                            <div key={quiz.id} className="p-4 border border-gray-300 rounded-xl hover:border-emerald-200 transition-colors relative group">
                                <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md mb-2 inline-block">{quiz.title}</span>
                                <p className="font-bold text-gray-800 mb-3">{quiz.question}</p>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <div className={quiz.correct_answer === 'A' ? 'font-bold text-emerald-600' : ''}>A. {quiz.option_a}</div>
                                    <div className={quiz.correct_answer === 'B' ? 'font-bold text-emerald-600' : ''}>B. {quiz.option_b}</div>
                                    <div className={quiz.correct_answer === 'C' ? 'font-bold text-emerald-600' : ''}>C. {quiz.option_c}</div>
                                    <div className={quiz.correct_answer === 'D' ? 'font-bold text-emerald-600' : ''}>D. {quiz.option_d}</div>
                                </div>
                                <button onClick={() => handleDelete(quiz.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}