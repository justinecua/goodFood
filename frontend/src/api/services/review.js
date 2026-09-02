import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_API_URL = Config.BACKEND_API_URL;

async function currentAccountId() {
  const user = JSON.parse((await AsyncStorage.getItem('user')) || '{}');
  return user.account_id ?? null;
}

async function post(path, payload) {
  const response = await axios.post(`${BACKEND_API_URL}${path}`, payload, {
    timeout: 20000,
  });
  return response.data;
}

// Reviews and the rating summary for one restaurant. `my_review` comes back
// filled in when the signed-in diner has already rated it, so the form opens
// in edit mode instead of blank.
export async function getRestaurantReviews(restaurantId) {
  return post('/get-restaurant-reviews/', {
    restaurant_id: restaurantId,
    account_id: await currentAccountId(),
  });
}

export async function addRestaurantReview({
  restaurantId,
  foodRating,
  serviceRating,
  ambianceRating,
  comment,
}) {
  return post('/add-restaurant-review/', {
    restaurant_id: restaurantId,
    account_id: await currentAccountId(),
    food_rating: foodRating,
    service_rating: serviceRating,
    ambiance_rating: ambianceRating,
    comment,
  });
}

export async function deleteRestaurantReview(resReviewId) {
  return post('/delete-restaurant-review/', {
    res_review_id: resReviewId,
    account_id: await currentAccountId(),
  });
}

export async function getDishReviews(dishId) {
  return post('/get-dish-reviews/', {
    dish_id: dishId,
    account_id: await currentAccountId(),
  });
}

export async function addDishReview({ dishId, rating, comment }) {
  return post('/add-dish-review/', {
    dish_id: dishId,
    account_id: await currentAccountId(),
    rating,
    comment,
  });
}

export async function deleteDishReview(dishReviewId) {
  return post('/delete-dish-review/', {
    dish_review_id: dishReviewId,
    account_id: await currentAccountId(),
  });
}

// Everything the signed-in diner has reviewed.
export async function getMyReviews() {
  return post('/get-my-reviews/', { account_id: await currentAccountId() });
}

// Restaurant + dish reviews left on the signed-in owner's restaurant.
export async function getOwnerReviews() {
  return post('/get-owner-reviews/', { account_id: await currentAccountId() });
}
