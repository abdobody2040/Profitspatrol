/**
 * ProfitsPatrol Business Consequence Engine (PRD Sections 28, 29, 109)
 * Generates educational cause-and-effect consequences and "Why?" explainers.
 */

import { BusinessConsequence, BusinessVenture, SimulationResult } from '../types/business';

export function evaluateConsequences(
  venture: BusinessVenture,
  sim: Omit<SimulationResult, 'consequence'>
): BusinessConsequence | null {
  const { sellingPrice, inventoryCostPerUnit, qualityTier, inventory, marketingBudget } = venture;

  // 1. Selling below cost
  if (sellingPrice < inventoryCostPerUnit && sim.unitsSold > 0) {
    return {
      id: 'cons_selling_below_cost',
      type: 'critical',
      titleEn: 'Selling Below Cost (Loss on Every Sale)',
      titleAr: 'البيع بأقل من التكلفة (خسارة مع كل بيعة)',
      whyExplanationEn: `It cost you $${inventoryCostPerUnit.toFixed(2)} to produce each unit, but you sold it for only $${sellingPrice.toFixed(2)}. In business, Revenue must exceed Costs to earn a profit!`,
      whyExplanationAr: `تكلفة إنتاج الوحدة الواحدة هي ${inventoryCostPerUnit.toFixed(2)}$ بينما قمت ببيعها بمبلغ ${sellingPrice.toFixed(2)}$ فقط. في التجارة، يجب أن تكون الإيرادات أعلى من التكاليف لتحقيق ربح!`,
      suggestedActionEn: `Increase your selling price above $${inventoryCostPerUnit.toFixed(2)} or find cheaper supplies.`,
      suggestedActionAr: `ارفع سعر البيع ليكون أعلى من ${inventoryCostPerUnit.toFixed(2)}$ أو ابحث عن مورّد بتكلفة أقل.`,
      heroAdvisorId: 'filo'
    };
  }

  // 2. Empty inventory when demand existed
  if (inventory <= 0 && marketingBudget > 0) {
    return {
      id: 'cons_empty_shelves',
      type: 'warning',
      titleEn: 'Marketing with Empty Shelves',
      titleAr: 'تسويق مع رفوف فارغة',
      whyExplanationEn: `You spent $${marketingBudget.toFixed(2)} on advertising to attract customers, but had zero items in stock to sell them! That wastes your marketing money.`,
      whyExplanationAr: `لقد أنفقت ${marketingBudget.toFixed(2)}$ على الدعاية لجذب الزبائن، ولكن لم يكن لديك أي بضاعة لبيعها لهم! هذا يهدر أموال التسويق.`,
      suggestedActionEn: 'Always stock up on inventory before running an advertising campaign.',
      suggestedActionAr: 'اشترِ البضاعة وخزّنها أولاً قبل إطلاق أي حملة إعلانية.',
      heroAdvisorId: 'ollie'
    };
  }

  // 3. Price too high for quality tier
  const maxReasonablePrice = qualityTier === 'budget' ? 3.0 : qualityTier === 'standard' ? 6.0 : 12.0;
  if (sellingPrice > maxReasonablePrice && sim.customersVisited > sim.unitsSold * 2) {
    return {
      id: 'cons_overpricing',
      type: 'warning',
      titleEn: 'Customers Walked Away (Price Too High)',
      titleAr: 'الزبائن تراجعوا (السعر مرتفع جداً)',
      whyExplanationEn: `Many customers looked at your items but decided the price ($${sellingPrice.toFixed(2)}) was too steep for the quality offered.`,
      whyExplanationAr: `العديد من الزبائن شاهدوا معروضاتك لكنهم شعروا أن السعر (${sellingPrice.toFixed(2)}$) أعلى بكثير من الجودة المقدمة.`,
      suggestedActionEn: 'Lower your price slightly, or upgrade your materials to premium quality.',
      suggestedActionAr: 'اخفض السعر قليلاً، أو طوّر جودة المواد إلى المستوى الممتاز.',
      heroAdvisorId: 'reema'
    };
  }

  // 4. Cutting quality while price is high
  if (qualityTier === 'budget' && sellingPrice > 2.5) {
    return {
      id: 'cons_cheap_quality_penalty',
      type: 'warning',
      titleEn: 'Customer Disappointment (Quality Issue)',
      titleAr: 'استياء العملاء (مشكلة جودة)',
      whyExplanationEn: 'Using budget materials reduced your costs, but customers felt the quality was lacking and your reputation took a hit.',
      whyExplanationAr: 'استخدام خامات رخيصة خفّض التكاليف، لكن العملاء لم تعجبهم الجودة فتأثرت سمعتك التجارية سلباً.',
      suggestedActionEn: 'Invest in standard or premium quality to win lasting customer trust.',
      suggestedActionAr: 'استثمر في جودة قياسية أو ممتازة لكسب ثقة العملاء الدائمة.',
      heroAdvisorId: 'kami'
    };
  }

  // 5. Great execution & healthy profit
  if (sim.dailyProfit > 15 && sim.unitsSold >= 5) {
    return {
      id: 'cons_healthy_profit',
      type: 'celebration',
      titleEn: 'Optimal Business Flow (Happy Customers & High Profit)',
      titleAr: 'توازن تجاري مثالي (زبائن سعداء وأرباح ممتازة)',
      whyExplanationEn: `You balanced quality, pricing, and smart advertising! Your revenue ($${sim.revenue.toFixed(2)}) beat expenses by $${sim.dailyProfit.toFixed(2)}.`,
      whyExplanationAr: `لقد حققت توازناً رائعاً بين الجودة، السعر، والتسويق الذكي! إيراداتك (${sim.revenue.toFixed(2)}$) تفوقت على مصاريفك بفارق (${sim.dailyProfit.toFixed(2)}$).`,
      suggestedActionEn: 'Reinvest a portion of your profits into expanding inventory or saving in the bank.',
      suggestedActionAr: 'أعد استثمار جزء من أرباحك في شراء بضاعة إضافية أو ادخرها في البنك.',
      heroAdvisorId: 'ollie'
    };
  }

  return null;
}
