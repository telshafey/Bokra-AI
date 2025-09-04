
import React, { useState, useMemo } from 'react';
import { HelpArticle, HelpCategory } from '../types';
import { useTranslation } from './contexts/LanguageContext';
import { useHelpCenterContext } from './contexts/HelpCenterContext';
import { MagnifyingGlassIcon, PlusCircleIcon, PencilIcon, TrashIcon } from './icons/Icons';
import PageHeader from './PageHeader';
import Card from './Card';
import HelpCategoryModal from './HelpCategoryModal';
import HelpArticleModal from './HelpArticleModal';

interface HelpCenterPageProps {
  isSuperAdmin: boolean;
}

const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ isSuperAdmin }) => {
  const { articles, categories, deleteCategory, deleteArticle } = useHelpCenterContext();
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // State for modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<HelpCategory | null>(null);
  const [editingArticle, setEditingArticle] = useState<HelpArticle | null>(null);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const categoryMatch = !selectedCategory || article.categoryId === selectedCategory;
      if (!categoryMatch) return false;
      
      if (searchTerm.trim() === '') return true;

      const searchLower = searchTerm.toLowerCase();
      const titleMatch = article.title[language]?.toLowerCase().includes(searchLower);
      const contentMatch = article.content[language]?.toLowerCase().includes(searchLower);
      const keywordsMatch = article.keywords.some(k => k.toLowerCase().includes(searchLower));
      return titleMatch || contentMatch || keywordsMatch;
    });
  }, [articles, selectedCategory, searchTerm, language]);
  
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category: HelpCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm(t('alerts.confirmations.deleteHelpCenterCategory'))) {
      deleteCategory(categoryId);
    }
  };

  const handleOpenAddArticle = () => {
    setEditingArticle(null);
    setIsArticleModalOpen(true);
  };
  
  const handleOpenEditArticle = (article: HelpArticle) => {
    setEditingArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleDeleteArticle = (articleId: string) => {
    if (confirm(t('alerts.confirmations.deleteHelpCenterArticle'))) {
      deleteArticle(articleId);
    }
  };

  const detailsArrowStyle = `
    .detail-arrow { transition: transform 0.2s; }
    details[open] > summary .detail-arrow { transform: rotate(180deg); }
  `;

  return (
    <div className="space-y-6">
      <style>{detailsArrowStyle}</style>
      <PageHeader
        title={t('helpCenter.title')}
        subtitle={t('helpCenter.subtitle')}
      />
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('helpCenter.searchPlaceholder')}
          className="w-full p-4 pl-12 text-lg border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          spellCheck="true"
        />
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <aside className="lg:col-span-1 lg:sticky lg:top-6">
          <Card title={t('helpCenter.categoriesTitle')}>
            {isSuperAdmin && (
              <button onClick={handleOpenAddCategory} className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 hover:bg-sky-200 p-2 rounded-lg mb-2">
                <PlusCircleIcon className="w-5 h-5"/> {t('helpCenter.addCategory')}
              </button>
            )}
            <nav className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-right p-3 rounded-lg font-semibold transition-colors ${!selectedCategory ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                {t('helpCenter.allArticles')}
              </button>
              {categories.map(category => (
                <div key={category.id} className="group relative">
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-right p-3 rounded-lg font-semibold transition-colors flex items-center gap-3 ${selectedCategory === category.id ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    <category.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{category.name[language]}</span>
                  </button>
                  {isSuperAdmin && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEditCategory(category)} className="p-1 text-slate-500 hover:text-sky-600"><PencilIcon className="w-4 h-4"/></button>
                      <button onClick={() => handleDeleteCategory(category.id)} className="p-1 text-slate-500 hover:text-red-600"><TrashIcon className="w-4 h-4"/></button>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </Card>
        </aside>

        <main className="lg:col-span-3 space-y-4">
           {isSuperAdmin && (
              <button onClick={handleOpenAddArticle} className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 p-3 rounded-lg">
                <PlusCircleIcon className="w-5 h-5"/> {t('helpCenter.addArticle')}
              </button>
            )}
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <details key={article.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm open:ring-1 open:ring-sky-500 open:shadow-md group/article">
                <summary className="font-bold text-slate-800 dark:text-slate-100 list-none flex justify-between items-center group p-4 cursor-pointer">
                  {article.title[language]}
                  <span className="text-slate-400 transform transition-transform duration-200 detail-arrow">▼</span>
                </summary>
                <div className="p-4 pt-0">
                  <div 
                    className="mt-4 pt-4 border-t dark:border-slate-700 text-slate-600 dark:text-slate-300" 
                    dangerouslySetInnerHTML={{ __html: article.content[language].replace(/\n/g, '<br />') }}
                  />
                  {isSuperAdmin && (
                    <div className="flex justify-end gap-2 mt-4 opacity-0 group-open:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEditArticle(article)} className="text-sm font-semibold flex items-center gap-1 p-2 bg-slate-100 hover:bg-slate-200 rounded-md"><PencilIcon className="w-4 h-4"/> {t('general.edit')}</button>
                      <button onClick={() => handleDeleteArticle(article.id)} className="text-sm font-semibold flex items-center gap-1 p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md"><TrashIcon className="w-4 h-4"/> {t('general.delete')}</button>
                    </div>
                  )}
                </div>
              </details>
            ))
          ) : (
            <Card>
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">{t('helpCenter.noResults')}</p>
            </Card>
          )}
        </main>
      </div>

      <HelpCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categoryToEdit={editingCategory}
      />
      
      <HelpArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        articleToEdit={editingArticle}
      />
    </div>
  );
};

export default HelpCenterPage;