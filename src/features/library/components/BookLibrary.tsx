import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { useEducationStore } from '../../../store/educationStore';
import { Book, UserRole, BookTask } from "../../../types";
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Star, X, Lock, CheckCircle2, CheckCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InvestorPitchModal from '../../game/components/InvestorPitchModal';
import SmartImage from '../../../components/ui/SmartImage';
import BookTaskCard from './BookTaskCard';
import BookTaskModal from './BookTaskModal';
import { hasSchoolBypass } from '../../../utils/premiumAccess';
import { CLASSIC_BOOKS } from '../data/classicBooks';
import { MORE_BOOKS } from '../data/moreBooks';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { Logger } from '../../../services/logger';

// IDs of Profits Patrol Exclusive books (Moved inside component for HMR sync)

interface BookLibraryProps {}

const BookLibrary: React.FC<BookLibraryProps> = () => {
  const storeExclusiveBooks = useAppStore((s) => s.exclusiveBooks);
  const EXCLUSIVE_IDS = React.useMemo(
    () => new Set(storeExclusiveBooks.map((b) => b.id)),
    [storeExclusiveBooks]
  );

  Logger.debug('[DEBUG] BookLibrary: storeExclusiveBooks IDs:', { ids: Array.from(EXCLUSIVE_IDS) });
  const {
    library,
    toggleAdminMode,
    completeGame,
    readBook,
    user,
    completeBookTask,
    getBookTaskProgress,
    syncLibrary,
  } = useAppStore();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [secretCount, setSecretCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [activeTask, setActiveTask] = useState<BookTask | null>(null);
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'exclusives'>('bestsellers');
  const { t, i18n } = useTranslation();

  // Sync tasks from static data to persisted store on mount
  React.useEffect(() => {
    syncLibrary();
  }, [syncLibrary]);

  const handleSecretClick = () => {
    const newCount = secretCount + 1;
    setSecretCount(newCount);
    if (newCount === 5) {
      toggleAdminMode();
      setSecretCount(0);
      alert('Admin Mode Toggled! Scroll down.');
    }
  };

  const handleReadSummary = (book: Book, isLocked: boolean) => {
    if (isLocked) {
      setShowPaywall(true);
      return;
    }
    setSelectedBook(book);
    // Track book reading progress
    readBook(book.id);
    // Award small XP for reading (The Bookworm Journey)
    completeGame(0, 15);
  };

  // Helper to normalize keys for i18n (replace dashes with underscores)
  const getBookKey = (id: string, field: string) => {
    return `library_books.${id.replace(/-/g, '_')}.${field}`;
  };

  const getFullContent = (book: Book) => {
    const normalizedId = book.id.replace(/-/g, '_');
    const ageSuffix = user?.age && user.age < 10 ? '_child' : '_teen';
    
    // 1. Try age-specific library_books key
    const libraryAgeKey = `library_books.${normalizedId}.fullContent${ageSuffix}` as any;
    const libraryAgeT = t(libraryAgeKey);
    if (libraryAgeT !== libraryAgeKey) return libraryAgeT;

    // 2. Try base library_books key
    const libraryBaseKey = `library_books.${normalizedId}.fullContent` as any;
    const libraryBaseT = t(libraryBaseKey);
    if (libraryBaseT !== libraryBaseKey) return libraryBaseT;

    // 3. Try exclusive_books key (legacy)
    const exclusiveKey = `exclusive_books.${normalizedId}.fullContent` as any;
    const exclusiveT = t(exclusiveKey);
    if (exclusiveT !== exclusiveKey) return exclusiveT;

    // 4. Fallback to static content
    return book.fullContent;
  };

  // Helper to look up translated exclusive book content from i18n
  const getExclusiveT = (bookId: string, field: string): string | null => {
    const normalizedId = bookId.replace(/-/g, '_');
    const key = `exclusive_books.${normalizedId}.${field}` as any;
    const translated = t(key);
    return translated !== key ? translated : null;
  };

  // Helper for translating titles (handles both exclusive and standard books)
  const getTranslatedTitle = (bookId: string, defaultTitle: string) => {
    if (EXCLUSIVE_IDS.has(bookId)) {
      const exclusiveTitle = getExclusiveT(bookId, 'title');
      Logger.debug(
        `[DEBUG] getTranslatedTitle (Exclusive): bookId="${bookId}", resultingTitle="${exclusiveTitle || defaultTitle}"`
      );
      if (exclusiveTitle) return exclusiveTitle;
      return defaultTitle;
    }

    const age = user?.age || 12;
    const ageSuffix = age < 10 ? '_child' : '_teen';
    const baseKey = getBookKey(bookId, 'title');
    const ageKey = `${baseKey}${ageSuffix}`;
    return i18n.exists(ageKey as any)
      ? t(ageKey as any)
      : t(baseKey as any, { defaultValue: defaultTitle });
  };

  const isIntern = user?.subscriptionTier === 'intern';
  const isAdmin = user?.role === UserRole.ADMIN;

  // B2B School License Bypass Check
    const classrooms = useEducationStore(state => state.classrooms);
    const users = useAppStore(state => state.users);
    const activeSchoolBypass = hasSchoolBypass(user, classrooms, users);

  const checkInternLocked = () => {
    if (isAdmin) return false;
    if (activeSchoolBypass) return false;
    return isIntern;
  };

  const isInternLocked = checkInternLocked();

  // Bestsellers always guarantee fresh verified local coverUrl from static CLASSIC_BOOKS
  const bestellerBooks = React.useMemo(() => {
    return CLASSIC_BOOKS.map((staticBook) => {
      const storeBook = library.find((b) => b.id === staticBook.id);
      return storeBook ? { ...storeBook, coverUrl: staticBook.coverUrl || storeBook.coverUrl } : staticBook;
    });
  }, [library]);

  // Exclusives always guarantee fresh verified local coverUrl from static MORE_BOOKS
  const exclusiveBooks = React.useMemo(() => {
    const moreMap = new Map(MORE_BOOKS.map((b) => [b.id, b]));
    const sourceList = storeExclusiveBooks && storeExclusiveBooks.length > 0 ? storeExclusiveBooks : MORE_BOOKS;
    return sourceList.map((book) => {
      const staticBook = moreMap.get(book.id);
      return staticBook ? { ...book, coverUrl: staticBook.coverUrl || book.coverUrl } : book;
    });
  }, [storeExclusiveBooks]);

  const displayedBooks = activeTab === 'exclusives' ? exclusiveBooks : bestellerBooks;

  const isExclusiveTab = activeTab === 'exclusives';
  const isMobile = useIsMobile();

  return (
    <div className="pb-20 max-w-6xl mx-auto">
      <InvestorPitchModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

      {/* Header */}
      <div className="flex justify-between items-end mb-6 px-4">
        <div>
          <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <BookOpen className="text-amber-700 dark:text-amber-500" size={40} />
            {t('library.title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">
            {t('library.subtitle')}
          </p>
          {activeSchoolBypass && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-bold border border-green-200 dark:border-green-800/50">
              <CheckCircle2 size={16} />
              {t('library.school_license_unlocked')}
            </div>
          )}
        </div>
        {/* Secret Trigger */}
        <button
          onClick={handleSecretClick}
          aria-label="Toggle admin mode"
          aria-hidden="true"
          className="text-gray-200 dark:text-gray-700 hover:text-gray-300 dark:hover:text-gray-600 transition-colors p-2"
        >
          <Lock size={20} />
        </button>
      </div>

      {/* ── Tab Toggle ────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 mb-8">
        <button
          onClick={() => setActiveTab('bestsellers')}
          aria-pressed={!isExclusiveTab}
          aria-label="Business Bestsellers tab"
          className={`flex items-center gap-2 ${
            !isExclusiveTab ? 'btn' : 'btn btn--ghost'
          }`}
        >
          <BookOpen size={18} />
          {t('library.tab_bestsellers')}
          <span className="opacity-80 text-xs px-2 py-0.5 rounded-full border border-current">
            {bestellerBooks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('exclusives')}
          aria-pressed={isExclusiveTab}
          aria-label="Profits Patrol Exclusives tab"
          className={`flex items-center gap-2 ${
            isExclusiveTab ? 'btn' : 'btn btn--ghost'
          }`}
        >
          <Sparkles size={18} />
          {t('library.tab_exclusives')}
          <span className="opacity-80 text-xs px-2 py-0.5 rounded-full border border-current">
            {exclusiveBooks.length}
          </span>
        </button>
      </div>

      {/* Bookshelf Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 px-4 pb-8">
        {displayedBooks.map((book, index) => {
          Logger.debug(`[DEBUG] BookCard [${index}]: id="${book.id}", title="${book.title}", coverUrl="${book.coverUrl}"`);
          const isRead = user?.readBookIds?.includes(book.id);
          const isExclusive = EXCLUSIVE_IDS.has(book.id);
          // Gating Logic: Interns only see first 3 books (Admins/Bypass bypass)
          const isLocked = isInternLocked && index >= 3;

          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`card group relative flex flex-col overflow-hidden !p-0 transition-transform duration-200
                ${isLocked ? 'cursor-pointer' : 'hover:-translate-y-1 hover:shadow-lg'}
            `}
              onClick={() => isLocked && setShowPaywall(true)}
            >
              {/* Locked Overlay */}
              {isLocked && (
                <div className="absolute inset-0 bg-gray-900/60 z-20 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                  <div className="bg-yellow-500 p-4 rounded-full shadow-lg mb-2">
                    <Lock size={32} />
                  </div>
                  <span className="font-black uppercase tracking-widest text-sm">
                    {t('library.premium_only')}
                  </span>
                </div>
              )}

              {/* Exclusive Badge */}
              {isExclusive && !isLocked && (
                <div className="absolute top-2 start-6 z-10 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                  <Sparkles size={9} /> EXCLUSIVE
                </div>
              )}

              {/* Spine Effect */}
              <div
                className={`absolute start-0 top-0 bottom-0 w-4 rounded-s-md opacity-20 ${isExclusive ? 'bg-violet-800' : 'bg-amber-800 dark:bg-gray-900'}`}
              />

              {/* Read Badge */}
              {isRead && !isLocked && (
                <div className="absolute top-4 end-4 z-10 bg-green-500 text-white rounded-full p-1 shadow-md">
                  <CheckCircle size={20} strokeWidth={3} />
                </div>
              )}

              <div className={`p-3 md:p-6 flex flex-col md:flex-row gap-3 md:gap-6 items-center md:items-start ${isLocked ? 'opacity-50' : ''}`}>
                {/* Cover */}
                <div className="w-20 h-28 md:w-24 md:h-36 shrink-0 rounded-lg shadow-md overflow-hidden border-2 border-white dark:border-gray-600 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300 bg-gray-200 dark:bg-gray-700">
                  <SmartImage
                    src={book.coverUrl}
                    alt={getTranslatedTitle(book.id, book.title)}
                    type="book"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 w-full text-center md:text-start">
                  <div
                    className={`inline-block bg-white dark:bg-gray-700 text-[10px] font-black uppercase px-2 py-1 rounded mb-2 border tracking-wider
                    ${
                      isExclusive
                        ? 'text-violet-800 dark:text-violet-400 border-violet-100 dark:border-gray-600'
                        : 'text-amber-800 dark:text-amber-400 border-amber-100 dark:border-gray-600'
                    }`}
                  >
                    {t(`library.categories.${book.category.toLowerCase()}` as any)}
                  </div>
                  <h3 className="font-black text-gray-800 dark:text-white text-sm md:text-lg leading-tight mb-1">
                    {getTranslatedTitle(book.id, book.title)}
                  </h3>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-4">
                    {book.author}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full w-fit
                    ${
                      isExclusive
                        ? 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-gray-700'
                        : 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-gray-700'
                    }`}
                  >
                    <Star size={12} fill="currentColor" /> {book.ageRating}
                  </div>
                </div>
              </div>

              <div
                className="mt-auto p-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadSummary(book, isLocked);
                  }}
                  className={`w-full ${
                    isLocked
                      ? 'btn btn--ghost opacity-60 cursor-not-allowed'
                      : 'btn'
                  }`}
                >
                  {isLocked ? <Lock size={18} /> : <BookOpen size={18} />}
                  {isLocked ? t('library.unlock') : t('library.read_summary')}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {displayedBooks.length === 0 && (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-bold bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 mx-4">
          {t('library.empty_state')}
        </div>
      )}

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedBook(null)}
          >
            <motion.div
              initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
              animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
              exit={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`card shadow-2xl overflow-hidden flex flex-col !p-0
                ${isMobile 
                    ? 'w-full rounded-t-[32px] max-h-[92vh] pb-safe' 
                    : 'rounded-3xl max-w-2xl w-full m-4 max-h-[85vh]'
                }
              `}
            >
              {isMobile && (
                  <div className="flex flex-col items-center pt-2 bg-[var(--color-surface)]">
                      <div className="bottom-sheet-handle" />
                  </div>
              )}
              {/* Modal Header */}
              <div className="bg-[var(--color-surface)] p-6 border-b border-[var(--color-border)] flex justify-between items-start">
                <div className="flex gap-6">
                  <div className="w-24 h-36 rounded-lg shadow-lg border-4 border-white dark:border-gray-700 overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-700">
                    <SmartImage
                      src={selectedBook.coverUrl}
                      alt={selectedBook.title}
                      type="book"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">
                      {t(`library.categories.${selectedBook.category.toLowerCase()}` as any)}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white mb-1">
                      {getTranslatedTitle(selectedBook.id, selectedBook.title)}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">
                      {selectedBook.author}
                    </p>
                  </div>
                </div>
                {!isMobile && (
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="btn btn--ghost !p-2 !rounded-full text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900">
                <div className="prose prose-amber dark:prose-invert max-w-none">
                  <h4 className="font-black text-gray-700 dark:text-gray-200 text-lg mb-4">
                    {t('library.whats_it_about')}
                  </h4>

                  {/* Full Content (Exclusive or Expanded Bestseller) or Short Summary */}
                  {selectedBook.fullContent ? (
                    <div className="mb-8 space-y-3">
                      {getFullContent(selectedBook)
                        ?.split(/\r?\n|\\n/)
                        .map((rawLine: string, i: number) => {
                          const line = rawLine.trim();
                          if (line.startsWith('## ')) {
                            return (
                              <h3
                                key={i}
                                className="text-lg font-black text-gray-800 dark:text-white mt-6 mb-1"
                              >
                                {line.replace('## ', '')}
                              </h3>
                            );
                          }
                          if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
                            return (
                              <p key={i} className="font-black text-gray-800 dark:text-white">
                                {line.replace(/\*\*/g, '')}
                              </p>
                            );
                          }
                          if (line.startsWith('> ')) {
                            return (
                              <blockquote
                                key={i}
                                className="border-s-4 border-violet-400 ps-4 italic text-violet-700 dark:text-violet-300 font-semibold my-3"
                              >
                                {line.replace(/\*\*/g, '').replace('> ', '')}
                              </blockquote>
                            );
                          }
                          if (line.startsWith('- ') || line.startsWith('* ')) {
                            const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1');
                            return (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm"
                              >
                                <span className="text-violet-500 mt-0.5 shrink-0">•</span>
                                <span className="font-medium">{content}</span>
                              </div>
                            );
                          }
                          if (line === '---') {
                            return (
                              <hr key={i} className="border-gray-200 dark:border-gray-700 my-3" />
                            );
                          }
                          if (line.trim() === '') return <div key={i} className="h-1" />;
                          // Inline bold: replace **text** with bold spans
                          const parts = line.split(/\*\*(.*?)\*\*/g);
                          return (
                            <p
                              key={i}
                              className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed"
                            >
                              {parts.map((part: string, j: number) =>
                                j % 2 === 1 ? (
                                  <strong
                                    key={j}
                                    className="text-gray-800 dark:text-white font-black"
                                  >
                                    {part}
                                  </strong>
                                ) : (
                                  part
                                )
                              )}
                            </p>
                          );
                        })}
                    </div>
                  ) : (
                    /* Fallback: short age-adapted summary for regular bestseller books */
                    (() => {
                      const age = user?.age || 12;
                      const ageSuffix = age < 10 ? '_child' : '_teen';
                      const baseKey = getBookKey(selectedBook.id, 'summary');
                      const ageKey = `${baseKey}${ageSuffix}`;
                      const hasAgeContent = i18n.exists(ageKey as any);
                      const summaryText = hasAgeContent
                        ? t(ageKey as any)
                        : t(baseKey as any, { defaultValue: selectedBook.summary });
                      return (
                        <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-8 text-lg">
                          {summaryText}
                        </p>
                      );
                    })()
                  )}

                  {/* Tasks & Challenges Section */}
                  {selectedBook.tasks && selectedBook.tasks.length > 0 && (
                    <div className="mt-4 mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-black text-gray-700 dark:text-gray-200 text-lg flex items-center gap-2">
                          {t('library.tasks_challenges')}
                        </h4>
                        {(() => {
                          const progress = getBookTaskProgress(selectedBook.id);
                          return progress.total > 0 ? (
                            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              {progress.completed}/{progress.total} ({progress.percentage}%)
                            </div>
                          ) : null;
                        })()}
                      </div>

                      {/* Progress Bar */}
                      {(() => {
                        const progress = getBookTaskProgress(selectedBook.id);
                        return progress.total > 0 ? (
                          <div className="mb-6">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                                style={{ width: `${progress.percentage}%` }}
                              />
                            </div>
                          </div>
                        ) : null;
                      })()}

                      {/* Task Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedBook.tasks.map((task) => {
                          const isCompleted =
                            user?.completedBookTasks?.some((c) => c.taskId === task.id) || false;
                          return (
                            <BookTaskCard
                              key={task.id}
                              task={task}
                              isCompleted={isCompleted}
                              onStart={() => setActiveTask(task)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border-2 border-blue-100 dark:border-blue-800">
                    <h4 className="font-black text-blue-800 dark:text-blue-300 text-lg mb-4 flex items-center gap-2">
                      <Star className="text-yellow-400 fill-current" /> {t('library.key_lessons')}
                    </h4>
                    <ul className="space-y-3">
                      {(selectedBook.keyLessons || []).map((lesson, i) => {
                        // For exclusive books, check the exclusive_books namespace first
                        const exclusiveLessonText = getExclusiveT(
                          selectedBook.id,
                          `keyLessons.${i}`
                        );

                        // For bestseller books, use the standard library_books i18n path
                        const age = user?.age || 12;
                        const ageSuffix = age < 10 ? '_child' : '_teen';
                        const baseKey = getBookKey(selectedBook.id, `lesson_${i}`);
                        const ageKey = `${baseKey}${ageSuffix}`;
                        const hasAgeContent = i18n.exists(ageKey as any);
                        const bestsellersLessonText = hasAgeContent
                          ? t(ageKey as any)
                          : t(baseKey as any, { defaultValue: lesson });

                        const lessonText = exclusiveLessonText ?? bestsellersLessonText;

                        return (
                          <li
                            key={i}
                            className="flex items-start gap-3 font-bold text-gray-700 dark:text-gray-300"
                          >
                            <div className="mt-1 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full p-0.5 shrink-0">
                              <CheckCircle2 size={16} />
                            </div>
                            {lessonText}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex justify-end">
                <button
                  onClick={() => setSelectedBook(null)}
                  className="btn btn--ghost"
                >
                  {t('library.close_book')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Task Modal */}
      {activeTask && selectedBook && (
        <BookTaskModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onComplete={(data) => {
            completeBookTask(activeTask.id, selectedBook.id, data);
            setActiveTask(null);
          }}
        />
      )}
    </div>
  );
};

export default BookLibrary;
