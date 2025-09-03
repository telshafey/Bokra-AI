import React, { useState, useMemo } from 'react';
import { JobOpening, Candidate, CandidateStage } from '../types';
import { UsersIcon, BriefcaseIcon } from './icons/Icons';
import PageHeader from './PageHeader';
import Card from './Card';
import { useTranslation } from './contexts/LanguageContext';

const STAGE_TRANSLATION: Record<CandidateStage, string> = {
    Applied: 'المتقدمون',
    Screening: 'الفحص',
    Interview: 'المقابلة',
    Offer: 'العرض',
    Hired: 'تم التعيين',
    Rejected: 'مرفوض',
};

const STAGE_COLORS: Record<CandidateStage, string> = {
    Applied: 'border-slate-500 text-slate-500 dark:border-slate-400 dark:text-slate-400',
    Screening: 'border-sky-500 text-sky-500 dark:border-sky-400 dark:text-sky-400',
    Interview: 'border-purple-500 text-purple-500 dark:border-purple-400 dark:text-purple-400',
    Offer: 'border-amber-500 text-amber-500 dark:border-amber-400 dark:text-amber-400',
    Hired: 'border-emerald-500 text-emerald-500 dark:border-emerald-400 dark:text-emerald-400',
    Rejected: 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400',
};

const STAGE_BG_COLORS: Record<CandidateStage, string> = {
    Applied: 'bg-slate-500',
    Screening: 'bg-sky-500',
    Interview: 'bg-purple-500',
    Offer: 'bg-amber-500',
    Hired: 'bg-emerald-500',
    Rejected: 'bg-red-500',
};


interface RecruitmentPageProps {
    jobOpenings: JobOpening[];
    candidates: Candidate[];
    onUpdateCandidateStage: (candidateId: string, newStage: CandidateStage) => void;
}

