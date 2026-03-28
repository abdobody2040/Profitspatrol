
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { Book } from '../../types';
import { INITIAL_LIBRARY } from '../../features/library/data/libraryBooks';
import { MORE_BOOKS } from '../../features/library/data/moreBooks';

export interface LibrarySlice {
    library: Book[];

    // Library CRUD
    addBook: (book: Book) => void;
    updateBook: (id: string, updates: Partial<Book>) => void;
    removeBook: (id: string) => void;
    resetLibrary: () => void;
    syncLibrary: () => void;

    // Note: readBook is in UserSlice as it updates user state
}

export const createLibrarySlice: StateCreator<AppState, [], [], LibrarySlice> = (set, get) => ({
    library: INITIAL_LIBRARY,

    addBook: (book) => set((state) => ({ library: [...state.library, book] })),

    updateBook: (id, updates) => set((state) => ({
        library: state.library.map(b => b.id === id ? { ...b, ...updates } : b)
    })),

    removeBook: (id) => set((state) => ({
        library: state.library.filter(b => b.id !== id)
    })),

    resetLibrary: () => set(() => ({
        library: INITIAL_LIBRARY
    })),

    syncLibrary: () => set((state) => {
        // Sync Library
        const initialMap = new Map(INITIAL_LIBRARY.map(b => [b.id, b]));
        const updatedLibrary: Book[] = [];
        state.library.forEach(book => {
            const staticBook = initialMap.get(book.id);
            if (staticBook) {
                updatedLibrary.push({
                    ...book,
                    ...staticBook, 
                });
            }
        });
        INITIAL_LIBRARY.forEach(staticBook => {
            if (!updatedLibrary.find(b => b.id === staticBook.id)) {
                updatedLibrary.push(staticBook);
            }
        });

        // Sync Exclusive Books
        const moreBooksMap = new Map(MORE_BOOKS.map(b => [b.id, b]));
        const updatedExclusiveBooks: Book[] = [];
        state.exclusiveBooks.forEach(book => {
            const staticBook = moreBooksMap.get(book.id);
            if (staticBook) {
                updatedExclusiveBooks.push({
                    ...book,
                    ...staticBook,
                });
            }
        });
        MORE_BOOKS.forEach(staticBook => {
            if (!updatedExclusiveBooks.find(b => b.id === staticBook.id)) {
                updatedExclusiveBooks.push(staticBook);
            }
        });

        return { library: updatedLibrary, exclusiveBooks: updatedExclusiveBooks };
    })
});
