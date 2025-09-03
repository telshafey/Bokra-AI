import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import { HelpArticle, HelpCategory, BilingualText } from '../types';
import { useHelpCenterContext } from './contexts/HelpCenterContext';
import { useTranslation } from './contexts/LanguageContext';

interface HelpArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
    articleToEdit: HelpArticle | null;
}

const HelpArticleModal: React.FC<HelpArticleModalProps> = ({ isOpen, onClose, articleToEdit }) => {
    const { t } = useTranslation();
    const { categories, addArticle, updateArticle } = useHelpCenterContext();

    const getInitialState = () => ({
        categoryId: categories[0]?.id || '',
        title: { ar: '', en: '' },
        content: { ar: '', en: '' },
        keywords: [],
    });

    const [articleData, setArticleData] = useState<Omit<HelpArticle, 'id'>>(getInitialState());
    const [keywordsStr, setKeywordsStr] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (articleToEdit) {
                setArticleData({
                    categoryId: articleToEdit.categoryId,
                    title: articleToEdit.title,
                    content: articleToEdit.content,
                    keywords: articleToEdit.keywords,
                });
                setKeywordsStr(articleToEdit.keywords.join(', '));
            } else {
                setArticleData(getInitialState());
                setKeywordsStr('');
            }
        }
    }, [isOpen, articleToEdit, categories]);

    if (!isOpen) return null;

    const handleTextChange = (field: 'title' | 'content', lang: 'ar' | 'en', value: string) => {
        setArticleData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
    };
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setArticleData(prev => ({ ...prev, categoryId: e.target.value }));
    };

    const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeywordsStr(e.target.value);
        setArticleData(prev => ({...prev, keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (articleToEdit) {
            updateArticle({ id: articleToEdit.id, ...articleData });
        } else {
            addArticle(articleData);
        }
        onClose();
    };

    const modalTitle = articleToEdit ? t('helpCenter.articleModal.editTitle') : t('helpCenter.articleModal.addTitle');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{modalTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" value={articleData.title.ar} onChange={e => handleTextChange('title', 'ar', e.target.value)} placeholder={t('helpCenter.articleModal.titleAr')} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                            <input type="text" value={articleData.title.en} onChange={e => handleTextChange('title', 'en', e.target.value)} placeholder={t('helpCenter.articleModal.titleEn')} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <textarea value={articleData.content.ar} onChange={e => handleTextChange('content', 'ar', e.target.value)} placeholder={t('helpCenter.articleModal.contentAr')} rows={6} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                             <textarea value={articleData.content.en} onChange={e => handleTextChange('content', 'en', e.target.value)} placeholder={t('helpCenter.articleModal.contentEn')} rows={6} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <select value={articleData.categoryId} onChange={handleSelectChange} className="w-full p-2 border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600" required>
                                <option value="" disabled>-- {t('helpCenter.articleModal.category')} --</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name.ar} / {cat.name.en}</option>)}
                            </select>
                             <input type="text" value={keywordsStr} onChange={handleKeywordsChange} placeholder={t('helpCenter.articleModal.keywords')} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t dark:border-slate-700">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 dark:bg-slate-600 rounded-lg">{t('general.cancel')}</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg">{t('general.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HelpArticleModal;