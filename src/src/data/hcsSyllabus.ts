import { SyllabusSubject } from '../types';

export const INITIAL_SYLLABUS: SyllabusSubject[] = [
  {
    id: 'prelims',
    name: 'PRELIMS',
    subSubjects: [
      {
        id: 'prelims-gs',
        name: 'General Studies',
        topics: [
          { id: 'pgs-1', title: 'General Science', completed: false },
          { id: 'pgs-2', title: 'Current Events of National & International Importance', completed: false },
          { id: 'pgs-3', title: 'Indian History & National Movement', completed: false },
          { id: 'pgs-4', title: 'Indian & World Geography', completed: false },
          { id: 'pgs-5', title: 'Indian Culture', completed: false },
          { id: 'pgs-6', title: 'Indian Polity & Governance', completed: false },
          { id: 'pgs-7', title: 'Indian Economy', completed: false },
          { id: 'pgs-8', title: 'General Mental Ability', completed: false },
          { id: 'pgs-9', title: 'Haryana Economy, People, Society, Culture and Language', completed: false }
        ]
      },
      {
        id: 'prelims-csat',
        name: 'CSAT',
        topics: [
          { id: 'pcsat-1', title: 'Comprehension', completed: false },
          { id: 'pcsat-2', title: 'Interpersonal & Communication Skills', completed: false },
          { id: 'pcsat-3', title: 'Logical Reasoning & Analytical Ability', completed: false },
          { id: 'pcsat-4', title: 'Decision Making & Problem Solving', completed: false },
          { id: 'pcsat-5', title: 'General Mental Ability', completed: false },
          { id: 'pcsat-6', title: 'Basic Numeracy & Data Interpretation', completed: false }
        ]
      }
    ]
  },
  {
    id: 'mains',
    name: 'MAINS',
    subSubjects: [
      {
        id: 'mains-eng',
        name: 'English & English Essay',
        topics: [
          { id: 'meng-1', title: 'English Precise Writing & Comprehension', completed: false },
          { id: 'meng-2', title: 'English Essay Writing', completed: false },
          { id: 'meng-3', title: 'Grammar & Vocabulary Usage', completed: false }
        ]
      },
      {
        id: 'mains-hin',
        name: 'Hindi & Hindi Essay',
        topics: [
          { id: 'mhin-1', title: 'Hindi Translation & Grammar', completed: false },
          { id: 'mhin-2', title: 'Hindi Essay Writing', completed: false },
          { id: 'mhin-3', title: 'Precis and Explanation', completed: false }
        ]
      },
      {
        id: 'mains-gs1',
        name: 'GS-I: Heritage, History, Geography & Society',
        topics: [
          { id: 'mgs1-1', title: 'Indian Culture & Heritage', completed: false },
          { id: 'mgs1-2', title: 'Modern Indian History & Freedom Struggle', completed: false },
          { id: 'mgs1-3', title: 'Post-Independence Reorganization', completed: false },
          { id: 'mgs1-4', title: 'World History', completed: false },
          { id: 'mgs1-5', title: 'Indian Society, Diversity & Globalization', completed: false },
          { id: 'mgs1-6', title: 'Role of Women & Women Organizations', completed: false },
          { id: 'mgs1-7', title: 'Social Empowerment, Communalism, Regionalism & Secularism', completed: false },
          { id: 'mgs1-8', title: 'World Physical Geography & Natural Resources', completed: false },
          { id: 'mgs1-9', title: 'Haryana Specific History, Culture & Society', completed: false }
        ]
      },
      {
        id: 'mains-gs2',
        name: 'GS-II: Governance, Constitution, Polity & IR',
        topics: [
          { id: 'mgs2-1', title: 'Indian Constitution & Federalism', completed: false },
          { id: 'mgs2-2', title: 'Separation of Powers & Constitutional Bodies', completed: false },
          { id: 'mgs2-3', title: 'Parliament & State Legislatures', completed: false },
          { id: 'mgs2-4', title: 'Representation of People Act', completed: false },
          { id: 'mgs2-5', title: 'Government Policies, Development & NGOs', completed: false },
          { id: 'mgs2-6', title: 'Welfare Schemes for Vulnerable Sections', completed: false },
          { id: 'mgs2-7', title: 'Governance, Transparency, Accountability & E-Governance', completed: false },
          { id: 'mgs2-8', title: 'Role of Civil Services in Democracy', completed: false },
          { id: 'mgs2-9', title: 'India & its Neighborhood & International Relations', completed: false },
          { id: 'mgs2-10', title: 'Haryana Governance & Administration Issues', completed: false }
        ]
      },
      {
        id: 'mains-gs3',
        name: 'GS-III: Economy, Tech, Environment & Security',
        topics: [
          { id: 'mgs3-1', title: 'Indian Economy & Growth, Budgeting', completed: false },
          { id: 'mgs3-2', title: 'Agriculture, Cropping Patterns, MSP & Food Security', completed: false },
          { id: 'mgs3-3', title: 'Land Reforms & Industrial Policy', completed: false },
          { id: 'mgs3-4', title: 'Science & Tech, IT, Space, Robotics, Biotech', completed: false },
          { id: 'mgs3-5', title: 'Environmental Conservation, Pollution & EIA', completed: false },
          { id: 'mgs3-6', title: 'Disaster Management', completed: false },
          { id: 'mgs3-7', title: 'Internal Security, Cyber Security & Money Laundering', completed: false },
          { id: 'mgs3-8', title: 'Haryana Economy & Agriculture Issues', completed: false }
        ]
      },
      {
        id: 'mains-gs4',
        name: 'GS-IV: Ethics, Integrity & Aptitude',
        topics: [
          { id: 'mgs4-1', title: 'Ethics and Human Interface & Human Values', completed: false },
          { id: 'mgs4-2', title: 'Attitude & Emotional Intelligence', completed: false },
          { id: 'mgs4-3', title: 'Civil Service Values & Integrity', completed: false },
          { id: 'mgs4-4', title: 'Probity in Governance, RTI & Codes of Ethics', completed: false },
          { id: 'mgs4-5', title: 'Moral Thinkers and Philosophers', completed: false },
          { id: 'mgs4-6', title: 'Case Studies on Ethics & Governance Issues', completed: false }
        ]
      }
    ]
  }
];
