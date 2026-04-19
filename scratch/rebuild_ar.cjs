const fs = require('fs');

const enPath = 'src/locales/en.ts';
const arPath = 'src/locales/ar.ts';

const enContent = fs.readFileSync(enPath, 'utf8');

// A map of known translations to inject during the rebuild
const t = {
    "Adventure Map": "خريطة المغامرة",
    "Assignments": "الواجبات",
    "Arcade": "الألعاب",
    "Library": "المكتبة",
    "Headquarters": "المقر الرئيسي",
    "MBA Skills": "مهارات الإدارة",
    "Portfolio": "المحفظة الاستثمارية",
    "Biz Store": "متجر الأعمال",
    "Leaderboard": "لائحة المتصدرين",
    "My Profile": "ملفي الشخصي",
    "Sign Out": "تسجيل الخروج",
    "Teacher Mode": "وضع المعلم",
    "Admin Console": "وضع المسؤول",
    "Overview": "نظرة عامة",
    "Classroom": "الفصل الدراسي",
    "Admin Dashboard": "لوحة تحكم المسؤول",
    "Learn": "تعلم",
    "My Empire": "إمبراطوريتي",
    "My Venture": "مشاريعي",
    "Social": "اجتماعي",
    "Social Hub": "المركز الاجتماعي",
    "Features": "المميزات",
    "Curriculum": "المناهج",
    "Pricing": "الأسعار",
    "Start Free": "ابدأ مجاناً",
    "For Parents": "لأولياء الأمور",
    "Debate Dojo": "ساحة النقاش",
    "Videos": "الفيديوهات",
    "Gig Central": "مركز الأعمال الحرة",
    "Real Estate": "العقارات",
    "Profits Patrol": "بروفيتس باترول",
    "Log In": "تسجيل الدخول",
    "Create Account": "إنشاء حساب",
    "Username": "اسم المستخدم",
    "Password": "كلمة المرور",
    "Enter username": "أدخل اسم المستخدم",
    "Enter password": "أدخل كلمة المرور",
    "Full Name": "الاسم الكامل",
    "Your Name": "اسمك",
    "Who is using this account?": "من يستخدم هذا الحساب؟",
    "I'm a Kid": "أنا طفل",
    "Ready to build a business!": "جاهز لبناء مشروعي!",
    "I'm a Parent": "أنا ولي أمر",
    "View progress & settings": "عرض التقدم والإعدادات",
    "I'm a Teacher": "أنا معلم",
    "Manage classroom & students": "إدارة الفصل والطلاب",
    "Back to Roles": "العودة للأدوار",
    "I agree to the Terms of Service & Privacy Policy": "أوافق على شروط الخدمة وسياسة الخصوصية",
    "You must agree to the Terms & Privacy Policy to continue.": "يجب عليك الموافقة على الشروط والخصوصية للمتابعة.",
    "Invalid username or password": "اسم المستخدم أو كلمة المرور غير صحيحة",
    "Invite Code (Optional)": "رمز الدعوة (اختياري)",
    "8+ Characters": "8 أحرف أو أكثر",
    "Number or Symbol": "رقم أو رمز",
    "All fields are required": "جميع الحقول مطلوبة",
    "Email": "البريد الإلكتروني",
    "Enter your email": "أدخل بريدك الإلكتروني",
    "Username or Email": "اسم المستخدم أو البريد الإلكتروني",
    "Sign in with Google": "تسجيل الدخول باستخدام جوجل",
    "Sign up with Google": "إنشاء حساب باستخدام جوجل",
    "OR": "أو",
    "What is Money?": "ما هو المال؟",
    "What is a Business?": "ما هو المشروع التجاري؟",
    "Next Day": "اليوم التالي",
    "Leave": "مغادرة",
    "Buy Ingredients": "شراء المكونات",
    "Check the weather forecast.": "تحقق من توقعات الطقس.",
    "Buy Lemons, Sugar, and Cups.": "اشترِ الليمون والسكر والأكواب.",
    "Set a price (Too high? No sales!)": "حدد السعر (مرتفع جداً؟ لا مبيعات!)",
    "Start the day and make profit!": "ابدأ اليوم وحقق الأرباح!",
    "Success!": "نجاح!",
    "Mission Failed": "فشلت المهمة",
    "Earned": "ربحت",
    "XP": "XP",
    "Start Challenge": "ابدأ التحدي",
    "Next Unit": "الوحدة التالية",
    "Next Lesson": "الدرس التالي",
    "Retry": "إعادة المحاولة",
    "Mission Complete": "اكتملت المهمة",
    "All": "الكل",
    "Lvl": "مستوى",
    "Easy": "سهل",
    "Medium": "متوسط",
    "Hard": "صعب",
    "Play Now": "العب الآن",
    "LOCKED": "مغلق",
    "PREMIUM ONLY": "للمشتركين فقط",
    "TYCOON ONLY": "للتايكون فقط",
    "Upgrade to Unlock": "اشترك للفتح",
    "NEW": "جديد",
    "Accept Deal": "قبول العرض",
    "Reject Offer": "رفض العرض",
    "Counter Offer": "عرض مضاد",
    "Walk Away": "مغادرة",
    "DEAL!": "تم الاتفاق!",
    "REJECTED": "مرفوض",
    "Try Again": "حاول مرة أخرى",
    "Congratulations!": "تهانينا!",
    "You secured funding!": "لقد حصلت على التمويل!",
    "No deal this time.": "لا اتفاق هذه المرة.",
    "Keep practicing!": "استمر في التدريب!",
    "Views": "المشاهدات",
    "Assigned": "تم التعيين",
};

// Process the content
let arContent = enContent.replace('export const en = {', 'export const ar = {');

// Simple regex to replace leaf values while preserving structure
// Match: key: 'Value',
arContent = arContent.replace(/:\s*['"](.*?)['"]/g, (match, value) => {
    if (t[value]) {
        return `: '${t[value]}'`;
    }
    // If not in map, wrap with [AR-TODO] and keep English if it's likely a sentence
    if (value.length > 0 && !value.includes('{{') && !value.startsWith('MOD_')) {
        return `: '[AR-TODO] ${value}'`;
    }
    return match;
});

// Fix the multi-line backtick blocks manually for lessons
const lessons = {
    "lesson_MB_01_body": "تخيل أنك تحاول شراء بلايستيشن مقابل ماعز! 🐐 قبل وجود العملات، استخدم الناس **نظام المقايضة**. كان هذا يعني تبادل الأشياء التي لديك بالأشياء التي تحتاجها. 'سأعطيك دجاجتين مقابل ذلك الحذاء!' كان الأمر فوضوياً، ذا رائحة كريهة، وصاخباً جداً. تم اختراع المال لجعل التجارة أسهل بكثير!",
    "lesson_ENT_11_body": "المشروع **التجاري** هو ببساطة فريق يحل المشكلات مقابل المال. هل أنت جائع؟ المطعم يحل ذلك! هل تشعر بالملل؟ شركة ألعاب الفيديو تحل ذلك! إذا كان بإمكانك حل مشكلة، يمكنك بدء مشروع تجاري."
};

Object.keys(lessons).forEach(key => {
    const regex = new RegExp(`${key}:\\s*[\`'"](.*?)['\"\`]`, 's');
    arContent = arContent.replace(regex, `${key}: "${lessons[key]}"`);
});

fs.writeFileSync(arPath, arContent, 'utf8');
console.log('Rebuilt ar.ts from en.ts template.');
