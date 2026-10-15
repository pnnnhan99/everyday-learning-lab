import React, { useState } from 'react';

import { Lesson } from '../learning/types';
import { SimulationContract } from '../simulation/types';

interface LessonDetailProps {
  lesson: Lesson;
  simulationRegistry: Map<string, SimulationContract<unknown, unknown>>;
}

export const LessonDetail: React.FC<LessonDetailProps> = ({ lesson, simulationRegistry }) => {
  const [simulationResults, setSimulationResults] = useState<unknown | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [activeSimulationId, setActiveSimulationId] = useState<string | null>(null);

  const handleRunSimulation = async (simulationId: string) => {
    setSimulationError(null);
    setIsRunningSimulation(true);
    setActiveSimulationId(simulationId);
    const simulation = simulationRegistry.get(simulationId);
    if (!simulation) {
      setSimulationError('Simulation not found in registry');
      setIsRunningSimulation(false);
      setActiveSimulationId(null);
      return;
    }
    try {
      await simulation.initialize();
      const result = await simulation.run();
      setSimulationResults(result);
    } catch (err) {
      setSimulationError(err instanceof Error ? err.message : 'Unknown error during simulation');
    } finally {
      setIsRunningSimulation(false);
      // Keep activeSimulationId set so we know which simulation was last run
    }
  };

  // Handle case where lesson or essential data is missing
  if (!lesson || !lesson.title) {
    return (
      <div className='space-y-8 text-center'>
        <h2 className='text-2xl font-bold text-white/80'>Lesson Not Available</h2>
        <p className='text-sm text-white/50'>
          The lesson data could not be loaded. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <header>
        <h1 className='text-3xl font-bold tracking-tight text-white'>{lesson.title}</h1>
        <p className='text-sm text-white/50'>{lesson.description || 'No description available.'}</p>
      </header>

      {/* Sections */}
      <section>
        <h2 className='text-xl font-semibold text-white/80'>Sections</h2>
        {lesson.sections && lesson.sections.length > 0 ? (
          lesson.sections.map((section) => (
            <div key={section.id} className='space-y-6'>
              <h3 className='text-lg font-medium text-white'>{section.title || 'Untitled Section'}</h3>
              <div className='text-sm text-white/70'>{section.content || 'No content available.'}</div>

              {/* Objectives */}
              {section.objectives && section.objectives.length > 0 ? (
                <>
                  <div className='mt-4'>
                    <h4 className='text-sm font-medium text-white/60'>Objectives</h4>
                    <ul className='list-disc list-space-y-1 pl-5 text-sm text-white/70'>
                      {section.objectives.map((obj) => (
                        <li key={obj}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className='mt-4 text-sm text-white/50'>No objectives defined for this section.</p>
              )}

              {/* Applications */}
              {section.applications && section.applications.length > 0 ? (
                <>
                  <div className='mt-4'>
                    <h4 className='text-sm font-medium text-white/60'>Applications</h4>
                    {section.applications.map((app) => (
                      <div key={app.id} className='border border-white/10 rounded-lg p-3 mb-4'>
                        <h5 className='text-base font-medium text-white'>{app.title || 'Untitled Application'}</h5>
                        <p className='text-sm text-white/60'>{app.description || 'No description available.'}</p>
                        {app.type === 'simulation' && (
                          <>
                            <button
                              onClick={() => handleRunSimulation(app.resourceId)}
                              disabled={isRunningSimulation}
                              aria-busy={isRunningSimulation}
                              aria-label={`${isRunningSimulation ? 'Running simulation' : 'Run simulation'}: ${app.title}`}
                              className={`${isRunningSimulation ? 'bg-gray-500' : 'bg-blue-500'} text-white rounded-hover w-full text-left py-2`}
                            >
                              {isRunningSimulation ? (
                                <>
                                  Running<span aria-hidden="true">...</span>
                                  <span className='sr-only'>simulation</span>
                                </>
                              ) : (
                                'Run Simulation'
                              )}
                            </button>
                            {simulationError && activeSimulationId === app.resourceId && (
                              <div className='mt-2'>
                                <p className='text-sm text-red-400' role='alert'>
                                  Simulation error: {simulationError}
                                </p>
                              </div>
                            )}
                            {simulationResults !== null && activeSimulationId === app.resourceId && (
                              <div className='mt-4'>
                                <h5 className='text-sm font-medium text-white'>Results:</h5>
                                <div className='bg-white/5 p-3 rounded-lg text-xs text-white/80 overflow-auto max-h-40'>
                                  <pre>{JSON.stringify(simulationResults, null, 2)}</pre>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        {app.type !== 'simulation' && (
                          <p className='mt-2 text-sm text-white/60'>
                            [{app.type}] {app.resourceId || 'No resource ID'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className='mt-4 text-sm text-white/50'>No applications defined for this section.</p>
              )}

              {/* Assessments */}
              {section.assessments && section.assessments.length > 0 ? (
                <>
                  <div className='mt-4'>
                    <h4 className='text-sm font-medium text-white/60'>Self-Check</h4>
                    {section.assessments.map((assessment) => (
                      <div key={assessment.id} className='border border-white/10 rounded-lg p-3 mb-4'>
                        <h5 className='text-base font-medium text-white'>{assessment.title || 'Untitled Assessment'}</h5>
                        <p className='text-sm text-white/60'>{assessment.description || 'No description available.'}</p>
                        {/* In a real implementation, we would render the assessment items */}
                        <p className='mt-2 text-sm text-white/50 italic'>
                          Assessment items would be rendered here.
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className='mt-4 text-sm text-white/50'>No assessments defined for this section.</p>
              )}
            </div>
          ))
        ) : (
          <p className='text-sm text-white/50'>No sections available for this lesson.</p>
        )}
      </section>

      {/* Practical Application and Reflection */}
      <section>
        <h2 className='text-xl font-semibold text-white/80'>Practical Application &amp; Reflection</h2>
        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-medium text-white'>Apply What You&apos;s Learned</h3>
            <p className='text-sm text-white/70'>Consider how the concepts in this lesson apply to everyday situations. Think about examples you might encounter at home, work, or in nature.</p>
          </div>
          <div>
            <h3 className='text-lg font-medium text-white'>Reflection</h3>
            <p className='text-sm text-white/70'>Take a moment to reflect on what you learned. What was most surprising? What questions do you still have?</p>
          </div>
        </div>
      </section>

      {/* Related Topics and Next Steps */}
      <section>
        <h2 className='text-xl font-semibold text-white/80'>Related Topics &amp; Next Steps</h2>
        <p className='text-sm text-white/70'>Explore related lessons to deepen your understanding.</p>
        {/* In a real implementation, we would list related lessons */}
      </section>
    </div>
  );
};
