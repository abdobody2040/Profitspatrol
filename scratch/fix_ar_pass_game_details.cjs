const fs = require('fs');

const arPath = 'src/locales/ar.ts';
let content = fs.readFileSync(arPath, 'utf8');

const t = {
  // Ingredients
  "Pink Frosting": "كريمة وردية",
  "Blue Frosting": "كريمة زرقاء",
  "Cherry": "كرز",
  "Sprinkles": "حبيبات سكر ملونة",
  "Corn Shell": "رقاقة ذرة",
  "Ground Beef": "لحم مفروم",
  "Shredded Cheese": "جبن مبشور",
  "Shredded Lettuce": "خس مفروم",
  "Salsa": "صلصة",
  
  // Recipes
  "Classic Burger": "برجر كلاسيكي",
  "Cheeseburger": "تشيز برجر",
  "Deluxe Burger": "برجر ديلوكس",
  "Double Meat": "لحم مضاعف",
  "Veggie Burger": "برجر نباتي",
  "Classic Cupcake": "كب كيك كلاسيكي",
  "Berry Blast": "انفجار التوت",
  "Classic Taco": "تاكو كلاسيكي",
  "Spicy Taco": "تاكو حار",
  "Meat Lover": "محبي اللحوم",

  // Quality Control
  "Spot defects! Only sell the best products.": "ابحث عن العيوب! بع أفضل المنتجات فقط.",
  "Mistakes": "أخطاء",
  "Start Inspection": "ابدأ الفحص",
  "Pass Good": "مرر الجيد",
  "Reject Bad": "ارفض السيء",
  "Tap the defective items to remove them. Don't let bad products ship!": "انقر على القطع المعيبة لإزالتها. لا تسمح بشحن منتجات سيئة!",

  // Ethics Game
  "The Ethical Dilemma": "المعضلة الأخلاقية",
  "Make tough choices. Balance Profit and Reputation.": "اتخذ قرارات صعبة. وازن بين الربح والسمعة.",
  "Reputation": "السمعة",
  "Scenario": "السيناريو",
  "Option": "الخيار",
  "Decision Made!": "تم اتخاذ القرار!",
  "Finish Game": "إنهاء اللعبة",
  "Sourcing Materials": "مصادر المواد",
  "You can buy materials from a factory that pollutes the river (cheap) or an eco-friendly factory (expensive).": "يمكنك شراء المواد من مصنع يلوث النهر (رخيص) أو مصنع صديق للبيئة (غالٍ).",
  "Buy Cheap (Polluting)": "شراء رخيص (ملوث)",
  "Buy Eco-Friendly (Expensive)": "شراء صديق للبيئة (غالٍ)",
  "Cheap materials boost profit but hurt the planet. Green choices build trust!": "المواد الرخيصة تزيد الربح ولكنها تؤذي الكوكب. الخيارات الخضراء تبني الثقة!",
  "Waste Disposal": "التخلص من النفايات",
  "The factory has extra waste. Dumping it in the woods is free. Paying to recycle costs money.": "المصنع لديه نفايات زائدة. إلقاؤها في الغابة مجاني. الدفع مقابل إعادة التدوير يكلف مالاً.",
  "Dump in Woods (Free)": "الإلقاء في الغابة (مجاني)",
  "Pay to Recycle": "الدفع لإعادة التدوير",
  "Illegal dumping brings bad press. Recycling is costly but people love green companies.": "الإلقاء غير القانوني يجلب سمعة سيئة. إعادة التدوير مكلفة ولكن الناس يحبون الشركات الخضراء.",
  "Honest Marketing": "تسويق صادق",
  "You can lie and say your product gives super powers (huge sales) or tell the truth (normal sales).": "يمكنك الكذب والقول إن منتجك يعطي قوى خارقة (مبيعات ضخمة) أو قول الحقيقة (مبيعات عادية).",
  "Lie about Super Powers": "الكذب بشأن القوى الخارقة",
  "Tell the Truth": "قول الحقيقة",
  "Lying brings quick cash but destroys trust forever. Honesty builds a loyal following.": "الكذب يجلب مالاً سريعاً ولكنه يدمر الثقة للأبد. الصدق يبني قاعدة متابعين مخلصين.",

  // Investing Game
  "Stock Market Rollercoaster": "سوق الأسهم المتقلب",
  "Buy low, sell high! Can you beat the market?": "اشترِ بسعر منخفض، وبع بسعر مرتفع! هل يمكنك هزيمة السوق؟",
  "Net Worth": "صافي الثروة",
  "Stock Price": "سعر السهم",
  "Cash": "نقد",
  "Shares": "الأسهم",
  "Buy Max": "شراء الحد الأقصى",
  "Sell All": "بيع الكل",
  "Start Trading": "ابدأ التداول",
  "Bull Market!": "سوق صاعد!",
  "Bear Market": "سوق هابط",
  "Market Boom!": "انتعاش السوق!",
  "Market Crash!": "انهيار السوق!",
};

Object.keys(t).forEach(eng => {
  const regex = new RegExp(":\\s*['\"]" + eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]", 'g');
  content = content.replace(regex, ": '" + t[eng] + "'");
});

fs.writeFileSync(arPath, content, 'utf8');
