import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import { HelpCategory, BilingualText } from '../types';
import { useHelpCenterContext } from './contexts/HelpCenterContext';
import { useTranslation } from './contexts/LanguageContext';

interface HelpCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryToEdit: HelpCategory | null;
}

const HelpCategoryModal: React.FC<HelpCategoryModalProps> = ({ isOpen, onClose, categoryToEdit }) => {
    const { t } = useTranslation();
    const { addCategory, updateCategory } = useHelpCenterContext();
    const [name, setName] = useState<BilingualText>({ ar: '', en: '' });

    useEffect(() => {
        if (isOpen) {
            setName(categoryToEdit?.name || { ar: '', en: '' });
        }
    }, [isOpen, categoryToEdit]);

    if (!isOpen) return null;

    const handleChange = (lang: 'ar' | 'en', value: string) => {
        setName(prev => ({ ...prev, [lang]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (categoryToEdit) {
            updateCategory({ id: categoryToEdit.id, name });
        } else {
            addCategory({ name });
        }
        onClose();
    };

    const modalTitle = categoryToEdit ? t('helpCenter.categoryModal.editTitle') : t('helpCenter.categoryModal.addTitle');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{modalTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('helpCenter.categoryModal.nameAr')}</label>
                        <input type="text" value={name.ar} onChange={e => handleChange('ar', e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('helpCenter.categoryModal.nameEn')}</label>
                        <input type="text" value={name.en} onChange={e => handleChange('en', e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 dark:bg-slate-600 rounded-lg">{t('general.cancel')}</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg">{t('general.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HelpCategoryModal;