import { useRegisterSW } from 'virtual:pwa-register/react';

function ReloadPrompt() {
    // checked logic: if site is updated, offlineReady will be false, needRefresh will be true
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            if (import.meta.env.DEV) console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            if (import.meta.env.DEV) console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    return (
        <div className="ReloadPrompt-container">
            {(offlineReady || needRefresh) && (
                <div className="fixed bottom-0 right-0 m-4 p-4 bg-white dark:bg-gray-800 border rounded-xl shadow-xl z-50 flex flex-col gap-2 max-w-sm">
                    <div className="text-sm font-bold text-gray-800 dark:text-white">
                        {offlineReady ? 'App is ready to work offline!' : 'New content available, click on reload button to update.'}
                    </div>
                    <div className="flex gap-2 justify-end">
                        {needRefresh && (
                            <button
                                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold"
                                onClick={() => updateServiceWorker(true)}
                            >
                                Reload
                            </button>
                        )}
                        <button
                            className="text-gray-500 text-sm"
                            onClick={() => close()}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReloadPrompt;
