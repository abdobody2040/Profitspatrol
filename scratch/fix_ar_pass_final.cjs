const fs = require('fs');

const arPath = 'src/locales/ar.ts';
let content = fs.readFileSync(arPath, 'utf8');

const t = {
    "What is Money?": "ما هو المال؟",
    "Before cash, how did people get what they needed?": "قبل النقد، كيف كان الناس يحصلون على ما يحتاجون إليه؟",
    "Trade complete! You swapped a goat for a game console. (Phew!)": "اكتمل التبادل! لقد استبدلت ماعزاً بجهاز ألعاب. (يا للهول!)",
    "By swapping items (Barter)": "عن طريق تبادل العناصر (المقايضة)",
    "By using credit cards": "باستخدام بطاقات الائتمان",
    "By fighting for it": "بالقتال من أجله",
    "By asking nicely": "بالطلب بلطف",
    "What is a Business?": "ما هو المشروع التجاري؟",
    "What is the main goal of a business?": "ما هو الهدف الرئيسي للمشروع التجاري؟",
    "Open for business! You set up your mini store and made your first sale.": "مفتوح للعمل! لقد أنشأت متجرك الصغير وقمت بأول عملية بيع.",
    "To provide goods or services for money": "تقديم سلع أو خدمات مقابل المال",
    "To sleep all day": "النوم طوال اليوم",
    "To hide toys from friends": "إخفاء الألعاب عن الأصدقاء",
    "To watch cartoons only": "مشاهدة الرسوم المتحركة فقط",
    "Next Day": "اليوم التالي",
    "Leave": "مغادرة",
    "Buy Ingredients": "شراء المكونات",
    "Check the weather forecast.": "تحقق من توقعات الطقس.",
    "Buy Lemons, Sugar, and Cups.": "اشترِ الليمون والسكر والأكواب.",
    "Set a price (Too high? No sales!)": "حدد السعر (مرتفع جداً؟ لا مبيعات!)",
    "Start the day and make profit!": "ابدأ اليوم وحقق الأرباح!",
    "Pitch your startup idea to the Titans!": "اعرض فكرة مشروعك على العمالقة!",
    "You missed the finance part!": "لقد فاتك الجزء المالي!",
    "Tips for Success": "نصائح للنجاح",
    "Speak clearly and confidently.": "تحدث بوضوح وثقة.",
    "Explain the problem you solve.": "اشرح المشكلة التي تحلها.",
    "Show how you make money.": "أظهر كيف تجني المال.",
    "Ask for what you need.": "اطلب ما تحتاجه.",
    "Congratulations!": "تهانينا!",
    "You secured funding!": "لقد حصلت على التمويل!",
    "No deal this time.": "لا اتفاق هذه المرة.",
    "Keep practicing!": "استمر في التدريب!",
    "Accept Offer": "قبول العرض",
    "Reject Offer": "رفض العرض",
    "Counter Offer": "عرض مضاد",
    "Views": "المشاهدات",
    "Assigned": "تم التعيين",
};

Object.keys(t).forEach(eng => {
    const escaped = eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('\\[AR-TODO\\]\\s*' + escaped, 'g');
    content = content.replace(regex, t[eng]);
});

// Manual block fixes for long text
content = content.replace(/lesson_MB_01_body:\s*['"].*?['"]/s, `lesson_MB_01_body: "تخيل أنك تحاول شراء بلايستيشن مقابل ماعز! 🐐 قبل وجود العملات، استخدم الناس **نظام المقايضة**. كان هذا يعني تبادل الأشياء التي لديك بالأشياء التي تحتاجها. 'سأعطيك دجاجتين مقابل ذلك الحذاء!' كان الأمر فوضوياً، ذا رائحة كريهة، وصاخباً جداً. تم اختراع المال لجعل التجارة أسهل بكثير!"`);
content = content.replace(/lesson_ENT_11_body:\s*['"].*?['"]/s, `lesson_ENT_11_body: "المشروع **التجاري** هو ببساطة فريق يحل المشكلات مقابل المال. هل أنت جائع؟ المطعم يحل ذلك! هل تشعر بالملل؟ شركة ألعاب الفيديو تحل ذلك! إذا كان بإمكانك حل مشكلة، يمكنك بدء مشروع تجاري."`);
content = content.replace(/tank_desc:\s*['"].*?['"]/s, `tank_desc: "اعرض أفكار عملك على حكامنا من الذكاء الاصطناعي، وفاوض على الشروط، واحصل على تمويل لشركتك الناشئة الافتراضية."`);
content = content.replace(/tankDesc:\s*['"].*?['"]/s, `tankDesc: "اعرض أفكار عملك على حكامنا من الذكاء الاصطناعي، وفاوض على الشروط، واحصل على تمويل لشركتك الناشئة الافتراضية."`);

fs.writeFileSync(arPath, content, 'utf8');
console.log('Final translation pass complete.');
