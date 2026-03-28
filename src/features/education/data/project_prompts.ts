import { t } from 'i18next';

export interface ProjectBrief {
    title: string;
    objective: string;
    kpis: {
        id: string;
        label: string;
        icon: string;
        desc: string;
    }[];
    expectations: string;
}

export const getProjectBrief = (moduleIdOrLessonId: string): ProjectBrief => {
    // Helper to allow passing "ENT" or "MOD_ENT"
    const id = moduleIdOrLessonId;

    // Entrepreneurship
    if (id.startsWith('ENT') || id.startsWith('MOD_ENT')) return {
        title: t('project.ent_title', { defaultValue: 'Launch Your Business' }),
        objective: t('project.ent_obj', { defaultValue: 'Create a concept for a business that solves a real problem.' }),
        kpis: [
            { id: 'creativity', label: t('kpi.creativity', { defaultValue: 'Creativity' }), icon: '💡', desc: t('kpi.creativity_desc', { defaultValue: 'Is the idea unique?' }) },
            { id: 'viability', label: t('kpi.viability', { defaultValue: 'Viability' }), icon: '🛠️', desc: t('kpi.viability_desc', { defaultValue: 'Can it be built?' }) },
            { id: 'impact', label: t('kpi.impact', { defaultValue: 'Impact' }), icon: '🌍', desc: t('kpi.impact_desc', { defaultValue: 'Does it help people?' }) }
        ],
        expectations: t('project.ent_exp', { defaultValue: 'Write a short plan describing your product, customers, and price. Upload a drawing of your logo!' })
    };
    // Marketing
    if (id.startsWith('MKT') || id.startsWith('MOD_MKT')) return {
        title: t('project.mkt_title', { defaultValue: 'Marketing Campaign' }),
        objective: t('project.mkt_obj', { defaultValue: 'Design a poster or ad to sell a product.' }),
        kpis: [
            { id: 'clarity', label: t('kpi.clarity', { defaultValue: 'Clarity' }), icon: '📢', desc: t('kpi.clarity_desc', { defaultValue: 'Is the message clear?' }) },
            { id: 'appeal', label: t('kpi.appeal', { defaultValue: 'Appeal' }), icon: '🎨', desc: t('kpi.appeal_desc', { defaultValue: 'Does it look good?' }) },
            { id: 'persuasion', label: t('kpi.persuasion', { defaultValue: 'Persuasion' }), icon: '🔥', desc: t('kpi.persuasion_desc', { defaultValue: 'Does it make me want to buy?' }) }
        ],
        expectations: t('project.mkt_exp', { defaultValue: 'Create a slogan and upload a picture of your poster.' })
    };
    // Money Basics
    if (id.startsWith('MB') || id.startsWith('MOD_MB')) return {
        title: t('project.mb_title', { defaultValue: 'My Savings Goal' }),
        objective: t('project.mb_obj', { defaultValue: 'Create a plan to save for something you really want.' }),
        kpis: [
            { id: 'realism', label: t('kpi.realism', { defaultValue: 'Realism' }), icon: '🎯', desc: t('kpi.realism_desc', { defaultValue: 'Is the goal reachable?' }) },
            { id: 'planning', label: t('kpi.planning', { defaultValue: 'Planning' }), icon: '📅', desc: t('kpi.planning_desc', { defaultValue: 'Do you have a step-by-step plan?' }) },
            { id: 'math', label: t('kpi.math', { defaultValue: 'Math' }), icon: '🧮', desc: t('kpi.math_desc', { defaultValue: 'Are your calculations correct?' }) }
        ],
        expectations: t('project.mb_exp', { defaultValue: 'Draw your savings jar and write down how long it will take to fill it.' })
    };
    // Investing
    if (id.startsWith('INV') || id.startsWith('MOD_INV')) return {
        title: t('project.inv_title', { defaultValue: 'Dream Portfolio' }),
        objective: t('project.inv_obj', { defaultValue: 'Pick 3 companies you would invest in and explain why.' }),
        kpis: [
            { id: 'research', label: t('kpi.research', { defaultValue: 'Research' }), icon: '🔍', desc: t('kpi.research_desc', { defaultValue: 'Did you learn about the companies?' }) },
            { id: 'diversity', label: t('kpi.diversity', { defaultValue: 'Diversity' }), icon: '🥚', desc: t('kpi.diversity_desc', { defaultValue: 'Did you pick different types?' }) },
            { id: 'reasoning', label: t('kpi.reasoning', { defaultValue: 'Reasoning' }), icon: '🧠', desc: t('kpi.reasoning_desc', { defaultValue: 'Is your "Why" smart?' }) }
        ],
        expectations: t('project.inv_exp', { defaultValue: 'List your 3 picks and write one sentence for each about why you chose it.' })
    };
    // Leadership
    if (id.startsWith('LDR') || id.startsWith('MOD_LDR')) return {
        title: t('project.ldr_title', { defaultValue: 'Team Captain' }),
        objective: t('project.ldr_obj', { defaultValue: 'Describe how you would lead a team to solve a problem.' }),
        kpis: [
            { id: 'empathy', label: t('kpi.empathy', { defaultValue: 'Empathy' }), icon: '❤️', desc: t('kpi.empathy_desc', { defaultValue: 'Are you thinking of others?' }) },
            { id: 'strategy', label: t('kpi.strategy', { defaultValue: 'Strategy' }), icon: '🗺️', desc: t('kpi.strategy_desc', { defaultValue: 'Do you have a good plan?' }) },
            { id: 'communication', label: t('kpi.communication', { defaultValue: 'Communication' }), icon: '🗣️', desc: t('kpi.communication_desc', { defaultValue: 'Is your message clear?' }) }
        ],
        expectations: t('project.ldr_exp', { defaultValue: 'Write a speech to your team or draw a comic of you solving a conflict.' })
    };
    // Economics
    if (id.startsWith('ECO') || id.startsWith('MOD_ECO')) return {
        title: t('project.eco_title', { defaultValue: 'Market Day' }),
        objective: t('project.eco_obj', { defaultValue: 'Plan a product to sell at a class market day.' }),
        kpis: [
            { id: 'supply_demand', label: t('kpi.supply_demand', { defaultValue: 'Supply & Demand' }), icon: '⚖️', desc: t('kpi.supply_demand_desc', { defaultValue: 'Is the price right?' }) },
            { id: 'scarcity', label: t('kpi.scarcity', { defaultValue: 'Scarcity' }), icon: '💎', desc: t('kpi.scarcity_desc', { defaultValue: 'Is the product special?' }) },
            { id: 'profit', label: t('kpi.profit', { defaultValue: 'Profit' }), icon: '💰', desc: t('kpi.profit_desc', { defaultValue: 'Will you make money?' }) }
        ],
        expectations: t('project.eco_exp', { defaultValue: 'Draw your market stall and list the prices for your items.' })
    };
    // Technology
    if (id.startsWith('TECH') || id.startsWith('MOD_TECH')) return {
        title: t('project.tech_title', { defaultValue: 'App Idea' }),
        objective: t('project.tech_obj', { defaultValue: 'Design an app that makes life easier for kids.' }),
        kpis: [
            { id: 'innovation', label: t('kpi.innovation', { defaultValue: 'Innovation' }), icon: '💡', desc: t('kpi.innovation_desc', { defaultValue: 'Is it a new idea?' }) },
            { id: 'ux', label: t('kpi.ux', { defaultValue: 'User Experience' }), icon: '📱', desc: t('kpi.ux_desc', { defaultValue: 'Is it easy to use?' }) },
            { id: 'tech_use', label: t('kpi.tech_use', { defaultValue: 'Tech Use' }), icon: '🤖', desc: t('kpi.tech_use_desc', { defaultValue: 'Does it use cool tech?' }) }
        ],
        expectations: t('project.tech_exp', { defaultValue: 'Sketch the main screen of your app and label the buttons.' })
    };
    // Social Good
    if (id.startsWith('SOC') || id.startsWith('MOD_SOC')) return {
        title: t('project.soc_title', { defaultValue: 'Change the World' }),
        objective: t('project.soc_obj', { defaultValue: 'Create a campaign to help your community or the planet.' }),
        kpis: [
            { id: 'passion', label: t('kpi.passion', { defaultValue: 'Passion' }), icon: '🔥', desc: t('kpi.passion_desc', { defaultValue: 'Do you care about this?' }) },
            { id: 'action', label: t('kpi.action', { defaultValue: 'Action' }), icon: '👟', desc: t('kpi.action_desc', { defaultValue: 'Is there something to do?' }) },
            { id: 'kindness', label: t('kpi.kindness', { defaultValue: 'Kindness' }), icon: '🤝', desc: t('kpi.kindness_desc', { defaultValue: 'Does it help others?' }) }
        ],
        expectations: t('project.soc_exp', { defaultValue: 'Make a poster concerning a cause you care about (like recycling or kindness).' })
    };
    // Global Business
    if (id.startsWith('GLO') || id.startsWith('MOD_GLO')) return {
        title: t('project.glo_title', { defaultValue: 'Global Explorer' }),
        objective: t('project.glo_obj', { defaultValue: 'Plan a business trip to another country.' }),
        kpis: [
            { id: 'culture', label: t('kpi.culture', { defaultValue: 'Culture' }), icon: '🌍', desc: t('kpi.culture_desc', { defaultValue: 'Do you respect the culture?' }) },
            { id: 'logistics', label: t('kpi.logistics', { defaultValue: 'Logistics' }), icon: '✈️', desc: t('kpi.logistics_desc', { defaultValue: 'How will you get there?' }) },
            { id: 'opportunity', label: t('kpi.opportunity', { defaultValue: 'Opportunity' }), icon: '💼', desc: t('kpi.opportunity_desc', { defaultValue: 'Why go there?' }) }
        ],
        expectations: t('project.glo_exp', { defaultValue: 'Pick a country and list 3 things you need to learn before doing business there.' })
    };
    // Finance
    if (id.startsWith('FIN') || id.startsWith('MOD_FIN')) return {
        title: t('project.fin_title', { defaultValue: 'Safety First' }),
        objective: t('project.fin_obj', { defaultValue: 'Create a checklist for staying safe online and with money.' }),
        kpis: [
            { id: 'security', label: t('kpi.security', { defaultValue: 'Security' }), icon: '🔒', desc: t('kpi.security_desc', { defaultValue: 'Does it cover passwords?' }) },
            { id: 'privacy', label: t('kpi.privacy', { defaultValue: 'Privacy' }), icon: '🕵️', desc: t('kpi.privacy_desc', { defaultValue: 'Does it protect info?' }) },
            { id: 'scam_check', label: t('kpi.scam_check', { defaultValue: 'Scam Check' }), icon: '🚫', desc: t('kpi.scam_check_desc', { defaultValue: 'Does it spot fakes?' }) }
        ],
        expectations: t('project.fin_exp', { defaultValue: 'Write down 5 rules for being a "Smart Money Manager".' })
    };

    // Generic Fallback
    return {
        title: t('project.gen_title', { defaultValue: 'Show Your Work' }),
        objective: t('project.gen_obj', { defaultValue: 'Demonstrate what you learned in this module.' }),
        kpis: [
            { id: 'effort', label: t('kpi.effort', { defaultValue: 'Effort' }), icon: '💪', desc: t('kpi.effort_desc', { defaultValue: 'Did you try your best?' }) },
            { id: 'understanding', label: t('kpi.understanding', { defaultValue: 'Understanding' }), icon: '🧠', desc: t('kpi.understanding_desc', { defaultValue: 'Did you use key terms?' }) },
            { id: 'presentation', label: t('kpi.presentation', { defaultValue: 'Presentation' }), icon: '✨', desc: t('kpi.presentation_desc', { defaultValue: 'Is it neat and organized?' }) }
        ],
        expectations: t('project.gen_exp', { defaultValue: 'Answer the prompt and upload any supporting images.' })
    };
};
