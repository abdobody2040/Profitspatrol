export interface SideCharacterConfig {
  name: string; // 'reema' | 'filo' | 'kami' | 'rex'
  afterNodeIndex: number; // 0..11
  side: 'left' | 'right';
  messageEn?: string;
  messageAr?: string;
  messageDe?: string;
  messageEs?: string;
  messageFr?: string;
}

// Side characters configuration: placed beside the path every 3-4 nodes alternating left and right
export const DISTRICT_SIDE_CHARACTERS: Record<number, SideCharacterConfig[]> = {
  1: [
    {
      name: 'reema',
      afterNodeIndex: 2,
      side: 'left',
      messageEn: 'Every coin counts!',
      messageAr: 'كل قرش بيفرق!',
      messageDe: 'Jede Münze zählt!',
      messageEs: '¡Cada moneda cuenta!',
      messageFr: 'Chaque pièce compte !',
    },
    {
      name: 'filo',
      afterNodeIndex: 6,
      side: 'right',
      messageEn: 'Safety first, save wisely!',
      messageAr: 'الأمان أولاً، ادخر بحكمة!',
      messageDe: 'Sicherheit zuerst, spare klug!',
      messageEs: '¡Seguridad primero, ahorra con prudencia!',
      messageFr: 'Sécurité d\'abord, épargne sagement !',
    },
    {
      name: 'kami',
      afterNodeIndex: 10,
      side: 'right',
      messageEn: 'Small steps build big wealth!',
      messageAr: 'خطوات بسيطة تصنع ثروة!',
      messageDe: 'Kleine Schritte schaffen großen Wohlstand!',
      messageEs: '¡Pequeños pasos construyen gran riqueza!',
      messageFr: 'De petits pas créent de grandes richesses !',
    },
  ],
  2: [
    {
      name: 'kami',
      afterNodeIndex: 2,
      side: 'left',
      messageEn: 'Build your dream venture!',
      messageAr: 'ابنِ مشروع أحلامك!',
      messageDe: 'Baue dein Traumunternehmen auf!',
      messageEs: '¡Construye el negocio de tus sueños!',
      messageFr: 'Bâtis l\'entreprise de tes rêves !',
    },
    {
      name: 'rex',
      afterNodeIndex: 6,
      side: 'right',
      messageEn: 'Ready for my challenge?',
      messageAr: 'مستعد لتحدي ريكس؟',
      messageDe: 'Bereit für meine Herausforderung?',
      messageEs: '¿Listo para mi desafío?',
      messageFr: 'Prêt pour mon défi ?',
    },
    {
      name: 'reema',
      afterNodeIndex: 10,
      side: 'right',
      messageEn: 'Know your market demand!',
      messageAr: 'افهم احتياج زبائنك جيداً!',
      messageDe: 'Kenne deine Marktnachfrage!',
      messageEs: '¡Conoce la demanda de tu mercado!',
      messageFr: 'Connais la demande de ton marché !',
    },
  ],
  3: [
    {
      name: 'filo',
      afterNodeIndex: 2,
      side: 'left',
      messageEn: 'Compound interest is magic!',
      messageAr: 'العائد التراكمي سحر حقيقي!',
      messageDe: 'Zinseszins ist wie Magie!',
      messageEs: '¡El interés compuesto es magia!',
      messageFr: 'Les intérêts composés sont magiques !',
    },
    {
      name: 'reema',
      afterNodeIndex: 6,
      side: 'right',
      messageEn: 'Network like a true founder!',
      messageAr: 'ابنِ شبكة علاقات قوية!',
      messageDe: 'Netzwerke wie ein echter Gründer!',
      messageEs: '¡Haz contactos como un verdadero fundador!',
      messageFr: 'Crée des réseaux comme un vrai fondateur !',
    },
    {
      name: 'rex',
      afterNodeIndex: 10,
      side: 'right',
      messageEn: 'Test your investment instincts!',
      messageAr: 'اختبر ذكاءك الاستثماري!',
      messageDe: 'Teste deine Investitions-Instinkte!',
      messageEs: '¡Pon a prueba tus instintos de inversión!',
      messageFr: 'Teste tes instincts d\'investissement !',
    },
  ],
  4: [
    {
      name: 'kami',
      afterNodeIndex: 2,
      side: 'left',
      messageEn: 'Optimize your supply chain!',
      messageAr: 'حسّن سلاسل الإمداد!',
      messageDe: 'Optimiere deine Lieferkette!',
      messageEs: '¡Optimiza tu cadena de suministro!',
      messageFr: 'Optimise ta chaîne d\'approvisionnement !',
    },
    {
      name: 'filo',
      afterNodeIndex: 6,
      side: 'right',
      messageEn: 'Cut unnecessary costs!',
      messageAr: 'وفّر التكاليف غير الضرورية!',
      messageDe: 'Senke unnötige Kosten!',
      messageEs: '¡Reduce costos innecesarios!',
      messageFr: 'Réduis les coûts inutiles !',
    },
    {
      name: 'reema',
      afterNodeIndex: 10,
      side: 'right',
      messageEn: 'Quality leads to loyal customers!',
      messageAr: 'الجودة تجلب زبائن أوفياء!',
      messageDe: 'Qualität führt zu treuen Kunden!',
      messageEs: '¡La calidad genera clientes leales!',
      messageFr: 'La qualité fidélise les clients !',
    },
  ],
  5: [
    {
      name: 'reema',
      afterNodeIndex: 2,
      side: 'left',
      messageEn: 'Scale with automation!',
      messageAr: 'توسع بالأتمتة والذكاء!',
      messageDe: 'Skaliere mit Automatisierung!',
      messageEs: '¡Escala con automatización!',
      messageFr: 'Développe avec l\'automatisation !',
    },
    {
      name: 'kami',
      afterNodeIndex: 6,
      side: 'right',
      messageEn: 'Innovate every single day!',
      messageAr: 'ابتكر حلولاً جديدة كل يوم!',
      messageDe: 'Innoviere an jedem einzelnen Tag!',
      messageEs: '¡Innova cada día!',
      messageFr: 'Innove chaque jour !',
    },
    {
      name: 'filo',
      afterNodeIndex: 10,
      side: 'right',
      messageEn: 'Keep cash reserves ready!',
      messageAr: 'احتفظ دائماً بسيولة احتياطية!',
      messageDe: 'Halte Barreserven bereit!',
      messageEs: '¡Mantén reservas de efectivo listas!',
      messageFr: 'Garde des réserves de trésorerie !',
    },
  ],
};

// Fallback helper for any district number (1..20)
export const getSideCharactersForDistrict = (districtNumber: number): SideCharacterConfig[] => {
  if (DISTRICT_SIDE_CHARACTERS[districtNumber]) {
    return DISTRICT_SIDE_CHARACTERS[districtNumber];
  }
  // Cycle pattern for districts 6..20
  const baseNum = ((districtNumber - 1) % 5) + 1;
  return DISTRICT_SIDE_CHARACTERS[baseNum] || DISTRICT_SIDE_CHARACTERS[1];
};

export const getSideCharacterMessage = (
  sideChar: SideCharacterConfig,
  lang: string
): string => {
  if (lang.startsWith('ar')) return sideChar.messageAr || sideChar.messageEn || '';
  if (lang.startsWith('de')) return sideChar.messageDe || sideChar.messageEn || '';
  if (lang.startsWith('es')) return sideChar.messageEs || sideChar.messageEn || '';
  if (lang.startsWith('fr')) return sideChar.messageFr || sideChar.messageEn || '';
  return sideChar.messageEn || sideChar.messageAr || '';
};
