export interface LocalizedModuleInfo {
  title: string;
  districtName: string;
  bossName: string;
  bossTagline: string;
}

export const getLocalizedModule = (
  moduleConfig: any,
  lang: string
): LocalizedModuleInfo => {
  if (!moduleConfig) {
    return {
      title: '',
      districtName: '',
      bossName: '',
      bossTagline: ''
    };
  }

  const isAr = lang.startsWith('ar');
  const isDe = lang.startsWith('de');
  const isEs = lang.startsWith('es');
  const isFr = lang.startsWith('fr');

  let title = moduleConfig.titleEn || moduleConfig.title || '';
  let districtName = moduleConfig.districtNameEn || moduleConfig.districtName || '';
  let bossName = moduleConfig.bossNameEn || moduleConfig.bossName || '';
  let bossTagline = moduleConfig.bossTaglineEn || moduleConfig.bossTagline || '';

  if (isAr) {
    title = moduleConfig.titleAr || title;
    districtName = moduleConfig.districtNameAr || districtName;
    bossName = moduleConfig.bossNameAr || bossName;
    bossTagline = moduleConfig.bossTaglineAr || bossTagline;
  } else if (isDe) {
    title = moduleConfig.titleDe || title;
    districtName = moduleConfig.districtNameDe || districtName;
    bossName = moduleConfig.bossNameDe || bossName;
    bossTagline = moduleConfig.bossTaglineDe || bossTagline;
  } else if (isEs) {
    title = moduleConfig.titleEs || title;
    districtName = moduleConfig.districtNameEs || districtName;
    bossName = moduleConfig.bossNameEs || bossName;
    bossTagline = moduleConfig.bossTaglineEs || bossTagline;
  } else if (isFr) {
    title = moduleConfig.titleFr || title;
    districtName = moduleConfig.districtNameFr || districtName;
    bossName = moduleConfig.bossNameFr || bossName;
    bossTagline = moduleConfig.bossTaglineFr || bossTagline;
  }

  return { title, districtName, bossName, bossTagline };
};

