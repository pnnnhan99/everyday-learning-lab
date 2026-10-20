# Learning Content Model

This document describes the shared learning content model used throughout the Everyday Science Sim application.

## Overview

The learning content model provides a standardized structure for educational content across different domains (mathematics, chemistry, physics, biology, and realworld challenges). It ensures consistency in how lessons, sections, applications, and assessments are defined and validated.

## Core Interfaces

### LearningContent

The base interface for all learning content:

- <code>id</code>: Unique identifier (string)
- <code>title</code>: Human-readable title (string)
- <code>description</code>: Brief description of the content (string)
- <code>domain</code>: Subject domain - one of: 'mathematics', 'chemistry', 'physics', 'biology', 'realworld'
- <code>difficulty</code>: Difficulty level - one of: 'beginner', 'intermediate', 'advanced'
- <code>language</code>: Language code (e.g., 'en', 'es') (string)
- <code>prerequisites</code>: Array of prerequisite content IDs (string[])
- <code>references</code>: Array of reference IDs or citation strings (string[])

### Lesson

Extends LearningContent with:

- <code>sections</code>: Array of Section objects (Section[])

### Section

Represents a subsection of a lesson:

- <code>id</code>: Unique identifier within the lesson (string)
- <code>title</code>: Section title (string)
- <code>content</code>: Main explanatory content (string)
- <code>objectives</code>: Learning objectives for this section (string[])
- <code>applications</code>: Practical applications or activities (Application[])
- <code>assessments</code>: Self-check exercises or quizzes (Assessment[])

### Application

Represents a practical activity:

- <code>id</code>: Unique identifier (string)
- <code>title</code>: Application title (string)
- <code>description</code>: Description of what the application entails (string)
- <code>type</code>: Type of application - one of: 'simulation', 'interactive', 'video', 'text'
- <code>resourceId</code>: Reference to the actual resource (e.g., simulation ID, video URL) (string)

### Assessment

Represents a self-check or evaluation:

- <code>id</code>: Unique identifier (string)
- <code>title</code>: Assessment title (string)
- <code>description</code>: Description of what is being assessed (string)
- <code>type</code>: Type of assessment - one of: 'quiz', 'exercise', 'project'
- <code>itemIds</code>: References to specific assessment items or questions (string[])

### Reference

Represents a scientific or educational reference:

- <code>id</code>: Unique identifier (string)
- <code>title</code>: Title of the reference work (string)
- <code>author</code>: Author name(s) (string)
- <code>year</code>: Publication year (number)
- <code>publisher</code>: Publisher name (string)
- <code>url</code>: URL to the reference (string, must start with http:// or https://)

## Domain-Specific Extensions

Each domain can extend the base LearningContent interface with domain-specific fields:

- MathematicsContent
- ChemistryContent
- PhysicsContent
- BiologyContent
- RealworldContent

Currently, these extensions are placeholders for future domain-specific attributes.

## Validation Functions

The application includes validation functions for each interface to ensure content integrity:

- <code>validateLearningContent</code>
- <code>validateLesson</code>
- <code>validateSection</code>
- <code>validateApplication</code>
- <code>validateAssessment</code>
- <code>validateReference</code>

Each function returns an object with either:

- { ok: true, value: T } for valid input
- { ok: false, error: string } for invalid input, with an explanatory error message

## Example Content

See the src/learning/examples/ directory for sample lessons:

- chemistry-acids-bases.ts: A beginner chemistry lesson on acids and bases
- mathematics-fractions.ts: A beginner mathematics lesson on fractions

These examples demonstrate how to structure content using the model and serve as templates for creating new lessons.

## Usage

When creating new learning content:

1. Define your content object following the appropriate interface
2. Use the validation functions to check for errors before storing or using the content
3. Import and use the content in your application components (e.g., LessonDetail)

## Related Components

- LessonDetail (src/components/lesson-detail/LessonDetail.tsx): Displays a full lesson with sections, applications, and assessments
- Simulation contracts (src/core/simulation/): Typed contract and registry for interactive simulations referenced in applications — see `docs/simulation-contract.md`

## Future Extensions

Potential future enhancements include:

- Adding timing estimates for sections and applications
- Incorporating adaptive learning paths based on assessment performance
- Adding multimedia assets (images, audio) directly to content objects
- Supporting multiple difficulty levels within a single lesson
- Incorporating social/collaborative activity types
