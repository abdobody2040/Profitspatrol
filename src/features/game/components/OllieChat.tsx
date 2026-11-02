
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Minimize2, Lock, Crown, Sparkles } from 'lucide-react';
import { chatWithOllie, ChatMessage } from '../../../lib/gemini';
import { useAppStore } from '../../../store';
import { useGameStore } from '../../../store/gameStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sanitizePrompt } from '../../../utils/promptSanitizer';
import { DISTRICT_V2_DEFINITIONS } from '../../hq/data/worldConfig';

const OllieChat: React.FC = () => {
  const { user, hasAiAccess, upgradeSubscription } = useAppStore();
  const { activeGameId } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isMapPage = location.pathname === '/map';
  const [showCoaching, setShowCoaching] = useState(true);

  useEffect(() => {
    setShowCoaching(true);
  }, [user?.completedLessonIds, location.pathname]);

  // Listen for header button trigger
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('ollie:open', handler);
    return () => window.removeEventListener('ollie:open', handler);
  }, []);

  const getOllieCoachingDialog = () => {
    if (!user) return "";
    const isAr = i18n.language === 'ar';
    if (user.streak === 0) {
      return t('coaching.low_streak', { defaultValue: "Welcome back! A successful tycoon shows up every day. Keep your daily streak hot! 🔥" });
    }
    if (user.ppTokens > 2000 && (!user.unlockedSkills || user.unlockedSkills.length === 0)) {
      return t('coaching.no_skills', { defaultValue: "Hey boss! You've got quite a bit of cash. Reinvesting in your Skills at the HQ will boost your efficiency and passive income! 🧠" });
    }
    if (!user.properties || user.properties.length === 0) {
      return t('coaching.no_properties', { defaultValue: "Real estate is the path to wealth! Go to Venture and buy your first property to start earning passive rent! 🏠" });
    }

    const activeDistrict = DISTRICT_V2_DEFINITIONS.find(d => {
      const bossId = `${d.id}_BOSS`;
      return !user.completedLessonIds?.includes(bossId);
    }) || DISTRICT_V2_DEFINITIONS[0];

    const districtName = isAr ? (activeDistrict.arabicName || activeDistrict.name) : activeDistrict.name;
    const bossName = isAr ? (activeDistrict.bossNameAr || activeDistrict.bossName) : activeDistrict.bossName;

    return t('coaching.active_district', {
      name: districtName,
      bossName: bossName,
      defaultValue: `Welcome to ${activeDistrict.name}! Let's master the lessons and defeat Boss ${activeDistrict.bossName} to claim the district completion rewards! 🏆`
    });
  };

  const handleContinueLearning = () => {
    window.dispatchEvent(new CustomEvent('trigger-continue-learning'));
  };

  // Paywall State - Persisted to prevent refresh exploit
  const [freeMessageUsed, setFreeMessageUsed] = useState(() => {
    return localStorage.getItem('ollie_free_sample_used') === 'true';
  });

  const hasAccess = hasAiAccess();
  // Explicit Tycoon check for UI branding (Admins get VIP too)
  const isTycoon = user?.subscriptionTier === 'tycoon' || user?.role === 'ADMIN';

  // Initial greeting
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize and update greeting on language change
  useEffect(() => {
    setMessages(prev => {
      // If empty or only has the initial greeting, update it
      if (prev.length === 0 || (prev.length === 1 && prev[0].role === 'model')) {
        return [{ role: 'model', parts: [{ text: t('chat.initial_greeting') }] }];
      }
      return prev;
    });
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Gating Check: Block if no access and limit used
    if (!hasAccess && freeMessageUsed) {
      return;
    }

    const userText = input.trim();
    setInput('');
    setIsLoading(true);

    // Create optimistic UI update
    const uiHistory = [
      ...messages,
      { role: 'user' as const, parts: [{ text: userText }] }
    ];
    setMessages(uiHistory);

    try {
      // Sanitize prompt for security (will throw if malicious)
      await sanitizePrompt(userText);

      // Call AI Service
      let reply = await chatWithOllie(messages, userText);

      // Inject Upsell if on Free Tier
      if (!hasAccess) {
        reply += t('chat.free_limit_reply');
        setFreeMessageUsed(true);
        localStorage.setItem('ollie_free_sample_used', 'true');
      }

      setMessages(prev => [
        ...prev,
        { role: 'model' as const, parts: [{ text: reply }] }
      ]);
    } catch (error: any) {
      // Handle prompt injection or other errors
      const errorMessage = error.message || t('chat.error_message');
      setMessages(prev => [
        ...prev,
        { role: 'model' as const, parts: [{ text: errorMessage }] }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };



  // Only show if user is logged in AND not in a game
  if (!user || activeGameId) return null;

  const renderOllieAvatar = (sizeClass: string) => {
    if (imgError) {
      return <span className="text-2xl">🦉</span>;
    }
    return (
      <img
        src="/assets/ollie_head.png"
        alt="Ollie"
        className={`w-full h-full object-contain`}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  };

  return (
    <>
      <div className={`fixed end-4 md:end-6 ${isOpen ? 'z-[210] bottom-4 md:bottom-6' : 'z-[140] bottom-20 md:bottom-8'} flex flex-col items-end pointer-events-none transition-all duration-300 ease-in-out`}>


        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden flex flex-col h-[500px] max-h-[60vh] pointer-events-auto relative
                ${isTycoon ? 'border-4 border-yellow-500' : 'border-4 border-yellow-400'}
            `}
            >
              {/* Header */}
              <div className={`p-4 flex justify-between items-center shrink-0
                ${isTycoon ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white' : 'bg-yellow-400 text-yellow-900'}
            `}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 shadow-sm overflow-hidden flex-shrink-0
                    ${isTycoon ? 'border-yellow-500' : 'border-yellow-600'}
                `}>
                    {renderOllieAvatar("w-full h-full")}
                  </div>
                  <div>
                    <h3 className="font-black text-lg leading-none flex items-center gap-2">
                       {t('chat.ollie_name')}
                      {isTycoon && <Crown size={16} className="text-yellow-400 fill-yellow-400" />}
                    </h3>
                    <p className={`text-xs font-bold flex items-center gap-1 ${isTycoon ? 'text-yellow-400' : 'opacity-80'}`}>
                      {hasAccess ? (isTycoon ? t('chat.vip_consultant') : t('chat.role_consultant')) : t('chat.role_free')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-1 rounded-lg transition-colors ${isTycoon ? 'hover:bg-gray-700' : 'hover:bg-yellow-500'}`}
                  >
                    <Minimize2 size={20} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  {messages.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isUser && (
                          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm me-2 flex-shrink-0 bg-yellow-100 flex items-center justify-center">
                            {renderOllieAvatar("w-full h-full")}
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-sm font-bold shadow-sm whitespace-pre-wrap
                          ${isUser
                              ? 'bg-blue-50 text-blue-900 rounded-se-none dark:bg-blue-600 dark:text-white'
                              : 'bg-white text-gray-800 dark:bg-gray-700 dark:text-white border-2 border-gray-100 dark:border-gray-600 rounded-ss-none'}
                        `}
                        >
                          {msg.parts[0].text}
                        </div>
                      </motion.div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm me-2 flex-shrink-0 bg-yellow-100 flex items-center justify-center">
                        {renderOllieAvatar("w-full h-full")}
                      </div>
                      <div className="bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 p-3 rounded-2xl rounded-ss-none flex gap-1 items-center">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area or Upgrade Button */}
              <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0">
                {!hasAccess && freeMessageUsed ? (
                  <button
                    onClick={() => navigate('/checkout/tycoon')}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all btn-juicy"
                  >
                    <Crown size={20} className="text-yellow-400" /> {t('chat.hire_button')}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-2xl px-2 py-1 border-2 border-transparent focus-within:border-kid-accent focus-within:bg-white dark:focus-within:bg-gray-600 transition-all">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={hasAccess ? (isTycoon ? t('chat.placeholder_vip') : t('chat.placeholder_paid')) : t('chat.placeholder_free')}
                      className="flex-1 bg-transparent border-none outline-none p-2 text-sm font-bold text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                      disabled={isLoading}
                      maxLength={500}
                    />
                    {input.length > 400 && (
                      <span className="text-xs text-orange-500 font-bold pe-1">
                        {500 - input.length}
                      </span>
                    )}
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className={`p-2 rounded-xl transition-all ${input.trim() && !isLoading
                        ? 'bg-kid-secondary text-white shadow-md hover:bg-green-600'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500'
                        }`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {!isOpen && isMapPage && showCoaching && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="hidden sm:flex bg-white dark:bg-gray-800 rounded-2xl border-2 border-yellow-400 shadow-2xl p-3.5 w-64 sm:w-72 text-start absolute bottom-0 end-[76px] sm:end-[84px] pointer-events-auto flex-col z-[140]"
            >
              {/* Small indicator arrow pointing towards Ollie button */}
              <div className="absolute bottom-5 -end-1.5 w-3 h-3 bg-white dark:bg-gray-800 border-t-2 border-r-2 border-yellow-400 rotate-45 transform"></div>
              
              <button
                onClick={() => setShowCoaching(false)}
                className="absolute top-2 end-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer p-0.5"
                title="إغلاق"
              >
                <X size={14} />
              </button>
              
              <p className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-relaxed mt-0.5 pe-4">
                "{getOllieCoachingDialog()}"
              </p>
              
              <div className="mt-2.5 flex justify-start">
                <button
                  onClick={handleContinueLearning}
                  className="bg-yellow-400 text-yellow-950 text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wide cursor-pointer hover:bg-yellow-500 transition-colors shadow-sm flex items-center gap-1"
                >
                  {t('map.ollie_cta', { defaultValue: "Let's Go! 🚀" })}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <motion.button
          id="ollie-chat-fab"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-[0_4px_0_0_rgba(0,0,0,0.2)] flex items-center justify-center border-4 transition-colors relative overflow-hidden pointer-events-auto
          ${isOpen
              ? 'bg-gray-200 dark:bg-gray-600 border-white dark:border-gray-700 text-gray-500 dark:text-gray-300'
              : isTycoon
                ? 'bg-white text-gray-900 border-yellow-500'
                : 'bg-yellow-400 text-yellow-900 border-white dark:border-gray-700'}
        `}
        >
          {isOpen ? (
            <X size={32} strokeWidth={3} />
          ) : (
            <>
              {renderOllieAvatar("w-full h-full")}
              {/* Pulsing ring if on map and coaching is visible */}
              {isMapPage && showCoaching && (
                <div className="absolute inset-0 rounded-full border-4 border-yellow-300 animate-ping opacity-40 pointer-events-none" />
              )}
              {/* Notification Badge */}
              {!hasAccess && !freeMessageUsed && (
                <span className="absolute top-0 end-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
              {/* Sparkle for Tycoon */}
              {isTycoon && (
                <div className="absolute top-0 end-0 bg-yellow-500 rounded-full p-1 border border-white">
                  <Sparkles size={10} className="text-white" />
                </div>
              )}
              {/* Lock Badge if limit reached */}
              {!hasAccess && freeMessageUsed && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Lock size={20} className="text-white" />
                </div>
              )}
            </>
          )}
        </motion.button>
      </div>


    </>
  );
};

export default OllieChat;
