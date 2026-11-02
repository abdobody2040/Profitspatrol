export type RealWorldCategory = 'smart_shopping' | 'home_savings' | 'customer_research' | 'home_solution' | 'sustainability';

export interface RealWorldMission {
  id: string;
  category: RealWorldCategory;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string;
  stepsEn: string[];
  stepsAr: string[];
  discussionQuestionEn: string;
  discussionQuestionAr: string;
  rewardTokens: number;
  rewardXp: number;
  badgeId: string;
  badgeNameEn: string;
  badgeNameAr: string;
}

export interface RealWorldSubmission {
  missionId: string;
  childNotes: string;
  parentApproved: boolean;
  parentApprovedAt?: string;
  submittedAt: string;
}
