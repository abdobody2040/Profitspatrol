/**
 * ProfitsPatrol Rex Competition Engine (PRD Section 5, 7, 28, 109)
 * Pure, consequence-driven economic rivalry engine against Rex the Raccoon across all 8 districts.
 */

import { DistrictId } from '../../../domain/world/districts';
import { RivalChallenge, PlayerStrategicOption, RivalryResolution } from '../types/rivalry';

export const DISTRICT_CHALLENGES: Record<DistrictId, RivalChallenge> = {
  money: {
    id: 'chal_money_pricewar',
    districtId: 'money',
    type: 'price_war',
    titleEn: 'The Money District Price War',
    titleAr: 'حرب الأسعار في حي النقود',
    scenarioEn: 'Rex just set up a flashy stall right across from you. He slashed his prices down to $2—well below actual production cost—hoping to drive you out of business!',
    scenarioAr: 'افتتح ريكس كشكاً براقاً أمام متجرك مباشرة، وخفّض أسعاره إلى ريالين فقط—وهو أقل من تكلفة الإنتاج الحقيقية—بهدف سحب كل زبائنك وإخراجك من السوق!',
    rexTauntEn: 'Think you can survive a real price war? My prices are so low, your customers are running to me!',
    rexTauntAr: 'هل تظن أنك ستصمد في حرب أسعار حقيقية؟ أسعاري منخفضة لدرجة أن زبائنك يهرولون إليّ!',
    rexEmotion: 'excited',
    rewardTokens: 60,
    rewardXp: 120,
    options: [
      {
        id: 'opt_money_panic_slash',
        titleEn: 'Panic & Slash Price to $1.50',
        titleAr: 'الهلع وتخفيض السعر إلى 1.5 ريال',
        descriptionEn: 'Sell at an immediate loss just to be cheaper than Rex.',
        descriptionAr: 'البيع بخسارة فورية لمجرد أن تكون أرخص من ريكس.',
        cashCost: 10,
        advisorRecommendation: 'filo',
        advisorTipEn: 'Filo warns: Never sell below cost! You run out of cash before Rex does.',
        advisorTipAr: 'فيلو يحذر: إياك والبيع بأقل من التكلفة! سينفد مالك قبل أن يستسلم ريكس.',
        outcomeType: 'defeat',
        marketShareDelta: -15,
        reputationDelta: -5,
        educationalReasoningEn: 'Selling below your cost is a trap. You lose money on every unit sold, draining your cash reserves while devaluing your brand.',
        educationalReasoningAr: 'البيع بأقل من التكلفة فخ قاتل. ستخسر المال مع كل قطعة تبيعها، مما يستنزف سيولتك ويهز ثقة زبائنك.',
        rexReactionEn: 'Ha! You fell for it! You\'re bleeding cash on every sale. Think again!',
        rexReactionAr: 'هاها! وقعت في الفخ! أنت تنزف أموالك مع كل عملية بيع. فكّر مرة أخرى!',
        rexReactionEmotion: 'celebrating'
      },
      {
        id: 'opt_money_bundle_value',
        titleEn: 'Create a High-Value Bundle & Loyalty Card',
        titleAr: 'تقديم باقة قيمة مضافة مع بطاقة ولاء',
        descriptionEn: 'Keep fair pricing, but bundle complementary items with Reema\'s warm customer service.',
        descriptionAr: 'الحفاظ على السعر العادل مع باقة مميزة وخدمة عملاء راقية تدعمها ريما.',
        cashCost: 20,
        advisorRecommendation: 'reema',
        advisorTipEn: 'Reema says: Customers don\'t just want cheap; they want trust and great value!',
        advisorTipAr: 'ريما تنصح: الزبائن لا يبحثون عن الرخص فقط، بل عن الثقة والقيمة الحقيقية!',
        outcomeType: 'victory',
        marketShareDelta: 18,
        reputationDelta: 15,
        educationalReasoningEn: 'Smart entrepreneurs compete on unique value and superior customer experience rather than racing to the bottom on price.',
        educationalReasoningAr: 'رواد الأعمال الأذكياء ينافسون بالقيمة المضافة وتجربة العميل المميزة بدلاً من الدخول في سباق تدمير الأسعار.',
        rexReactionEn: 'What?! Customers are willing to pay more for your friendly bundle?! Impressive...',
        rexReactionAr: 'ماذا؟! الزبائن مستعدون لدفع المزيد مقابل باقتك الرائعة وحسن تعاملك؟! هذا مبهر حقاً...',
        rexReactionEmotion: 'surprised'
      },
      {
        id: 'opt_money_wait_out',
        titleEn: 'Hold Steady & Wait Rex Out',
        titleAr: 'الثبات والصبر حتى يستنزف ريكس أمواله',
        descriptionEn: 'Do nothing and wait for Rex\'s unsustainable losses to force him to raise prices.',
        descriptionAr: 'عدم تغيير أي شيء وانتظار انتهاء مخزون ريكس بعد أن يخسر أمواله.',
        cashCost: 0,
        advisorRecommendation: 'ollie',
        advisorTipEn: 'Ollie says: Patience is good, but without active marketing, you still lose foot traffic.',
        advisorTipAr: 'أولي يوضح: الصبر حكمة، لكن دون تنشيط تسويقك ستفقد بعض حركة الزبائن مؤقتاً.',
        outcomeType: 'tactical_draw',
        marketShareDelta: 5,
        reputationDelta: 2,
        educationalReasoningEn: 'Rex cannot sustain losses forever, but passive waiting allows him to temporarily capture undecided shoppers.',
        educationalReasoningAr: 'ريكس لا يستطيع تحمل الخسارة إلى الأبد، لكن الوقوف مكتوف الأيدي يجعله يكسب المتسوقين المترددين مؤقتاً.',
        rexReactionEn: 'You\'re stubborn, aren\'t you? My pockets are deep, but this is costing me a fortune.',
        rexReactionAr: 'أنت عنيد جداً! جيوبي عميقة، لكن هذه التجربة بدأت تكلفني ثروة طائلة.',
        rexReactionEmotion: 'thinking'
      }
    ]
  },

  builders: {
    id: 'chal_builders_copycat',
    districtId: 'builders',
    type: 'innovation_sprint',
    titleEn: 'The Copycat Sprint',
    titleAr: 'سباق الابتكار ونسخ المنتجات في حي البناة',
    scenarioEn: 'Rex secretly bought your best-selling product and rushed out a cheap imitation overnight, advertising it as "The Original Rex Edition"!',
    scenarioAr: 'اشترى ريكس منتجك الأكثر مبيعاً سراً، وأطلق نسخة مقلدة سريعة في اليوم التالي مدعياً أنه "الإصدار الأصلي لريكس"!',
    rexTauntEn: 'Why spend weeks inventing when I can copy your idea in ten minutes? Try to keep up!',
    rexTauntAr: 'لماذا أقضي أسابيع في الاختراع بينما يمكنني نسخ فكرتك في عشر دقائق؟ حاول اللحاق بي!',
    rexEmotion: 'talking',
    rewardTokens: 75,
    rewardXp: 140,
    options: [
      {
        id: 'opt_bld_argue_online',
        titleEn: 'Argue Online & Complain',
        titleAr: 'الجدال والشكوى على وسائل التواصل',
        descriptionEn: 'Waste hours posting angry messages accusing Rex of copying.',
        descriptionAr: 'إضاعة الوقت في منشورات غاضبة واتهام ريكس بالتقليد.',
        cashCost: 0,
        advisorRecommendation: 'filo',
        advisorTipEn: 'Filo warns: Arguing gives Rex free publicity. Spend energy on building, not venting.',
        advisorTipAr: 'فيلو يحذر: الجدال يمنح ريكس دعاية مجانية. ركّز طاقتك على البناء لا التذمر.',
        outcomeType: 'defeat',
        marketShareDelta: -10,
        reputationDelta: -8,
        educationalReasoningEn: 'Public disputes generate negative attention for your business and distract you from serving customers.',
        educationalReasoningAr: 'النزاعات العلنية تشوه سمعة علامتك التجارية وتصرف تركيزك عن خدمة زبائنك وإبهارهم.',
        rexReactionEn: 'Thanks for the free advertising! All your arguing just made my store famous!',
        rexReactionAr: 'شكراً على الدعاية المجانية! كل هذا الجدال جعل اسم متجري حديث الجميع!',
        rexReactionEmotion: 'celebrating'
      },
      {
        id: 'opt_bld_kami_pivot',
        titleEn: 'Sprint Innovation 2.0 with Kami',
        titleAr: 'إطلاق النسخة المطورة 2.0 مع كامي',
        descriptionEn: 'Add an authentic custom feature and personal guarantee that a copycat can never replicate.',
        descriptionAr: 'إضافة ميزة مبتكرة فريدة وضمان حقيقي للجودة يستحيل على المقلد مجاراته.',
        cashCost: 25,
        advisorRecommendation: 'kami',
        advisorTipEn: 'Kami cheers: Let him copy yesterday\'s idea! We are already making tomorrow\'s breakthrough!',
        advisorTipAr: 'كامي يهتف: دعه ينسخ فكرة الأمس! نحن نصنع الآن ابتكار الغد الذي لا يُقهر!',
        outcomeType: 'victory',
        marketShareDelta: 20,
        reputationDelta: 18,
        educationalReasoningEn: 'Continuous innovation is the ultimate moat. Copycats only copy the past, while visionary leaders define the future.',
        educationalReasoningAr: 'الابتكار المستمر هو الحصن المنيع. المقلدون ينسخون ماضيك فقط، بينما أنت تقود وتصنع المستقبل.',
        rexReactionEn: 'You launched Version 2.0 already?! How does Kami invent so fast?! I surrender this round.',
        rexReactionAr: 'أطلقت الإصدار 2.0 بهذه السرعة؟! كيف يبتكر كامي بتلك المهارة؟! أرفع لك القبعة هذه المرة.',
        rexReactionEmotion: 'surprised'
      },
      {
        id: 'opt_bld_discount_original',
        titleEn: 'Slap an "Authentic Original" Badge on Your Goods',
        titleAr: 'وضع شارة "الأصلية المعتمدة" على منتجاتك',
        descriptionEn: 'Inform shoppers about your certified craftsmanship with clean informational posters.',
        descriptionAr: 'توعية الزبائن بالفرق بين الصناعة المتقنة والتقليد عبر لافتات أنيقة.',
        cashCost: 10,
        advisorRecommendation: 'ollie',
        advisorTipEn: 'Ollie says: Education helps conscious buyers, though impulse buyers may still get confused.',
        advisorTipAr: 'أولي يوضح: التوعية تفيد المشترين الواعين، لكن بعض المشترين المتعجلين قد ينخدعون.',
        outcomeType: 'tactical_draw',
        marketShareDelta: 6,
        reputationDelta: 5,
        educationalReasoningEn: 'Protecting brand identity through clear verification builds trust, but needs ongoing product distinction.',
        educationalReasoningAr: 'حماية الهوية بعلامات موثوقة تعزز الثقة، لكنها تحتاج لتعزيز دائم بجودة المنتج.',
        rexReactionEn: 'Nice stickers, partner. But I\'m still biting at your ankles!',
        rexReactionAr: 'ملصقات أنيقة يا شريكي. لكنني ما زلت أنافسك بكل قوة!',
        rexReactionEmotion: 'thinking'
      }
    ]
  },

  risk: {
    id: 'chal_risk_hype',
    districtId: 'risk',
    type: 'ethics_test',
    titleEn: 'The Mirage of Quick Riches',
    titleAr: 'سراب الثراء السريع في حي المخاطر',
    scenarioEn: 'Rex is pitching "Guaranteed 1000% Returns Overnight" tokens to neighborhood kids, ridiculing your steady and transparent business model as "boring"!',
    scenarioAr: 'يوزع ريكس بطاقات تعد بـ "أرباح خيالية 1000% خلال ليلة واحدة"، ويسخر من مشروعك الصادق والمتأني واصفاً إياه بـ "الممل"!',
    rexTauntEn: 'Steady work? Boring! Real patrollers double their money in ten seconds with Rex Tokens! Care to join the frenzy?',
    rexTauntAr: 'العمل المتدرج ممل! الرواد الحقيقيون يضاعفون ثروتهم في ثوانٍ مع بطاقات ريكس! هل تجرؤ على الانضمام؟',
    rexEmotion: 'pointing',
    rewardTokens: 80,
    rewardXp: 150,
    options: [
      {
        id: 'opt_risk_gamble_in',
        titleEn: 'Invest Business Cash into Rex\'s Token',
        titleAr: 'استثمار أموال المشروع في بطاقات ريكس المجهولة',
        descriptionEn: 'Gamble business treasury cash on high-risk speculative promises.',
        descriptionAr: 'المقامرة بسيولة المتجر خلف وعود خيالية غير مضمونة.',
        cashCost: 50,
        advisorRecommendation: 'filo',
        advisorTipEn: 'Filo alarms: STOP! If it sounds too good to be true, it\'s a financial hazard!',
        advisorTipAr: 'فيلو يدق جرس الإنذار: توقف! إذا كان العرض خيالياً جداً لدرجة لا تُصدق، فهو فخ مؤكد!',
        outcomeType: 'defeat',
        marketShareDelta: -20,
        reputationDelta: -25,
        educationalReasoningEn: 'Speculation with business operating capital violates fiduciary responsibility and exposes you to total financial ruin.',
        educationalReasoningAr: 'المقامرة برأس مال التشغيل مغامرة طائشة تعرض مشروعك للانهيار التام وتفقدك ثقة الجميع.',
        rexReactionEn: 'Oops! The token market crashed! No refunds, rookie! Think again next time!',
        rexReactionAr: 'أوبس! انهارت أسعار البطاقات فجأة! لا يوجد استرجاع يا مبتدئ! فكّر مجدداً!',
        rexReactionEmotion: 'celebrating'
      },
      {
        id: 'opt_risk_transparent_report',
        titleEn: 'Publish Transparent Financial Balance & Honest Truth',
        titleAr: 'نشر تقرير شفاف يوضح الأرباح الحقيقية ومخاطر الفخاخ',
        descriptionEn: 'Team up with Filo to host a free "Financial Safety & Scam Defense" workshop for shoppers.',
        descriptionAr: 'التعاون مع فيلو لتنظيم ورشة توعوية مجانية للزبائن تكشف الفخاخ وتوضح بناء الثروة الحقيقية.',
        cashCost: 15,
        advisorRecommendation: 'filo',
        advisorTipEn: 'Filo nods: Integrity is your greatest shield. When Rex\'s bubble pops, your honesty shines.',
        advisorTipAr: 'فيلو يؤكد: الأمانة أعظم درع. عندما تنفجر فقاعة ريكس، سيصبح متجرك ملاذ الأمان الوحيد.',
        outcomeType: 'victory',
        marketShareDelta: 22,
        reputationDelta: 25,
        educationalReasoningEn: 'Trustworthy financial stewardship and fraud resistance build enduring community respect that outlasts any temporary hype cycle.',
        educationalReasoningAr: 'الأمانة المالية والتوعية بالمخاطر تبني سمعة راسخة تدوم طويلاً بعد تلاشي فقاعات الدعاية الزائفة.',
        rexReactionEn: 'Ugh... my tokens went to zero, and now everyone in town calls you the most honest CEO in the district...',
        rexReactionAr: 'أخ... فقدت بطاقاتي كل قيمتها، وأصبح الجميع يلقبونك بالمدير الأكثر نزاهة ومصداقية...',
        rexReactionEmotion: 'defeat' as any
      },
      {
        id: 'opt_risk_ignore_hype',
        titleEn: 'Silently Stick to Your Daily Sales',
        titleAr: 'التجاهل التام ومواصلة البيع اليومي العادي',
        descriptionEn: 'Neither invest nor educate; simply keep ringing up daily customers.',
        descriptionAr: 'عدم الاستثمار وعدم التوعية، والتركيز على المبيعات الاعتيادية فقط.',
        cashCost: 0,
        advisorRecommendation: 'ollie',
        advisorTipEn: 'Ollie says: Prudent defense, though you miss an opportunity to lead the district.',
        advisorTipAr: 'أولي يحلل: تصرف حذر ومقبول، وإن كنت فوت فرصة قيادة الرأي العام في المنطقة.',
        outcomeType: 'tactical_draw',
        marketShareDelta: 4,
        reputationDelta: 4,
        educationalReasoningEn: 'Staying focused on solid business preserves your cash, but speaking up for consumer protection cements true leadership.',
        educationalReasoningAr: 'التركيز على عملك يحمي أموالك، لكن حماية الزبائن وتوعيتهم هي ما يصنع القائد الحقيقي.',
        rexReactionEn: 'You didn\'t bite at all? You\'re cooler under pressure than you look.',
        rexReactionAr: 'لم تبتلع الطعم أبداً؟ أعصابك أبرد مما كنت أتصور.',
        rexReactionEmotion: 'thinking'
      }
    ]
  },

  operations: {
    id: 'chal_operations_supply',
    districtId: 'operations',
    type: 'price_war',
    titleEn: 'Operations Supply Chain Crunch',
    titleAr: 'أزمة سلاسل الإمداد في حي العمليات',
    scenarioEn: 'A sudden delivery delay hits the town! Rex hoarded cheap low-grade supplies and is price-gouging everyone at 3x standard prices.',
    scenarioAr: 'تأخرت شحنات الموردين فجأة! قام ريكس باحتكار بضائع رديئة ويعرضها بأسعار مضاعفة 3 مرات مستغلاً حاجة السوق.',
    rexTauntEn: 'Supply and demand, rookie! I have stock, you don\'t! Pay my inflated prices or stay empty!',
    rexTauntAr: 'هذا هو قانون العرض والطلب! لدي بضاعة وأنت لا تملك! ادفع أسعاري المرتفعة أو أغلق متجرك!',
    rexEmotion: 'talking',
    rewardTokens: 70,
    rewardXp: 130,
    options: [
      {
        id: 'opt_ops_buy_inflated',
        titleEn: 'Panic & Buy Rex\'s Inflated Low-Quality Inventory',
        titleAr: 'الارتباك والشراء من ريكس بأسعاره المضاعفة الرديئة',
        descriptionEn: 'Overpay for shoddy goods that will disappoint your customers.',
        descriptionAr: 'دفع مبالغ طائلة في بضاعة رديئة ستفسد سمعتك مع الزبائن.',
        cashCost: 45,
        advisorRecommendation: 'filo',
        advisorTipEn: 'Filo warns: Buying junk at inflated prices wipes out your profit margins!',
        advisorTipAr: 'فيلو يحذر: شراء بضاعة رديئة بأسعار باهظة يدمر أرباحك ويفقدك عملاءك!',
        outcomeType: 'defeat',
        marketShareDelta: -14,
        reputationDelta: -15,
        educationalReasoningEn: 'Panic-buying overpriced, substandard stock destroys cash reserves and compromises product integrity.',
        educationalReasoningAr: 'الشراء المتعجل لبضاعة رديئة بأسعار مضاعفة يستنزف السيولة ويهز مصداقية جودتك.',
        rexReactionEn: 'Haha! You paid me triple for inventory I bought from the discount bin! Pure profit for me!',
        rexReactionAr: 'هاها! اشتريت مني بثلاثة أضعاف بضاعة اشتريتها أنا بسعر التراب! ربح صافٍ لي!',
        rexReactionEmotion: 'celebrating'
      },
      {
        id: 'opt_ops_local_coop',
        titleEn: 'Partner with Local Neighborhood Producers & Ollie',
        titleAr: 'التحالف مع المنتجين المحليين في الحي مع أولي',
        descriptionEn: 'Form a resilient local supplier co-op to source fresh alternative goods at fair cost.',
        descriptionAr: 'بناء شبكة توريد محلية سريعة وبديلة تضمن استمرار العمل بجودة عالية وسعر عادل.',
        cashCost: 20,
        advisorRecommendation: 'ollie',
        advisorTipEn: 'Ollie explains: Diversified suppliers protect you from single points of failure.',
        advisorTipAr: 'أولي يوضح: تنويع مصادر التوريد يحميك من أي انقطاع مفاجئ ويمنحك مرونة دائمة.',
        outcomeType: 'victory',
        marketShareDelta: 20,
        reputationDelta: 18,
        educationalReasoningEn: 'Building diversified, relational supply networks guarantees operational stability during market crunches.',
        educationalReasoningAr: 'بناء علاقات متينة مع موردين محليين يضمن استقرار الإمدادات في أوقات الأزمات دون الرضوخ للاستغلال.',
        rexReactionEn: 'You built your own supplier network in two days?! Now nobody will touch my overpriced stock!',
        rexReactionAr: 'بنيت شبكة موردين خاصة بك في يومين فقط؟! الآن لن يقترب أحد من بضاعتي المحتكرة!',
        rexReactionEmotion: 'surprised'
      },
      {
        id: 'opt_ops_preorder_discount',
        titleEn: 'Offer Pre-Orders with Delivery Guarantees',
        titleAr: 'فتح باب الحجز المسبق مع خصم تشجيعي للمشتريين',
        descriptionEn: 'Collect customer orders in advance while shipments arrive, keeping cash flow steady.',
        descriptionAr: 'تسجيل طلبات الزبائن مسبقاً وتوفيرها فور وصول الشحنة مع خصم بسيط على الانتظار.',
        cashCost: 5,
        advisorRecommendation: 'reema',
        advisorTipEn: 'Reema says: Transparency with customers turns delays into anticipation!',
        advisorTipAr: 'ريما تنصح: الصدق مع العملاء يحول فترة الانتظار إلى ثقة وترقب إيجابي!',
        outcomeType: 'tactical_draw',
        marketShareDelta: 7,
        reputationDelta: 8,
        educationalReasoningEn: 'Pre-order systems manage working capital efficiently while protecting customer relationships.',
        educationalReasoningAr: 'الحجز المسبق ينظم التدفق المالي بدقة ويحافظ على ولاء الزبائن بصراحة وشفافية.',
        rexReactionEn: 'Smart move. You kept your customers happy without buying a single box from me.',
        rexReactionAr: 'حركة حكيمة. حافظت على زبائنك سعداء دون أن تشتري مني صندوقاً واحداً.',
        rexReactionEmotion: 'thinking'
      }
    ]
  },

  innovation: {
    id: 'chal_innovation_rush',
    districtId: 'innovation',
    type: 'innovation_sprint',
    titleEn: 'Innovation Prototype Rush',
    titleAr: 'سباق النماذج في حي الابتكار',
    scenarioEn: 'Rex announced an app with 100 features overnight, but every screen crashes! Still, the flashy ads are confusing tech buyers.',
    scenarioAr: 'أعلن ريكس عن تطبيق يضم 100 ميزة في ليلة واحدة، لكن كل شاشة تتعطل! ورغم ذلك، الإعلانات الصاخبة تخدع المشترين.',
    rexTauntEn: 'More features equals more money! Who cares if it has bugs when the trailer looks this cool?!',
    rexTauntAr: 'ميزات أكثر تعني أرباحاً أكثر! من يكترث للأخطاء طالما الإعلان يبدو رائعاً؟! فكّر ثانية!',
    rexEmotion: 'talking',
    rewardTokens: 85,
    rewardXp: 160,
    options: [
      {
        id: 'opt_inn_rush_features',
        titleEn: 'Rush 50 Half-Baked Features to Outnumber Him',
        titleAr: 'إطلاق 50 ميزة غير مكتملة لمجرد مجاراته في العدد',
        descriptionEn: 'Sacrifice testing and user experience to match Rex\'s bullet point list.',
        descriptionAr: 'التضحية باختبار الأداء وسهولة الاستخدام لكتابة قائمة ميزات أطول.',
        cashCost: 30,
        advisorRecommendation: 'filo',
        advisorTipEn: 'Filo warns: Glitchy software creates support nightmares and refunds.',
        advisorTipAr: 'فيلو يحذر: البرمجيات المليئة بالأخطاء كابوس يدمر ثقة المستخدمين ويدفعهم لطلب استرجاع الأموال.',
        outcomeType: 'defeat',
        marketShareDelta: -14,
        reputationDelta: -15,
        educationalReasoningEn: 'Customers value reliability and seamless usability far more than a long list of broken features.',
        educationalReasoningAr: 'المستخدمون يقدرون السلاسة والاعتمادية أضعاف تقديرهم لقائمة طويلة من الميزات المعطلة.',
        rexReactionEn: 'Haha! Both of our apps crashed at the demo! But I spent less making mine!',
        rexReactionAr: 'هاها! تطبيقانا تعطلا معاً في العرض! لكنني أنفقت مالاً أقل في صناعة تطبيقي!',
        rexReactionEmotion: 'celebrating'
      },
      {
        id: 'opt_inn_delight_ux',
        titleEn: 'Polish 3 Core Features to Perfection with Kami',
        titleAr: 'صقل 3 ميزات أساسية لتصل لدرجة الإبهار مع كامي',
        descriptionEn: 'Deliver lightning-fast, bug-free delight with stellar customer onboarding.',
        descriptionAr: 'تقديم تجربة فائقة السرعة وخالية من العيوب مع توجيه سلس وممتع للمستخدمين الجدد.',
        cashCost: 25,
        advisorRecommendation: 'kami',
        advisorTipEn: 'Kami says: Simplicity is genius! Solve the real user problem better than anyone!',
        advisorTipAr: 'كامي يبتسم: البساطة هي قمة الذكاء! حل مشكلة المستخدم الحقيقية ببراعة لا مثيل لها!',
        outcomeType: 'victory',
        marketShareDelta: 21,
        reputationDelta: 22,
        educationalReasoningEn: 'Doing a few things exceptionally well builds loyal advocates who leave 5-star reviews and champion your product.',
        educationalReasoningAr: 'إتقان الأساسيات ببراعة فائقة يصنع زبائن أوفياء يمنحونك أعلى التقييمات ويسوقون لك بحماس.',
        rexReactionEn: 'Wait... your app only has 3 buttons, but people use it 10 hours a day?! Mind blown...',
        rexReactionAr: 'مهلاً... تطبيقك فيه 3 أزرار فقط، ومع ذلك يستخدمه الناس لساعات يومياً؟! لقد أذهلتني...',
        rexReactionEmotion: 'surprised'
      },
      {
        id: 'opt_inn_free_trial',
        titleEn: 'Offer a 7-Day Hassle-Free Demonstration',
        titleAr: 'تقديم فترة تجربة مجانية بدون تعقيد لـ 7 أيام',
        descriptionEn: 'Let users experience your stability directly without upfront commitment.',
        descriptionAr: 'منح المستخدمين فرصة تجربة استقرار وموثوقية حلك قبل اتخاذ قرار الشراء.',
        cashCost: 15,
        advisorRecommendation: 'reema',
        advisorTipEn: 'Reema says: Giving people a taste of reliability builds trust faster than ads.',
        advisorTipAr: 'ريما تؤكد: إتاحة التجربة المباشرة تثبت المصداقية أسرع بكثير من مجرد الوعود.',
        outcomeType: 'tactical_draw',
        marketShareDelta: 8,
        reputationDelta: 8,
        educationalReasoningEn: 'Free trials reduce customer risk and convert thoughtful buyers into long-term subscribers.',
        educationalReasoningAr: 'التجارب المجانية تزيل مخاوف الشراء وتحول الزبائن المترددين إلى مشتركين دائمين.',
        rexReactionEn: 'Good move. People got to test before buying and realized my app crashes.',
        rexReactionAr: 'حركة ذكية. جرب الناس قبل الشراء واكتشفوا أن تطبيقي يتوقف فجأة.',
        rexReactionEmotion: 'thinking'
      }
    ]
  },

  leadership: {
    id: 'chal_leadership_brand',
    districtId: 'leadership',
    type: 'hype_marketing',
    titleEn: 'The Corporate PR Storm',
    titleAr: 'عاصفة العلاقات العامة في حي القيادة',
    scenarioEn: 'Rex hired street parrots to fly around repeating misleading gossip about your store while plastering cartoon billboards mocking your brand!',
    scenarioAr: 'استأجر ريكس طيوراً تذيع إشاعات مضللة في السوق حول متجرك، ونصب لوحات كرتونية تسخر من علامتك التجارية!',
    rexTauntEn: 'In big business, narrative is everything! If I say your store is uncool, people believe it! Think again, CEO!',
    rexTauntAr: 'في عالم الشركات الكبرى، الصورة الذهنية هي كل شيء! إذا قلت إن متجرك غير مواكب للموضة، سيصدقني الجميع!',
    rexEmotion: 'excited',
    rewardTokens: 90,
    rewardXp: 175,
    options: [
      {
        id: 'opt_ldr_mud_sling',
        titleEn: 'Retaliate with Rumors About Rex',
        titleAr: 'الرد بالمثل وإطلاق إشاعات مضادة عن ريكس',
        descriptionEn: 'Hire your own birds to spread vicious gossip back at Rex\'s company.',
        descriptionAr: 'استئجار طيور أخرى لنشر إشاعات هجومية عن شركة ريكس.',
        cashCost: 35,
        advisorRecommendation: 'reema',
        advisorTipEn: 'Reema warns: When you throw mud, both CEOs end up dirty. Protect your dignity.',
        advisorTipAr: 'ريما تحذر: عندما ترشق الطين، تتلطخ أنت أيضاً. حافظ على رقي ومكانة علامتك.',
        outcomeType: 'defeat',
        marketShareDelta: -15,
        reputationDelta: -25,
        educationalReasoningEn: 'Engaging in slander destroys professional respect and drives premier corporate clients to neutral competitors.',
        educationalReasoningAr: 'الانجرار خلف الهجوم الشخصي يدمر السمعة المهنية وينفر كبار العملاء والشركاء المحترمين.',
        rexReactionEn: 'We turned the whole district into a tabloid! Corporate investors just walked away from both of us!',
        rexReactionAr: 'لقد حولنا السوق إلى ساحة شجار رخيص! المستثمرون الكبار هربوا منا نحن الاثنين!',
        rexReactionEmotion: 'celebrating'
      },
      {
        id: 'opt_ldr_community_impact',
        titleEn: 'Host a Youth Entrepreneur Showcase & Charity Fund',
        titleAr: 'رعاية ملتقى رواد الأعمال الناشئين ودعم مبادرة مجتمعية',
        descriptionEn: 'Invest in real community value with Reema, letting real testimonials speak for your enterprise.',
        descriptionAr: 'الاستثمار في مبادرة حقيقية تخدم المجتمع مع ريما، وترك قصص نجاح الزبائن تتحدث عن أصالتك.',
        cashCost: 30,
        advisorRecommendation: 'reema',
        advisorTipEn: 'Reema smiles: Authentic corporate citizenship turns community leaders into your fiercest defenders!',
        advisorTipAr: 'ريما تبتسم: المسؤولية المجتمعية الصادقة تجعل كل أهالي الحي سفراء ومدافعين مخلصين عنك!',
        outcomeType: 'victory',
        marketShareDelta: 22,
        reputationDelta: 25,
        educationalReasoningEn: 'True corporate leadership is built on community impact and undeniable social proof, not cheap smear campaigns.',
        educationalReasoningAr: 'الريادة المؤسسية الحقيقية تُبنى على الأثر المجتمعي الصادق والأدلة العملية، لا على المهاترات.',
        rexReactionEn: 'The Mayor just gave you a Community Medal of Honor while taking down my billboards... Bravo.',
        rexReactionAr: 'عمدة الحي كرمك للتو بوسام الشرف وأمر بإزالة لوحاتي الساخرة... لقد هزمتني برقي.',
        rexReactionEmotion: 'reluctantRespect' as any
      },
      {
        id: 'opt_ldr_press_release',
        titleEn: 'Issue a Calm, Fact-Checked Official Statement',
        titleAr: 'إصدار بيان رسمي هادئ مدعم بالأرقام والوقائع',
        descriptionEn: 'Set the record straight with documented customer satisfaction figures.',
        descriptionAr: 'توضيح الحقائق بهدوء من خلال نشر إحصائيات رضا الزبائن الموثقة.',
        cashCost: 10,
        advisorRecommendation: 'ollie',
        advisorTipEn: 'Ollie says: Clear facts dispel rumors, providing solid ground for discerning corporate clients.',
        advisorTipAr: 'أولي يحلل: الحقائق الدقيقة تدحض الأكاذيب وتطمئن كبار العملاء ذوي النظرة الفاحصة.',
        outcomeType: 'tactical_draw',
        marketShareDelta: 7,
        reputationDelta: 7,
        educationalReasoningEn: 'Professional crisis communication preserves trust among analytical decision-makers.',
        educationalReasoningAr: 'التواصل الاحترافي في أوقات الأزمات يحافظ على ثقة صناع القرار والعقلاء في السوق.',
        rexReactionEn: 'You\'re too professional to rattle, aren\'t you? I need to find a new angle.',
        rexReactionAr: 'أنت محترف جداً ولا تفقد هدوءك أبداً! عليّ البحث عن زاوية أخرى.',
        rexReactionEmotion: 'thinking'
      }
    ]
  },

  strategy: {
    id: 'chal_strategy_credit',
    districtId: 'strategy',
    type: 'price_war',
    titleEn: 'The Strategic Cash Flow Trap',
    titleAr: 'فخ التدفق النقدي في حي الاستراتيجية',
    scenarioEn: 'Rex is handing out unlimited merchandise on "Buy Now, Pay in 10 Years" credit. Shoppers are taking everything, but Rex has zero cash left in his register!',
    scenarioAr: 'يوزع ريكس بضاعته على طريقة "اشترِ الآن وادفع بعد 10 سنوات". تهافت الزبائن، لكن صندوق ريكس أصبح فارغاً تماماً من أي سيولة نقدية!',
    rexTauntEn: 'I made 100 sales on credit today! Who needs actual cash when you have promises written on napkins?!',
    rexTauntAr: 'حققت 100 عملية بيع بالآجل اليوم! من يحتاج لنقود حقيقية طالما لدي وعود مدونة على مناديل ورقية؟! فكّر فيها!',
    rexEmotion: 'excited',
    rewardTokens: 70,
    rewardXp: 135,
    options: [
      {
        id: 'opt_strat_copy_credit',
        titleEn: 'Offer Unchecked Credit with Zero Down Payment',
        titleAr: 'تقديم بيع بالآجل دون أي دفعة أولى أو فحص للقدرة',
        descriptionEn: 'Give away your inventory on unsecured promises to look busy.',
        descriptionAr: 'توزيع المخزون بوعود غير مضمونة لمجرد الظهور بمظهر المتجر المزدحم.',
        cashCost: 40,
        advisorRecommendation: 'filo',
        advisorTipEn: 'Filo gasps: You cannot pay suppliers with IOUs! Cash flow is oxygen!',
        advisorTipAr: 'فيلو يصرخ: لا يمكنك دفع مستحقات الموردين بورق الوعود! السيولة النقدية هي أكسجين التجارة!',
        outcomeType: 'defeat',
        marketShareDelta: -18,
        reputationDelta: -12,
        educationalReasoningEn: 'Revenue on paper is meaningless if you cannot collect cash to pay inventory costs, wages, and operating expenses.',
        educationalReasoningAr: 'تسجيل الأرباح على الورق لا قيمة له إذا عجزت عن تحصيل النقود لدفع ثمن المخزون ومصاريف التشغيل.',
        rexReactionEn: 'Haha! Now both our bank accounts are empty! We\'re broke together, pal!',
        rexReactionAr: 'هاها! حسابانا البنكيان أصبحا فارغين معاً! أهلاً بك في نادي الإفلاس!',
        rexReactionEmotion: 'celebrating'
      },
      {
        id: 'opt_strat_smart_layaway',
        titleEn: 'Structured Layaway with Cash Discount & Ollie\'s Model',
        titleAr: 'خطة ادخار منظمة مع خصم للدفع النقدي الفوري',
        descriptionEn: 'Reward cash-paying customers with 5% savings and set up safe milestone payment plans.',
        descriptionAr: 'مكافأة الدفع النقدي بخصم تشجيعي 5% وتنظيم خطط دفع مرحلية واضحة وآمنة.',
        cashCost: 10,
        advisorRecommendation: 'ollie',
        advisorTipEn: 'Ollie explains: Cash in hand today is always worth more than a risky promise tomorrow.',
        advisorTipAr: 'أولي يوضح: ريال في يدك اليوم خير من عشرة وعود مؤجلة غداً. حافظ على تدفقك النقدي!',
        outcomeType: 'victory',
        marketShareDelta: 19,
        reputationDelta: 16,
        educationalReasoningEn: 'Cash flow management guarantees business survival and gives you working capital to seize wholesale opportunities.',
        educationalReasoningAr: 'الإدارة الحكيمة للسيولة تضمن بقاء مشروعك وتمنحك القدرة على اقتناص فرص الشراء بأسعار الجملة.',
        rexReactionEn: 'My supplier just locked my doors because I couldn\'t pay in cash... while your vault is full. Lesson learned.',
        rexReactionAr: 'أقفل المورد باب متجري لأنني لم أستطع الدفع نقداً... بينما خزنتك ممتلئة بالسيولة. درس قاسٍ تعلمته.',
        rexReactionEmotion: 'defeat' as any
      },
      {
        id: 'opt_strat_standard_terms',
        titleEn: 'Maintain Strict 100% Cash-and-Carry Policy',
        titleAr: 'التمسك بالدفع الفوري الكامل عند الاستلام فقط',
        descriptionEn: 'Refuse all credit sales and rely solely on direct point-of-sale transactions.',
        descriptionAr: 'رفض أي بيع آجل تماماً والاعتماد فقط على الشراء المباشر الفوري.',
        cashCost: 0,
        advisorRecommendation: 'filo',
        advisorTipEn: 'Filo nods: 100% safe, although flexible payment plans can help big-ticket items.',
        advisorTipAr: 'فيلو يوافق: خيار آمن 100%، وإن كانت المرونة المدروسة تزيد مبيعات المنتجات الكبيرة.',
        outcomeType: 'tactical_draw',
        marketShareDelta: 6,
        reputationDelta: 5,
        educationalReasoningEn: 'Cash-only preserves your balance sheet with zero bad debts, maintaining financial health.',
        educationalReasoningAr: 'البيع النقدي التام يحمي ميزانيتك من الديون المعدومة ويحافظ على صحة مشروعك المالية.',
        rexReactionEn: 'At least you\'re still solvent. I have to go collect on 50 bounced napkins.',
        rexReactionAr: 'على الأقل مشروعك لا يزال مستقراً. أما أنا فعليّ الآن ملاحقة ديون 50 شخصاً.',
        rexReactionEmotion: 'thinking'
      }
    ]
  },

  launch: {
    id: 'chal_launch_pitch',
    districtId: 'launch',
    type: 'ethics_test',
    titleEn: 'The Angel Investor Pitch-Off',
    titleAr: 'منافسة العرض أمام المستثمرين في حي الانطلاق',
    scenarioEn: 'A panel of legendary angel investors is in town with $10,000 in seed funding! Rex is showing exaggerated charts with fake billions in projected revenue.',
    scenarioAr: 'لجنة من كبار المستثمرين تزور الحي لتمويل المشاريع الواعدة! يقدم ريكس مخططات وهمية بأرقام فلكية خيالية لإبهارهم.',
    rexTauntEn: 'Investors don\'t want modest realism—they want dream numbers! Watch me take all the funding before you even introduce yourself!',
    rexTauntAr: 'المستثمرون لا يريدون أرقاماً متواضعة، بل أرقاماً أسطورية! شاهدني وأنا أستحوذ على التمويل كله قبلك!',
    rexEmotion: 'excited',
    rewardTokens: 100,
    rewardXp: 200,
    options: [
      {
        id: 'opt_lnch_fake_numbers',
        titleEn: 'Exaggerate Your Projections to Beat Rex\'s Numbers',
        titleAr: 'تضخيم توقعاتك لتكون أعلى من أرقام ريكس الوهمية',
        descriptionEn: 'Lie about your margins and promise 10,000,000 users by next week.',
        descriptionAr: 'المبالغة في الأرقام وتقديم وعود بملايين الزبائن خلال أيام دون خطة واقعية.',
        cashCost: 10,
        advisorRecommendation: 'filo',
        advisorTipEn: 'Filo warns: Experienced investors do due diligence. Faking numbers ends in disgrace.',
        advisorTipAr: 'فيلو ينبه: المستثمر الخبير يدقق في كل تفصيلة. تزييف الأرقام نهايته الفضيحة وفقدان المصداقية.',
        outcomeType: 'defeat',
        marketShareDelta: -20,
        reputationDelta: -30,
        educationalReasoningEn: 'Falsifying financial data in an investor pitch is fraud. When due diligence exposes the truth, your startup loses all credibility.',
        educationalReasoningAr: 'تزييف البيانات المالية أمام المستثمرين خيانة للأمانة. عندما يكتشف التدقيق ذلك تسقط مصداقيتك بالكامل.',
        rexReactionEn: 'The judges caught both of our fake graphs! We both got disqualified! Think again!',
        rexReactionAr: 'لجنة التحكيم كشفت الرسوم الوهمية لكلينا! استبعدونا معاً من المسابقة! فكّر مجدداً!',
        rexReactionEmotion: 'celebrating'
      },
      {
        id: 'opt_lnch_solid_unit_economics',
        titleEn: 'Present Rigorous Unit Economics & Validated Traction',
        titleAr: 'تقديم نموذج اقتصادي رصين مع أدلة حقيقية على المبيعات',
        descriptionEn: 'Work with Ollie and Reema to showcase real customer lifetime value, customer acquisition cost, and steady margins.',
        descriptionAr: 'التعاون مع أولي وريما لعرض تكلفة اكتساب العميل وقيمته الحقيقية مع هوامش ربح موثقة.',
        cashCost: 20,
        advisorRecommendation: 'ollie',
        advisorTipEn: 'Ollie smiles: Real angels back founders who understand their math and show authentic customer love.',
        advisorTipAr: 'أولي يبتسم: المستثمرون العباقرة يدعمون من يتقن لغة الأرقام الصادقة ويثبت حب الزبائن لمنتجه.',
        outcomeType: 'victory',
        marketShareDelta: 25,
        reputationDelta: 30,
        educationalReasoningEn: 'Top-tier investors fund disciplined execution, positive unit economics, and honest founders over flashy exaggerations.',
        educationalReasoningAr: 'أفضل المستثمرين يستثمرون في الانضباط ووضوح اقتصاديات المنتج وأمانة المؤسس وليس في الاستعراض الفارغ.',
        rexReactionEn: 'They grilled my fake numbers in two minutes, then gave you the lead check! You\'re the real deal, partner.',
        rexReactionAr: 'فحصوا أرقامي دقيقتين فقط ففضحتني، ثم منحوك شيك الاستثمار الأول! أنت رائد أعمال حقيقي يا شريكي.',
        rexReactionEmotion: 'reluctantRespect' as any
      },
      {
        id: 'opt_lnch_bootstrap_pitch',
        titleEn: 'Pitch a Profitable Bootstrapping Plan',
        titleAr: 'عرض خطة نمو ذاتي مستدام بدون الحاجة لديون أو تنازل عن حصص',
        descriptionEn: 'Show how your healthy cash flow can self-fund growth without giving away equity.',
        descriptionAr: 'إثبات أن تدفقك النقدي الصحي كافٍ لتمويل التوسع ذاتياً دون التخلي عن جزء من شركتك.',
        cashCost: 5,
        advisorRecommendation: 'kami',
        advisorTipEn: 'Kami says: Total freedom! You don\'t always need outside money if your engine is profitable!',
        advisorTipAr: 'كامي يهتف: الحرية والاستقلال! لا تحتاج دائماً لأموال المستثمرين إذا كان مشروعك يدر ربحاً حقيقياً!',
        outcomeType: 'victory',
        marketShareDelta: 20,
        reputationDelta: 20,
        educationalReasoningEn: 'Bootstrapping with real customer revenues gives you 100% control and ownership of your destiny.',
        educationalReasoningAr: 'الاعتماد على إيرادات زبائنك يمنحك السيطرة الكاملة بنسبة 100% على قرارات ومستقبل مشروعك.',
        rexReactionEn: 'Wait, you turned them down because your own store makes enough money?! That is next level!',
        rexReactionAr: 'مهلاً، رفضت شروطهم لأن أرباح متجرك كافية للنمو ذاتياً؟! هذا ارتقاء لمستوى آخر من القوة!',
        rexReactionEmotion: 'surprised'
      }
    ]
  }
};

