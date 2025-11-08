import React, { useState, useMemo } from 'react';
import type { User, Article, Review, Comment, Institution, NewInstitution } from '../types';
import { Badge, UserRole } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import ArticleCard from './ArticleCard';
import CreateInstitutionForm from './CreateInstitutionForm';
import { DocumentDuplicateIcon } from './icons/DocumentDuplicateIcon';
import { ClipboardDocumentCheckIcon } from './icons/ClipboardDocumentCheckIcon';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { OrcidIcon } from './icons/OrcidIcon';
import { GoogleScholarIcon } from './icons/GoogleScholarIcon';
import { LinkIcon } from './icons/LinkIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { KeyIcon } from './icons/KeyIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ShareIcon } from './icons/ShareIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { PresentationChartBarIcon } from './icons/PresentationChartBarIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { PencilIcon } from './icons/PencilIcon';
import { PencilSquareIcon } from './icons/PencilSquareIcon';
import EditProfileForm from './EditProfileForm';
import { ChatBubbleLeftEllipsisIcon } from './icons/ChatBubbleLeftEllipsisIcon';


interface ProfilePageProps {
  user: User;
  allArticles: Article[];
  users: User[];
  institutions: Institution[];
  currentUser: User | null;
  onSelectArticle: (id: string) => void;
  onViewProfile: (userId: string) => void;
  onFollowUser: (userId: string) => void;
  onUpdateUser: (user: User) => void;
  onViewInstitution: (id: string) => void;
  onCreateInstitution: (newInstitution: NewInstitution) => Institution;
  onNavigateToMessages: (userId: string) => void;
}

type ActivityTab = 'publications' | 'reviews' | 'comments';

interface UserReview extends Review {
  articleId: string;
  articleTitle: string;
}

