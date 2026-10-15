export interface LearningContent {
  id: string;
  title: string;
  description: string;
  domain: 'mathematics' | 'chemistry' | 'physics' | 'biology' | 'realworld';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  // Common fields for all content types
  prerequisites: string[];
  references: string[];
  // To be extended by specific content types
}

export interface Lesson extends LearningContent {
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  content: string;
  objectives: string[];
  applications: Application[];
  assessments: Assessment[];
}

export interface Application {
  id: string;
  title: string;
  description: string;
  type: 'simulation' | 'interactive' | 'video' | 'text';
  // Reference to a simulation contract or other resource
  resourceId: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'exercise' | 'project';
  // Reference to assessment items
  itemIds: string[];
}

export interface Reference {
  id: string;
  title: string;
  author: string;
  year: number;
  publisher: string;
  url: string;
}

// Domain-specific extensions can be added here
export interface MathematicsContent extends LearningContent {
  // Mathematics-specific fields
}

export interface ChemistryContent extends LearningContent {
  // Chemistry-specific fields
}

export interface PhysicsContent extends LearningContent {
  // Physics-specific fields
}

export interface BiologyContent extends LearningContent {
  // Biology-specific fields
}

export interface RealworldContent extends LearningContent {
  // Real-world challenges-specific fields
}
