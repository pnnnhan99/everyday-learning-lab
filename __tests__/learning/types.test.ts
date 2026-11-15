import { describe, it, expect } from 'vitest';
import {
  validateLearningContent,
  validateLesson,
  validateSection,
  validateApplication,
  validateAssessment,
  validateReference
} from '../../src/learning/types';

describe('Learning content validation', () => {
  describe('validateLearningContent', () => {
    it('should validate a valid learning content', () => {
      const input = {
        id: 'lc1',
        title: 'Test Content',
        description: 'A test content',
        domain: 'mathematics',
        difficulty: 'beginner',
        language: 'en',
        prerequisites: ['pre1', 'pre2'],
        references: ['ref1', 'ref2']
      };

      const result = validateLearningContent(input);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('lc1');
        expect(result.value.title).toBe('Test Content');
        expect(result.value.description).toBe('A test content');
        expect(result.value.domain).toBe('mathematics');
        expect(result.value.difficulty).toBe('beginner');
        expect(result.value.language).toBe('en');
        expect(result.value.prerequisites).toEqual(['pre1', 'pre2']);
        expect(result.value.references).toEqual(['ref1', 'ref2']);
      }
    });

    it('should reject missing id', () => {
      const input = {
        title: 'Test Content',
        description: 'A test content',
        domain: 'mathematics',
        difficulty: 'beginner',
        language: 'en',
        prerequisites: [],
        references: []
      };

      const result = validateLearningContent(input);
      expect(result.ok).toBe(false);
      expect(result.error).toContain('LearningContent.id is required');
    });

    it('should reject invalid domain', () => {
      const input = {
        id: 'lc1',
        title: 'Test Content',
        description: 'A test content',
        domain: 'invalid',
        difficulty: 'beginner',
        language: 'en',
        prerequisites: [],
        references: []
      };

      const result = validateLearningContent(input);
      expect(result.ok).toBe(false);
      expect(result.error).toContain('LearningContent.domain must be one of');
    });

    it('rejects blank required text and malformed string arrays', () => {
      const base = {
        id: 'lc1',
        title: 'Test Content',
        description: 'A test content',
        domain: 'chemistry',
        difficulty: 'beginner',
        language: 'en',
        prerequisites: [],
        references: []
      };

      expect(validateLearningContent({ ...base, title: '  ' }).ok).toBe(false);
      expect(validateLearningContent({ ...base, description: '' }).ok).toBe(false);
      expect(validateLearningContent({ ...base, language: '' }).ok).toBe(false);
      expect(validateLearningContent({ ...base, prerequisites: ['ok', ''] }).ok).toBe(false);
      expect(validateLearningContent({ ...base, references: 'not-an-array' }).ok).toBe(false);
    });
  });

  describe('validateLesson', () => {
    it('should validate a valid lesson', () => {
      const input = {
        id: 'lesson1',
        title: 'Test Lesson',
        description: 'A test lesson',
        domain: 'chemistry',
        difficulty: 'intermediate',
        language: 'en',
        prerequisites: ['pre1'],
        references: ['ref1'],
        sections: [
          {
            id: 'sec1',
            title: 'Section 1',
            content: 'Content 1',
            objectives: ['obj1'],
            applications: [
              {
                id: 'app1',
                title: 'Application 1',
                description: 'Desc 1',
                type: 'simulation',
                resourceId: 'sim1'
              }
            ],
            assessments: [
              {
                id: 'ass1',
                title: 'Assessment 1',
                description: 'Desc 1',
                type: 'quiz',
                itemIds: ['item1']
              }
            ]
          }
        ]
      };

      const result = validateLesson(input);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('lesson1');
        expect(result.value.sections.length).toBe(1);
        expect(result.value.sections[0].id).toBe('sec1');
        expect(result.value.sections[0].applications.length).toBe(1);
        expect(result.value.sections[0].assessments.length).toBe(1);
      }
    });

    const validLesson = {
      id: 'lesson1',
      title: 'Test Lesson',
      description: 'A test lesson',
      domain: 'chemistry',
      difficulty: 'intermediate',
      language: 'en',
      prerequisites: [],
      references: [],
      sections: [
        {
          id: 'sec1',
          title: 'Section 1',
          content: 'Content 1',
          objectives: ['obj1'],
          applications: [],
          assessments: []
        }
      ]
    };

    it('rejects empty sections and duplicate section ids', () => {
      expect(validateLesson({ ...validLesson, sections: [] }).ok).toBe(false);
      const duplicate = {
        ...validLesson,
        sections: [validLesson.sections[0], { ...validLesson.sections[0] }]
      };
      const result = validateLesson(duplicate);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toContain('duplicate section id');
    });

    it('validates nested applications and assessments', () => {
      const missingResource = {
        ...validLesson,
        sections: [
          {
            ...validLesson.sections[0],
            applications: [
              { id: 'app1', title: 'App', description: 'Desc', type: 'simulation', resourceId: '' }
            ]
          }
        ]
      };
      expect(validateLesson(missingResource).ok).toBe(false);

      const invalidAssessment = {
        ...validLesson,
        sections: [
          {
            ...validLesson.sections[0],
            assessments: [
              { id: 'ass1', title: '', description: 'Desc', type: 'exercise', itemIds: [] }
            ]
          }
        ]
      };
      expect(validateLesson(invalidAssessment).ok).toBe(false);
    });
  });

  describe('validateSection', () => {
    it('should validate a valid section', () => {
      const input = {
        id: 'sec1',
        title: 'Section 1',
        content: 'Content 1',
        objectives: ['obj1', 'obj2'],
        applications: [
          {
            id: 'app1',
            title: 'App 1',
            description: 'Desc 1',
            type: 'interactive',
            resourceId: 'inter1'
          }
        ],
        assessments: [
          {
            id: 'ass1',
            title: 'Assessment 1',
            description: 'Desc 1',
            type: 'exercise',
            itemIds: ['item1', 'item2']
          }
        ]
      };

      const result = validateSection(input);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('sec1');
        expect(result.value.title).toBe('Section 1');
        expect(result.value.content).toBe('Content 1');
        expect(result.value.objectives).toEqual(['obj1', 'obj2']);
        expect(result.value.applications.length).toBe(1);
        expect(result.value.assessments.length).toBe(1);
      }
    });
  });

  describe('validateApplication', () => {
    it('should validate a valid application', () => {
      const input = {
        id: 'app1',
        title: 'Video App',
        description: 'A video application',
        type: 'video',
        resourceId: 'video123'
      };

      const result = validateApplication(input);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('app1');
        expect(result.value.title).toBe('Video App');
        expect(result.value.description).toBe('A video application');
        expect(result.value.type).toBe('video');
        expect(result.value.resourceId).toBe('video123');
      }
    });

    it('should reject invalid type', () => {
      const input = {
        id: 'app1',
        title: 'Video App',
        description: 'A video application',
        type: 'invalid',
        resourceId: 'video123'
      };

      const result = validateApplication(input);
      expect(result.ok).toBe(false);
      expect(result.error).toContain('Application.type must be one of');
    });
  });

  describe('validateAssessment', () => {
    it('should validate a valid assessment', () => {
      const input = {
        id: 'ass1',
        title: 'Project Assessment',
        description: 'A project based assessment',
        type: 'project',
        itemIds: ['proj1', 'proj2']
      };

      const result = validateAssessment(input);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('ass1');
        expect(result.value.title).toBe('Project Assessment');
        expect(result.value.description).toBe('A project based assessment');
        expect(result.value.type).toBe('project');
        expect(result.value.itemIds).toEqual(['proj1', 'proj2']);
      }
    });
  });

  describe('validateReference', () => {
    it('should validate a valid reference', () => {
      const input = {
        id: 'ref1',
        title: 'Test Reference',
        author: 'John Doe',
        year: 2023,
        publisher: 'Test Publisher',
        url: 'https://example.com/ref'
      };

      const result = validateReference(input);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('ref1');
        expect(result.value.title).toBe('Test Reference');
        expect(result.value.author).toBe('John Doe');
        expect(result.value.year).toBe(2023);
        expect(result.value.publisher).toBe('Test Publisher');
        expect(result.value.url).toBe('https://example.com/ref');
      }
    });

    it('should reject invalid URL', () => {
      const input = {
        id: 'ref1',
        title: 'Test Reference',
        author: 'John Doe',
        year: 2023,
        publisher: 'Test Publisher',
        url: 'not-a-url'
      };

      const result = validateReference(input);
      expect(result.ok).toBe(false);
      expect(result.error).toContain('Reference.url must be a valid URL');
    });
  });
});
