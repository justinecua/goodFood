"""Fill the sample restaurants with ratings, reviews and notifications.

    python manage.py seed_reviews          # add reviews wherever they're missing
    python manage.py seed_reviews --fresh  # clear the sample reviews first

Run `seed_sample_data` first - this needs the sample restaurants, dishes and
diner accounts to exist. Every restaurant gets a house "quality" between 2.9
and 4.8 stars, and each review is drawn around it, so the top-rated lists come
out with a real spread instead of everything sitting at 4.5.

The random draw is seeded, so repeated runs on a fresh database produce the
same reviews.
"""

import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from account.models import Account
from dish.models import Dish
from notification.models import Notification
from restaurant.models import Restaurant
from review.models import Dish_Review, Restaurant_Review

from restaurant.management.commands._sample_data import RESTAURANTS, REVIEWERS

RANDOM_SEED = 20260902

# House quality per restaurant, keyed by the email in _sample_data. Reviews
# are drawn around these, so the "top" lists have something to sort.
QUALITY = {
    "hello@titabebangs.ph": 4.7,
    "orders@thecrunch.ph": 4.2,
    "kumain@palapahouse.ph": 4.8,
    "reserve@timogagrill.ph": 4.5,
    "hi@cafeaurora.ph": 4.3,
    "hello@ramenkita.ph": 4.6,
    "manoy@lechonbelly.ph": 4.4,
    "kain@bahaykubo.ph": 3.9,
    "book@casailigan.ph": 4.1,
    "hello@tinolaexpress.ph": 3.6,
    "hello@bulanglangcdo.ph": 4.5,
    "brew@kagayankapehan.ph": 4.0,
    "kain@sinuglawbaybay.ph": 4.4,
    "hello@titacely.ph": 3.4,
    "reserve@highlandgrill.ph": 4.6,
}

RESTAURANT_COMMENTS = {
    5: [
        "Best meal we have had all year. We were seated straight away and the food came out fast.",
        "Everything we ordered was excellent. Staff checked on us without hovering.",
        "Worth the drive. Portions are generous and the prices are fair for what you get.",
        "Brought the whole family and there were no complaints, which never happens.",
    ],
    4: [
        "Really good food, though the place gets loud once it fills up.",
        "Solid meal. Service slowed down a bit at peak hour but the staff were apologetic.",
        "We enjoyed it. Would come back on a weekday when it is quieter.",
        "Good value. Parking is the only hassle.",
    ],
    3: [
        "Food was fine, nothing memorable. Might have caught them on an off day.",
        "Decent but slow. We waited nearly forty minutes for the mains.",
        "Mixed - one dish was great, the other was under-seasoned.",
    ],
    2: [
        "Long wait and the food arrived lukewarm. The staff were polite about it at least.",
        "Overpriced for the portion size. The room also needed a clean.",
    ],
    1: [
        "Waited an hour, got the wrong order, and nobody came back to check.",
    ],
}

DISH_COMMENTS = {
    5: [
        "Order this. Genuinely one of the best versions I have had.",
        "Perfectly cooked and seasoned. I would come back just for this.",
        "Exactly what it should be. No notes.",
    ],
    4: [
        "Very good, though a little on the salty side for me.",
        "Enjoyed it. Portion is smaller than I expected for the price.",
        "Really tasty. Would order again.",
    ],
    3: [
        "It was okay. Nothing wrong with it, just not exciting.",
        "A bit dry, but the sauce carried it.",
    ],
    2: [
        "Under-seasoned and it arrived cold.",
    ],
    1: [
        "Could not finish it. Something was off.",
    ],
}

# Notifications a diner receives - the owner's are generated from the reviews
# themselves in review/queries.py, so these are the other half of the feature.
DINER_NOTIFICATIONS = [
    ("Your review is live", "Thanks for rating {restaurant}. Your review is now visible to other diners."),
    ("{restaurant} replied to your review", "The owner thanked you for the feedback and hopes to see you again."),
    ("New dish at {restaurant}", "They just added something new to the menu. Have a look."),
    ("{restaurant} is trending near you", "It moved into the top rated restaurants in your area this week."),
    ("Someone found your review helpful", "Your review of {restaurant} was marked helpful by another diner."),
]


