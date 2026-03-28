export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
}

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
    hustle_pet_sitter: [
        {
            question: "How often should you feed a dog?",
            options: ["Once a day", "Twice a day", "Three times a day", "Whenever they want"],
            correctIndex: 1
        },
        {
            question: "What should you do if a cat is hissing?",
            options: ["Pet it more", "Give it space", "Yell at it", "Pick it up"],
            correctIndex: 1
        },
        {
            question: "How much water should pets have?",
            options: ["Only at meals", "Fresh water always", "Once a day", "No water needed"],
            correctIndex: 1
        },
        {
            question: "What's a sign a pet is sick?",
            options: ["Playing", "Eating well", "Not eating", "Sleeping normally"],
            correctIndex: 2
        },
        {
            question: "Should you give pets chocolate?",
            options: ["Yes, as a treat", "No, it's toxic", "Only dark chocolate", "Only on weekends"],
            correctIndex: 1
        },
        {
            question: "How do you know a dog wants to play?",
            options: ["It growls deeply", "It wags its tail and bows", "It runs away", "It sleeps"],
            correctIndex: 1
        },
        {
            question: "What food is unsafe for cats?",
            options: ["Chicken", "Onions", "Tuna", "Salmon"],
            correctIndex: 1
        }
    ],
    hustle_tutor_helper: [
        {
            question: "What is 7 × 8?",
            options: ["54", "56", "64", "48"],
            correctIndex: 1
        },
        {
            question: "Which word is spelled correctly?",
            options: ["Recieve", "Receive", "Recive", "Receeve"],
            correctIndex: 1
        },
        {
            question: "What is 15 + 27?",
            options: ["42", "41", "43", "40"],
            correctIndex: 0
        },
        {
            question: "What is the capital of France?",
            options: ["London", "Paris", "Berlin", "Rome"],
            correctIndex: 1
        },
        {
            question: "How many sides does a hexagon have?",
            options: ["5", "6", "7", "8"],
            correctIndex: 1
        },
        {
            question: "What is 144 ÷ 12?",
            options: ["10", "11", "12", "13"],
            correctIndex: 2
        },
        {
            question: "Which is the largest ocean?",
            options: ["Atlantic", "Indian", "Pacific", "Arctic"],
            correctIndex: 2
        },
        {
            question: "What gas do plants absorb from the air?",
            options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
            correctIndex: 2
        }
    ],
    hustle_coding_tutor: [
        {
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
            correctIndex: 0
        },
        {
            question: "Which symbol starts a comment in JavaScript?",
            options: ["#", "//", "/*", "<!--"],
            correctIndex: 1
        },
        {
            question: "What is a variable?",
            options: ["A fixed number", "A container for data", "A type of loop", "A function"],
            correctIndex: 1
        },
        {
            question: "What does CSS stand for?",
            options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"],
            correctIndex: 1
        },
        {
            question: "What is a loop used for?",
            options: ["Storing data", "Repeating code", "Creating variables", "Styling pages"],
            correctIndex: 1
        },
        {
            question: "Which of these is a programming language?",
            options: ["Google", "Python", "Excel", "Chrome"],
            correctIndex: 1
        },
        {
            question: "What does 'if' do in coding?",
            options: ["Repeats code", "Makes a decision", "Defines a variable", "Ends a program"],
            correctIndex: 1
        },
        {
            question: "What is a function?",
            options: ["A type of number", "Reusable block of code", "A browser feature", "A color setting"],
            correctIndex: 1
        }
    ],
    hustle_tech_support: [
        {
            question: "What does 'restarting' a computer usually fix?",
            options: ["Hardware damage", "Software glitches", "Broken screens", "Nothing"],
            correctIndex: 1
        },
        {
            question: "What does Wi-Fi stand for?",
            options: ["Wireless Fidelity", "Wide Frequency", "Wireless Fiber", "Web Integration"],
            correctIndex: 0
        },
        {
            question: "Which is stronger: 5G or 4G?",
            options: ["4G", "They're the same", "5G", "It depends on the phone"],
            correctIndex: 2
        },
        {
            question: "What is a virus on a computer?",
            options: ["A type of browser", "Harmful software", "A computer part", "A kind of app"],
            correctIndex: 1
        },
        {
            question: "What should you do if a website looks suspicious?",
            options: ["Click all links", "Close it immediately", "Enter your password", "Download a file"],
            correctIndex: 1
        },
        {
            question: "What is RAM used for?",
            options: ["Storing photos permanently", "Running apps temporarily", "Connecting to internet", "Printing files"],
            correctIndex: 1
        },
        {
            question: "How do you protect your accounts online?",
            options: ["Share your password", "Use a strong unique password", "Use '12345'", "Never log out"],
            correctIndex: 1
        }
    ],
    hustle_bike_repair: [
        {
            question: "What tool do you most commonly use to tighten bolts on a bike?",
            options: ["Screwdriver", "Allen wrench / hex key", "Pliers", "Hammer"],
            correctIndex: 1
        },
        {
            question: "How do you check if a bike tire needs air?",
            options: ["Spin the wheel", "Squeeze it firmly", "Listen for a click", "Check the color"],
            correctIndex: 1
        },
        {
            question: "What should you apply to a squeaky bike chain?",
            options: ["Water", "Chain lubricant / oil", "Glue", "Soap"],
            correctIndex: 1
        },
        {
            question: "What does 'brake pad wear' mean?",
            options: ["The brakes are too tight", "The pads are thin and need replacing", "The brake cables broke", "The handlebars are loose"],
            correctIndex: 1
        },
        {
            question: "If a bike tire keeps going flat, what's most likely the cause?",
            options: ["Too much air", "A puncture or worn tube", "Loose handlebars", "Broken pedals"],
            correctIndex: 1
        }
    ],

    // ─── TIER 3 QUIZ GIGS ───────────────────────────────────────────────────────
    hustle_ai_tutor: [
        {
            question: "What does 'AI' stand for?",
            options: ["Actual Intelligence", "Artificial Intelligence", "Automated Internet", "Advanced Input"],
            correctIndex: 1
        },
        {
            question: "How does a machine learning model improve?",
            options: ["By resting overnight", "By being updated manually", "By training on more data", "By connecting to the internet"],
            correctIndex: 2
        },
        {
            question: "What is a 'prompt' when using an AI tool?",
            options: ["A computer error", "The instruction you give to the AI", "A type of robot", "An AI test score"],
            correctIndex: 1
        },
        {
            question: "Which tool is an example of a generative AI?",
            options: ["Google Maps", "ChatGPT", "Microsoft Excel", "Adobe Photoshop"],
            correctIndex: 1
        },
        {
            question: "What is 'bias' in an AI model?",
            options: ["When the AI is too slow", "When the AI gives unfair or skewed results due to training data", "When the AI costs too much", "When the AI needs updating"],
            correctIndex: 1
        },
        {
            question: "What does 'personalized learning' mean in AI tutoring?",
            options: ["Everyone gets the same lessons", "The AI adapts lessons to each student's pace and level", "Students teach the AI", "Lessons are printed on paper"],
            correctIndex: 1
        },
        {
            question: "Which field combines AI with education?",
            options: ["EdTech", "FinTech", "GreenTech", "MedTech"],
            correctIndex: 0
        }
    ],

    hustle_climate_advisor: [
        {
            question: "What does 'carbon footprint' measure?",
            options: ["Shoe size", "CO₂ emissions from your activities", "Forest size", "Water usage"],
            correctIndex: 1
        },
        {
            question: "What does 'ESG' stand for in business?",
            options: ["Economy, Society, Growth", "Environmental, Social, Governance", "Energy, Sales, Goals", "Ethics, Strategy, Gains"],
            correctIndex: 1
        },
        {
            question: "Which gas is the main driver of climate change?",
            options: ["Oxygen", "Nitrogen", "Carbon Dioxide (CO₂)", "Hydrogen"],
            correctIndex: 2
        },
        {
            question: "What is a 'carbon offset'?",
            options: ["Burning more fuel", "Paying to reduce CO₂ elsewhere to balance your own emissions", "A type of tax", "A solar panel rebate"],
            correctIndex: 1
        },
        {
            question: "What does 'net zero' mean?",
            options: ["No business profits", "Emitting zero pollution ever", "Balancing emissions with removals so net CO₂ = 0", "Using no electricity"],
            correctIndex: 2
        },
        {
            question: "Which is a renewable energy source?",
            options: ["Coal", "Natural Gas", "Wind Power", "Oil"],
            correctIndex: 2
        },
        {
            question: "What is the circular economy?",
            options: ["An economy shaped like a circle", "A system of reuse and recycling instead of waste", "A stock market strategy", "A type of import/export deal"],
            correctIndex: 1
        }
    ],

    hustle_web3_dev: [
        {
            question: "What is a blockchain?",
            options: ["A type of USB drive", "A distributed ledger secured by cryptography", "A gaming console", "A social media platform"],
            correctIndex: 1
        },
        {
            question: "What is a 'smart contract'?",
            options: ["A contract written by lawyers", "Self-executing code stored on a blockchain", "An insurance policy", "A legal document"],
            correctIndex: 1
        },
        {
            question: "What does 'decentralized' mean in Web3?",
            options: ["Controlled by one company", "No single central authority controls it", "Hosted in one location", "Only accessible from one country"],
            correctIndex: 1
        },
        {
            question: "What is a crypto wallet used for?",
            options: ["Storing physical coins", "Managing your blockchain keys and assets", "Making phone calls", "Browsing the internet"],
            correctIndex: 1
        },
        {
            question: "What language is most commonly used to write Ethereum smart contracts?",
            options: ["Python", "JavaScript", "Solidity", "HTML"],
            correctIndex: 2
        },
        {
            question: "What does 'NFT' stand for?",
            options: ["New Financial Token", "Non-Fungible Token", "Network File Transfer", "No Fee Transaction"],
            correctIndex: 1
        },
        {
            question: "What is a 'DApp'?",
            options: ["A dance application", "A decentralized application running on a blockchain", "A data backup program", "A developer smartphone app"],
            correctIndex: 1
        }
    ]
};
