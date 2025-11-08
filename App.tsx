
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import SubmissionForm from './components/SubmissionForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
// FIX: Changed to default import for ProfilePage.
import ProfilePage from './components/ProfilePage';
import FeedPage from './components/FeedPage';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import WorkingGroupList from './components/WorkingGroupList';
import WorkingGroupDetail from './components/WorkingGroupDetail';
import CreateWorkingGroupForm from './components/CreateWorkingGroupForm';
import ScientificCalendar from './components/ScientificCalendar';
import InstitutionList from './components/InstitutionList';
import InstitutionDetail from './components/InstitutionDetail';
import MessagesPage from './components/MessagesPage';
import { useMockData } from './hooks/useMockData';
import type { Article, User, NewUser, Comment, Notification, Review, WorkingGroup, NewWorkingGroup, ScientificEvent, Institution, NewInstitution, Message } from './types';
import { ArticleStatus, UserRole, Badge, ReviewRecommendation } from './types';

const REPUTATION_POINTS = {
    PUBLISH: 20,
    REVIEW: 10,
    COMMENT: 2,
};

const updateUserStats = (user: User, allArticles: Article[]): User => {
    const userArticles = allArticles.filter(a => a.author.id === user.id);
    const userReviews = allArticles.flatMap(a => a.reviews.filter(r => r.reviewer.id === user.id));
    const userComments = allArticles.flatMap(a => a.comments.filter(c => c.author.id === user.id));
    
    const reputation = (userArticles.length * REPUTATION_POINTS.PUBLISH) + 
                         (userReviews.length * REPUTATION_POINTS.REVIEW) + 
                         (userComments.length * REPUTATION_POINTS.COMMENT);
    
    const newBadges = new Set(user.badges.filter(b => b === Badge.FOUNDING_MEMBER || b === Badge.VERIFIED)); // Keep static badges
    
    if (userArticles.length >= 2) newBadges.add(Badge.PROLIFIC_AUTHOR);
    if (userReviews.length >= 3) newBadges.add(Badge.TOP_REVIEWER);
    if (userComments.length >= 10) newBadges.add(Badge.COMMUNITY_BUILDER);

    return { ...user, reputation, badges: Array.from(newBadges) };
};