/**
 * Returns the active challenge for the requested district.
 */
export function getChallengeForDistrict(districtId: DistrictId): RivalChallenge {
  return DISTRICT_CHALLENGES[districtId] || DISTRICT_CHALLENGES.money;
}

/**
 * Pure evaluation engine for resolving a player strategic option.
 */
export function resolveRivalChallenge(
  challenge: RivalChallenge,
  chosenOptionId: string,
  currentMarketShare: number = 50
): RivalryResolution {
  const option = challenge.options.find(o => o.id === chosenOptionId);

  if (!option) {
    throw new Error(`Option ${chosenOptionId} not found in challenge ${challenge.id}`);
  }

  // Calculate new market share bounded [5, 95]
  const rawAfter = currentMarketShare + option.marketShareDelta;
  const playerMarketShareAfter = Math.min(95, Math.max(5, rawAfter));
  const effectiveDelta = playerMarketShareAfter - currentMarketShare;

  // Reward calculations based on outcome
  let tokensEarned = 0;
  let xpEarned = 0;

  if (option.outcomeType === 'victory') {
    tokensEarned = challenge.rewardTokens;
    xpEarned = challenge.rewardXp;
  } else if (option.outcomeType === 'tactical_draw') {
    tokensEarned = Math.round(challenge.rewardTokens * 0.4);
    xpEarned = Math.round(challenge.rewardXp * 0.5);
  } else {
    // Consolation learning XP
    tokensEarned = 5;
    xpEarned = 25;
  }

  const isDistrictDominated = playerMarketShareAfter >= 75;

  return {
    challengeId: challenge.id,
    districtId: challenge.districtId,
    chosenOptionId,
    outcome: option.outcomeType,
    playerMarketShareBefore: currentMarketShare,
    playerMarketShareAfter,
    marketShareDelta: effectiveDelta,
    cashSpent: option.cashCost,
    tokensEarned,
    xpEarned,
    rexResponseEn: option.rexReactionEn,
    rexResponseAr: option.rexReactionAr,
    rexEmotion: option.rexReactionEmotion,
    educationalReasoningEn: option.educationalReasoningEn,
    educationalReasoningAr: option.educationalReasoningAr,
    isDistrictDominated
  };
}

