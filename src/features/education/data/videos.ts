import { Video } from '../../../types';

export const INITIAL_VIDEOS: Video[] = [
    {
        id: 'vid_1',
        title: 'How Money Works',
        description: 'A fun animation explaining the basics of currency and value.',
        youtubeId: 'p7HKvqRI_Bo', // Example ID
        category: 'Finance',
        duration: '4:20',
        tags: ['money', 'history']
    },
    {
        id: 'vid_2',
        title: 'Think Like a CEO',
        description: 'Understand the mindset of successful entrepreneurs.',
        youtubeId: 'F2i09t-5c7s',
        category: 'Mindset',
        duration: '10:05',
        tags: ['leadership', 'mindset']
    },
    {
        id: 'vid_3',
        title: 'Lemonade Stand Strategy',
        description: 'Pro tips to maximize profits in your first business.',
        youtubeId: 'M576WBa9ja0',
        category: 'Strategy',
        duration: '6:15',
        tags: ['gameplay', 'strategy']
    }
];