class Command(BaseCommand):
    help = "Create sample reviews, ratings and notifications for the seeded restaurants."

    def add_arguments(self, parser):
        parser.add_argument(
            "--fresh",
            action="store_true",
            help="Delete existing reviews and notifications for the sample data first.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        random.seed(RANDOM_SEED)

        emails = [entry["email"] for entry in RESTAURANTS]
        restaurants = list(Restaurant.objects.filter(email__in=emails))

        if not restaurants:
            self.stdout.write(
                self.style.ERROR(
                    "No sample restaurants found. Run `python manage.py seed_sample_data` first."
                )
            )
            return

        diners = list(
            Account.objects.filter(
                username__in=[spec["username"] for spec in REVIEWERS]
            )
        )

        if not diners:
            self.stdout.write(
                self.style.ERROR("No sample diner accounts found. Run seed_sample_data first.")
            )
            return

        if options["fresh"]:
            self.wipe(restaurants, diners)

        now = timezone.now()

        # The database is remote, so everything is built in memory first and
        # written in a handful of round trips rather than one per review.
        # Existing rows are looked up once, as (parent_id, account_id) pairs.
        seen_restaurant = set(
            Restaurant_Review.objects.filter(restaurant__in=restaurants)
            .values_list("restaurant_id", "account_id")
        )
        seen_dish = set(
            Dish_Review.objects.filter(restaurant__in=restaurants)
            .values_list("dish_id", "account_id")
        )

        new_restaurant_reviews = []
        new_dish_reviews = []
        new_notifications = []

        dishes_by_restaurant = {}
        for dish in Dish.objects.filter(restaurant__in=restaurants):
            dishes_by_restaurant.setdefault(dish.restaurant_id, []).append(dish)

        for restaurant in restaurants:
            quality = QUALITY.get(restaurant.email, 4.0)

            # Every diner reviews most restaurants, but not all of them, so
            # review counts differ between places.
            reviewers = random.sample(diners, random.randint(4, len(diners)))

            for diner in reviewers:
                if (restaurant.pk, diner.pk) in seen_restaurant:
                    continue

                food = self.draw(quality)
                service = self.draw(quality - 0.2)
                ambiance = self.draw(quality - 0.1)
                overall = round((food + service + ambiance) / 3, 2)
                created = now - timedelta(
                    days=random.randint(1, 240), hours=random.randint(0, 23)
                )

                review = Restaurant_Review(
                    restaurant=restaurant,
                    account=diner,
                    food_rating=food,
                    service_rating=service,
                    ambiance_rating=ambiance,
                    overall_rating=overall,
                    comment=self.comment(RESTAURANT_COMMENTS, overall),
                )
                # created_at/updated_at are auto fields, so bulk_create stamps
                # them with "now" and the real date is written afterwards.
                review.seeded_at = created
                new_restaurant_reviews.append(review)

                # The owner hears about it, exactly as they would in the app.
                new_notifications.append(
                    self.notification(
                        restaurant.account,
                        restaurant,
                        "New restaurant review",
                        f"{diner.username} rated {restaurant.restaurant_name} "
                        f"{overall:.1f} out of 5.",
                        created,
                    )
                )

            for dish in dishes_by_restaurant.get(restaurant.pk, []):
                # A dish is rated by a subset of the people who rated the
                # restaurant - not everyone orders everything.
                for diner in random.sample(reviewers, random.randint(2, min(6, len(reviewers)))):
                    if (dish.pk, diner.pk) in seen_dish:
                        continue

                    # Signature and best-selling dishes score a little higher.
                    bonus = 0.3 if (dish.is_signature or dish.is_best_seller) else 0.0
                    rating = self.draw(quality + bonus)
                    created = now - timedelta(
                        days=random.randint(1, 240), hours=random.randint(0, 23)
                    )

                    review = Dish_Review(
                        dish=dish,
                        restaurant=restaurant,
                        account=diner,
                        rating=rating,
                        comment=self.comment(DISH_COMMENTS, rating),
                    )
                    review.seeded_at = created
                    new_dish_reviews.append(review)

        # Give the diners a feed of their own so the notification screen has
        # something to show on both sides of the app.
        for diner in diners:
            for _ in range(random.randint(3, 6)):
                restaurant = random.choice(restaurants)
                title, body = random.choice(DINER_NOTIFICATIONS)
                created = now - timedelta(
                    days=random.randint(0, 30), hours=random.randint(0, 23)
                )
                new_notifications.append(
                    self.notification(
                        diner,
                        restaurant,
                        title.format(restaurant=restaurant.restaurant_name),
                        body.format(restaurant=restaurant.restaurant_name),
                        created,
                    )
                )

        self.write(Restaurant_Review, new_restaurant_reviews, ["created_at", "updated_at"])
        self.write(Dish_Review, new_dish_reviews, ["created_at", "updated_at"])
        self.write(Notification, new_notifications, ["created_at"])

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(new_restaurant_reviews)} restaurant review(s), "
                f"{len(new_dish_reviews)} dish review(s) and "
                f"{len(new_notifications)} notification(s)."
            )
        )

    # ------------------------------------------------------------------

    def draw(self, quality):
        """A single 1-5 star rating scattered around a restaurant's quality."""
        value = random.gauss(quality, 0.55)
        return round(min(5.0, max(1.0, value)) * 2) / 2

    def comment(self, pool, rating):
        """A comment matching the star band - a third of reviews leave none."""
        if random.random() < 0.3:
            return None

        band = max(1, min(5, int(round(float(rating)))))
        return random.choice(pool[band])

    def notification(self, account, restaurant, title, body, created):
        notification = Notification(
            account=account,
            restaurant=restaurant,
            title=title,
            body=body,
            # Anything older than a week has already been seen.
            is_read=(timezone.now() - created).days > 7,
        )
        notification.seeded_at = created
        return notification

    def write(self, model, rows, date_fields):
        """Insert the rows, then correct the auto_now/auto_now_add stamps.

        bulk_update reads the attribute straight off the instance rather than
        going through pre_save, which is the only way to keep a backdated
        created_at on a model that declares auto_now_add.
        """
        if not rows:
            return

        model.objects.bulk_create(rows, batch_size=200)

        for row in rows:
            for field in date_fields:
                setattr(row, field, row.seeded_at)

        model.objects.bulk_update(rows, date_fields, batch_size=200)

    def wipe(self, restaurants, diners):
        removed = 0
        removed += Restaurant_Review.objects.filter(restaurant__in=restaurants).delete()[0]
        removed += Dish_Review.objects.filter(restaurant__in=restaurants).delete()[0]
        removed += Notification.objects.filter(restaurant__in=restaurants).delete()[0]
        removed += Notification.objects.filter(account__in=diners).delete()[0]
        self.stdout.write(self.style.WARNING(f"Removed {removed} sample row(s)."))
