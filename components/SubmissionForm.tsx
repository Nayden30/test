import React, { useState } from 'react';
import type { Article, WorkingGroup, User } from '../types';
import { CreativeCommonsLicense } from '../types';
import { summarizeAndSuggestKeywords } from '../services/geminiService';
import { useTranslation } from '../hooks/useTranslation';
import { SparklesIcon } from './icons/SparklesIcon';

// --- Markdown Previewer Component & Logic ---

const parseInline = (lineText: string): React.ReactNode => {
    const parts = lineText.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return part;
    });
};

const parseMarkdown = (text: string): React.ReactNode[] => {
  const elements: React.ReactNode[] = [];
  if (!text) return elements;

  const lines = text.split('\n');
  let currentListItems: string[] = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-6 space-y-1 my-4">
          {currentListItems.map((item, idx) => (
            <li key={idx}>{parseInline(item)}</li>
          ))}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, index) => {
    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={index} className="text-3xl font-bold mt-6 mb-3 pb-2 border-b">{line.substring(2)}</h1>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={index} className="text-2xl font-bold mt-5 mb-2 pb-2 border-b">{line.substring(3)}</h2>);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(4)}</h3>);
    } else if (line.startsWith('* ')) {
      currentListItems.push(line.substring(2));
    } else if (line.trim() !== '') {
      flushList();
      elements.push(<p key={index} className="my-4 leading-relaxed">{parseInline(line)}</p>);
    } else {
        flushList();
    }
  });

  flushList();

  return elements;
};

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      {parseMarkdown(content)}
    </div>
  );
};


// --- Main SubmissionForm Component ---

interface SubmissionFormProps {
  onSubmit: (article: Omit<Article, 'id' | 'author' | 'submissionDate' | 'status' | 'reviews' | 'comments' | 'views' | 'citations'>) => void;
  currentUser: User;
  workingGroups: WorkingGroup[];
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onSubmit, currentUser, workingGroups }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [disciplines, setDisciplines] = useState('');
  const [references, setReferences] = useState('');
  const [fullText, setFullText] = useState('');
  const [license, setLicense] = useState<CreativeCommonsLicense>(CreativeCommonsLicense.CC_BY);
  const [workingGroupId, setWorkingGroupId] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const formInputStyle = "w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500";
  
  const userGroups = workingGroups.filter(wg => wg.members.includes(currentUser.id));
  
  const ARTICLE_TEMPLATES = {
    'standard': t('submissionForm.templates.standard.content'),
    'review': t('submissionForm.templates.review.content'),
    'dataset': t('submissionForm.templates.dataset.content')
  };

  const handleAiAssist = async () => {
    if (!abstract.trim()) {
      setAiError(t('submissionForm.aiError.abstractMissing'));
      return;
    }
    setIsAiLoading(true);
    setAiError(null);
    try {
      const { summary, keywords: suggestedKeywords } = await summarizeAndSuggestKeywords(abstract);
      setKeywords(suggestedKeywords.join(', '));
    } catch (error) {
      setAiError(error instanceof Error ? error.message : t('submissionForm.aiError.unknown'));
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateKey = e.target.value as keyof typeof ARTICLE_TEMPLATES;
    if (templateKey && ARTICLE_TEMPLATES[templateKey]) {
        setFullText(ARTICLE_TEMPLATES[templateKey]);
    } else {
        setFullText('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const articleData = {
      title,
      abstract,
      keywords: keywords.split(',').map(kw => kw.trim()).filter(Boolean),
      disciplines: disciplines.split(',').map(d => d.trim()).filter(Boolean),
      references,
      fullText,
      license,
      workingGroupId: workingGroupId || undefined,
    };
    onSubmit(articleData);
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-4">{t('submissionForm.title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('submissionForm.articleTitle.label')}</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className={formInputStyle} />
        </div>

        <div>
          <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('submissionForm.abstract.label')}</label>
          <textarea id="abstract" value={abstract} onChange={e => setAbstract(e.target.value)} required rows={6} className={formInputStyle}></textarea>
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('submissionForm.keywords.label')}</label>
          <div className="flex items-center gap-2">
            <input type="text" id="keywords" value={keywords} onChange={e => setKeywords(e.target.value)} required className={`flex-grow ${formInputStyle}`} />
            <button type="button" onClick={handleAiAssist} disabled={isAiLoading} className="flex items-center justify-center bg-purple-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-purple-700 transition disabled:bg-purple-300">
              {isAiLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  {t('submissionForm.aiAssistButton')}
                </>
              )}
            </button>
          </div>
          {aiError && <p className="text-red-500 text-sm mt-1">{aiError}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="disciplines" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('submissionForm.disciplines.label')}</label>
              <input type="text" id="disciplines" value={disciplines} onChange={e => setDisciplines(e.target.value)} required className={formInputStyle} />
            </div>
            <div>
              <label htmlFor="license" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('submissionForm.license.label')}</label>
               <select id="license" value={license} onChange={(e) => setLicense(e.target.value as CreativeCommonsLicense)} className={formInputStyle}>
                    {Object.values(CreativeCommonsLicense).map(lic => (
                        <option key={lic} value={lic}>{lic}</option>
                    ))}
                </select>
            </div>
        </div>
        
        <div>
          <label htmlFor="workingGroup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('submissionForm.workingGroup.label')}</label>
          <select id="workingGroup" value={workingGroupId} onChange={(e) => setWorkingGroupId(e.target.value)} className={formInputStyle} disabled={userGroups.length === 0}>
              <option value="">{t('submissionForm.workingGroup.none')}</option>
              {userGroups.map(wg => (
                  <option key={wg.id} value={wg.id}>{wg.name}</option>
              ))}
          </select>
           {userGroups.length === 0 && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('submissionForm.workingGroup.noGroups')}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="references" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('submissionForm.references.label')}</label>
              <textarea id="references" value={references} onChange={e => setReferences(e.target.value)} rows={4} className={formInputStyle}></textarea>
            </div>
            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('submissionForm.templates.label')}</label>
               <select id="template" onChange={handleTemplateChange} className={formInputStyle}>
                    <option value="">{t('submissionForm.templates.scratch')}</option>
                    <option value="standard">{t('submissionForm.templates.standard.name')}</option>
                    <option value="review">{t('submissionForm.templates.review.name')}</option>
                    <option value="dataset">{t('submissionForm.templates.dataset.name')}</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('submissionForm.templates.helpText')}</p>
            </div>
        </div>
        
        <div>
          <label htmlFor="fullText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('submissionForm.fullText.label')}</label>
          <div className="mt-1 grid grid-cols-1 md:grid-cols-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm overflow-hidden" style={{ height: '450px' }}>
            <textarea
              id="fullText"
              value={fullText}
              onChange={e => setFullText(e.target.value)}
              className="w-full h-full border-0 resize-y rounded-l-md focus:ring-0 p-4 font-mono text-sm leading-6 tracking-wide bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              placeholder={t('submissionForm.fullText.placeholder')}
            />
            <div className="hidden md:block border-l border-gray-200 dark:border-gray-600 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
              <div className="p-4">
                <MarkdownPreview content={fullText} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t dark:border-gray-700">
            <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-md hover:bg-blue-700 transition text-lg">{t('submissionForm.submitButton')}</button>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;