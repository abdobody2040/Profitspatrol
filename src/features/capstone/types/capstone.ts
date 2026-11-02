export type CapstoneStage = 
  | 'problem' 
  | 'solution' 
  | 'pricing' 
  | 'branding' 
  | 'operations' 
  | 'strategy' 
  | 'pitch' 
  | 'graduated';

export interface ProblemOption {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  targetCustomerEn: string;
  targetCustomerAr: string;
  icon: string;
}

export interface PrototypeChoice {
  id: string;
  nameEn: string;
  nameAr: string;
  materialEn: string;
  materialAr: string;
  cost: number;
}

export interface InvestorFeedback {
  investorName: string;
  avatar: string;
  verdict: 'invest' | 'pass';
  offerTokens: number;
  equityPercent: number;
  commentEn: string;
  commentAr: string;
}

export interface CapstoneVenture {
  // Step 1: Problem
  problemId: string;
  problemTitleEn: string;
  problemTitleAr: string;
  targetCustomerEn: string;
  targetCustomerAr: string;

  // Step 2: Solution & Prototype
  solutionNameEn: string;
  solutionNameAr: string;
  prototypeCategory: string;
  baseMaterial: string;

  // Step 3: Pricing & Economics
  unitCost: number;
  sellingPrice: number;
  marginPercent: number;

  // Step 4: Branding & Marketing
  companyName: string;
  sloganEn: string;
  sloganAr: string;
  primaryColor: string;

  // Step 5: Operations & Ethics
  supplierType: 'local_ethical' | 'cheap_unverified';
  consequenceShield: boolean;

  // Step 6: Strategy & Moat
  competitiveMoat: 'innovation' | 'customer_trust' | 'low_cost';

  // Step 7: The Tank Pitch & Graduation
  tankValuation: number;
  fundingRaised: number;
  investorOffers: InvestorFeedback[];
  grade: 'Tycoon' | 'Founder' | 'Rookie';
  completedAt?: string;
}

export interface CapstoneCertificate {
  certificateId: string;
  studentName: string;
  companyName: string;
  slogan: string;
  grade: 'Tycoon' | 'Founder' | 'Rookie';
  valuation: number;
  fundingRaised: number;
  issuedAt: string;
  signatures: {
    ollie: boolean;
    reema: boolean;
    filo: boolean;
    kami: boolean;
  };
}
