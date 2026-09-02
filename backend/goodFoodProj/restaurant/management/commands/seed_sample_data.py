"""Populate the database with sample restaurants, dishes and diners.

    python manage.py seed_sample_data          # add anything that's missing
    python manage.py seed_sample_data --fresh  # delete the sample rows first

Creates 15 restaurants around Northern Mindanao, each with an owner account,
a location, operating hours, cuisine categories and 6 dishes, plus 8 diner
accounts to review them. Everything is matched on a natural key (restaurant
email, account username, dish name) so running it twice is harmless.

The sample logins all use the password below - they are dev fixtures, not
anything that should reach a real deployment.

Reviews are seeded separately: `python manage.py seed_reviews`.
"""

from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from django.db import transaction

from account.models import Account, AccountType
from dish.models import Dish, Dish_Category
from location.models import Location
from restaurant.models import (
    Category,
    Operating_Hours,
    Restaurant,
    Restaurant_Branch,
    Restaurant_Category,
)

from ._sample_data import DEFAULT_HOURS, DISH_CATEGORIES, RESTAURANTS, REVIEWERS

SAMPLE_PASSWORD = "goodfood123"


class Command(BaseCommand):
    help = "Create sample restaurants, dishes, categories and diner accounts."

    def add_arguments(self, parser):
        parser.add_argument(
            "--fresh",
            action="store_true",
            help="Delete the sample restaurants and accounts before seeding.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["fresh"]:
            self.wipe()

        owner_type, _ = AccountType.objects.get_or_create(account_type="Restaurant Owner")
        diner_type, _ = AccountType.objects.get_or_create(account_type="Diner")

        for name, description in DISH_CATEGORIES:
            Dish_Category.objects.get_or_create(
                dish_category_name=name,
                defaults={"dish_category_description": description},
            )

        dish_categories = {
            c.dish_category_name: c for c in Dish_Category.objects.all()
        }

        restaurants_made = 0
        dishes_made = 0

        for entry in RESTAURANTS:
            owner = self.upsert_account(entry["owner"], owner_type)
            location = self.upsert_location(entry["location"], entry["email"])

            restaurant, created = Restaurant.objects.get_or_create(
                email=entry["email"],
                defaults={
                    "account": owner,
                    "location": location,
                    "restaurant_name": entry["restaurant_name"],
                    "restaurant_description": entry["restaurant_description"],
                    "address": entry["address"],
                    "contact_number": entry["contact_number"],
                },
            )
            restaurants_made += int(created)

            if not created:
                restaurant.account = owner
                restaurant.location = location
                restaurant.restaurant_name = entry["restaurant_name"]
                restaurant.restaurant_description = entry["restaurant_description"]
                restaurant.address = entry["address"]
                restaurant.contact_number = entry["contact_number"]
                restaurant.save()

            self.sync_hours(restaurant, entry.get("hours") or DEFAULT_HOURS)
            self.sync_categories(restaurant, entry["categories"])
            self.sync_branches(restaurant, entry.get("branches") or [])

            for spec in entry["dishes"]:
                _, dish_created = Dish.objects.get_or_create(
                    restaurant=restaurant,
                    dish_name=spec["dish_name"],
                    defaults={
                        "dish_category": dish_categories.get(spec["dish_category"]),
                        "dish_description": spec.get("dish_description"),
                        "dish_price": spec["dish_price"],
                        "is_signature": spec.get("is_signature", False),
                        "is_best_seller": spec.get("is_best_seller", False),
                        "is_available": spec.get("is_available", True),
                        "preparation_notes": spec.get("preparation_notes"),
                        "how_to_eat": spec.get("how_to_eat"),
                    },
                )
                dishes_made += int(dish_created)

        for spec in REVIEWERS:
            self.upsert_account(spec, diner_type)

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {restaurants_made} new restaurant(s) and {dishes_made} new dish(es). "
                f"{Restaurant.objects.count()} restaurants and {Dish.objects.count()} dishes in total.\n"
                f"Sample accounts use the password '{SAMPLE_PASSWORD}'."
            )
        )

    # ------------------------------------------------------------------

    def upsert_account(self, spec, account_type):
        """An owner or diner account, matched on username."""
        username = spec["username"]

        account, created = Account.objects.get_or_create(
            username=username,
            defaults={
                "first_name": spec["first_name"],
                "last_name": spec["last_name"],
                "gender": spec.get("gender"),
                "email_address": f"{username}@goodfood.test",
                "password": make_password(SAMPLE_PASSWORD),
                "account_type": account_type,
            },
        )

        if created:
            self.stdout.write(f"  account: {username}")

        return account

    def upsert_location(self, spec, key):
        """One location row per sample restaurant, matched on its coordinates."""
        location, _ = Location.objects.get_or_create(
            latitude=spec["latitude"],
            longitude=spec["longitude"],
            defaults={
                "city": spec["city"],
                "province": spec["province"],
                "region": spec["region"],
                "country": spec["country"],
            },
        )
        return location

    def sync_hours(self, restaurant, hours):
        Operating_Hours.objects.filter(restaurant=restaurant).delete()
        Operating_Hours.objects.bulk_create(
            [
                Operating_Hours(
                    restaurant=restaurant,
                    day_of_week=day,
                    opening_time=opening,
                    closing_time=closing,
                    is_closed=is_closed,
                )
                for day, opening, closing, is_closed in hours
            ]
        )

    def sync_categories(self, restaurant, names):
        for name in names:
            category, _ = Category.objects.get_or_create(category_name=name)
            Restaurant_Category.objects.get_or_create(
                restaurant=restaurant, category=category
            )

    def sync_branches(self, restaurant, branches):
        for spec in branches:
            Restaurant_Branch.objects.get_or_create(
                restaurant=restaurant,
                branch_name=spec["branch_name"],
                defaults={
                    "address": spec["address"],
                    "contact_number": spec["contact_number"],
                    "latitude": spec["latitude"],
                    "longitude": spec["longitude"],
                },
            )

    def wipe(self):
        """Remove only the rows this command created."""
        emails = [entry["email"] for entry in RESTAURANTS]
        usernames = [entry["owner"]["username"] for entry in RESTAURANTS]
        usernames += [spec["username"] for spec in REVIEWERS]

        # Dishes, hours, branches and reviews all cascade from the restaurant.
        deleted, _ = Restaurant.objects.filter(email__in=emails).delete()
        Account.objects.filter(username__in=usernames).delete()

        self.stdout.write(self.style.WARNING(f"Removed {deleted} sample row(s)."))