interface UserComment extends Comment {
    articleId: string;
    articleTitle: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, allArticles, users, institutions, currentUser, onSelectArticle, onViewProfile, onFollowUser, onUpdateUser, onViewInstitution, onCreateInstitution, onNavigateToMessages }) => {
  const [activeTab, setActiveTab] = useState<ActivityTab>('publications');
  const [newKeyword, setNewKeyword] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditingInstitution, setIsEditingInstitution] = useState(false);
  const [isCreateInstModalOpen, setIsCreateInstModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

  const isOwnProfile = currentUser?.id === user.id;
  const isFollowingUser = currentUser?.followingUsers.includes(user.id) ?? false;

  const userInstitution = useMemo(() => institutions.find(i => i.id === user.institutionId), [institutions, user.institutionId]);

  const badgeDescriptions: Record<Badge, string> = {
    [Badge.FOUNDING_MEMBER]: t('profile.badges.foundingMember'),
    [Badge.PROLIFIC_AUTHOR]: t('profile.badges.prolificAuthor'),
    [Badge.TOP_REVIEWER]: t('profile.badges.topReviewer'),
    [Badge.COMMUNITY_BUILDER]: t('profile.badges.communityBuilder'),
    [Badge.VERIFIED]: t('profile.badges.verified')
  };

  const rolePermissions: Record<UserRole, string> = {
      [UserRole.AUTHOR]: t('profile.roles.author'),
      [UserRole.REVIEWER]: t('profile.roles.reviewer'),
      [UserRole.MODERATOR]: t('profile.roles.moderator'),
      [UserRole.ADMIN]: t('profile.roles.admin'),
  };
  
  const followerCount = useMemo(() => users.filter(u => u.followingUsers.includes(user.id)).length, [users, user.id]);

  const userPublications = useMemo(() => {
    return allArticles.filter(article => article.author.id === user.id)
      .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
  }, [allArticles, user.id]);
  
  const userReviews = useMemo(() => {
    const reviews: UserReview[] = [];
    allArticles.forEach(article => {
        article.reviews.forEach(review => {
            if (review.reviewer.id === user.id) {
                reviews.push({ ...review, articleId: article.id, articleTitle: article.title });
            }
        });
    });
    return reviews.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allArticles, user.id]);

  const userComments = useMemo(() => {
    const comments: UserComment[] = [];
     allArticles.forEach(article => {
        article.comments.forEach(comment => {
            if (comment.author.id === user.id) {
                comments.push({ ...comment, articleId: article.id, articleTitle: article.title });
            }
        });
    });
    return comments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allArticles, user.id]);
  
  const handleAddKeyword = (e: React.FormEvent) => {
      e.preventDefault();
      if (newKeyword && !user.favoriteKeywords.includes(newKeyword.trim())) {
          const updatedUser = { ...user, favoriteKeywords: [...user.favoriteKeywords, newKeyword.trim()] };
          onUpdateUser(updatedUser);
          setNewKeyword('');
      }
  }

  const handleRemoveKeyword = (keywordToRemove: string) => {
      const updatedUser = { ...user, favoriteKeywords: user.favoriteKeywords.filter(k => k !== keywordToRemove) };
      onUpdateUser(updatedUser);
  }

  const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    if (newId === 'add_new') {
        setIsCreateInstModalOpen(true);
    } else {
        onUpdateUser({ ...user, institutionId: newId });
        setIsEditingInstitution(false);
    }
  };

  const handleInstitutionCreated = (newInstitutionData: NewInstitution) => {
    const newInstitution = onCreateInstitution(newInstitutionData);
    onUpdateUser({ ...user, institutionId: newInstitution.id });
    setIsCreateInstModalOpen(false);
    setIsEditingInstitution(false);
  };

  const profileUrl = `${window.location.origin}/profile/${user.id}`;
  const handleCopyUrl = () => {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'publications':
        return userPublications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userPublications.map(article => (
              <ArticleCard key={article.id} article={article} onSelectArticle={onSelectArticle} onViewProfile={onViewProfile} />
            ))}
          </div>
        ) : <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t('profile.noPublications')}</p>;

      case 'reviews':
        return userReviews.length > 0 ? (
           <div className="space-y-4">
            {userReviews.map(review => (
                <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 italic">"{review.comment}"</p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {t('profile.reviewedArticle')} <button onClick={() => onSelectArticle(review.articleId)} className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">"{review.articleTitle}"</button> {t('profile.onDate')} {new Date(review.date).toLocaleDateString()}
                    </div>
                </div>
            ))}
           </div>
        ) : <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t('profile.noReviews')}</p>;
        
      case 'comments':
          return userComments.length > 0 ? (
           <div className="space-y-4">
            {userComments.map(comment => (
                <div key={comment.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                    <p className="text-gray-800 dark:text-gray-200">"{comment.text}"</p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {t('profile.commentedOn')} <button onClick={() => onSelectArticle(comment.articleId)} className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">"{comment.articleTitle}"</button> {t('profile.onDate')} {new Date(comment.date).toLocaleDateString()}
                    </div>
                </div>
            ))}
           </div>
        ) : <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t('profile.noComments')}</p>;

      default:
        return null;
    }
  };

  const TabButton: React.FC<{tab: ActivityTab, label: string, count: number, icon: React.FC<any>}> = ({tab, label, count, icon: Icon}) => (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        <Icon className="h-5 w-5"/>
        <span>{label}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}>{count}</span>
      </button>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8 overflow-hidden">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 bg-cover bg-center" style={{backgroundImage: `url(${user.bannerUrl})`}}></div>
        <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-24 md:-mt-20">
                <img src={user.avatarUrl} alt={user.name} className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 shadow-md mb-4 md:mb-0 md:mr-6" />
                <div className="flex-grow text-center md:text-left mt-4 md:mt-0">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">{user.name}</h1>
                    <div className="flex items-center justify-center md:justify-start group">
                        {isEditingInstitution ? (
                            <select 
                                value={user.institutionId}
                                onChange={handleInstitutionChange}
                                onBlur={() => setIsEditingInstitution(false)}
                                className="mt-1 text-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                                <option value="add_new">{t('profile.addInstitution.option')}</option>
                            </select>
                        ) : (
                            <>
                                {userInstitution ? (
                                    <button onClick={() => onViewInstitution(userInstitution.id)} className="text-lg text-gray-600 dark:text-gray-400 mt-1 hover:underline hover:text-blue-500">
                                        {userInstitution.name}
                                    </button>
                                ) : (
                                    <span className="text-lg text-gray-500 dark:text-gray-400 mt-1 italic">{t('login.noAffiliation')}</span>
                                )}
                                {isOwnProfile && (
                                    <button onClick={() => setIsEditingInstitution(true)} className="ml-2 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    <div className="flex justify-center md:justify-start items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span><span className="font-bold text-gray-700 dark:text-gray-200">{userPublications.length}</span> {t('profile.publications')}</span>
                        <span><span className="font-bold text-gray-700 dark:text-gray-200">{followerCount}</span> {t('profile.followers')}</span>
                        <span><span className="font-bold text-gray-700 dark:text-gray-200">{user.followingUsers.length}</span> {t('profile.following')}</span>
                        <span><span className="font-bold text-yellow-500">{user.reputation}</span> {t('profile.reputation')}</span>
                    </div>
                </div>
                 <div className="mt-4 md:mt-0 md:ml-auto flex-shrink-0 flex items-center space-x-2">
                    {isOwnProfile && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-3 rounded-full font-bold transition-colors bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            title={t('profile.editProfile')}
                        >
                            <PencilSquareIcon className="h-5 w-5" />
                        </button>
                    )}
                    <button
                        onClick={() => setIsQrModalOpen(true)}
                        className="p-3 rounded-full font-bold transition-colors bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        title={t('profile.shareProfile')}
                    >
                        <ShareIcon className="h-5 w-5" />
                    </button>
                    {!isOwnProfile && currentUser && (
                       <div className="flex items-center space-x-2">
                            <button
                                onClick={() => onNavigateToMessages(user.id)}
                                className="px-4 py-2 flex items-center space-x-2 rounded-full font-bold transition-colors bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
                                <span>{t('profile.message')}</span>
                            </button>
                            <button
                                onClick={() => onFollowUser(user.id)}
                                className={`px-6 py-2 rounded-full font-bold transition-colors w-32 ${
                                    isFollowingUser
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-2 border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-600'
                                }`}
                            >
                                {isFollowingUser ? t('profile.following') : t('profile.follow')}
                            </button>
                       </div>
                    )}
                </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-6 max-w-2xl text-center md:text-left">{user.bio}</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                {user.specialties.map(spec => <span key={spec} className="bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">{spec}</span>)}
            </div>
            <div className="mt-4 flex justify-center md:justify-start items-center space-x-4">
                {user.websiteUrl && <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600"><LinkIcon className="h-6 w-6"/></a>}
                {user.googleScholarUrl && <a href={user.googleScholarUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600"><GoogleScholarIcon className="h-6 w-6"/></a>}
                {/* Assuming ORCID iD is part of user data in a real app */}
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600"><OrcidIcon className="h-6 w-6"/></a>
            </div>
            {user.badges.length > 0 && (
                <div className="mt-6 border-t dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center md:text-left mb-3">{t('profile.badges.title')}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        {user.badges.map(badge => {
                            const isVerified = badge === Badge.VERIFIED;
                            const BadgeIcon = isVerified ? CheckBadgeIcon : TrophyIcon;
                            const colors = isVerified 
                                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-500/20"
                                : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/20";
                            return (
                                <div key={badge} className={`group relative flex items-center p-2 rounded-lg border ${colors}`}>
                                    <BadgeIcon className="h-6 w-6 mr-2" />
                                    <span className="font-semibold text-sm">{badge}</span>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        {badgeDescriptions[badge]}
                                        <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left column */}
        <div className="xl:w-1/3 space-y-8">
            {/* Portfolio */}
            {user.portfolio && (user.portfolio.thesis || user.portfolio.conferences.length > 0 || user.portfolio.projects.length > 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 border-b dark:border-gray-700 pb-2">{t('profile.portfolio.title')}</h2>
                {user.portfolio.thesis && (
                    <div className="mb-4">
                        <h3 className="font-semibold flex items-center"><AcademicCapIcon className="h-5 w-5 mr-2" /> {t('profile.portfolio.thesis')}</h3>
                        <p className="text-gray-700 dark:text-gray-200">{user.portfolio.thesis.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.portfolio.thesis.university}, {user.portfolio.thesis.year}</p>
                        {user.portfolio.thesis.url && <a href={user.portfolio.thesis.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{t('profile.portfolio.readMore')}</a>}
                    </div>
                )}
                 {user.portfolio.conferences.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold flex items-center"><PresentationChartBarIcon className="h-5 w-5 mr-2" /> {t('profile.portfolio.conferences')}</h3>
                        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm text-gray-600 dark:text-gray-300">
                           {user.portfolio.conferences.map((conf, i) => <li key={i}><strong>{conf.role}</strong> at {conf.name}, {conf.year} ({conf.location})</li>)}
                        </ul>
                    </div>
                )}
                 {user.portfolio.projects.length > 0 && (
                    <div>
                        <h3 className="font-semibold flex items-center"><LightBulbIcon className="h-5 w-5 mr-2" /> {t('profile.portfolio.projects')}</h3>
                         <div className="space-y-3 mt-2">
                           {user.portfolio.projects.map((proj, i) => (
                               <div key={i}>
                                   <p className="font-semibold text-gray-800 dark:text-gray-100">{proj.name} <span className="text-xs font-normal bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">{proj.status}</span></p>
                                   <p className="text-sm text-gray-600 dark:text-gray-300">{proj.description}</p>
                                   {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{t('profile.portfolio.viewProject')}</a>}
                               </div>
                           ))}
                        </div>
                    </div>
                )}
              </div>
            )}
             {/* Roles */}
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 border-b dark:border-gray-700 pb-2">{t('profile.roles.title')}</h2>
                 <ul className="space-y-3">
                    {user.roles.map(role => (
                        <li key={role}>
                            <p className="font-semibold text-gray-800 dark:text-gray-100 capitalize flex items-center"><KeyIcon className="h-5 w-5 mr-2 text-yellow-500" /> {role}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 pl-7">{rolePermissions[role]}</p>
                        </li>
                    ))}
                </ul>
             </div>

             {/* Favorite Keywords */}
            {isOwnProfile && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-2">{t('profile.manageKeywords.title')}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('profile.manageKeywords.description')}</p>
                    <form onSubmit={handleAddKeyword} className="flex items-center gap-2 mb-4">
                        <input type="text" value={newKeyword} onChange={e => setNewKeyword(e.target.value)} placeholder={t('profile.manageKeywords.placeholder')} className="flex-grow border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
                        <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700">{t('profile.manageKeywords.addButton')}</button>
                    </form>
                     <div className="flex flex-wrap gap-2">
                        {user.favoriteKeywords.map(keyword => (
                            <span key={keyword} className="flex items-center bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-xs font-semibold pl-2 pr-1 py-1 rounded-full">
                                {keyword}
                                <button onClick={() => handleRemoveKeyword(keyword)} className="ml-1 text-purple-500 hover:text-purple-700">
                                    <XCircleIcon className="h-4 w-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Right column */}
        <div className="xl:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex space-x-2">
                <TabButton tab="publications" label={t('profile.publications')} count={userPublications.length} icon={DocumentDuplicateIcon} />
                <TabButton tab="reviews" label={t('profile.reviews')} count={userReviews.length} icon={ClipboardDocumentCheckIcon} />
                <TabButton tab="comments" label={t('profile.comments')} count={userComments.length} icon={ChatBubbleLeftRightIcon} />
              </div>
            </div>
            <div>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
       {isQrModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setIsQrModalOpen(false)}>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl relative text-center" onClick={e => e.stopPropagation()}>
                <button onClick={() => setIsQrModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">{t('profile.shareModal.title')}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{t('profile.shareModal.description', {name: user.name})}</p>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md inline-block">
                    {/* Placeholder for QR Code */}
                    <div className="w-48 h-48 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-gray-500">QR Code</span>
                    </div>
                </div>
                <div className="mt-4">
                    <input type="text" value={profileUrl} readOnly className="w-full border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-md text-sm" />
                    <button onClick={handleCopyUrl} className="mt-2 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">
                        {copied ? t('profile.shareModal.copied') : t('profile.shareModal.copyUrl')}
                    </button>
                </div>
            </div>
         </div>
      )}
      {isCreateInstModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <CreateInstitutionForm 
            onSubmit={handleInstitutionCreated}
            onClose={() => setIsCreateInstModalOpen(false)}
          />
        </div>
      )}
       {isEditing && (
         <EditProfileForm user={user} onUpdateUser={onUpdateUser} onClose={() => setIsEditing(false)} />
       )}
    </div>
  );
};
// FIX: Added default export.
export default ProfilePage;