const App: React.FC = () => {
  const { articles: initialArticles, users: initialUsers, workingGroups: initialWorkingGroups, scientificEvents: initialEvents, institutions: initialInstitutions, messages: initialMessages } = useMockData();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [institutions, setInstitutions] = useState<Institution[]>(initialInstitutions.sort((a,b) => a.name.localeCompare(b.name)));
  const [workingGroups, setWorkingGroups] = useState<WorkingGroup[]>(initialWorkingGroups);
  const [scientificEvents, setScientificEvents] = useState<ScientificEvent[]>(initialEvents);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'list' | 'detail' | 'submit' | 'login' | 'register' | 'profile' | 'feed' | 'admin' | 'groupsList' | 'groupDetail' | 'createGroup' | 'calendar' | 'institutionList' | 'institutionDetail' | 'messages'>('landing');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);
  const [selectedConversationUserId, setSelectedConversationUserId] = useState<string | null>(null);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  const [keywordFilter, setKeywordFilter] = useState<string | null>(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate generation of event notifications on app load
    const eventNotifications: Notification[] = [];
    initialEvents.forEach(event => {
      initialUsers.forEach(user => {
        const hasMatchingDiscipline = user.specialties.some(spec => event.disciplines.includes(spec));
        if (hasMatchingDiscipline) {
          eventNotifications.push({
            id: `notif-evt-${event.id}-${user.id}-${Date.now()}`,
            userId: user.id,
            type: 'new_event',
            messageKey: 'notifications.newEvent',
            messagePayload: { eventType: event.type, eventTitle: event.title },
            eventId: event.id,
            isRead: false,
            date: new Date().toISOString(),
          });
        }
      });
    });
    setNotifications(prev => [...eventNotifications, ...prev]);
  }, [initialEvents, initialUsers]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const clearViews = useCallback(() => {
    setSelectedArticleId(null);
    setViewingProfileId(null);
    setSelectedGroupId(null);
    setSelectedInstitutionId(null);
    setSelectedConversationUserId(null);
    setKeywordFilter(null);
  }, []);

  const handleSelectArticle = useCallback((id: string) => {
    clearViews();
    setSelectedArticleId(id);
    setView('detail');
  }, [clearViews]);
  
  const handleViewGroup = useCallback((groupId: string) => {
    clearViews();
    setSelectedGroupId(groupId);
    setView('groupDetail');
  }, [clearViews]);

  const handleViewInstitution = useCallback((institutionId: string) => {
    clearViews();
    setSelectedInstitutionId(institutionId);
    setView('institutionDetail');
  }, [clearViews]);

  const handleViewProfile = useCallback((userId: string) => {
    clearViews();
    setViewingProfileId(userId);
    setView('profile');
  }, [clearViews]);

  const handleNavigate = useCallback((newView: 'landing' | 'list' | 'submit' | 'login' | 'register' | 'feed' | 'admin' | 'groupsList' | 'createGroup' | 'calendar' | 'institutionList' | 'messages') => {
    clearViews();
    setView(newView);
  }, [clearViews]);

  const handleNavigateToMessages = useCallback((userId: string | null) => {
    clearViews();
    setView('messages');
    setSelectedConversationUserId(userId);
    if(userId) {
      handleMarkConversationAsRead(userId);
    }
  }, [clearViews]);
  
  const handleSelectKeyword = useCallback((keyword: string) => {
    clearViews();
    setKeywordFilter(keyword);
    setView('list');
  }, [clearViews]);

  const handleLogin = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      handleNavigate('list');
    }
  }, [users, handleNavigate]);
  
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    handleNavigate('landing');
  }, [handleNavigate]);
  
  const handleRegister = useCallback((newUserData: NewUser) => {
      const newUser: User = {
          ...newUserData,
          id: `user-${Date.now()}`,
          avatarUrl: `https://i.pravatar.cc/150?u=user${Date.now()}`,
          bio: 'A new member of the Linguistics Nexus community.',
          roles: [UserRole.AUTHOR], // Default role
          specialties: [],
          followingUsers: [],
          followedArticles: [],
          bannerUrl: '/placeholder-banner.jpg',
          websiteUrl: null,
          googleScholarUrl: null,
          reputation: 0,
          badges: [],
          location: null,
          favoriteKeywords: [],
          // FIX: Added missing joinDate property to satisfy the User type.
          joinDate: new Date().toISOString(),
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      handleNavigate('list');
  }, [handleNavigate]);

  const handleArticleSubmit = useCallback((newArticle: Omit<Article, 'id' | 'author' | 'submissionDate' | 'status' | 'reviews' | 'comments' | 'views' | 'citations' | 'language'>) => {
    if (!currentUser) return;
    
    const fullArticle: Article = {
      ...newArticle,
      id: `art-${Date.now()}`,
      author: currentUser,
      submissionDate: new Date().toISOString(),
      status: ArticleStatus.SUBMITTED,
      reviews: [],
      comments: [],
      views: 0,
      citations: 0,
      language: 'en', // default language
    };
    
    setArticles(prevArticles => {
        const newArticles = [fullArticle, ...prevArticles];
        setUsers(prevUsers => {
            const userToUpdate = prevUsers.find(u => u.id === currentUser.id);
            if (!userToUpdate) return prevUsers;
            const updatedUser = updateUserStats(userToUpdate, newArticles);
            if (currentUser.id === updatedUser.id) setCurrentUser(updatedUser);

            // Generate keyword notifications for other users
            const newKeywordNotifications: Notification[] = [];
            prevUsers.forEach(user => {
                if (user.id === currentUser.id) return; // Don't notify the author
                const matchingKeywords = user.favoriteKeywords.filter(favKw => 
                    fullArticle.keywords.some(artKw => artKw.toLowerCase().includes(favKw.toLowerCase()))
                );
                if (matchingKeywords.length > 0) {
                    newKeywordNotifications.push({
                        id: `notif-kw-${fullArticle.id}-${user.id}`,
                        userId: user.id,
                        type: 'new_article_keyword',
                        messageKey: 'notifications.newArticleKeyword',
                        messagePayload: { keyword: matchingKeywords[0], articleTitle: fullArticle.title },
                        articleId: fullArticle.id,
                        isRead: false,
                        date: new Date().toISOString(),
                    });
                }
            });
            setNotifications(prev => [...newKeywordNotifications, ...prev]);

            return prevUsers.map(u => u.id === currentUser.id ? updatedUser : u);
        });
        return newArticles;
    });

    handleNavigate('list');
  }, [currentUser, handleNavigate]);
  
  const handleCreateGroup = useCallback((newGroupData: NewWorkingGroup) => {
    if (!currentUser) return;
    const newGroup: WorkingGroup = {
        ...newGroupData,
        id: `wg-${Date.now()}`,
        members: [currentUser.id],
        coordinators: [currentUser.id],
        associatedArticles: [],
        createdDate: new Date().toISOString(),
    };
    setWorkingGroups(prev => [newGroup, ...prev]);
    handleViewGroup(newGroup.id);
  }, [currentUser, handleViewGroup]);
  
  const handleAddComment = (articleId: string, text: string, parentId: string | null = null) => {
      if (!currentUser) return;
      const newComment: Comment = {
          id: `com-${Date.now()}`,
          author: currentUser,
          date: new Date().toISOString(),
          text,
          parentId,
      };
      
      setArticles(prevArticles => {
          const newArticles = prevArticles.map(a => a.id === articleId ? { ...a, comments: [...a.comments, newComment] } : a);

          setUsers(prevUsers => {
            const userToUpdate = prevUsers.find(u => u.id === currentUser.id);
            if (!userToUpdate) return prevUsers;
            const updatedUser = updateUserStats(userToUpdate, newArticles);
            if (currentUser.id === updatedUser.id) setCurrentUser(updatedUser);
            return prevUsers.map(u => u.id === currentUser.id ? updatedUser : u);
        });
          
          if (parentId) {
              const article = newArticles.find(a => a.id === articleId);
              const parentComment = article?.comments.find(c => c.id === parentId);
              if (parentComment && parentComment.author.id !== currentUser.id) {
                  const newNotification: Notification = {
                      id: `notif-${Date.now()}`,
                      userId: parentComment.author.id,
                      type: 'reply',
                      messageKey: 'notifications.reply',
                      messagePayload: { userName: currentUser.name, articleTitle: article.title },
                      articleId,
                      isRead: false,
                      date: new Date().toISOString(),
                  };
                  setNotifications(prev => [newNotification, ...prev]);
              }
          }
          return newArticles;
      });
  };

  const handleAddReview = useCallback((articleId: string, recommendation: ReviewRecommendation, comment: string) => {
      if (!currentUser) return;
      const newReview: Review = {
          id: `rev-${Date.now()}`,
          reviewer: currentUser,
          date: new Date().toISOString(),
          recommendation: recommendation,
          comment: comment,
      };

      setArticles(prevArticles => {
          const newArticles = prevArticles.map(a => a.id === articleId ? { ...a, reviews: [...a.reviews, newReview], status: ArticleStatus.UNDER_REVIEW } : a);

          setUsers(prevUsers => {
            const userToUpdate = prevUsers.find(u => u.id === currentUser.id);
            if (!userToUpdate) return prevUsers;
            const updatedUser = updateUserStats(userToUpdate, newArticles);
            if (currentUser.id === updatedUser.id) setCurrentUser(updatedUser);
            return prevUsers.map(u => u.id === currentUser.id ? updatedUser : u);
          });

          return newArticles;
      });
  }, [currentUser]);

  const handleUpdateArticle = useCallback((updatedArticle: Article) => {
    setArticles(prevArticles => 
        prevArticles.map(article => article.id === updatedArticle.id ? updatedArticle : article)
    );
  }, []);

  const handleDeleteArticle = useCallback((articleId: string) => {
      setArticles(prev => prev.filter(a => a.id !== articleId));
  }, []);
  
  const handleUpdateUser = useCallback((updatedUser: User) => {
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      if (currentUser?.id === updatedUser.id) {
          setCurrentUser(updatedUser);
      }
  }, [currentUser?.id]);
  
  const handleDeleteUser = useCallback((userId: string) => {
      if (currentUser?.id === userId) {
          handleLogout();
      }
      setUsers(prev => prev.filter(u => u.id !== userId));
      // Optional: also remove user's content
      // setArticles(prev => prev.filter(a => a.author.id !== userId)); 
  }, [currentUser?.id, handleLogout]);

  const handleAddMemberToGroup = useCallback((groupId: string, userId: string) => {
    setWorkingGroups(prevGroups => 
        prevGroups.map(group => {
            if (group.id === groupId && !group.members.includes(userId)) {
                return { ...group, members: [...group.members, userId] };
            }
            return group;
        })
    );
  }, []);


  const handleFollowUser = useCallback((userIdToFollow: string) => {
    if (!currentUser) return;
    
    const isFollowing = currentUser.followingUsers.includes(userIdToFollow);
    
    const updatedFollowingUsers = isFollowing
        ? currentUser.followingUsers.filter(id => id !== userIdToFollow)
        : [...currentUser.followingUsers, userIdToFollow];

    const updatedCurrentUser = { ...currentUser, followingUsers: updatedFollowingUsers };
    
    setCurrentUser(updatedCurrentUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedCurrentUser : u));
  }, [currentUser]);

  const handleFollowArticle = useCallback((articleIdToFollow: string) => {
      if (!currentUser) return;

      const isFollowing = currentUser.followedArticles.includes(articleIdToFollow);

      const updatedFollowedArticles = isFollowing
          ? currentUser.followedArticles.filter(id => id !== articleIdToFollow)
          : [...currentUser.followedArticles, articleIdToFollow];
      
      const updatedCurrentUser = { ...currentUser, followedArticles: updatedFollowedArticles };

      setCurrentUser(updatedCurrentUser);
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedCurrentUser : u));
  }, [currentUser]);
  
  const handleCreateInstitution = useCallback((newInstitutionData: NewInstitution): Institution => {
    const newInstitution: Institution = {
        ...newInstitutionData,
        id: `inst-${Date.now()}`,
        logoUrl: `https://via.placeholder.com/150/81A4CD/FFFFFF?text=${newInstitutionData.name.substring(0, 2).toUpperCase()}`,
        websiteUrl: newInstitutionData.websiteUrl || null,
    };
    setInstitutions(prev => [...prev, newInstitution].sort((a,b) => a.name.localeCompare(b.name)));
    return newInstitution;
  }, []);

  const handleSendMessage = useCallback((recipientId: string, text: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      recipientId,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prev => [...prev, newMessage]);

    const newNotification: Notification = {
      id: `notif-msg-${Date.now()}`,
      userId: recipientId,
      type: 'new_message',
      messageKey: 'notifications.newMessage',
      messagePayload: { userName: currentUser.name },
      isRead: false,
      date: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);

    setSelectedConversationUserId(recipientId);

  }, [currentUser]);

  const handleMarkConversationAsRead = useCallback((otherUserId: string) => {
    if (!currentUser) return;
    setMessages(prev => prev.map(msg => 
        (msg.senderId === otherUserId && msg.recipientId === currentUser.id && !msg.isRead) 
        ? { ...msg, isRead: true } 
        : msg
    ));
  }, [currentUser]);

  const userNotifications = useMemo(() => {
    return notifications.filter(n => n.userId === currentUser?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notifications, currentUser]);
  
  const unreadMessagesCount = useMemo(() => {
    if (!currentUser) return 0;
    return messages.filter(m => m.recipientId === currentUser.id && !m.isRead).length;
  }, [messages, currentUser]);

  const selectedArticle = useMemo(() => {
    return articles.find(article => article.id === selectedArticleId) || null;
  }, [articles, selectedArticleId]);
  
  const selectedGroup = useMemo(() => {
    return workingGroups.find(group => group.id === selectedGroupId) || null;
  }, [workingGroups, selectedGroupId]);

  const selectedInstitution = useMemo(() => {
    return institutions.find(inst => inst.id === selectedInstitutionId) || null;
  }, [institutions, selectedInstitutionId]);

  const renderContent = () => {
    switch (view) {
      case 'login':
        return <LoginForm users={users} institutions={institutions} onLogin={handleLogin} onNavigateToRegister={() => setView('register')} />;
      case 'register':
        return <RegisterForm onRegister={handleRegister} onNavigateToLogin={() => setView('login')} institutions={institutions} onCreateInstitution={handleCreateInstitution} />;
      case 'profile':
          const profileUser = users.find(u => u.id === viewingProfileId);
          if (profileUser) {
              return <ProfilePage 
                          user={profileUser} 
                          allArticles={articles}
                          users={users}
                          institutions={institutions}
                          currentUser={currentUser}
                          onSelectArticle={handleSelectArticle}
                          onViewProfile={handleViewProfile}
                          onFollowUser={handleFollowUser}
                          onUpdateUser={handleUpdateUser}
                          onViewInstitution={handleViewInstitution}
                          onCreateInstitution={handleCreateInstitution}
                          onNavigateToMessages={handleNavigateToMessages}
                      />;
          }
          handleNavigate('list');
          return null;
      case 'submit':
        if (!currentUser) {
          setView('login');
          return null;
        }
        return <SubmissionForm 
            onSubmit={handleArticleSubmit} 
            currentUser={currentUser}
            workingGroups={workingGroups}
        />;
      case 'detail':
        if (selectedArticle) {
          return <ArticleDetail 
            article={selectedArticle} 
            currentUser={currentUser} 
            workingGroups={workingGroups}
            institutions={institutions}
            onAddComment={handleAddComment}
            onAddReview={handleAddReview}
            onViewProfile={handleViewProfile} 
            onFollowArticle={handleFollowArticle} 
            onViewGroup={handleViewGroup}
            onViewInstitution={handleViewInstitution}
          />;
        }
        handleNavigate('list');
        return null;
      case 'feed':
        if (!currentUser) {
            setView('login');
            return null;
        }
        return <FeedPage 
                    currentUser={currentUser} 
                    allArticles={articles} 
                    onSelectArticle={handleSelectArticle} 
                    onViewProfile={handleViewProfile} 
                />;
      case 'admin':
          if (!currentUser || !currentUser.roles.includes(UserRole.ADMIN)) {
              handleNavigate('list');
              return null;
          }
          return <AdminDashboard 
                    users={users}
                    articles={articles}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                    onDeleteArticle={handleDeleteArticle}
                    onSelectArticle={handleSelectArticle}
                 />;
      case 'groupsList':
          return <WorkingGroupList 
                    workingGroups={workingGroups} 
                    onViewGroup={handleViewGroup}
                    onNavigate={handleNavigate}
                 />;
      case 'groupDetail':
          if (selectedGroup) {
              return <WorkingGroupDetail 
                        group={selectedGroup}
                        allArticles={articles}
                        users={users}
                        currentUser={currentUser}
                        institutions={institutions}
                        onSelectArticle={handleSelectArticle}
                        onViewProfile={handleViewProfile}
                        onAddMember={handleAddMemberToGroup}
                     />;
          }
          handleNavigate('groupsList');
          return null;
      case 'createGroup':
          if (!currentUser) {
            setView('login');
            return null;
          }
          return <CreateWorkingGroupForm onSubmit={handleCreateGroup} />;
      case 'calendar':
          return <ScientificCalendar events={scientificEvents} />;
      case 'institutionList':
          return <InstitutionList 
                    institutions={institutions} 
                    users={users}
                    onViewInstitution={handleViewInstitution} 
                 />;
      case 'institutionDetail':
          if (selectedInstitution) {
            return <InstitutionDetail 
                      institution={selectedInstitution}
                      allUsers={users}
                      allArticles={articles}
                      onViewProfile={handleViewProfile}
                      onSelectArticle={handleSelectArticle}
                   />;
          }
          handleNavigate('institutionList');
          return null;
      case 'messages':
        if (!currentUser) {
          setView('login');
          return null;
        }
        return <MessagesPage 
                  currentUser={currentUser}
                  users={users}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onSelectConversation={handleNavigateToMessages}
                  selectedConversationUserId={selectedConversationUserId}
                />;
      case 'list':
        return <ArticleList 
                  articles={articles} 
                  onSelectArticle={handleSelectArticle} 
                  onViewProfile={handleViewProfile} 
                  initialKeywordFilter={keywordFilter}
               />;
      case 'landing':
      default:
        return <LandingPage 
            articles={articles} 
            users={users}
            institutions={institutions}
            currentUser={currentUser}
            onSelectArticle={handleSelectArticle} 
            onViewProfile={handleViewProfile} 
            onNavigate={handleNavigate}
            isLoggedIn={!!currentUser}
            onSelectKeyword={handleSelectKeyword}
        />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <Header 
        currentUser={currentUser} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout} 
        onViewProfile={handleViewProfile}
        theme={theme}
        toggleTheme={toggleTheme}
        notifications={userNotifications}
        unreadMessagesCount={unreadMessagesCount}
        onSelectArticle={handleSelectArticle}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;