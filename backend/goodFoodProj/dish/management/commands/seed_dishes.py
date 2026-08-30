"""Add a handful of sample dishes to a restaurant, for local testing.

    python manage.py seed_dishes                 # newest restaurant in the DB
    python manage.py seed_dishes --account 5     # newest restaurant for account 5
    python manage.py seed_dishes --restaurant 3  # a specific restaurant
    python manage.py seed_dishes --fresh         # wipe that restaurant's dishes first

Dishes are matched by name, so running it twice doesn't create duplicates.
Needs the dish_* tables, i.e. `reconcile_db` + `migrate` must have run.
"""

from django.core.management.base import BaseCommand

from restaurant.models import Restaurant
from dish.models import Dish, Dish_Category


DISHES = [
    {
        "dish_name": "Kare-Kare",
        "category": "Mains",
        "dish_price": "380.00",
        "dish_description": (
            "Oxtail and vegetables in a thick peanut sauce, served with "
            "bagoong on the side."
        ),
        "is_signature": True,
        "how_to_eat": "Stir in a little bagoong to taste, then spoon over rice.",
    },
    {
        "dish_name": "Crispy Pata",
        "category": "Mains",
        "dish_price": "520.00",
        "dish_description": (
            "Whole pork leg simmered until tender, then deep-fried for a "
            "shattering crackle."
        ),
        "is_best_seller": True,
        "preparation_notes": "Order 20 minutes ahead - it's fried to order.",
    },
    {
        "dish_name": "Sinigang na Hipon",
        "category": "Soups",
        "dish_price": "310.00",
        "dish_description": "Sour tamarind broth with prawns, radish and kangkong.",
    },
    {
        "dish_name": "Lumpiang Shanghai",
        "category": "Appetizers",
        "dish_price": "180.00",
        "dish_description": "Hand-rolled pork spring rolls, eight pieces per order.",
        "is_best_seller": True,
    },
    {
        "dish_name": "Halo-Halo",
        "category": "Desserts",
        "dish_price": "150.00",
        "dish_description": (
            "Shaved ice with sweet beans, jellies, leche flan, ube and a "
            "scoop of ice cream."
        ),
        "is_signature": True,
        "how_to_eat": "Mix everything together before the ice melts.",
    },
    {
        "dish_name": "Iced Kalamansi",
        "category": "Drinks",
        "dish_price": "70.00",
        "dish_description": "House calamansi juice, lightly sweetened.",
    },
]


class Command(BaseCommand):
    help = "Add sample dishes to a restaurant (local testing)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--account",
            type=int,
            help="Seed the newest restaurant owned by this account id.",
        )
        parser.add_argument(
            "--restaurant",
            type=int,
            help="Seed this restaurant id.",
        )
        parser.add_argument(
            "--fresh",
            action="store_true",
            help="Delete the restaurant's existing dishes first.",
        )

    def handle(self, *args, **options):
        restaurant = self._pick_restaurant(options)
        if restaurant is None:
            self.stderr.write(
                self.style.ERROR(
                    "No restaurant found. Add restaurant information first, or "
                    "pass --restaurant / --account."
                )
            )
            return

        if options["fresh"]:
            removed, _ = Dish.objects.filter(restaurant=restaurant).delete()
            self.stdout.write("Removed %s existing dish row(s)." % removed)

        created = 0
        for item in DISHES:
            category = None
            if item.get("category"):
                category, _ = Dish_Category.objects.get_or_create(
                    dish_category_name=item["category"]
                )

            _, was_created = Dish.objects.get_or_create(
                restaurant=restaurant,
                dish_name=item["dish_name"],
                defaults={
                    "dish_category": category,
                    "dish_description": item.get("dish_description", ""),
                    "dish_price": item["dish_price"],
                    "is_signature": item.get("is_signature", False),
                    "is_best_seller": item.get("is_best_seller", False),
                    "is_available": item.get("is_available", True),
                    "preparation_notes": item.get("preparation_notes", ""),
                    "how_to_eat": item.get("how_to_eat", ""),
                },
            )
            if was_created:
                created += 1

        self.stdout.write(
            self.style.SUCCESS(
                "%s sample dish(es) added to '%s' (restaurant id %s). "
                "Total now: %s."
                % (
                    created,
                    restaurant.restaurant_name,
                    restaurant.restaurant_id,
                    Dish.objects.filter(restaurant=restaurant).count(),
                )
            )
        )

    def _pick_restaurant(self, options):
        if options["restaurant"]:
            return Restaurant.objects.filter(
                pk=options["restaurant"]
            ).first()

        query = Restaurant.objects.all()
        if options["account"]:
            query = query.filter(account_id=options["account"])
        return query.order_by("-restaurant_id").first()
