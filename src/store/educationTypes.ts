import type { EducationSlice } from './slices/educationSlice';
import type { VideoSlice } from './slices/videoSlice';

export type EducationState = EducationSlice & VideoSlice;
