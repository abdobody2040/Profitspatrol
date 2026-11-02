$filePath = "g:\Vibe coding\Profitspatrol\src\features\hq\components\KidMap.tsx"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Outer bar: more padding + gap
$content = $content.Replace(
    'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center gap-2 shadow-sm transition-colors duration-200',
    'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3.5 flex items-center gap-3 shadow-sm transition-colors duration-200'
)

# Avatar w-10 -> w-12
$content = $content.Replace(
    'w-10 h-10 rounded-full overflow-hidden border-2 border-blue-400 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shadow-md',
    'w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shadow-md'
)

# Rank badge text-[7px] -> text-[9px]
$content = $content.Replace(
    'bg-blue-500 text-white font-black text-[7px] px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-800 shadow-sm whitespace-nowrap leading-none',
    'bg-blue-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full border-2 border-white dark:border-gray-800 shadow-sm whitespace-nowrap leading-none'
)

# Empire label text-[8px] -> text-[11px]
$content = $content.Replace(
    'text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500',
    'text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500'
)

# Empire value text-sm -> text-lg
$content = $content.Replace(
    'className="text-sm font-black text-yellow-600 dark:text-yellow-400 leading-none"',
    'className="text-lg font-black text-yellow-600 dark:text-yellow-400 leading-none"'
)

# Separator
$content = $content.Replace(
    'w-px h-8 bg-gray-200 dark:bg-white/10 mx-1 flex-shrink-0',
    'w-px h-9 bg-gray-200 dark:bg-gray-700 mx-2 flex-shrink-0'
)

# Income chip: gap-1 -> gap-1.5, px-2 py-1 -> px-3 py-1.5
$content = $content.Replace(
    'flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-2 py-1 rounded-xl flex-shrink-0',
    'flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl flex-shrink-0'
)
# Income icon size
$content = $content.Replace('<TrendingUp size={11} className="text-emerald-600 dark:text-emerald-400"', '<TrendingUp size={14} className="text-emerald-600 dark:text-emerald-400"')
# Income label
$content = $content.Replace(
    'text-[7px] font-bold text-emerald-700 dark:text-emerald-400/70 uppercase',
    'text-[10px] font-bold text-emerald-700 dark:text-emerald-400/70 uppercase'
)
# Income value
$content = $content.Replace(
    'text-[10px] font-black text-emerald-600 dark:text-emerald-300',
    'text-sm font-black text-emerald-600 dark:text-emerald-300'
)

# PP Tokens chip
$content = $content.Replace(
    'flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 px-2 py-1 rounded-xl flex-shrink-0',
    'flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 px-3 py-1.5 rounded-xl flex-shrink-0'
)
$content = $content.Replace(
    'text-[10px] font-black text-yellow-600 dark:text-yellow-400',
    'text-sm font-black text-yellow-600 dark:text-yellow-400'
)

# Streak chip
$content = $content.Replace(
    'flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 px-2 py-1 rounded-xl flex-shrink-0',
    'flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 px-3 py-1.5 rounded-xl flex-shrink-0'
)
$content = $content.Replace('<Flame size={12} className="fill-orange-400 text-orange-500"', '<Flame size={16} className="fill-orange-400 text-orange-500"')
$content = $content.Replace(
    'text-[10px] font-black text-orange-600 dark:text-orange-400',
    'text-sm font-black text-orange-600 dark:text-orange-400'
)

# HQ chip
$content = $content.Replace(
    'flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 px-2 py-1 rounded-xl flex-shrink-0 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors',
    'flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-xl flex-shrink-0 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors'
)
$content = $content.Replace(
    'text-[10px] font-black text-indigo-600 dark:text-indigo-400',
    'text-sm font-black text-indigo-600 dark:text-indigo-400'
)

# Empire chip (desktop)
$content = $content.Replace(
    'items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-2 py-1 rounded-xl flex-shrink-0 hidden md:flex',
    'items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl flex-shrink-0 hidden md:flex'
)
$content = $content.Replace(
    'text-[10px] font-black text-emerald-600 dark:text-emerald-400',
    'text-sm font-black text-emerald-600 dark:text-emerald-400'
)

# PlayHub button: w-8 h-8 -> w-10 h-10
$content = $content.Replace(
    'w-8 h-8 rounded-xl bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center shadow-md border border-blue-400/30 transition-colors',
    'w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center shadow-md border border-blue-400/30 transition-colors'
)
$content = $content.Replace('<Gamepad2 size={15} className="text-white"', '<Gamepad2 size={18} className="text-white"')

# PlayHub dropdown: widen + top offset
$content = $content.Replace(
    'top-10 z-[199] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-2 flex flex-col gap-1 min-w-[140px]',
    'top-12 z-[199] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-2 flex flex-col gap-1 min-w-[170px]'
)
$content = $content.Replace(
    'text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest px-2 pb-1',
    'text-xs font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest px-2 pb-1'
)
$content = $content.Replace(
    'gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 text-xs font-bold',
    'gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 text-sm font-bold'
)

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done - header widened and fonts enlarged"
