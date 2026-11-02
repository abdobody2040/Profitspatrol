import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CapstoneStage, CapstoneVenture, ProblemOption, InvestorFeedback, CapstoneCertificate } from '../types/capstone';
import { CAPSTONE_PROBLEMS, MOCK_INVESTORS } from '../data/capstoneData';
import { useAppStore } from '../../../store';

export interface CapstoneStoreState {
  currentStage: CapstoneStage;
  venture: CapstoneVenture;
  certificate: CapstoneCertificate | null;

  // Actions
  setProblem: (problem: ProblemOption) => void;
  setSolution: (nameEn: string, nameAr: string, category: string, baseMaterial: string) => void;
  setEconomics: (unitCost: number, sellingPrice: number) => void;
  setBranding: (companyName: string, sloganEn: string, sloganAr: string, primaryColor: string) => void;
  setOperations: (supplierType: 'local_ethical' | 'cheap_unverified') => void;
  setStrategy: (competitiveMoat: 'innovation' | 'customer_trust' | 'low_cost') => void;
  pitchToTheTank: () => { valuation: number; fundingRaised: number; grade: 'Tycoon' | 'Founder' | 'Rookie' };
  setStage: (stage: CapstoneStage) => void;
  resetCapstone: () => void;
}

const DEFAULT_VENTURE: CapstoneVenture = {
  problemId: CAPSTONE_PROBLEMS[0].id,
  problemTitleEn: CAPSTONE_PROBLEMS[0].titleEn,
  problemTitleAr: CAPSTONE_PROBLEMS[0].titleAr,
  targetCustomerEn: CAPSTONE_PROBLEMS[0].targetCustomerEn,
  targetCustomerAr: CAPSTONE_PROBLEMS[0].targetCustomerAr,

  solutionNameEn: 'Crunchy Fruit Bites',
  solutionNameAr: 'رقائق الفواكه المقرمشة',
  prototypeCategory: 'healthy_food',
  baseMaterial: 'organic_apples',

  unitCost: 2.0,
  sellingPrice: 5.0,
  marginPercent: 60,

  companyName: 'SnackPatrol Co.',
  sloganEn: 'Crunch into Pure Energy!',
  sloganAr: 'قرمشة طبيعية بطاقة متجددة!',
  primaryColor: '#F97316',

  supplierType: 'local_ethical',
  consequenceShield: true,

  competitiveMoat: 'customer_trust',

  tankValuation: 0,
  fundingRaised: 0,
  investorOffers: [],
  grade: 'Founder'
};

