import { Book } from '../../../types';
import { CLASSIC_BOOKS } from './classicBooks';
import { MORE_BOOKS } from './moreBooks';

export const INITIAL_LIBRARY: Book[] = [
  ...CLASSIC_BOOKS,
  ...MORE_BOOKS
];