/**
 * Calculates district revenue and customer bonus based on market share dominance.
 */
export function calculateMarketShareBonus(playerMarketShare: number): {
  revenueMultiplier: number;
  customerDemandMultiplier: number;
  tierEn: string;
  tierAr: string;
} {
  if (playerMarketShare >= 75) {
    return {
      revenueMultiplier: 1.25,
      customerDemandMultiplier: 1.30,
      tierEn: 'District Dominator (75%+)',
      tierAr: 'زعيم السوق الإقليمي (75%+)'
    };
  }
  if (playerMarketShare >= 55) {
    return {
      revenueMultiplier: 1.10,
      customerDemandMultiplier: 1.15,
      tierEn: 'Market Leader (55%-74%)',
      tierAr: 'رائد السوق (55%-74%)'
    };
  }
  if (playerMarketShare >= 45) {
    return {
      revenueMultiplier: 1.0,
      customerDemandMultiplier: 1.0,
      tierEn: 'Balanced Competitor (45%-54%)',
      tierAr: 'منافس متعادل (45%-54%)'
    };
  }
  return {
    revenueMultiplier: 0.85,
    customerDemandMultiplier: 0.80,
    tierEn: 'Underdog (Under 45%)',
    tierAr: 'في موقع التحدي (أقل من 45%)'
  };
}
