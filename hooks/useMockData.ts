import { useMemo } from 'react';
import type { User, Article, WorkingGroup, ScientificEvent, Institution, Message } from '../types';
import { UserRole, ArticleStatus, ReviewRecommendation, Badge, CreativeCommonsLicense } from '../types';

export const useMockData = () => {
  const data = useMemo(() => {
    const institutions: Institution[] = [
        {
            id: 'inst-1',
            name: 'University of Syntax',
            city: 'Prague',
            country: 'Czech Republic',
            websiteUrl: '#',
            logoUrl: 'https://via.placeholder.com/150/81A4CD/FFFFFF?text=US',
            description: 'A leading institution in theoretical and formal linguistics, with a strong focus on generative grammar and its interfaces.'
        },
        {
            id: 'inst-2',
            name: 'Institute for Language Studies',
            city: 'London',
            country: 'United Kingdom',
            websiteUrl: '#',
            logoUrl: 'https://via.placeholder.com/150/A3BE8C/FFFFFF?text=ILS',
            description: 'Dedicated to the empirical study of language in its social and cognitive contexts, specializing in semantics, pragmatics, and sociolinguistics.'
        },
        {
            id: 'inst-3',
            name: 'Global Language Institute',
            city: 'Boston',
            country: 'USA',
            websiteUrl: '#',
            logoUrl: 'https://via.placeholder.com/150/B48EAD/FFFFFF?text=GLI',
            description: 'An interdisciplinary center for the study of language evolution, change, and computation, known for its work in historical and corpus linguistics.'
        }
    ];

    const user1: User = {
      id: 'user-1',
      name: 'Dr. Alena Petrova',
      email: 'apetrova@university-syntax.edu',
      institutionId: 'inst-1',
      specialties: ['Phonology', 'Syntax', 'Computational Linguistics'],
      avatarUrl: 'https://i.pravatar.cc/150?u=user1',
      bio: 'Linguistics professor with a focus on Slavic languages and formal syntax.',
      roles: [UserRole.AUTHOR, UserRole.REVIEWER],
      followingUsers: ['user-2', 'user-admin'],
      followedArticles: [],
      bannerUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      websiteUrl: 'https://example.edu/apetrova',
      googleScholarUrl: 'https://scholar.google.com/citations?user=xyz123',
      reputation: 54,
      badges: [Badge.FOUNDING_MEMBER, Badge.PROLIFIC_AUTHOR, Badge.VERIFIED],
      location: { city: 'Prague', country: 'Czech Republic', lat: 50.0755, lng: 14.4378 },
      favoriteKeywords: ['Laryngeal Theory', 'PIE', 'Hittite'],
      joinDate: '2023-01-10T10:00:00Z',
      portfolio: {
        thesis: {
            title: 'A Four-Laryngeal Model for Proto-Indo-European based on Hittite Evidence',
            university: 'University of Syntax',
            year: 2018,
            url: '#'
        },
        conferences: [
            { name: 'Annual Meeting on Phonology (AMP)', role: 'Speaker', year: 2023, location: 'Paris, France' },
            { name: 'Indo-European Roundtable', role: 'Keynote Speaker', year: 2022, location: 'Leiden, Netherlands' },
        ],
        projects: [
            { name: 'Digital Corpus of Anatolian Languages', description: 'A project to digitize and annotate all known Anatolian texts.', status: 'Ongoing', url: '#' }
        ]
    }
    };

    const user2: User = {
      id: 'user-2',
      name: 'Dr. Ben Carter',
      email: 'bcarter@ils.org',
      institutionId: 'inst-2',
      specialties: ['Semantics', 'Pragmatics', 'Sociolinguistics'],
      avatarUrl: 'https://i.pravatar.cc/150?u=user2',
      bio: 'Researcher exploring the intersection of meaning, context, and society.',
      roles: [UserRole.AUTHOR, UserRole.REVIEWER],
      followingUsers: ['user-1'],
      followedArticles: ['art-1'],
      bannerUrl: 'https://images.unsplash.com/photo-1484807352052-23338990c6c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      websiteUrl: 'https://example.org/bcarter',
      googleScholarUrl: null,
      reputation: 32,
      badges: [Badge.FOUNDING_MEMBER],
      location: { city: 'London', country: 'United Kingdom', lat: 51.5072, lng: -0.1276 },
      favoriteKeywords: ['Discourse Analysis', 'Politeness', 'Corpus Linguistics'],
      joinDate: '2023-02-20T11:00:00Z',
      portfolio: {
        thesis: null,
        conferences: [
            { name: 'International Pragmatics Conference (IPrA)', role: 'Speaker', year: 2023, location: 'Brussels, Belgium' },
            { name: 'Computer-Mediated Communication (CMC)', role: 'Attendee', year: 2022, location: 'Online' },
        ],
        projects: []
    }
    };
    
    const adminUser: User = {
        id: 'user-admin',
        name: 'Dr. Evelyn Reed',
        email: 'ereed@gli.edu',
        institutionId: 'inst-3',
        specialties: ['Historical Linguistics', 'Corpus Linguistics'],
        avatarUrl: 'https://i.pravatar.cc/150?u=currentuser',
        bio: 'Passionate about uncovering the evolution of language through data.',
        roles: [UserRole.AUTHOR, UserRole.REVIEWER, UserRole.ADMIN, UserRole.MODERATOR],
        followingUsers: ['user-1', 'user-2'],
        followedArticles: [],
        bannerUrl: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        websiteUrl: 'https://example.edu/ereed',
        googleScholarUrl: 'https://scholar.google.com/citations?user=abc789',
        reputation: 22,
        badges: [Badge.FOUNDING_MEMBER, Badge.VERIFIED],
        location: { city: 'Boston', country: 'USA', lat: 42.3601, lng: -71.0589 },
        favoriteKeywords: ['Language Shift', 'Agent-Based Modeling'],
        joinDate: '2023-01-05T09:00:00Z',
        portfolio: {
        thesis: {
            title: 'Modeling Language Evolution: An Agent-Based Approach',
            university: 'Global Language Institute',
            year: 2015,
        },
        conferences: [
             { name: 'Conference on Computational Linguistics (ACL)', role: 'Organizer', year: 2023, location: 'Toronto, Canada' },
        ],
        projects: [
            { name: 'Linguistics Nexus Platform', description: 'Lead developer and project manager for this platform.', status: 'Completed', url: '#' }
        ]
    }
    };

    const user3: User = {
        id: 'user-3',
        name: 'Dr. Jean Dupont',
        email: 'jdupont@university-syntax.edu',
        institutionId: 'inst-1',
        specialties: ['Syntax', 'Semantics'],
        avatarUrl: 'https://i.pravatar.cc/150?u=user3',
        bio: 'Specialist in generative syntax and formal semantics.',
        roles: [UserRole.AUTHOR],
        followingUsers: [],
        followedArticles: [],
        bannerUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        websiteUrl: null,
        googleScholarUrl: null,
        reputation: 2,
        badges: [],
        location: { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
        favoriteKeywords: ['Minimalist Program', 'Cartography'],
        joinDate: '2024-05-15T14:00:00Z',
        portfolio: { thesis: null, conferences: [], projects: [] }
    };
    
    const initialUsers: User[] = [user1, user2, adminUser, user3];
    
    const messages: Message[] = [
        {
            id: 'msg-1',
            senderId: 'user-1',
            recipientId: 'user-2',
            text: 'Hi Ben, great paper on discourse markers! I had a follow-up question about your corpus.',
            timestamp: '2024-07-28T10:00:00Z',
            isRead: true,
        },
        {
            id: 'msg-2',
            senderId: 'user-2',
            recipientId: 'user-1',
            text: 'Thanks, Alena! Happy to discuss. What did you have in mind?',
            timestamp: '2024-07-28T10:05:00Z',
            isRead: true,
        },
        {
            id: 'msg-3',
            senderId: 'user-admin',
            recipientId: 'user-1',
            text: 'Hello Dr. Petrova, we\'re looking for reviewers for a paper on computational phonology. Would you be interested?',
            timestamp: '2024-07-29T14:00:00Z',
            isRead: false,
        },
    ];

    const initialWorkingGroups: WorkingGroup[] = [
        {
            id: 'wg-1',
            name: 'Corpus of Spoken French',
            description: 'A collaborative project to build and analyze a comprehensive corpus of contemporary spoken French from various regions. Our goal is to document phonological variations, syntactic innovations, and lexical trends.',
            members: [user1.id, adminUser.id],
            coordinators: [adminUser.id],
            associatedArticles: ['art-3', 'art-4'],
            bibliography: `* Labov, W. (1972). Sociolinguistic Patterns. University of Pennsylvania Press.
* Biber, D., & Conrad, S. (2009). Register, Genre, and Style. Cambridge University Press.
* Moreau, M.-L. (1997). Sociolinguistique: les concepts de base. Mardaga.`,
            createdDate: '2023-09-01T10:00:00Z',
        }
    ];

    const scientificEvents: ScientificEvent[] = [
      {
        id: 'evt-1',
        title: 'Annual Meeting on Phonology (AMP 2024)',
        type: 'Conference',
        disciplines: ['Phonology'],
        startDate: '2024-10-11T09:00:00Z',
        endDate: '2024-10-13T17:00:00Z',
        location: 'University of Southern California, USA',
        url: '#',
        description: 'The premier conference for phonological research, featuring talks and posters on a wide range of topics in the field.'
      },
      {
        id: 'evt-2',
        title: 'Call for Papers: Journal of Pragmatics Special Issue',
        type: 'Call for Papers',
        disciplines: ['Pragmatics', 'Sociolinguistics'],
        startDate: '2024-09-01T09:00:00Z',
        endDate: '2024-12-15T23:59:59Z',
        location: 'Online Submission',
        url: '#',
        description: 'Special issue on "Digital Discourse and Politeness". We invite submissions that explore politeness phenomena in online communication.'
      },
      {
        id: 'evt-3',
        title: 'Generative Syntax in the 21st Century (GS21)',
        type: 'Conference',
        disciplines: ['Syntax'],
        startDate: '2025-01-08T09:00:00Z',
        endDate: '2025-01-10T18:00:00Z',
        location: 'Leiden University, Netherlands',
        url: '#',
        description: 'A conference exploring recent developments in generative grammar and its interfaces with other linguistic modules.'
      }
    ];

    const articles: Article[] = [
      {
        id: 'art-1',
        title: 'The Phonological System of Proto-Indo-European: A Reassessment',
        abstract: 'This paper re-examines the laryngeal theory in Proto-Indo-European phonology, proposing a new model with four laryngeals based on recent Hittite evidence. We argue that this model provides a more parsimonious explanation for vowel alternations in descendant languages.',
        keywords: ['Proto-Indo-European', 'Phonology', 'Laryngeal Theory', 'Hittite', 'Historical Linguistics'],
        disciplines: ['Phonology', 'Historical Linguistics'],
        references: 'Saussure, F. de. (1879). Mémoire sur le système primitif des voyelles dans les langues indo-européennes. ...',
        fullText: `# A Deep Dive into PIE Phonology...`,
        author: user1,
        submissionDate: '2023-10-15T10:00:00Z',
        publicationDate: '2023-11-20T09:00:00Z',
        status: ArticleStatus.PUBLISHED,
        views: 1258,
        citations: 42,
        license: CreativeCommonsLicense.CC_BY,
        language: 'en',
        reviews: [
            { id: 'rev-1', reviewer: user2, date: '2023-11-01T14:30:00Z', recommendation: ReviewRecommendation.ACCEPT, comment: 'A groundbreaking paper that significantly advances our understanding of PIE. Well-argued and supported by strong evidence.' },
        ],
        comments: [
            { id: 'com-1', author: user2, date: '2023-11-20T09:15:00Z', text: 'Congratulations on the publication! This will surely be a key reference for years to come.', parentId: null },
            { id: 'com-2', author: user1, date: '2023-11-20T11:00:00Z', text: 'Thank you, Ben! I appreciate your insightful review during the process.', parentId: 'com-1' },
            { id: 'com-3', author: adminUser, date: '2023-11-21T14:00:00Z', text: 'A fantastic read. I had one question regarding the treatment of laryngeals in Anatolian languages - could you elaborate on that?', parentId: null },
            { id: 'com-4', author: user1, date: '2023-11-22T10:00:00Z', text: 'Excellent question, Evelyn. The Anatolian evidence is complex, but my upcoming paper will address it directly. I argue that the reflexes there support a four-laryngeal system.', parentId: 'com-3' },
        ]
      },
      {
        id: 'art-2',
        title: 'Discourse Markers and Politeness in Online Academic Communities',
        abstract: 'We analyze a corpus of 10,000 forum posts from academic mailing lists to investigate the role of discourse markers (e.g., "actually", "I think") in conveying politeness and managing academic disagreement. The study finds a significant correlation between marker usage and community engagement.',
        keywords: ['Discourse Analysis', 'Pragmatics', 'Sociolinguistics', 'Politeness Theory', 'Corpus Linguistics'],
        disciplines: ['Pragmatics', 'Sociolinguistics'],
        references: 'Brown, P., & Levinson, S. C. (1987). Politeness: Some universals in language usage. ...',
        fullText: 'This article presents a comprehensive study on discourse markers...',
        author: user2,
        submissionDate: '2024-01-20T15:30:00Z',
        publicationDate: '2024-02-15T10:00:00Z',
        status: ArticleStatus.PUBLISHED,
        views: 3450,
        citations: 5,
        license: CreativeCommonsLicense.CC_BY_SA,
        language: 'en',
        reviews: [
            { id: 'rev-2', reviewer: user1, date: '2024-02-05T18:00:00Z', recommendation: ReviewRecommendation.MINOR_REVISIONS, comment: 'Solid methodology and interesting findings. The discussion section could be strengthened by connecting the results more explicitly to Brown & Levinson\'s framework. Some minor clarifications are needed in Table 2.' },
        ],
        comments: []
      },
       {
        id: 'art-3',
        title: 'A Computational Model for Predicting Language Shift',
        abstract: 'This paper introduces a novel agent-based model to simulate language shift dynamics in multilingual communities. By incorporating factors such as social network structure, language prestige, and intergenerational transmission, the model accurately predicts outcomes observed in historical case studies.',
        keywords: ['Computational Linguistics', 'Language Shift', 'Sociolinguistics', 'Agent-Based Modeling'],
        disciplines: ['Computational Linguistics', 'Sociolinguistics'],
        references: 'Abrams, D. M., & Strogatz, S. H. (2003). Linguistics: Modelling the dynamics of language death. Nature, 424(6951), 900-900.',
        fullText: 'The full text for the computational model paper would detail the mathematical foundations...',
        author: adminUser,
        submissionDate: '2024-03-10T09:00:00Z',
        status: ArticleStatus.UNDER_REVIEW,
        views: 102,
        citations: 0,
        license: null,
        language: 'en',
        workingGroupId: 'wg-1',
        reviews: [{id: 'rev-3', reviewer: user1, date: '2024-03-25T11:00:00Z', recommendation: ReviewRecommendation.MAJOR_REVISIONS, comment: 'Promising model, but the validation section is weak. Needs comparison with more case studies.'}],
        comments: []
      },
       {
        id: 'art-4',
        title: 'The Syntax of Code-Switching in Bilingual Children',
        abstract: 'This longitudinal study examines the syntactic structures of code-switching in Spanish-English bilingual children aged 4-6. We find that their switches adhere to the Matrix Language Frame model, challenging earlier theories of grammatical constraint violations.',
        keywords: ['Bilingualism', 'Code-Switching', 'Syntax', 'Child Language Acquisition'],
        disciplines: ['Syntax', 'Psycholinguistics'],
        references: 'Myers-Scotton, C. (1993). Dueling languages: Grammatical structure in codeswitching. Oxford University Press.',
        fullText: 'Full text here...',
        author: user1,
        submissionDate: '2024-04-22T11:00:00Z',
        publicationDate: '2024-05-30T16:00:00Z',
        status: ArticleStatus.PUBLISHED,
        views: 2890,
        citations: 15,
        license: CreativeCommonsLicense.CC_BY,
        language: 'en',
        workingGroupId: 'wg-1',
        reviews: [],
        comments: []
      },
      {
        id: 'art-5',
        title: "L'interface Syntaxe-Sémantique du partitif en français",
        abstract: "Cet article explore la structure des syntagmes nominaux partitifs en français (ex. 'du pain', 'des amis'). Nous proposons une analyse unifiée qui rend compte des différentes interprétations (massique, pluriel) en se basant sur une décomposition fine de la tête nominale D.",
        keywords: ['Syntax', 'Semantics', 'French Linguistics', 'Partitive'],
        disciplines: ['Syntax', 'Semantics'],
        references: 'Vergnaud, J.-R. (1974). French Relative Clauses. PhD Thesis, MIT.',
        fullText: 'Full text in French here...',
        author: user3,
        submissionDate: '2024-05-20T09:00:00Z',
        status: ArticleStatus.SUBMITTED,
        views: 45,
        citations: 0,
        license: CreativeCommonsLicense.CC_BY,
        language: 'fr',
        reviews: [],
        comments: []
      },
      {
        id: 'art-6',
        title: "Revisiting English Verb Complementation",
        abstract: "A corpus-based study of verb complementation patterns in modern British English, focusing on the competition between gerunds and infinitives after specific classes of matrix verbs. The results show a significant shift towards infinitival complements over the last 50 years.",
        keywords: ['Corpus Linguistics', 'Syntax', 'English Grammar', 'Complementation'],
        disciplines: ['Syntax', 'Corpus Linguistics'],
        references: 'Biber, D., Johansson, S., Leech, G., Conrad, S., & Finegan, E. (1999). Longman grammar of spoken and written English. Longman.',
        fullText: 'Full text here...',
        author: user2,
        submissionDate: '2024-06-01T14:20:00Z',
        status: ArticleStatus.REJECTED,
        views: 112,
        citations: 0,
        license: null,
        language: 'en',
        reviews: [{id: 'rev-4', reviewer: adminUser, date: '2024-06-15T10:00:00Z', recommendation: ReviewRecommendation.REJECT, comment: 'The study lacks a clear theoretical grounding for the observed statistical shifts. The methodology is sound, but the analysis does not go beyond descriptive statistics.'}],
        comments: []
      },
    ];

    return { users: initialUsers, articles, workingGroups: initialWorkingGroups, scientificEvents, institutions, messages };
  }, []);

  return data;
};