import React, { useState, useMemo } from 'react';
import type { Article, User, Comment, Review, WorkingGroup, Institution } from '../types';
import { ArticleStatus, ReviewRecommendation, UserRole } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { EyeIcon } from './icons/EyeIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { DocumentArrowDownIcon } from './icons/DocumentArrowDownIcon';
import { FlagIcon } from './icons/FlagIcon';
import { ReplyIcon } from './icons/ReplyIcon';
import { CreativeCommonsIcon } from './icons/CreativeCommonsIcon';
import { PresentationChartBarIcon } from './icons/PresentationChartBarIcon';
import PresentationMode from './PresentationMode';
import { UsersGroupIcon } from './icons/UsersGroupIcon';

interface ArticleDetailProps {
  article: Article;
  currentUser: User | null;
  workingGroups: WorkingGroup[];
  institutions: Institution[];
  onAddComment: (articleId: string, text: string, parentId?: string | null) => void;
  onAddReview: (articleId: string, recommendation: ReviewRecommendation, comment: string) => void;
  onViewProfile: (userId: string) => void;
  onFollowArticle: (articleId: string) => void;
  onViewGroup: (groupId: string) => void;
  onViewInstitution: (institutionId: string) => void;
}

const generateBibTeX = (article: Article): string => {
    const authorNames = article.author.name.split(' ').reverse().join(', ');
    const year = new Date(article.submissionDate).getFullYear();
    const month = new Date(article.submissionDate).toLocaleString('default', { month: 'long' }).toLowerCase();
    
    const bibKey = `${authorNames.split(',')[0].toLowerCase()}${year}${article.title.split(' ')[0].toLowerCase()}`;

    return `@article{${bibKey},
  author  = {${authorNames}},
  title   = {${article.title}},
  journal = {Linguistics Nexus},
  year    = {${year}},
  month   = {${month}},
  abstract= {${article.abstract.replace(/\n/g, ' ')}},
  keywords= {${article.keywords.join(', ')}},
}`;
};

const CommentItem: React.FC<{
    comment: Comment,
    allComments: Comment[],
    onViewProfile: (userId: string) => void,
    onReply: (commentId: string) => void,
    currentUser: User | null,
    activeReplyId: string | null
}> = ({ comment, allComments, onViewProfile, onReply, currentUser, activeReplyId }) => {
    const { t } = useTranslation();
    const replies = allComments.filter(c => c.parentId === comment.id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const isReplying = activeReplyId === comment.id;

    const handleReportComment = (commentId: string) => {
        alert(t('articleDetail.commentReported', { commentId }));
    };

    return (
      <div className="flex items-start space-x-4">
        <button onClick={() => onViewProfile(comment.author.id)} className="focus:outline-none rounded-full group flex-shrink-0">
            <img src={comment.author.avatarUrl} alt={comment.author.name} className="h-10 w-10 rounded-full group-hover:ring-2 group-hover:ring-blue-500 transition" />
        </button>
        <div className="flex-1">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <button onClick={() => onViewProfile(comment.author.id)} className="focus:outline-none group">
                    <p className="font-semibold text-sm text-left group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline text-gray-900 dark:text-gray-100">{comment.author.name}</p>
                </button>
                <p className="text-gray-800 dark:text-gray-300">{comment.text}</p>
            </div>
             <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.date).toLocaleString()}</span>
                 {currentUser && (
                    <>
                        <button onClick={() => onReply(comment.id)} className={`text-xs font-semibold flex items-center ${isReplying ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}`}>
                           <ReplyIcon className="h-3 w-3 mr-1" /> {t('articleDetail.reply')}
                        </button>
                         <button onClick={() => handleReportComment(comment.id)} title={t('articleDetail.reportComment')} className="text-gray-400 hover:text-red-500">
                            <FlagIcon className="h-4 w-4" />
                        </button>
                    </>
                 )}
            </div>

            {replies.length > 0 && (
                <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                    {replies.map(reply => (
                        <CommentItem 
                            key={reply.id} 
                            comment={reply} 
                            allComments={allComments}
                            onViewProfile={onViewProfile}
                            onReply={onReply}
                            currentUser={currentUser}
                            activeReplyId={activeReplyId}
                        />
                    ))}
                </div>
            )}
        </div>
      </div>
    );
};