const RecruitmentPage: React.FC<RecruitmentPageProps> = ({ jobOpenings, candidates, onUpdateCandidateStage }) => {
    const [selectedJobId, setSelectedJobId] = useState<string | null>(jobOpenings.find(j => j.status === 'Open')?.id || null);
    const { t } = useTranslation();

    const candidatesByJob = useMemo(() => {
        return candidates.reduce((acc, candidate) => {
            (acc[candidate.jobOpeningId] = acc[candidate.jobOpeningId] || []).push(candidate);
            return acc;
        }, {} as Record<string, Candidate[]>);
    }, [candidates]);
    
    const statsByJobId = useMemo(() => {
        const stats: Record<string, Record<CandidateStage | 'total', number>> = {};
        for (const job of jobOpenings) {
            const jobCandidates = candidatesByJob[job.id] || [];
            stats[job.id] = {
                total: jobCandidates.length,
                Applied: jobCandidates.filter(c => c.stage === 'Applied').length,
                Screening: jobCandidates.filter(c => c.stage === 'Screening').length,
                Interview: jobCandidates.filter(c => c.stage === 'Interview').length,
                Offer: jobCandidates.filter(c => c.stage === 'Offer').length,
                Hired: jobCandidates.filter(c => c.stage === 'Hired').length,
                Rejected: jobCandidates.filter(c => c.stage === 'Rejected').length,
            };
        }
        return stats;
    }, [jobOpenings, candidatesByJob]);


    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, candidateId: string) => {
        e.dataTransfer.setData("candidateId", candidateId);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStage: CandidateStage) => {
        e.preventDefault();
        const candidateId = e.dataTransfer.getData("candidateId");
        if (candidateId) {
            onUpdateCandidateStage(candidateId, newStage);
        }
        (e.currentTarget as HTMLDivElement).classList.remove('bg-slate-200', 'dark:bg-slate-600');
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const renderKanbanBoard = () => {
        if (!selectedJobId) {
            return <div className="text-center p-12 text-slate-500 dark:text-slate-400">الرجاء اختيار وظيفة لعرض المتقدمين.</div>;
        }
        const currentCandidates = candidatesByJob[selectedJobId] || [];

        const stages: CandidateStage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

        return (
            <div className="flex gap-4 overflow-x-auto p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg min-h-[60vh]">
                {stages.map(stage => (
                    <div 
                        key={stage}
                        className="w-72 bg-slate-100 dark:bg-slate-800 rounded-lg flex-shrink-0 flex flex-col"
                        onDrop={(e) => handleDrop(e, stage)}
                        onDragOver={handleDragOver}
                        onDragEnter={(e) => (e.currentTarget as HTMLDivElement).classList.add('bg-slate-200', 'dark:bg-slate-600')}
                        onDragLeave={(e) => (e.currentTarget as HTMLDivElement).classList.remove('bg-slate-200', 'dark:bg-slate-600')}
                    >
                        <h3 className={`font-bold text-slate-800 dark:text-slate-200 p-3 border-t-4 ${STAGE_COLORS[stage]}`}>
                            {STAGE_TRANSLATION[stage]} ({currentCandidates.filter(c => c.stage === stage).length})
                        </h3>
                        <div className="space-y-3 p-2 h-full overflow-y-auto">
                            {currentCandidates.filter(c => c.stage === stage).map(candidate => (
                                <div 
                                    key={candidate.id} 
                                    className="bg-white dark:bg-slate-700 p-3 rounded-md shadow-sm cursor-grab active:cursor-grabbing border-l-4 border-slate-300 dark:border-slate-500"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, candidate.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={candidate.avatarUrl} alt={candidate.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{candidate.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{candidate.email}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <PageHeader title="إدارة التوظيف" subtitle="تتبع الوظائف الشاغرة والمرشحين عبر جميع مراحل التوظيف." />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobOpenings.map(job => {
                    const stats = statsByJobId[job.id];
                    const pipelineStages: CandidateStage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
                    return (
                    <button 
                        key={job.id}
                        onClick={() => setSelectedJobId(job.id)}
                        className={`p-5 bg-white dark:bg-slate-800 rounded-xl shadow-md text-right transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${selectedJobId === job.id ? 'border-sky-500 ring-2 ring-sky-200 dark:ring-sky-500/50' : 'border-transparent'}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{job.title}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 my-1">{t('departments.' + job.departmentKey)}</p>
                            </div>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${job.status === 'Open' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                                {job.status === 'Open' ? 'مفتوحة' : 'مغلقة'}
                            </span>
                        </div>
                         <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 pt-3 mt-3 border-t dark:border-slate-700">
                            <UsersIcon className="w-5 h-5 ml-2 text-sky-600 dark:text-sky-400"/>
                            <span>إجمالي المتقدمين: <strong className="dark:text-slate-200">{stats.total}</strong></span>
                        </div>
                        <div className="mt-2 space-y-2">
                             <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 flex overflow-hidden">
                                {pipelineStages.map(stage => {
                                    if(stats[stage] === 0) return null;
                                    const percentage = (stats.total > 0 ? (stats[stage] / stats.total) * 100 : 0);
                                    return <div key={stage} className={`${STAGE_BG_COLORS[stage]}`} style={{width: `${percentage}%`}} title={`${STAGE_TRANSLATION[stage]}: ${stats[stage]}`}></div>
                                })}
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                                {pipelineStages.map(stage => {
                                     if(stats[stage] === 0) return null;
                                    return (
                                        <div key={stage} className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${STAGE_BG_COLORS[stage]}`}></span>
                                            <span className="text-slate-600 dark:text-slate-400">{STAGE_TRANSLATION[stage]}: <strong className="dark:text-slate-200">{stats[stage]}</strong></span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </button>
                )})}
                 <button className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow-md flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-dashed hover:border-sky-500 dark:hover:border-sky-500">
                     <BriefcaseIcon className="w-10 h-10 mb-2 text-slate-400" />
                     <span className="font-bold">إضافة وظيفة جديدة</span>
                </button>
            </div>
            
            <Card paddingClass="p-2">
                {renderKanbanBoard()}
            </Card>
        </div>
    );
};

export default RecruitmentPage;