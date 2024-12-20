import React, { useState } from 'react';
import { askQuestion } from '../services/frontend.service';

const Question: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [relevantChunks, setRelevantChunks] = useState<{ text: string; score: number }[]>([]);

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await askQuestion(question);
            if (response.status === 204) {
                setAnswer('No Answer found');
                setRelevantChunks([]);
                return;
            }
            setAnswer(response.data.answer);
            setRelevantChunks(response.data.relevantChunks || []);
        } catch (error) {
            console.error('Error fetching answer:', error);
            setAnswer('An error occurred while fetching the answer.');
            setRelevantChunks([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-lg mb-4">Ask a Question</h2>
            <form onSubmit={handleQuestionSubmit} className="mb-4 flex flex-col sm:flex-row">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question here..."
                    required
                    className="w-full min-w-10 max-w-72 p-2 mr-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 w-24 rounded mt-2 sm:mt-0"
                >
                    {loading ? 'Fetching...' : 'Submit'}
                </button>
            </form>
            {answer && (
                <div className="mt-6">
                    <h3 className="text-xl font-medium text-gray-800">Answer:</h3>
                    <p className="text-gray-700">{answer}</p>

                    {relevantChunks.length > 0 && (
                        <>
                            <h4 className="text-lg font-semibold text-gray-800 mt-4">Relevant Chunks:</h4>
                            <ul className="list-disc pl-6 space-y-2">
                                {relevantChunks.map((chunk, index) => (
                                    <li key={index} className="text-gray-600">
                                        <p>
                                            <strong>Chunk:</strong> {chunk.text}
                                        </p>
                                        <p>
                                            <strong>Confidence:</strong> {(chunk.score * 100).toFixed(2)}%
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Question;
