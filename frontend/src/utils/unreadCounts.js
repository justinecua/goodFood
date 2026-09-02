import { getUnreadCount } from '../api/services/notification';
import { getUnreadMessageCount } from '../api/services/messaging';

// The unread numbers behind the badges on the bottom navbar.
//
// The navbar is rendered inside every screen, so it can refresh when a screen
// comes into focus - but that isn't enough on its own. Marking notifications
// read happens *while* the notification screen is focused, and the badge has
// to drop straight away rather than waiting for the next navigation. So the
// counts live here, and anything that changes them calls refreshUnreadCounts()
// to push the new values to every mounted navbar at once.

let counts = { messages: 0, notifications: 0 };
const listeners = new Set();

export function getCounts() {
  return counts;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function refreshUnreadCounts() {
  try {
    const [notifications, messages] = await Promise.all([
      getUnreadCount(),
      getUnreadMessageCount(),
    ]);

    counts = {
      // A signed-out account, or a failed lookup, reads as nothing unread
      // rather than leaving a stale number on screen.
      notifications: Number(notifications?.unread_count) || 0,
      messages: Number(messages?.unread_count) || 0,
    };
  } catch (error) {
    console.log('refreshUnreadCounts failed:', error.message);
    counts = { messages: 0, notifications: 0 };
  }

  listeners.forEach(listener => listener(counts));
  return counts;
}

// Clears the badges without a round trip - used on logout.
export function resetUnreadCounts() {
  counts = { messages: 0, notifications: 0 };
  listeners.forEach(listener => listener(counts));
}
