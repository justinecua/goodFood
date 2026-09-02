import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  getCounts,
  subscribe,
  refreshUnreadCounts,
} from '../utils/unreadCounts';

// Unread message and notification counts for the bottom navbar badges.
//
// Refetches whenever the surrounding screen comes into focus, and also listens
// for pushes from refreshUnreadCounts() so a badge clears the moment something
// is marked read on the screen already showing.
export function useUnreadCounts() {
  const [counts, setCounts] = useState(getCounts);

  useEffect(() => subscribe(setCounts), []);

  useFocusEffect(
    useCallback(() => {
      refreshUnreadCounts();
    }, []),
  );

  return counts;
}
