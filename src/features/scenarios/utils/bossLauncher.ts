import { Difficulty } from '../../hq/components/DifficultySelectModal';
import { SCENARIOS } from '../data/scenarios';
import { Logger } from '../../../services/logger';

/**
 * consistently launches the correct boss scenario for a given node ID and difficulty
 */
export const launchBossScenario = (
    nodeId: string,
    difficulty: Difficulty = 'MEDIUM',
    startScenarioAction: (scenario: any) => void
) => {
    // 1. Determine which Scenario to load based on Section Index
    // nodeId format: SEC_0_BOSS, SEC_1_BOSS etc.
    const sectionIndexParts = nodeId.split('_');
    const sectionIndex = parseInt(sectionIndexParts[1]) || 0; // Default to 0 if NaN

    const baseScenario = SCENARIOS[sectionIndex % SCENARIOS.length];

    if (!baseScenario) {
        Logger.error('bossLauncher: No scenario found for section index', { nodeId, sectionIndex });
        return;
    }

    // 2. Apply Difficulty Modifiers to the selected scenario
    let cash = baseScenario.initialCash;
    let burn = baseScenario.initialBurnRate;
    let turns = baseScenario.turns;

    if (difficulty === 'EASY') {
        cash += 500;
        burn = Math.max(100, burn - 200);
        turns = Math.max(3, turns - 1);
    } else if (difficulty === 'HARD') {
        cash = Math.max(500, cash - 300);
        burn += 100;
        turns += 2;
    }

    startScenarioAction({
        ...baseScenario,
        initialCash: cash,
        initialBurnRate: burn,
        turns: turns,
        completionId: nodeId,
        issues: baseScenario.issues.map((issue: any) => {
            // Adjust issue costs for difficulty
            if (difficulty === 'HARD') {
                return { ...issue, costToFix: Math.floor(issue.costToFix * 1.2) };
            }
            return issue;
        })
    });
};
