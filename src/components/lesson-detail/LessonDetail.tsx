import React, { useState } from 'react';

import { type Lesson } from '../../learning/types';
import type { SimulationContract } from '../../core/simulation/types';

interface LessonDetailProps {
  lesson: Lesson;
  simulationRegistry: Map<string, SimulationContract<unknown, unknown>>;
}

export const LessonDetail: React.FC<LessonDetailProps> = ({ lesson, simulationRegistry }) => {
  const [simulationResults, setSimulationResults] = useState<unknown | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);

  const handleRunSimulation = async (simulationId: string) => {
    setSimulationError(null);
    setIsRunningSimulation(true);
    const simulation = simulationRegistry.get(simulationId);
    if (!simulation) {
      setSimulationError('Simulation not found');
      setIsRunningSimulation(false);
      return;
    }
    try {
      await simulation.initialize();
      const result = await simulation.run();
      setSimulationResults(result);
    } catch (err) {
      setSimulationError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsRunningSimulation(false);
    }
  };

  return (
    <div className='space-y-8'>
      <header>
        <h1 className='text-3xl font-bold tracking-tight text-white'>{lesson.title}</h1>
        <p className='text-sm text-white/50'>{lesson.description}</p>
      </header>

      {/* Sections */}
      <section>
        <h2 className='text-xl font-semibold text-white/80'>Sections</h2>
        {lesson.sections.map((section) => (
          <div key={section.id} className='space-y-4'>
            <h3 className='text-lg font-medium text-white'>{section.title}</h3>
            <div className='text-sm text-white/70'>{section.content}</div>

            {/* Objectives */}
            <div className='mt-2'>
              <h4 className='text-sm font-medium text-white/60'>Objectives</h4>
              <ul className='list-disc list-space-y-1 pl-5 text-sm text-white/70'>
                {section.objectives.map((obj) => (
                  <li key={obj}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Applications */}
            <div className='mt-2'>
              <h4 className='text-sm font-medium text-white/60'>Applications</h4>
              {section.applications.map((app) => (
                <div key={app.id} className='border border-white/10 rounded-lg p-3 mb-2'>
                  <h5 className='text-base font-medium text-white'>{app.title}</h5>
                  <p className='text-sm text-white/60'>{app.description}</p>
                  {app.type === 'simulation' && (
                    <>
                      <button
                        onClick={() => handleRunSimulation(app.resourceId)}
                        disabled={isRunningSimulation}
                        className={`${isRunningSimulation ? 'bg-gray-500' : 'bg-blue-500'} text-white rounded-hover`}
                      >
                        {isRunningSimulation ? 'Running...' : 'Run Simulation'}
                      </button>
                      {simulationError && (
                        <p className='mt-2 text-sm text-red-400'>{simulationError}</p>
                      )}
                      {simulationResults !== null && (
                        <div className='mt-2 p-3 bg-white/10 rounded-lg'>
                          <h5 className='text-sm font-medium text-white'>Results:</h5>
                          <pre className='text-xs text-white/80 bg-white/5 p-2 overflow-auto'>
                            {JSON.stringify(simulationResults, null, 2)}
                          </pre>
                        </div>
                      )}
                    </>
                  )}
                  {app.type !== 'simulation' && (
                    <p className='mt-2 text-sm text-white/60'>
                      [{app.type}] {app.resourceId}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Assessments */}
            <div className='mt-2'>
              <h4 className='text-sm font-medium text-white/60'>Self-Check</h4>
              {section.assessments.map((assessment) => (
                <div key={assessment.id} className='border border-white/10 rounded-lg p-3'>
                  <h5 className='text-base font-medium text-white'>{assessment.title}</h5>
                  <p className='text-sm text-white/60'>{assessment.description}</p>
                  {/* In a real implementation, we would render the assessment items */}
                  <p className='mt-2 text-sm text-white/50 italic'>
                    Assessment items would be rendered here.
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Practical Application and Reflection */}
      <section>
        <h2 className='text-xl font-semibold text-white/80'>Practical Application &amp; Reflection</h2>
        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium text-white'>Apply What You Have Learned</h3>
            <p className='text-sm text-white/70'>
              Consider how the concepts in this lesson apply to everyday situations.
              Think about examples you might encounter at home, work, or in nature.
            </p>
          </div>
          <div>
            <h3 className='text-lg font-medium text-white'>Reflection</h3>
            <p className='text-sm text-white/70'>
              Take a moment to reflect on what you learned. What was most surprising?
              What questions do you still have?
            </p>
          </div>
        </div>
      </section>

      {/* Related Topics and Next Steps */}
      <section>
        <h2 className='text-xl font-semibold text-white/80'>Related Topics &amp; Next Steps</h2>
        <p className='text-sm text-white/70'>
          Explore related lessons to deepen your understanding.
        </p>
        {/* In a real implementation, we would list related lessons */}
      </section>
    </div>
  );
};