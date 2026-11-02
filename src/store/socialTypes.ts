import type { SocialSlice } from './slices/socialSlice';
import type { NewsSlice } from './slices/newsSlice';
import type { BountySlice } from './slices/bountySlice';

export type SocialState = SocialSlice & NewsSlice & BountySlice;
