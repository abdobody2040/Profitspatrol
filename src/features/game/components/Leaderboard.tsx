
import React, { useMemo } from 'react';
import { useAppStore, MOCK_LEADERBOARD } from '../../../store';
import { Trophy, Medal, Crown, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Logger } from '../../../services/logger';

const Leaderboard: React.FC = () => {
  const { user } = useAppStore();
  const { t } = useTranslation();

  const [leaderboardData, setLeaderboardData] = React.useState<typeof MOCK_LEADERBOARD>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const { supabase } = await import('../../../lib/supabase');

        if (!supabase) {
          Logger.info('Leaderboard: Supabase not configured, using mock data');
          // Fall back to mock data but put current user in there if not present
          const mockSorted = [...MOCK_LEADERBOARD].sort((a, b) => b.xp - a.xp);
          if (user && !mockSorted.find(m => m.id === user.id)) {
            mockSorted.push({
              id: user.id,
              name: user.name || 'Anonymous',
              avatar: user.avatar || '👤',
              xp: user.xp || 0,
              isCurrentUser: true
            });
            mockSorted.sort((a, b) => b.xp - a.xp);
          }
          setLeaderboardData(mockSorted);
          return;
        }

        // Prevent infinite loading by racing the network request against a 3-second timeout
        const fetchPromise = supabase
          .from('profiles')
          .select('id, name, avatar, xp')
          .order('xp', { ascending: false })
          .limit(100);

        const timeoutPromise = new Promise<{data: any, error: Error}>((_, reject) => 
          setTimeout(() => reject(new Error("Supabase timeout")), 3000)
        );

        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedData = data.map(profile => ({
            id: profile.id,
            name: profile.name || 'Anonymous CEO',
            avatar: profile.avatar || '👤',
            xp: profile.xp || 0,
            isCurrentUser: user?.id === profile.id
          }));

          // Ensure current user is in the list even if not in top 100
          if (user && !formattedData.find(p => p.id === user.id)) {
            formattedData.push({
              id: user.id,
              name: user.name,
              avatar: user.avatar || '👤',
              xp: user.xp || 0,
              isCurrentUser: true
            });
            formattedData.sort((a, b) => b.xp - a.xp);
          }

          setLeaderboardData(formattedData);
        } else {
          setLeaderboardData([]);
        }
      } catch (error) {
        Logger.error('Leaderboard: Failed to fetch leaderboard data', error);
        // Fallback
        setLeaderboardData([...MOCK_LEADERBOARD].sort((a, b) => b.xp - a.xp));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  const sorted = leaderboardData;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-gray-800 dark:text-white flex items-center justify-center gap-3">
          <Trophy className="text-yellow-500 fill-current" size={40} />
          {t('leaderboard.title')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-bold mt-2 bg-gray-100 dark:bg-gray-800 inline-block px-4 py-1 rounded-full text-sm">{t('leaderboard.weekly_reset')}</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-yellow-500 animate-spin"></div>
            <p className="text-gray-500 font-bold animate-pulse">{t('common.loading', 'Loading rankings...')}</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-bold bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            {t('leaderboard.empty_state', 'No executives found yet. Be the first!')}
          </div>
        ) : (
          sorted.map((entry, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center p-4 rounded-3xl border-4 shadow-sm relative transition-transform hover:scale-[1.02]
                  ${entry.isCurrentUser
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 z-10'
                    : isTop3
                      ? 'bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-700'
                      : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}
               `}
              >
                <div className={`w-12 font-black text-2xl text-center mr-2 rtl:mr-0 rtl:ml-2 italic ${isTop3 ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}>
                  #{rank}
                </div>

                <div className={`w-14 h-14 rounded-full border-4 shadow-sm flex items-center justify-center text-3xl relative
                    ${isTop3 ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800' : 'border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'}
                `}>
                  {entry.avatar}
                  {rank === 1 && <div className="absolute -top-4 -right-2 rtl:-left-2 rtl:right-auto text-2xl drop-shadow-md"><Crown className="fill-yellow-400 text-yellow-600" size={32} /></div>}
                </div>

                <div className="flex-1 ml-4 rtl:ml-0 rtl:mr-4">
                  <h3 className={`font-black text-lg ${entry.isCurrentUser ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>
                    {entry.name} {entry.isCurrentUser && <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full ml-2 rtl:ml-0 rtl:mr-2 align-middle">{t('leaderboard.you')}</span>}
                  </h3>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('stats.level')} {Math.floor(entry.xp / 100) + 1} CEO</div>
                </div>

                <div className="text-right rtl:text-left bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-600">
                  <div className="font-black text-gray-800 dark:text-white text-xl">{entry.xp} XP</div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(Leaderboard);
