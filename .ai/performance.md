# ProfitsPatrol Performance Optimization

## Rendering Optimization
- **React.memo**: Used for static UI elements and heavy list items.
- **useMemo / useCallback**: Applied to expensive calculations and stable event handlers to prevent unnecessary re-renders.
- **Framer Motion**: Using `layout` and `AnimatePresence` efficiently to avoid layout thrashing.

## Asset Management
- **Image Optimization**: Critical assets are served via local public folder.
- **Lazy Loading**: Native `loading="lazy"` on non-critical images.
- **Code Splitting**: Dynamic imports (`React.lazy`) for all route-level components.

## Data & Database
- **Indexing**: Frequent queries (e.g., `user_id`) are indexed in PostgreSQL.
- **Caching**: LocalStore/Zustand acts as a first-level cache. Supabase fetches are minimized using store-level checks.
- **Query Optimization**: Use specific column selects instead of `select(*)` where possible.

## Bundle Size
- **Tooling**: Vite with Terser compression.
- **PWA**: Workbox handles offline caching of static assets, reducing subsequent load times.

## Performance Budgets
- **Lighthouse Targets**:
  - Performance: > 90
  - Accessibility: > 95
  - Best Practices: > 95
  - SEO: > 95
