import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  getTopDishes,
  getTopRestaurants,
  getRecentReviews,
} from '../api/services/ranking';
import { getUserLocation } from '../api/services/location';

// Top dishes, top restaurants and the latest reviews - the three sections
// both home screens show.
//
// These rank across all of goodFood, so they return the same thing wherever
// the user happens to be. The stored coordinates are still sent so the
// backend can work out how far away each result is; `located` reports whether
// it had any to work with, which is all the distance labels depend on.
export function useTopPicks({
  dishLimit = 6,
  restaurantLimit = 6,
  reviewLimit = 5,
} = {}) {
  const [loading, setLoading] = useState(true);
  const [dishes, setDishes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [located, setLocated] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      Promise.all([
        getTopDishes({ limit: dishLimit }),
        getTopRestaurants({ limit: restaurantLimit }),
        getRecentReviews({ limit: reviewLimit }),
        getUserLocation(),
      ])
        .then(([dishData, restaurantData, reviewData, location]) => {
          if (!active) return;

          setDishes(dishData?.dishes ?? []);
          setRestaurants(restaurantData?.restaurants ?? []);
          setReviews(reviewData?.reviews ?? []);
          setLocated(Boolean(location) && Boolean(restaurantData?.located));
        })
        .catch(err => console.log('top picks failed:', err.message))
        .finally(() => active && setLoading(false));

      return () => {
        active = false;
      };
    }, [dishLimit, restaurantLimit, reviewLimit]),
  );

  return { loading, dishes, restaurants, reviews, located };
}
