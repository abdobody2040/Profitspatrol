import { ProblemOption, InvestorFeedback } from '../types/capstone';

export const CAPSTONE_PROBLEMS: ProblemOption[] = [
  {
    id: 'prob_school_snack',
    titleEn: 'Healthy Crunchy Snacks for School',
    titleAr: 'وجبات مدرسية مقرمشة وصحية ولذيذة',
    descriptionEn: 'Students are tired of sugary junk snacks during recess and want energetic, tasty snacks.',
    descriptionAr: 'الطلاب يعانون من الوجبات السريعة المليئة بالسكريات أثناء الفسحة ويبحثون عن وجبات لذيذة تمنحهم طاقة.',
    targetCustomerEn: 'Elementary and Middle School Students & Busy Parents',
    targetCustomerAr: 'طلاب المدارس وأولياء الأمور الباحثون عن تغذية متوازنة',
    icon: '🍎'
  },
  {
    id: 'prob_eco_stationery',
    titleEn: 'Plantable Seed Pencils & Notebooks',
    titleAr: 'أقلام ودفاتر قابلة للزراعة صديقة للبيئة',
    descriptionEn: 'Millions of wooden pencils and notebook papers are thrown away without environmental renewal.',
    descriptionAr: 'ملايين الأقلام الخشبية والدفاتر تُهدر يومياً دون تجديد بيئي مستدام.',
    targetCustomerEn: 'Eco-conscious Students, Schools, and Art Creators',
    targetCustomerAr: 'الطلاب المحبون للبيئة، المدارس، وهواة الرسم والفنون',
    icon: '🌱'
  },
  {
    id: 'prob_study_box',
    titleEn: 'Smart Focus Study Toolkit',
    titleAr: 'صندوق تنظيم الدراسة والتركيز الذكي',
    descriptionEn: 'Learners lose track of assignments and struggle to stay focused without engaging visual planners.',
    descriptionAr: 'الطلاب يواجهون صعوبة في تنظيم أوقات الواجبات والتركيز بدون أدوات بصرية جذابة.',
    targetCustomerEn: 'Young Learners Seeking Fun Habit Tracking',
    targetCustomerAr: 'الطلاب الصغار الراغبون في تنظيم عاداتهم الدراسية باستمتاع',
    icon: '📦'
  }
];

export const MOCK_INVESTORS: {
  id: string;
  name: string;
  avatar: string;
  focus: string;
  focusAr: string;
}[] = [
  {
    id: 'ollie',
    name: 'Ollie the Chief Strategist',
    avatar: '🦉',
    focus: 'Profit Margins, Unit Economics & Longevity',
    focusAr: 'هوامش الربح، الحسابات الدقيقة، والتخطيط الاستراتيجي'
  },
  {
    id: 'reema',
    name: 'Reema the Brand Queen',
    avatar: '🦊',
    focus: 'Viral Appeal, Customer Storytelling & Brand Identity',
    focusAr: 'قوة العلامة التجارية، جاذبية القصة، وجذب الزبائن'
  },
  {
    id: 'filo',
    name: 'Filo the Ethical Guardian',
    avatar: '🐘',
    focus: 'Ethical Sourcing, Fair Value & Scam Protection',
    focusAr: 'الأمان، التعامل العادل، والموردين الأخلاقيين'
  }
];
