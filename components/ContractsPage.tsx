


import React, { useState } from 'react';
import { SparklesIcon, DocumentDuplicateIcon, PrinterIcon } from './icons/Icons';
import { generateContractWithAI } from '../services/geminiService';
import PageHeader from './PageHeader';
import Card from './Card';
import { useTranslation } from './contexts/LanguageContext';

const ContractsPage: React.FC = () => {
    const { t, language } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const [generatedContract, setGeneratedContract] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError(t('contracts.promptRequiredError'));
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedContract('');

        try {
            const contractText = await generateContractWithAI(prompt, language);
            setGeneratedContract(contractText);
        } catch (err: any) {
            setError(err.message || t('contracts.unexpectedError'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContract);
        alert(t('contracts.copiedAlert'));
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${t('contracts.printTitle')}</title>
                        <style>
                            body { 
                                font-family: 'Cairo', sans-serif; 
                                direction: ${language === 'ar' ? 'rtl' : 'ltr'};
                                line-height: 1.6;
                                padding: 2rem;
                                color: #333;
                            }
                            pre { 
                                white-space: pre-wrap; 
                                word-wrap: break-word;
                                font-family: inherit;
                            }
                            @media print {
                                body {
                                    color: #000;
                                }
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
            <PageHeader
                title={t('contracts.pageHeaderTitle')}
                subtitle={t('contracts.pageHeaderSubtitle')}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <Card title={t('contracts.keyPointsTitle')}>
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <textarea
                            id="contract-points"
                            rows={12}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors bg-white dark:bg-slate-700 dark:text-white"
                            placeholder={t('contracts.promptPlaceholder')}
                            spellCheck="true"
                        />
                         {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md disabled:bg-slate-400 dark:disabled:bg-slate-600"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>{t('contracts.generatingButton')}</span>
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-6 h-6" />
                                    <span>{t('contracts.generateButton')}</span>
                                </>
                            )}
                        </button>
                    </form>
                </Card>

                <Card title={t('contracts.draftContractTitle')} className="flex flex-col min-h-[580px]">
                     <div className="flex justify-end mb-4">
                        {generatedContract && !isLoading && (
                            <div className="flex items-center gap-2">
                                <button onClick={handleCopy} className="flex items-center gap-1.5 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-1 px-3 rounded-md transition-colors" title={t('contracts.copyTooltip')}>
                                    <DocumentDuplicateIcon className="w-4 h-4"/>
                                    <span>{t('contracts.copyButton')}</span>
                                </button>
                                <button onClick={handlePrint} className="flex items-center gap-1.5 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-1 px-3 rounded-md transition-colors" title={t('contracts.printTooltip')}>
                                    <PrinterIcon className="w-4 h-4"/>
                                    <span>{t('contracts.printButton')}</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-4 h-full">
                        <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200 font-sans h-full overflow-y-auto">
                            {isLoading 
                                ? <div className="flex items-center justify-center h-full"><span className="animate-pulse">{t('contracts.aiWriting')}</span></div> 
                                : (generatedContract || <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">{t('contracts.draftPlaceholder')}</div>)}
                        </pre>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ContractsPage;