const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, currentUser, workingGroups, institutions, onAddComment, onAddReview, onViewProfile, onFollowArticle, onViewGroup, onViewInstitution }) => {
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewRecommendation, setReviewRecommendation] = useState<ReviewRecommendation>(ReviewRecommendation.MINOR_REVISIONS);
  const [presentationMode, setPresentationMode] = useState(false);
  
  const [commentText, setCommentText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const { t } = useTranslation();
  
  const articleGroup = useMemo(() => {
    return workingGroups.find(wg => wg.id === article.workingGroupId);
  }, [workingGroups, article.workingGroupId]);

  const authorInstitution = useMemo(() => {
    return institutions.find(i => i.id === article.author.institutionId);
  }, [institutions, article.author.institutionId]);

  const isFollowingArticle = currentUser?.followedArticles.includes(article.id) ?? false;

  const rootComments = useMemo(() => {
    return article.comments.filter(c => !c.parentId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [article.comments]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || newReviewComment.trim() === '') return;
    onAddReview(article.id, reviewRecommendation, newReviewComment);
    setNewReviewComment('');
  };

  const handleExportBibTeX = () => {
    const bibtexString = generateBibTeX(article);
    const blob = new Blob([bibtexString], { type: 'application/x-bibtex' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.toLowerCase().replace(/\s/g, '_')}.bib`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (commentText.trim()) {
          onAddComment(article.id, commentText, activeReplyId);
          setCommentText('');
          setActiveReplyId(null);
      }
  };

  return (
    <>
    {presentationMode && (
        <PresentationMode 
            content={article.fullText} 
            title={article.title}
            author={article.author.name}
            onClose={() => setPresentationMode(false)} 
        />
    )}
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800/50 rounded-lg shadow-xl p-8 md:p-12">
      <header className="mb-8">
        <div className="flex items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-blue-600 dark:text-blue-400">{article.disciplines.join(', ')}</span>
            <span className="mx-2">&middot;</span>
            <div className="flex items-center"><CalendarIcon className="h-4 w-4 mr-1"/> {t('articleDetail.publishedOn')} {new Date(article.submissionDate).toLocaleDateString()}</div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight mb-4">{article.title}</h1>
        <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
            <div className="flex items-center space-x-4">
                <button onClick={() => onViewProfile(article.author.id)} className="flex items-center space-x-4 group focus:outline-none">
                    <img src={article.author.avatarUrl} alt={article.author.name} className="h-12 w-12 rounded-full group-hover:ring-2 group-hover:ring-blue-500 transition" />
                    <div>
                        <p className="font-semibold text-lg text-left group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline text-gray-800 dark:text-gray-200">{article.author.name}</p>
                        {authorInstitution && (
                           <button onClick={(e) => { e.stopPropagation(); onViewInstitution(authorInstitution.id); }} className="text-gray-600 dark:text-gray-400 text-left hover:underline hover:text-blue-500">
                               {authorInstitution.name}
                           </button>
                        )}
                    </div>
                </button>
            </div>
             <div className="flex items-center space-x-2">
                 <button
                    onClick={() => setPresentationMode(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-colors text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    <PresentationChartBarIcon className="h-5 w-5"/>
                    <span>{t('articleDetail.presentationMode')}</span>
                  </button>
                 {currentUser && (
                    <button
                        onClick={() => onFollowArticle(article.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-colors text-sm ${
                            isFollowingArticle 
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-500/30' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                        <BookmarkIcon className={`h-5 w-5 ${isFollowingArticle ? 'fill-current' : ''}`} />
                        <span>{isFollowingArticle ? t('articleDetail.following') : t('articleDetail.follow')}</span>
                    </button>
                )}
             </div>
        </div>
      </header>
      
      {articleGroup && (
        <section className="mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 flex items-center space-x-4">
            <UsersGroupIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t('articleDetail.collaborativeProject')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('articleDetail.partOf')}
                <button onClick={() => onViewGroup(articleGroup.id)} className="font-bold text-blue-600 dark:text-blue-400 hover:underline mx-1">
                  {articleGroup.name}
                </button>
                {t('articleDetail.workingGroup')}
              </p>
            </div>
          </div>
        </section>
      )}

       <div className="my-8 flex justify-center space-x-8 border-y border-gray-200 dark:border-gray-700 py-4">
            <div className="text-center">
                <div className="flex items-center text-gray-500 dark:text-gray-400"><EyeIcon className="h-5 w-5 mr-1.5"/> {t('articleDetail.views')}</div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{article.views.toLocaleString()}</p>
            </div>
             <div className="text-center">
                <div className="flex items-center text-gray-500 dark:text-gray-400"><AcademicCapIcon className="h-5 w-5 mr-1.5"/> {t('articleDetail.citations')}</div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{article.citations}</p>
            </div>
            <div className="text-center">
                <div className="flex items-center text-gray-500 dark:text-gray-400"><DocumentArrowDownIcon className="h-5 w-5 mr-1.5"/> BibTeX</div>
                <button onClick={handleExportBibTeX} className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:underline">{t('articleDetail.export')}</button>
            </div>
        </div>

      <section className="mb-8 prose prose-lg dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">{t('articleDetail.abstract')}</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{article.abstract}</p>
      </section>

      <section className="mb-12">
         <div className="flex flex-wrap gap-2">
            {article.keywords.map(kw => <span key={kw} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">{kw}</span>)}
        </div>
      </section>

      {article.license && (
        <section className="mb-12">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 flex items-center space-x-3">
                <CreativeCommonsIcon className="h-8 w-8 text-gray-500" />
                <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t('articleDetail.license')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('articleDetail.licenseText')} {article.license}.</p>
                </div>
            </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">{t('articleDetail.peerReview')}</h2>
        {article.reviews.length > 0 ? (
          <ul className="space-y-6">
            {article.reviews.map(review => (
              <li key={review.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <button onClick={() => onViewProfile(review.reviewer.id)} className="flex items-center space-x-3 group focus:outline-none">
                    <img src={review.reviewer.avatarUrl} className="h-8 w-8 rounded-full group-hover:ring-2 group-hover:ring-blue-500 transition" alt={review.reviewer.name} />
                    <div>
                      <p className="font-semibold text-left group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline text-gray-800 dark:text-gray-200">{review.reviewer.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-left">{new Date(review.date).toLocaleDateString()} - <span className="font-medium">{review.recommendation}</span></p>
                    </div>
                  </button>
                </div>
                <p className="text-gray-800 dark:text-gray-300">{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">{t('articleDetail.noReviews')}</p>
        )}
        {currentUser && currentUser.roles.includes(UserRole.REVIEWER) && (
            <form onSubmit={handleAddReview} className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-lg mb-2">{t('articleDetail.submitReview')}</h3>
                <select value={reviewRecommendation} onChange={e => setReviewRecommendation(e.target.value as ReviewRecommendation)} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md mb-2">
                    {Object.values(ReviewRecommendation).map(rec => <option key={rec} value={rec}>{rec}</option>)}
                </select>
                <textarea value={newReviewComment} onChange={e => setNewReviewComment(e.target.value)} placeholder={t('articleDetail.reviewPlaceholder')} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md h-32"></textarea>
                <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">{t('articleDetail.submitReviewButton')}</button>
            </form>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">{t('articleDetail.discussion')} ({article.comments.length})</h2>
         <div className="space-y-6">
            {rootComments.map(comment => (
                <CommentItem 
                    key={comment.id}
                    comment={comment}
                    allComments={article.comments}
                    onViewProfile={onViewProfile}
                    onReply={setActiveReplyId}
                    currentUser={currentUser}
                    activeReplyId={activeReplyId}
                />
            ))}
         </div>
         {article.comments.length === 0 && <p className="text-gray-500 dark:text-gray-400 mb-6">{t('articleDetail.noComments')}</p>}
        
        {currentUser && (
            <form onSubmit={handleCommentSubmit} className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-start space-x-4">
                    <img src={currentUser.avatarUrl} alt="Your avatar" className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                        <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={activeReplyId ? t('articleDetail.replyPlaceholder') : t('articleDetail.commentPlaceholder')} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"></textarea>
                        <div className="flex items-center justify-between mt-2">
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">{t('articleDetail.postComment')}</button>
                            {activeReplyId && (
                                <button type="button" onClick={() => setActiveReplyId(null)} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">{t('articleDetail.cancelReply')}</button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        )}
      </section>
    </div>
    </>
  );
};

export default ArticleDetail;