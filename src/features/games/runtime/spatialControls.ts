/**
 * Spatial controls remain physical rather than linguistic:
 * Left always lowers the lane index and Right always raises it,
 * regardless of document reading direction (LTR or RTL).
 */
export const SPATIAL_LANE_MOVE = {
  left: -1,
  right: 1,
} as const;

export type SpatialDirection = keyof typeof SPATIAL_LANE_MOVE;

export function moveLane(currentLane: number, direction: SpatialDirection, laneCount = 3) {
  return Math.max(0, Math.min(laneCount - 1, currentLane + SPATIAL_LANE_MOVE[direction]));
}
