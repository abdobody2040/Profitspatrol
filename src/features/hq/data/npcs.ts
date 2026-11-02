import { NPCConfig, TimeOfDay, NPCLivingEmotion } from '../../../types';

export const NPC_CONFIGS: NPCConfig[] = [
    {
        id: 'npc_entrepreneur',
        nameEn: 'Tariq the Founder',
        nameAr: 'طارق رائد الأعمال',
        role: 'entrepreneur',
        arabicRole: 'رائد أعمال طموح',
        personality: 'Eager and inquisitive beginner',
        arabicPersonality: 'مبتدئ حريص ومحب للاستطلاع والتجربة',
        avatar: '🎒',
        defaultEmotion: 'growing',
        schedule: [
            {
                timeOfDay: 'morning',
                districtId: 'money',
                locationNameEn: 'Startup Street Lemonade Stand',
                locationNameAr: 'كشك الليموناضة في شارع الشركات الناشئة',
                activityEn: 'Testing recipe costs and pricing lemonade cups',
                activityAr: 'حساب تكلفة المكونات وتسعير أكواب الليموناضة'
            },
            {
                timeOfDay: 'afternoon',
                districtId: 'builders',
                locationNameEn: 'Maker Workshop',
                locationNameAr: 'ورشة صناع الأعمال',
                activityEn: 'Building prototype packaging for organic cookies',
                activityAr: 'تصميم عبوات تجريبية لبيع الكعك العضوي'
            },
            {
                timeOfDay: 'night',
                districtId: 'innovation',
                locationNameEn: 'Tech Incubator Cafe',
                locationNameAr: 'مقهى حاضنة التكنولوجيا',
                activityEn: 'Studying digital business models and bookkeeping apps',
                activityAr: 'دراسة نماذج الأعمال الرقمية وتطبيقات المحاسبة'
            }
        ],
        stateDialogues: {
            needs_help: {
                en: [
                    "Oh no! My lemonade supply costs doubled today! Can you help me rebalance my prices?",
                    "I forgot to factor in cup packaging costs! My net margin is currently negative!"
                ],
                ar: [
                    "يا للمفاجأة! ارتفعت تكاليف الليمون اليوم! هل تساعدني في إعادة ضبط أسعاري؟",
                    "لقد نسيت حساب تكلفة الأكواب الورقية! هامش ربحي الصافي بالسالب الآن!"
                ]
            },
            celebrating: {
                en: [
                    "We sold out all 50 lemonade cups before noon! Our gross profit hit a new high score!",
                    "Look at this ledger! Income exceeded expenses by 300%! Reinvesting time!"
                ],
                ar: [
                    "لقد نفدت جميع أكواب الليمون الـ 50 قبل الظهر! أرباحنا الإجمالية حققت رقماً قياسياً!",
                    "انظر إلى دفتر الحسابات! الدخل فاق المصاريف بنسبة 300%! حان وقت إعادة الاستثمار!"
                ]
            },
            worried: {
                en: [
                    "Rain is forecasted for Startup Street today... foot traffic might drop by 60%.",
                    "What if customers think my prices are too high? How do I explain my product's value?"
                ],
                ar: [
                    "تتوقع النشرة أمطاراً في شارع الشركات اليوم... قد تنخفض حركة المشاة بنسبة 60%.",
                    "ماذا لو اعتقد الزبائن أن أسعاري مرتفعة؟ كيف أشرح لهم القيمة المميزة لمنتجي؟"
                ]
            },
            growing: {
                en: [
                    "Every customer gave positive feedback! We are building loyal repeat buyers!",
                    "My spreadsheet is completely organized now thanks to Ollie's advice!"
                ],
                ar: [
                    "كل زبون زارنا اليوم أبدى إعجابه! نحن نبني قاعدة عملاء أوفياء ومستمرين!",
                    "جدول ميزانيتي أصبح منظماً بالكامل بفضل نصائح البومة أولي!"
                ]
            }
        },
        dialoguePool: {
            idle: [
                "I've got a brand new business idea! Let's sketch it down.",
                "Should we start with lemonade or cookies? What has better margins?",
                "Failures are just lessons in disguise, right Ollie?"
            ],
            advice: [
                "Always write down your costs before setting your selling price!",
                "Startup street is all about money basics. Make sure your income is higher than your costs!",
                "Reinvesting your initial profits helps your empire grow exponentially."
            ],
            questIntro: "Hey there! Can you help me budget my first project? Let's check my spreadsheet."
        },
        dialoguePoolAr: {
            idle: [
                "لدي فكرة مشروع تجاري جديدة تماماً! دعنا ندونها.",
                "هل نبدأ ببيع الليموناضة أم الكعك؟ أيهما يحقق هوامش ربح أفضل؟",
                "الفشل هو مجرد دروس متنكرة في زي آخر، أليس كذلك يا أولي؟"
            ],
            advice: [
                "اكتب دائماً تكاليفك بالكامل قبل تحديد سعر البيع!",
                "شارع الشركات الناشئة يدور حول أساسيات المال. تأكد من أن دخلك أعلى من تكاليفك!",
                "إعادة استثمار أرباحك الأولية يساعد إمبراطوريتك على النمو بشكل مضاعف."
            ],
            questIntro: "مرحباً بك! هل يمكنك مساعدتي في وضع ميزانية لمشروعي الأول؟ دعنا نتحقق من جدول البيانات الخاص بي."
        },
        quest: {
            id: 'qst_budget_sheet',
            title: "Entrepreneur's First Budget",
            titleAr: "ميزانية رائد الأعمال الأولى",
            description: "Review costs and calculate net profit for the lemonade stand.",
            descriptionAr: "راجع التكاليف واحسب صافي الربح لكشك الليموناضة.",
            requirementText: "Complete 'Money Basics' lessons & earn 100 P Tokens",
            requirementTextAr: "أكمل دروس 'أساسيات المال' واجمع 100 من رموز PP",
            rewardText: "Starter Wallet Pack (+100 Tokens, +50 XP)",
            rewardTextAr: "حزمة محفظة المبتدئين (+100 رمز، +50 XP)",
            rewardTokens: 100,
            rewardXp: 50
        }
    },
    {
        id: 'npc_marketer',
        nameEn: 'Laila the Brand Guru',
        nameAr: 'ليلى خبيرة التسويق',
        role: 'marketer',
        arabicRole: 'خبيرة العلامات التجارية',
        personality: 'High-energy brand guru',
        arabicPersonality: 'مفعمة بالحيوية والابتكار الإعلاني',
        avatar: '📣',
        defaultEmotion: 'happy',
        schedule: [
            {
                timeOfDay: 'morning',
                districtId: 'builders',
                locationNameEn: 'Food Truck Avenue Social Stage',
                locationNameAr: 'منصة شارع عربات الطعام الترويجية',
                activityEn: 'Filming a viral 15-second teaser for the Artisan Burger truck',
                activityAr: 'تصوير فيديو ترويجي قصير ومبتكر لعربة البرجر الحرفي'
            },
            {
                timeOfDay: 'afternoon',
                districtId: 'launch',
                locationNameEn: 'Metropolitan Media Hub',
                locationNameAr: 'مركز الإعلام والوسائط المتروبوليتاني',
                activityEn: 'Analyzing customer click rates and storytelling sentiment',
                activityAr: 'تحليل معدلات نقر الجمهور وتأثير القصة الإعلانية'
            },
            {
                timeOfDay: 'night',
                districtId: 'money',
                locationNameEn: 'Neon Boardwalk',
                locationNameAr: 'ممشى النيون التجاري',
                activityEn: 'Observing evening window shoppers and billboard readability',
                activityAr: 'مراقبة تجربة تسوق المارة ووضوح اللوحات الإعلانية'
            }
        ],
        stateDialogues: {
            needs_help: {
                en: [
                    "Our slogan sounds too generic! Can you help me write an authentic hook that touches hearts?",
                    "People are scrolling past our post without stopping! We need visual storytelling magic!"
                ],
                ar: [
                    "شعارنا يبدو عادياً جداً! هل تساعدني في كتابة عبارة تسويقية تلامس قلوب الزبائن؟",
                    "الناس يتصفحون دون توقف! نحتاج إلى سحر السرد القصصي البصري!"
                ]
            },
            celebrating: {
                en: [
                    "Our food truck campaign went viral! Over 1,000 visitors queued up across the block!",
                    "Word of mouth is exploding! Customers are tagging their friends without us paying for ads!"
                ],
                ar: [
                    "حملة عربة الطعام انتشرت في كل مكان! أكثر من 1,000 زائر يقفون في الطابور الآن!",
                    "التسويق الشفهي ينفجر! العملاء ينصحون أصدقاءهم بحماس دون الحاجة لإعلانات مدفوعة!"
                ]
            },
            busy: {
                en: [
                    "Setting up the cameras for the Grand Opening livestream! Keep the samples coming!",
                    "Testing three different logo color schemes to see which one builds trust quickest."
                ],
                ar: [
                    "أجهز الكاميرات للبث المباشر للافتتاح الكبير! واصلوا تجهيز عينات التذوق!",
                    "أختبر ثلاثة تدرجات ألوان للشعار لمعرفة أيها يبني ثقة أسرع لدى العميل."
                ]
            }
        },
        dialoguePool: {
            idle: [
                "Make it viral! If they don't know you, they can't buy from you!",
                "Branding is what people say about you when you're not in the room.",
                "Let's launch a social campaign for Food Truck Avenue!"
            ],
            advice: [
                "A good logo should be simple, memorable, and explain your core value.",
                "Don't just sell features; sell the feeling and the benefit to the customer!",
                "Word of mouth is the cheapest and most powerful marketing tool in the world."
            ],
            questIntro: "We need a viral slogan for our Burger Truck! Let's build a social pitch."
        },
        dialoguePoolAr: {
            idle: [
                "اجعل مشروعك ينتشر كالنار في الهشيم! إذا لم يعرفك الناس، فلن يشتروا منك!",
                "العلامة التجارية هي ما يقوله الناس عنك عندما لا تكون في الغرفة.",
                "دعنا نطلق حملة اجتماعية لشارع عربات الطعام!"
            ],
            advice: [
                "يجب أن يكون الشعار الجيد بسيطاً وسهل التذكر ويوضح قيمتك الأساسية.",
                "لا تبع الميزات فقط؛ بل بع الشعور والفائدة التي تعود على العميل!",
                "التسويق الشفهي (توصية العملاء لبعضهم) هو الأرخص والأقوى في العالم."
            ],
            questIntro: "نحتاج إلى شعار جذاب لعربة البرجر الخاصة بنا! دعنا ننشئ عرضاً تسويقياً اجتماعياً."
        },
        quest: {
            id: 'qst_burger_pitch',
            title: "Burger Truck Viral Campaign",
            titleAr: "حملة عربة البرجر الترويجية",
            description: "Construct a catchphrase that highlights organic inputs and fast service.",
            descriptionAr: "صمم شعاراً تسويقياً يسلط الضوء على المكونات العضوية والخدمة السريعة.",
            requirementText: "Complete 'Marketing' lessons & unlock Food Truck Avenue",
            requirementTextAr: "أكمل دروس 'التسويق' وافتح شارع عربات الطعام",
            rewardText: "Marketing Box (+150 Tokens, +80 XP)",
            rewardTextAr: "صندوق التسويق (+150 رمز، +80 XP)",
            rewardTokens: 150,
            rewardXp: 80
        }
    },
    {
        id: 'npc_driver',
        nameEn: 'Captain Sami Logistics',
        nameAr: 'كابتن سامي للوجستيات',
        role: 'driver',
        arabicRole: 'خبير اللوجستيات والتوريد',
        personality: 'Practical and logistics-oriented driver',
        arabicPersonality: 'عملي، دقيق، ومهتم بالكفاءة وسرعة الوصول',
        avatar: '🚚',
        defaultEmotion: 'busy',
        schedule: [
            {
                timeOfDay: 'morning',
                districtId: 'operations',
                locationNameEn: 'Central Freight Docks',
                locationNameAr: 'أرصفة الشحن المركزية',
                activityEn: 'Inspecting cargo manifests and loading perishable goods',
                activityAr: 'فحص قوائم الشحن وتحميل البضائع السريعة التلف'
            },
            {
                timeOfDay: 'afternoon',
                districtId: 'money',
                locationNameEn: 'Retail Town Depot',
                locationNameAr: 'مستودع بلدة التجزئة',
                activityEn: 'Unloading wholesale batches for local storefronts',
                activityAr: 'تفريغ دفعات الجملة لتوزيعها على المتاجر المحلية'
            },
            {
                timeOfDay: 'night',
                districtId: 'builders',
                locationNameEn: 'Fleet Maintenance Hub',
                locationNameAr: 'مركز صيانة أسطول الشاحنات',
                activityEn: 'Checking vehicle tires and calculating optimal fuel routes',
                activityAr: 'فحص إطارات الشاحنات وحساب أفضل مسارات استهلاك الوقود'
            }
        ],
        stateDialogues: {
            needs_help: {
                en: [
                    "A roadblock on Express Way 4! All deliveries to the Retail Boutiques are stalled!",
                    "My inventory spreadsheet doesn't match the cargo count! 10 crates are unaccounted for!"
                ],
                ar: [
                    "إغلاق مروري على الطريق السريع 4! كل الشحنات لبلدة التجزئة مهددة بالتأخير!",
                    "جدول المخزون لا يطابق الحمولة الفعلية! هناك 10 صناديق لم يتم توثيق مسارها!"
                ]
            },
            celebrating: {
                en: [
                    "100% on-time delivery record achieved this week! Zero spoilage, zero damaged boxes!",
                    "Optimized the cross-district route and saved 35% on fuel costs! Pure efficiency!"
                ],
                ar: [
                    "حققنا نسبة التزام بالمواعيد 100% هذا الأسبوع! صفر تلف وصفر خسائر!",
                    "حسّنا المسار بين الأحياء ووفرنا 35% من تكاليف الوقود! قمة الكفاءة التشغيلية!"
                ]
            },
            busy: {
                en: [
                    "Hold on, let me sign this shipping manifest! 40 boxes of Kami's prototypes arriving!",
                    "Gotta keep the supply chain moving smoothly—retailers rely on our precision!"
                ],
                ar: [
                    "انتظر دقيقة لأوقع بوليصة الشحن! 40 صندوقاً من نماذج كيمي الأولية في طريقها إلينا!",
                    "سلاسل الإمداد لا تحتمل التوقف—أصحاب المتاجر يعتمدون على دقة مواعيدنا!"
                ]
            }
        },
        dialoguePool: {
            idle: [
                "Stock is loaded! Ready to ship across Retail Town.",
                "Logistics runs the world. If delivery is late, the sale is lost.",
                "Fast shipping = happy customers!"
            ],
            advice: [
                "Always optimize your delivery routes to save on fuel and time costs.",
                "Keep a buffer stock of inventory so you don't run out when demand spikes.",
                "Customer satisfaction depends heavily on the condition of the delivered goods."
            ],
            questIntro: "I've got a massive shipment of toys to deliver to the Toy Boutique!"
        },
        dialoguePoolAr: {
            idle: [
                "المخزون محمل! جاهز للشحن عبر بلدة التجزئة.",
                "اللوجستيات تدير العالم. إذا تأخر التوصيل، فستخسر البيعة.",
                "شحن سريع = عملاء سعداء!"
            ],
            advice: [
                "احرص دائماً على تحسين مسارات التوصيل لتوفير تكاليف الوقود والوقت.",
                "احتفظ بمخزون احتياطي حتى لا ينفد عند ارتفاع الطلب المفاجئ.",
                "رضا العملاء يعتمد بشكل كبير على حالة البضائع المسلمة."
            ],
            questIntro: "لدي شحنة ضخمة من الألعاب لتوصيلها إلى متجر الألعاب!"
        },
        quest: {
            id: 'qst_route_opt',
            title: "Logistics Route Optimization",
            titleAr: "تحسين مسار اللوجستيات",
            description: "Solve a shortest-path problem to deliver cargo with minimum energy.",
            descriptionAr: "حل مشكلة أقصر مسار لتوصيل الحمولة بأقل استهلاك للطاقة.",
            requirementText: "Complete 'Operations' modules & manage inventory",
            requirementTextAr: "أكمل وحدات 'العمليات' وأدر مخزونك بذكاء",
            rewardText: "Driver's Bonus (+120 Tokens, +60 XP)",
            rewardTextAr: "مكافأة السائق (+120 رمز، +60 XP)",
            rewardTokens: 120,
            rewardXp: 60
        }
    },
    {
        id: 'npc_investor',
        nameEn: 'Farouk the Harbor Investor',
        nameAr: 'فاروق مستثمر المرفأ',
        role: 'investor',
        arabicRole: 'مستثمر ومحلل أصول',
        personality: 'Wise, analytical, risk-aware manager',
        arabicPersonality: 'حكيم، تحليلي، وخبير في حساب المخاطر والعوائد',
        avatar: '💼',
        defaultEmotion: 'worried',
        schedule: [
            {
                timeOfDay: 'morning',
                districtId: 'risk',
                locationNameEn: 'Financial Exchange Floor',
                locationNameAr: 'قاعة بورصة حي الثروة والمخاطر',
                activityEn: 'Analyzing asset yields and compound interest dividend rates',
                activityAr: 'تحليل عوائد الأصول ومعدلات توزيعات الأرباح المركبة'
            },
            {
                timeOfDay: 'afternoon',
                districtId: 'strategy',
                locationNameEn: 'Skyline Capital Tower',
                locationNameAr: 'برج كابيتال في حي الاستراتيجية',
                activityEn: 'Screening startup pitches for sustainable competitive moats',
                activityAr: 'فحص عروض المشاريع الناشئة والبحث عن حصون تنافسية متينة'
            },
            {
                timeOfDay: 'night',
                districtId: 'operations',
                locationNameEn: 'Harbor Lighthouse Club',
                locationNameAr: 'نادي منارة المرفأ الاستثماري',
                activityEn: 'Reviewing real estate portfolios and macro-economic trends',
                activityAr: 'مراجعة المحافظ العقارية والاتجاهات الاقتصادية الكلية'
            }
        ],
        stateDialogues: {
            needs_help: {
                en: [
                    "A suspicious syndicate is offering guaranteed 200% daily returns! We must educate young founders!",
                    "The bond yields inverted! We need to adjust our emergency cash reserves immediately!"
                ],
                ar: [
                    "هناك جهة مجهولة تعد بأرباح خيالية 200% يومياً! يجب أن نوعي رواد الأعمال الصغار ضد هذا الاحتيال!",
                    "تذبذبت أسواق العوائد! نحتاج إلى تعزيز احتياطي الطوارئ النقدي فوراً!"
                ]
            },
            celebrating: {
                en: [
                    "Our diversified index fund just paid out another quarterly dividend! The magic of compounding!",
                    "By sticking to sound risk management, our portfolio safely weathered the market dip!"
                ],
                ar: [
                    "صندوق المؤشرات المتنوع وزع أرباحه الفصلية للتو! هذا هو سحر النمو المركب!",
                    "بالتمسك بإدارة المخاطر الحكيمة، حافظت محفظتنا على استقرارها رغم تقلبات السوق!"
                ]
            },
            worried: {
                en: [
                    "Too many beginner founders are putting 100% of their cash into a single volatile asset...",
                    "Inflation is running high—idle money in cash jars is silently losing its purchasing power."
                ],
                ar: [
                    "الكثير من المبتدئين يضعون كل أموالهم في أصل واحد متقلب دون أي تنويع...",
                    "التضخم مرتفع—النقود الراكدة في الصناديق تفقد قوتها الشرائية بصمت إن لم تُستثمر."
                ]
            }
        },
        dialoguePool: {
            idle: [
                "Show me the numbers. Let's look at the compound growth projections.",
                "High returns always come with risk. What is your mitigation plan?",
                "Passive cash flow is the ultimate goal of an empire builder."
            ],
            advice: [
                "Compound interest is the eighth wonder of the world. Start investing early!",
                "Never put all your eggs in one basket. Diversify across real estate, stocks, and crypto.",
                "Inflation reduces the purchasing power of idle cash. Keep your money working!"
            ],
            questIntro: "I am evaluating a high-yield real estate fund. Want to review the asset yields?"
        },
        dialoguePoolAr: {
            idle: [
                "أرني الأرقام. دعنا نلقي نظرة على توقعات النمو المركب.",
                "العوائد المرتفعة تأتي دائماً مع المخاطر. ما هي خطتك للتخفيف منها؟",
                "التدفق النقدي السلبي هو الهدف النهائي لبناء الإمبراطورية."
            ],
            advice: [
                "الفائدة المركبة هي الأعجوبة الثامنة في العالم. ابدأ الاستثمار مبكراً!",
                "لا تضع كل البيض في سلة واحدة. نوّع بين العقارات، الأسهم، والعملات الرقمية.",
                "التضخم يقلل من القوة الشرائية للنقد الخامل. اجعل أموالك تعمل دائماً!"
            ],
            questIntro: "أقوم بتقييم صندوق عقاري عالي العائد. هل تريد مراجعة عوائد الأصول؟"
        },
        quest: {
            id: 'qst_real_estate_valuation',
            title: "Harbor Real Estate Pitch",
            titleAr: "تقييم عقارات المرفأ",
            description: "Analyze cash-on-cash return for an apartment complex in Investment Harbor.",
            descriptionAr: "حلل العائد النقدي لمجمع سكني في مرفأ الاستثمار.",
            requirementText: "Complete 'Risk & Wealth' lessons & earn 200 P Tokens",
            requirementTextAr: "أكمل دروس 'الثروة والمخاطر' واجمع 200 رمز PP",
            rewardText: "Investor Pack (+250 Tokens, +100 XP)",
            rewardTextAr: "حزمة المستثمر (+250 رمز، +100 XP)",
            rewardTokens: 250,
            rewardXp: 100
        }
    },
    {
        id: 'npc_ceo',
        nameEn: 'Nadia the Chief Executive',
        nameAr: 'نادية الرئيسة التنفيذية',
        role: 'ceo',
        arabicRole: 'قائدة تنفيذية ملهمة',
        personality: 'Visionary and inspiring chief leader',
        arabicPersonality: 'قائدة ملهمة، ذات نظرة استراتيجية عالمية',
        avatar: '🦁',
        defaultEmotion: 'celebrating',
        schedule: [
            {
                timeOfDay: 'morning',
                districtId: 'leadership',
                locationNameEn: 'Executive Boardroom',
                locationNameAr: 'قاعة الاجتماعات التنفيذية بحي القيادة',
                activityEn: 'Aligning department roadmaps and mentoring junior managers',
                activityAr: 'موائمة خطط الأقسام وتدريب مديري الفرق الجدد'
            },
            {
                timeOfDay: 'afternoon',
                districtId: 'strategy',
                locationNameEn: 'Strategic Alliances Atrium',
                locationNameAr: 'بهو التحالفات الاستراتيجية',
                activityEn: 'Negotiating sustainable trade agreements and joint ventures',
                activityAr: 'التفاوض حول شراكات تجارية مستدامة ومشاريع مشتركة'
            },
            {
                timeOfDay: 'night',
                districtId: 'launch',
                locationNameEn: 'Global Vision Observatory',
                locationNameAr: 'مرصد الرؤية العالمية بحي الانطلاق',
                activityEn: 'Evaluating global market reach and corporate social responsibility',
                activityAr: 'تقييم التوسع في الأسواق الدولية والمسؤولية الاجتماعية للمؤسسة'
            }
        ],
        stateDialogues: {
            needs_help: {
                en: [
                    "Two of our best team leads have conflicting product roadmaps. Can you help mediate a win-win resolution?",
                    "We need to present our sustainability audit to shareholders, but our packaging data is incomplete!"
                ],
                ar: [
                    "هناك تضارب في وجهات النظر بين قادة الفرق. هل تساعدنا في صياغة حل تفاوضي يكسب فيه الجميع؟",
                    "نستعد لعرض تقرير الاستدامة على المساهمين، لكننا بحاجة لتدقيق بيانات التغليف الصديق للبيئة!"
                ]
            },
            celebrating: {
                en: [
                    "Our company was ranked #1 in ethical leadership and employee happiness this quarter!",
                    "ProfitsPatrol enterprises just crossed 10,000 satisfied community members! Congratulations, CEO!"
                ],
                ar: [
                    "مؤسستنا حققت المركز الأول في القيادة الأخلاقية وسعادة فريق العمل هذا الربع!",
                    "مشاريع ProfitsPatrol تجاوزت حاجز 10,000 عميل سعيد ومستفيد! أهنئك أيها القائد الواعد!"
                ]
            },
            growing: {
                en: [
                    "True leadership isn't about giving orders; it's about unlocking the brilliance of your team.",
                    "Look at the progress in every district—our collective vision is shaping a brighter future!"
                ],
                ar: [
                    "القيادة الحقيقية ليست بإعطاء الأوامر، بل في إطلاق العنان لإبداع وتميز فريقك.",
                    "انظر إلى التطور في كل حي—رؤيتنا المشتركة تبني مستقبلاً مزدهراً ومستداماً!"
                ]
            }
        },
        dialoguePool: {
            idle: [
                "Management is doing things right; leadership is doing the right things.",
                "Let's align our corporate strategies and global partnerships.",
                "Our vision maps the future of ProfitsPatrol!"
            ],
            advice: [
                "To scale, you must delegate. Trust your managers but verify their performance reports.",
                "A great company has a clear mission that goes beyond just making money.",
                "Global trade requires cultural awareness and adaptive pricing mechanisms."
            ],
            questIntro: "We are preparing for our annual shareholder meeting at the Corporate HQ!"
        },
        dialoguePoolAr: {
            idle: [
                "الإدارة هي أداء الأشياء بشكل صحيح؛ أما القيادة فهي فعل الأشياء الصحيحة.",
                "دعنا نوائم استراتيجيات شركاتنا وشراكاتنا العالمية.",
                "رؤيتنا ترسم مسار مستقبل ProfitsPatrol!"
            ],
            advice: [
                "لكي تتوسع، يجب أن تفوض. ثق بمديريك ولكن راجع تقارير أدائهم بانتظام.",
                "الشركة العظيمة لديها رسالة واضحة تتجاوز مجرد كسب المال.",
                "تتطلب التجارة العالمية وعياً ثقافياً وآليات تسعير مرنة."
            ],
            questIntro: "نحن نستعد لاجتماع المساهمين السنوي في مقر الشركة الرئيسي!"
        },
        quest: {
            id: 'qst_shareholder_meeting',
            title: "Corporate Shareholder Pitch",
            titleAr: "عرض للمساهمين في الشركة",
            description: "Design a slide deck defending your carbon-neutral global trade initiative.",
            descriptionAr: "صمم عرضاً تقديمياً تدافع فيه عن مبادرتك التجارية العالمية المحايدة للكربون.",
            requirementText: "Complete 'Leadership' modules & reach Level 5+",
            requirementTextAr: "أكمل وحدات 'القيادة' وبلغ المستوى 5 فما فوق",
            rewardText: "Executive Suite Case (+400 Tokens, +200 XP)",
            rewardTextAr: "حقيبة الجناح التنفيذي (+400 رمز، +200 XP)",
            rewardTokens: 400,
            rewardXp: 200
        }
    }
];

/**
 * Calculates current time of day based on current hour (0-23)
 */
export function getTimeOfDay(hour: number = new Date().getHours()): TimeOfDay {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'night';
}

/**
 * Find all NPCs located in a specific district for a given time of day.
 */
export function getNPCsByDistrictAndTime(districtId: string, timeOfDay: TimeOfDay): NPCConfig[] {
    return NPC_CONFIGS.filter(npc => 
        npc.schedule?.some(s => s.districtId === districtId && s.timeOfDay === timeOfDay)
    );
}

/**
 * Find NPC by unique ID
 */
export function getNPCById(id: string): NPCConfig | undefined {
    return NPC_CONFIGS.find(npc => npc.id === id);
}
