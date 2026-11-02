const fs = require('fs');
const path = require('path');

// 1. Update src/locales/ar/teacher.ts
const teacherLocalePath = path.resolve('src/locales/ar/teacher.ts');
let teacherLocale = fs.readFileSync(teacherLocalePath, 'utf8');

const teacherExtraKeys = `  create_class_modal_title: 'إنشاء فصل دراسي جديد',
  create_class_modal_desc: 'أدخل تفاصيل الفصل لتمكين الطلاب من الانضمام وبدء التحديات والمهام.',
  class_name_label: 'اسم الفصل',
  class_name_placeholder: 'مثال: رواد أعمال الصف السادس - أ',
  class_code_label: 'رمز الفصل (6 خانات)',
  generate_new_code: 'توليد رمز جديد',
  create_class_btn: 'إنشاء الفصل الدراسي',
  cancel: 'إلغاء',
  class_created_success: 'تم إنشاء الفصل الدراسي بنجاح!',
  new_class_button: '+ إنشاء فصل جديد',
  select_class: 'اختر الفصل:',
};`;

teacherLocale = teacherLocale.replace(/\};\s*$/, teacherExtraKeys);
fs.writeFileSync(teacherLocalePath, teacherLocale, 'utf8');
console.log('ar/teacher.ts updated');

// 2. Update src/locales/ar/assignments.ts
const assignLocalePath = path.resolve('src/locales/ar/assignments.ts');
let assignLocale = fs.readFileSync(assignLocalePath, 'utf8');

const assignExtraKeys = `  tab_daily: 'المهام اليومية وعقود الأحياء',
  tab_classroom: 'مهام الفصل الدراسي',
  join_class_button: 'انضم إلى فصل',
  switch_class_button: 'تبديل الفصل',
  no_class_card_title: 'لم تنضم إلى فصل مدرسي بعد',
  no_class_card_desc: 'أدخل رمز الفصل الدراسي المكون من 6 خانات الذي زودك به معلمك للوصول إلى مهام وواجبات الفصل.',
  enter_code_cta: 'إدخال رمز الفصل والانضمام',
};`;

assignLocale = assignLocale.replace(/\};\s*$/, assignExtraKeys);
fs.writeFileSync(assignLocalePath, assignLocale, 'utf8');
console.log('ar/assignments.ts updated');
