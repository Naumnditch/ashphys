import type { StudentVideoRequest } from '@/lib/videoRequests/types';

export function request(overrides: Partial<StudentVideoRequest> = {}): StudentVideoRequest {
  return {
    id: overrides.id ?? `req-${Math.random().toString(36).slice(2)}`,
    description: 'Why is the tension bigger at the bottom of the circle?',
    questionNumber: '7b',
    status: 'open',
    youtubeId: null,
    openedAt: null,
    adminNote: null,
    createdAt: '2026-10-10T09:00:00.000Z',
    topicId: 'topic-1',
    topicName: 'Circular motion',
    chapterNumber: 3,
    chapterTitle: 'Forces and Motion',
    screenshotUrl: null,
    ...overrides,
  };
}

export const FULFILLED = request({
  id: 'req-fulfilled',
  status: 'fulfilled',
  youtubeId: 'dQw4w9WgXcQ',
  adminNote: 'See the free-body diagram at 1:20.',
  createdAt: '2026-10-12T09:00:00.000Z',
});
