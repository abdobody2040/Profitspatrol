import React from 'react';
import { findGame } from '../features/games/registry/canonicalRegistry';
import { UnifiedGameShell } from '../features/games/runtime/UnifiedGameShell';
import { SkeletonPageLoader } from '../components/ui/SkeletonPageLoader';

interface Props {
  gameId: string;
  onExit: () => void;
}

export const ArcadeGameShellWrapper: React.FC<Props> = ({ gameId, onExit }) => {
  const game = findGame(gameId);
  if (!game) return <SkeletonPageLoader />;
  return <UnifiedGameShell game={game} onExit={onExit} />;
};

export default ArcadeGameShellWrapper;