export const useCapstoneStore = create<CapstoneStoreState>()(
  persist(
    (set, get) => ({
      currentStage: 'problem',
      venture: DEFAULT_VENTURE,
      certificate: null,

      setStage: (stage) => set({ currentStage: stage }),

      setProblem: (problem) => set((state) => ({
        venture: {
          ...state.venture,
          problemId: problem.id,
          problemTitleEn: problem.titleEn,
          problemTitleAr: problem.titleAr,
          targetCustomerEn: problem.targetCustomerEn,
          targetCustomerAr: problem.targetCustomerAr
        }
      })),

      setSolution: (nameEn, nameAr, category, baseMaterial) => set((state) => ({
        venture: {
          ...state.venture,
          solutionNameEn: nameEn,
          solutionNameAr: nameAr,
          prototypeCategory: category,
          baseMaterial: baseMaterial
        }
      })),

      setEconomics: (unitCost, sellingPrice) => {
        const cost = Math.max(0.1, unitCost);
        const price = Math.max(cost, sellingPrice);
        const margin = Math.round(((price - cost) / price) * 100);

        set((state) => ({
          venture: {
            ...state.venture,
            unitCost: cost,
            sellingPrice: price,
            marginPercent: margin
          }
        }));
      },

      setBranding: (companyName, sloganEn, sloganAr, primaryColor) => set((state) => ({
        venture: {
          ...state.venture,
          companyName,
          sloganEn,
          sloganAr,
          primaryColor
        }
      })),

      setOperations: (supplierType) => set((state) => ({
        venture: {
          ...state.venture,
          supplierType,
          consequenceShield: supplierType === 'local_ethical'
        }
      })),

      setStrategy: (competitiveMoat) => set((state) => ({
        venture: {
          ...state.venture,
          competitiveMoat
        }
      })),

      pitchToTheTank: () => {
        const { venture } = get();

        // Calculate Score & Valuation
        let score = 50; // base score

        // Margins: Ideal between 40% and 75%
        if (venture.marginPercent >= 40 && venture.marginPercent <= 75) {
          score += 25;
        } else if (venture.marginPercent > 75) {
          score += 15; // slightly risky high price
        } else {
          score += 10;
        }

        // Ethics
        if (venture.supplierType === 'local_ethical') {
          score += 15;
        }

        // Competitive Advantage
        if (venture.competitiveMoat) {
          score += 10;
        }

        const grade: 'Tycoon' | 'Founder' | 'Rookie' = 
          score >= 90 ? 'Tycoon' : score >= 70 ? 'Founder' : 'Rookie';

        const valuation = score >= 90 ? 25000 : score >= 70 ? 15000 : 7500;
        const fundingRaised = score >= 90 ? 5000 : score >= 70 ? 3000 : 1500;

        // Generate Investor Feedbacks
        const offers: InvestorFeedback[] = [
          {
            investorName: 'Ollie the Owl',
            avatar: '🦉',
            verdict: 'invest',
            offerTokens: Math.round(fundingRaised * 0.4),
            equityPercent: 10,
            commentEn: `Brilliant financial planning! With a ${venture.marginPercent}% gross margin, your unit economics are rock solid.`,
            commentAr: `تخطيط مالي بارع! بهامش ربح ${venture.marginPercent}%، أرقامك الاقتصادية متينة ومطمئنة للغاية.`
          },
          {
            investorName: 'Reema the Fox',
            avatar: '🦊',
            verdict: 'invest',
            offerTokens: Math.round(fundingRaised * 0.35),
            equityPercent: 8,
            commentEn: `The brand "${venture.companyName}" has irresistible storytelling potential! The slogan resonates perfectly!`,
            commentAr: `العلامة التجارية "${venture.companyName}" تمتلك قصة تسويقية مبهرة! الشعار يلمس حاجة العميل فوراً!`
          },
          {
            investorName: 'Filo the Elephant',
            avatar: '🐘',
            verdict: venture.supplierType === 'local_ethical' ? 'invest' : 'pass',
            offerTokens: venture.supplierType === 'local_ethical' ? Math.round(fundingRaised * 0.25) : 0,
            equityPercent: 5,
            commentEn: venture.supplierType === 'local_ethical'
              ? 'I proudly back your ethical supply chain! Protecting trust is the true secret of lasting business.'
              : 'Caution: Unverified suppliers expose your venture to reputational hazards. Always prioritize ethics!',
            commentAr: venture.supplierType === 'local_ethical'
              ? 'أفخر بدعم سلاسل التوريد الأخلاقية والمحلية لديك! حماية الثقة هي أثمن أصول المشروع المستمر.'
              : 'تحذير: الموردون غير الموثوقين يعرضون سمعة مشروعك للخطر. اجعل النزاهة أولويتك دائماً!'
          }
        ];

        const completedAt = new Date().toISOString();

        // Award in AppStore
        const appStore = useAppStore.getState();
        const user = appStore.user;
        const studentName = user?.name || 'Young Entrepreneur';

        if (user) {
          const currentBadges = user.badges || [];
          const updatedBadges = currentBadges.includes('badge_capstone_graduate')
            ? currentBadges
            : [...currentBadges, 'badge_capstone_graduate'];

          useAppStore.setState({
            user: {
              ...user,
              xp: (user.xp || 0) + 500,
              ppTokens: (user.ppTokens || 0) + 300,
              hasGraduated: true,
              badges: updatedBadges
            }
          });
        }

        const cert: CapstoneCertificate = {
          certificateId: `CERT-CAPSTONE-${Date.now().toString(36).toUpperCase()}`,
          studentName,
          companyName: venture.companyName,
          slogan: venture.sloganAr || venture.sloganEn,
          grade,
          valuation,
          fundingRaised,
          issuedAt: completedAt,
          signatures: {
            ollie: true,
            reema: true,
            filo: venture.supplierType === 'local_ethical',
            kami: true
          }
        };

        set((state) => ({
          currentStage: 'graduated',
          venture: {
            ...state.venture,
            tankValuation: valuation,
            fundingRaised,
            investorOffers: offers,
            grade,
            completedAt
          },
          certificate: cert
        }));

        return { valuation, fundingRaised, grade };
      },

      resetCapstone: () => set({
        currentStage: 'problem',
        venture: DEFAULT_VENTURE,
        certificate: null
      })
    }),
    {
      name: 'pp_capstone_venture_store'
    }
  )
);
