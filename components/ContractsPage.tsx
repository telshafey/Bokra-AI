
import React, { useState } from 'react';
import { SparklesIcon, DocumentDuplicateIcon, PrinterIcon } from './icons/Icons';
import { generateContractWithAI } from '../services/geminiService';

const ContractsPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedContract, setGeneratedContract] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('يرجى إدخال النقاط الأساسية للعقد.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedContract('');

        try {
            const contractText = await generateContractWithAI(prompt);
            setGeneratedContract(contractText);
        } catch (err: any) {
            setError(err.message || 'حدث خطأ غير متوقع.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContract);
        alert('تم نسخ نص العقد!');
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>طباعة العقد</title>
                        <style>
                            body { 
                                font-family: 'Cairo', sans-serif; 
                                direction: rtl;
                                line-height: 1.6;
                            }
                            pre { 
                                white-space: pre-wrap; 
                                word-wrap: break-word;
                                font-family: inherit;
                            }
                        </style>
                    </head>
                    <body>
                        <pre>${generatedContract}</pre>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };


    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800">توليد عقود العمل بالذكاء الاصطناعي</h1>
                <p className="text-slate-500 mt-1 max-w-2xl mx-auto">
                    أدخل النقاط الرئيسية مثل (اسم الموظف، المنصب، الراتب، تاريخ البدء) وسيقوم الذكاء الاصطناعي بصياغة مسودة عقد عمل رسمي متوافق مع قانون العمل المصري.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <label htmlFor="contract-points" className="block text-lg font-bold text-slate-700">
                            النقاط الأساسية للعقد
                        </label>
                        <textarea
                            id="contract-points"
                            rows={12}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                            placeholder="مثال:&#10;- اسم الموظف: أحمد علي&#10;- المسمى الوظيفي: مهندس برمجيات&#10;- الراتب الأساسي: 15000 جنيه مصري&#10;- تاريخ بدء العمل: 1/10/2025&#10;- مدة العقد: سنة واحدة"
                        />
                         {error && <p className="text-sm text-red-600">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md disabled:bg-slate-400"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>جاري توليد العقد...</span>
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-6 h-6" />
                                    <span>توليد مسودة العقد</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                 <div className="bg-white p-6 rounded-xl shadow-md flex flex-col h-full min-h-[500px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-700">مسودة العقد</h3>
                        {generatedContract && !isLoading && (
                            <div className="flex items-center gap-2">
                                <button onClick={handleCopy} className="flex items-center gap-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1 px-3 rounded-md transition-colors" title="نسخ النص">
                                    <DocumentDuplicateIcon className="w-4 h-4"/>
                                    <span>نسخ</span>
                                </button>
                                <button onClick={handlePrint} className="flex items-center gap-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1 px-3 rounded-md transition-colors" title="طباعة">
                                    <PrinterIcon className="w-4 h-4"/>
                                    <span>طباعة</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 bg-slate-50 border rounded-lg p-4 h-full">
                        <pre className="whitespace-pre-wrap text-sm text-slate-800 font-sans h-full overflow-y-auto">
                            {isLoading 
                                ? <div className="flex items-center justify-center h-full"><span className="animate-pulse">جاري الكتابة بواسطة الذكاء الاصطناعي...</span></div> 
                                : (generatedContract || <div className="flex items-center justify-center h-full text-slate-400">سيظهر العقد الذي تم إنشاؤه هنا...</div>)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractsPage;
