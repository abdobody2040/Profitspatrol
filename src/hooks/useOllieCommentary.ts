import { useState, useCallback, useRef } from 'react';

export type OllieEvent =
  | 'big_profit'
  | 'going_broke'
  | 'upgrade_bought'
  | 'streak_3'
  | 'streak_5'
  | 'streak_7'
  | 'game_start'
  | 'game_over_win'
  | 'game_over_lose'
  | 'bad_decision'
  | 'good_decision'
  | 'combo_hit'
  | 'competitor_appears'
  | 'market_crash'
  | 'milestone';

interface OllieMessage {
  text: string;
  emoji: string;
  fact?: string; // Optional educational fact
}

const COMMENTARY: Record<OllieEvent, OllieMessage[]> = {
  big_profit: [
    { text: "You're printing money! Jeff Bezos started in a garage too!", emoji: '💰', fact: "Amazon started as an online bookstore in Jeff Bezos' garage in 1994." },
    { text: "Cha-ching! Remember: Revenue is vanity, Profit is sanity!", emoji: '🔥', fact: "Revenue = all money in. Profit = what's left after paying ALL costs." },
    { text: "Legendary numbers! Warren Buffett would be proud!", emoji: '👑', fact: "Warren Buffett turned $6,000 at age 11 into $100B+ by investing wisely." },
    { text: "Look at you GO! This is what 'operating leverage' feels like!", emoji: '🚀' },
  ],
  going_broke: [
    { text: "Ouch! Even Elon Musk went bankrupt once. Budgets = your survival kit!", emoji: '😅', fact: "Elon Musk spent his last dollar keeping SpaceX alive in 2008. It worked." },
    { text: "Red alert! Cut your costs or you'll be selling your chair next!", emoji: '🚨', fact: "Cash flow is the #1 reason businesses fail, not lack of profit." },
    { text: "We've hit the floor. Time to PIVOT! Great CEOs adapt fast.", emoji: '💡', fact: "Netflix started as a DVD mail-rental service. Pivoting saved them." },
    { text: "Bankruptcy incoming! But hey — learning from failure is how pros grow.", emoji: '📉' },
  ],
  upgrade_bought: [
    { text: "Smart move! In business, this is called Capital Investment.", emoji: '🛠️', fact: "Capital investment = spending money on things that make MORE money later." },
    { text: "You just bought productivity! Smart CEOs buy time, not stuff.", emoji: '⚡', fact: "Henry Ford's assembly line (1913) cut car production time from 12 hours to 93 minutes." },
    { text: "Upgrade acquired! Every upgrade = compounding returns over time.", emoji: '📈', fact: "Compound growth means small improvements stack into massive results." },
  ],
  streak_3: [
    { text: "3 wins in a row! That's called 'operational consistency'!", emoji: '🔥', fact: "McDonald's serves 69M customers daily because of consistent operations, not just food." },
    { text: "Streak time! You're proving you can repeat success — that's a REAL skill.", emoji: '⚡' },
  ],
  streak_5: [
    { text: "5-streak LEGEND! You've found your winning formula. SCALE IT!", emoji: '🌶️', fact: "Scaling means doing what works... but BIGGER. Apple scaled iPods into iPhones." },
    { text: "HOT STREAK! Your consistency score is off the charts, CEO!", emoji: '🏆' },
  ],
  streak_7: [
    { text: "7 in a row?! You are UNSTOPPABLE! This is what market domination looks like!", emoji: '👑', fact: "Amazon held a 7-year streak of losing money on purpose to dominate the market." },
    { text: "LEGENDARY CEO MODE ACTIVATED! Your streak rivals Fortune 500 companies!", emoji: '💎' },
  ],
  game_start: [
    { text: "Welcome, Boss! Remember: every great empire started with a single decision.", emoji: '👋', fact: "90% of businesses fail in year 1. The 10% that survive? They adapted quickly." },
    { text: "Time to build your empire! Think like an owner, not an employee.", emoji: '🚀' },
    { text: "Let's GO! The best CEOs don't just work hard — they work SMART.", emoji: '💡' },
  ],
  game_over_win: [
    { text: "WINNER! You out-thought, out-worked, and out-earned the competition!", emoji: '🏆', fact: "Only 6% of small businesses make it to year 10. You've got what it takes!" },
    { text: "You CRUSHED it! That's what we call a profitable exit strategy!", emoji: '🎉' },
  ],
  game_over_lose: [
    { text: "Tough round! Every failure is data. What would you do differently?", emoji: '🤔', fact: "Thomas Edison failed 10,000 times before inventing the lightbulb. Each fail = a lesson." },
    { text: "Game over — for now! The best investors say 'fail fast, learn faster'.", emoji: '💪' },
  ],
  bad_decision: [
    { text: "Hmm... that might backfire. Always think about second-order effects!", emoji: '⚠️', fact: "Second-order thinking = asking 'And then what happens after THAT?'" },
    { text: "Risky move! Great entrepreneurs calculate risks before taking them.", emoji: '🎲' },
  ],
  good_decision: [
    { text: "Nice thinking! That's called strategic foresight!", emoji: '✨', fact: "Strategic thinking is the #1 skill hiring managers look for in leaders." },
    { text: "Smart play! You're thinking like a CEO!", emoji: '🧠' },
  ],
  combo_hit: [
    { text: "COMBO! You're in the zone! This is peak performance!", emoji: '⚡' },
    { text: "Chain reaction! Everything's clicking — that's called 'flow state'.", emoji: '🌊', fact: "Athletes, musicians, and CEOs all describe 'flow state' as their best moments." },
  ],
  competitor_appears: [
    { text: "A competitor appeared! Competition makes YOU better. Embrace it!", emoji: '⚔️', fact: "Competition forces innovation. Without competitors, companies get lazy (and expensive)." },
    { text: "Watch out! The market just got more interesting. ADAPT or lose market share!", emoji: '👀' },
  ],
  market_crash: [
    { text: "MARKET CRASH! This is why diversification exists. Don't put all eggs in one basket!", emoji: '📉', fact: "Warren Buffett's rule #1: Never lose money. Rule #2: Never forget rule #1." },
    { text: "Red everywhere! Smart investors BUY during crashes. Buy low, sell high!", emoji: '🔴', fact: "The 2008 crash: investors who held on made 400% returns by 2018." },
  ],
  milestone: [
    { text: "MILESTONE REACHED! Every $1,000 in business is called a 'revenue milestone'!", emoji: '🎯', fact: "Most startups celebrate their first $1 as hard as their first $1 Million." },
    { text: "You hit a new record! Track these — investors love growth metrics!", emoji: '📊' },
  ],
};

export function useOllieCommentary() {
  const [currentMessage, setCurrentMessage] = useState<OllieMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownRef = useRef<Record<string, number>>({});

  const trigger = useCallback((event: OllieEvent, duration = 4000) => {
    // Cooldown: don't spam the same event type within 15 seconds
    const now = Date.now();
    if (cooldownRef.current[event] && now - cooldownRef.current[event] < 15000) return;
    cooldownRef.current[event] = now;

    const messages = COMMENTARY[event];
    if (!messages || messages.length === 0) return;

    const msg = messages[Math.floor(Math.random() * messages.length)];

    // Clear previous
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setCurrentMessage(msg);
    setIsVisible(true);

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setCurrentMessage(null), 400); // Wait for exit animation
    }, duration);
  }, []);

  const dismiss = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
    setTimeout(() => setCurrentMessage(null), 400);
  }, []);

  return { currentMessage, isVisible, trigger, dismiss };
}
