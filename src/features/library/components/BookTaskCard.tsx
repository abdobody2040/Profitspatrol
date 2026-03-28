import React from 'react';
import { BookTask } from '../../../types';
import { CheckCircle2, Clock, Coins, Star, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BookTaskCardProps {
    task: BookTask;
    isCompleted: boolean;
    progress?: number; // For action challenges (0-100)
    onStart: () => void;
}

const BookTaskCard: React.FC<BookTaskCardProps> = ({ task, isCompleted, progress, onStart }) => {
    const { t, i18n } = useTranslation();

    // Helper to get translated task content
    const getTaskContent = () => {
        const typeMapping: Record<string, string> = {
            'action_challenge': 'actionChallenge',
            'share_teach': 'shareTeach',
        };
        const typeKey = typeMapping[task.type] || task.type;
        const baseKey = `library_tasks.${task.bookId}.${typeKey}`;

        const titleKey = `${baseKey}.title`;
        const descriptionKey = `${baseKey}.description`;

        // Fallback to generic task type translations
        const genericTitleKey = `library.task_${task.type.replace('_', '')}_title`;
        const genericDescKey = `library.task_${task.type.replace('_', '')}_desc`;

        return {
            title: i18n.exists(titleKey as any)
                ? t(titleKey as any)
                : i18n.exists(genericTitleKey as any)
                    ? t(genericTitleKey as any)
                    : task.title,
            description: i18n.exists(descriptionKey as any)
                ? t(descriptionKey as any)
                : i18n.exists(genericDescKey as any)
                    ? t(genericDescKey as any)
                    : task.description
        };
    };

    const { title, description } = getTaskContent();

    // Task type icons and colors
    const getTaskIcon = () => {
        switch (task.type) {
            case 'quiz':
                return '📝';
            case 'reflection':
                return '💭';
            case 'action_challenge':
                return '🎯';
            case 'share_teach':
                return '🗣️';
            case 'application':
                return '🌍';
            default:
                return '📚';
        }
    };

    // Difficulty colors
    const getDifficultyColor = () => {
        switch (task.difficulty) {
            case 'easy':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'hard':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <div className={`
      relative p-4 rounded-xl border-2 transition-all duration-300
      ${isCompleted
                ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg'
            }
    `}>
            {/* Completion Badge */}
            {isCompleted && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">{getTaskIcon()}</div>
                <div className="flex-1">
                    <h5 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">
                        {title}
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>

            {/* Difficulty & Time */}
            <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getDifficultyColor()}`}>
                    {t(`library.tasks.difficulty.${task.difficulty}`)}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{task.estimatedMinutes} {t('library.tasks.min')}</span>
                </div>
            </div>

            {/* Progress Bar (for action challenges) */}
            {task.type === 'action_challenge' && progress !== undefined && progress > 0 && !isCompleted && (
                <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>{t('library.tasks.progress')}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Rewards */}
            <div className="flex items-center gap-3 mb-3 text-xs">
                <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <Zap className="w-4 h-4" />
                    <span className="font-semibold">{task.rewards.xp} XP</span>
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <Coins className="w-4 h-4" />
                    <span className="font-semibold">{task.rewards.coins}</span>
                </div>
                {task.rewards.badge && (
                    <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                        <Star className="w-4 h-4" />
                        <span className="font-semibold text-xs">{task.rewards.badge}</span>
                    </div>
                )}
            </div>

            {/* Action Button */}
            <button
                onClick={onStart}
                disabled={isCompleted}
                className={`
          w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200
          ${isCompleted
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }
        `}
            >
                {isCompleted ? t('library.tasks.completed') : t('library.tasks.start')}
            </button>
        </div>
    );
};

export default BookTaskCard;
