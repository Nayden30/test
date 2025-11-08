export enum UserRole {
  AUTHOR = 'author',
  REVIEWER = 'reviewer',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

export enum ArticleStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  PUBLISHED = 'Published',
}

export enum ReviewRecommendation {
    ACCEPT = 'Accept',
    MINOR_REVISIONS = 'Minor Revisions',
    MAJOR_REVISIONS = 'Major Revisions',
    REJECT = 'Reject',
}

export enum Badge {
    TOP_REVIEWER = 'Top Reviewer',
    PROLIFIC_AUTHOR = 'Prolific Author',
    FOUNDING_MEMBER = 'Founding Member',
    COMMUNITY_BUILDER = 'Community Builder',
    VERIFIED = 'Verified Contributor',
}

export enum CreativeCommonsLicense {
    CC_BY = 'Attribution (CC BY)',
    CC_BY_SA = 'Attribution-ShareAlike (CC BY-SA)',
    CC_BY_ND = 'Attribution-NoDerivs (CC BY-ND)',
    CC0 = 'Public Domain Dedication (CC0)',
}

export interface Conference {
  name: string;
  role: 'Speaker' | 'Attendee' | 'Organizer' | 'Keynote Speaker';
  year: number;
  location: string;
}

export interface Thesis {
  title: string;
  university: string;
  year: number;
  url?: string;
}

export interface Project {
  name: string;
  description: string;
  status: 'Ongoing' | 'Completed' | 'Planning';
  url?: string;
}

export interface Institution {
  id: string;
  name: string;
  city: string;
  country: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  description: string;
}

export type NewInstitution = Omit<Institution, 'id' | 'logoUrl'>;

export interface User {
  id: string;
  name: string;
  email: string;
  institutionId: string;
  specialties: string[];
  avatarUrl: string;
  bio: string;
  roles: UserRole[];
  followingUsers: string[];
  followedArticles: string[];
  bannerUrl: string;
  websiteUrl: string | null;
  googleScholarUrl: string | null;
  reputation: number;
  badges: Badge[];
  location: { city: string, country: string, lat: number, lng: number } | null;
  favoriteKeywords: string[];
  portfolio?: {
    thesis: Thesis | null;
    conferences: Conference[];
    projects: Project[];
  };
  joinDate: string;
}

export interface NewUser {
    name: string;
    email: string;
    institutionId: string;
    password?: string; // Password is used for creation, not stored in the main User object
}

export interface Review {
  id: string;
  reviewer: User;
  date: string;
  recommendation: ReviewRecommendation;
  comment: string;
}

export interface Comment {
    id: string;
    author: User;
    date: string;
    text: string;
    parentId: string | null;
}

export interface Article {
  id: string;
  title: string;
  abstract: string;
  keywords: string[];
  disciplines: string[];
  references: string;
  fullText: string;
  author: User;
  submissionDate: string;
  publicationDate?: string;
  status: ArticleStatus;
  reviews: Review[];
  comments: Comment[];
  views: number;
  citations: number;
  license: CreativeCommonsLicense | null;
  workingGroupId?: string;
  language: 'en' | 'fr' | 'es';
}

export interface Notification {
    id: string;
    userId: string;
    type: 'reply' | 'new_article' | 'mention' | 'new_article_keyword' | 'new_event' | 'new_message';
    messageKey: string;
    messagePayload: Record<string, string | number>;
    articleId?: string;
    eventId?: string;
    isRead: boolean;
    date: string;
}

export interface WorkingGroup {
  id: string;
  name: string;
  description: string;
  members: string[]; // array of user IDs
  coordinators: string[]; // array of user IDs (admins of the group)
  associatedArticles: string[]; // array of article IDs
  bibliography: string;
  createdDate: string;
}

export type NewWorkingGroup = Omit<WorkingGroup, 'id' | 'members' | 'coordinators' | 'associatedArticles' | 'createdDate'>;

export interface ScientificEvent {
  id: string;
  title: string;
  type: 'Conference' | 'Call for Papers' | 'Workshop' | 'Summer School';
  disciplines: string[];
  startDate: string;
  endDate: string;
  location: string;
  url: string;
  description: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string; // ISO date string
  isRead: boolean;
}