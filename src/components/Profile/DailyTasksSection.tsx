import { useState } from 'react';
import { claimDailyTask } from '../../lib/api/gamification';
import './DailyTasksSection.css';

interface DailyTask {
  id: string;
  type: string;
  description: string;
  xpReward: number;
  tonReward?: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
}

interface DailyTasksSectionProps {
  tasks?: DailyTask[];
  loading: boolean;
  onClaim: () => void;
}

export default function DailyTasksSection({ tasks, loading, onClaim }: DailyTasksSectionProps) {
  const [claiming, setClaiming] = useState<string | null>(null);

  if (loading) {
    return <div className="tasks-skeleton">Загрузка...</div>;
  }

  if (!tasks || tasks.length === 0) {
    return <div className="tasks-empty">Нет заданий на сегодня</div>;
  }

  async function handleClaim(taskId: string) {
    setClaiming(taskId);
    try {
      await claimDailyTask(taskId);
      onClaim(); // Refresh data
    } catch (error) {
      console.error('Failed to claim task:', error);
    } finally {
      setClaiming(null);
    }
  }

  return (
    <div className="tasks-list">
      {tasks.map(task => (
        <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <span className="task-status">
            {task.completed ? '✅' : '⬜'}
          </span>
          <div className="task-info">
            <span className="task-description">{task.description}</span>
            {!task.completed && task.target > 1 && (
              <span className="task-progress">{task.progress}/{task.target}</span>
            )}
          </div>
          <div className="task-reward">
            +{task.xpReward} XP
            {task.tonReward && task.tonReward > 0 && ` +${task.tonReward} TON`}
          </div>
          {task.completed && !task.claimed && (
            <button 
              className="task-claim-btn"
              onClick={() => handleClaim(task.id)}
              disabled={claiming === task.id}
            >
              {claiming === task.id ? '...' : 'Забрать'}
            </button>
          )}
          {task.claimed && (
            <span className="task-claimed">✓</span>
          )}
        </div>
      ))}
    </div>
  );
}
