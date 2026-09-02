"""Give the sample restaurants some conversations to show in the inbox.

    python manage.py seed_messages          # add threads that don't exist yet
    python manage.py seed_messages --fresh  # clear the sample threads first

Run `seed_sample_data` first. Each thread is a short diner-to-restaurant
exchange (reservations, questions about the menu), and every message the
recipient hasn't "read" also lands in their notification feed, exactly as
sendMessage would have created it.

Like seed_reviews, this builds everything in memory and writes it with
bulk_create/bulk_update - the database is remote and per-row writes are far
too slow.
"""

import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from account.models import Account
from messaging.models import Conversation, Message
from notification.models import Notification
from restaurant.models import Restaurant

from restaurant.management.commands._sample_data import RESTAURANTS, REVIEWERS

RANDOM_SEED = 20260902

# Each script is a list of (who, text), where "diner" is the customer and
# "owner" is whoever runs the restaurant.
SCRIPTS = [
    [
        ("diner", "Hello! Pwede magpa-reserve for tonight?"),
        ("owner", "Hello! Yes, sure"),
        ("owner", "What time and how many guests?"),
        ("diner", "Table for 2, around 7:00 PM"),
        ("owner", "Reservation confirmed"),
        ("owner", "Please arrive on time. See you later!"),
        ("diner", "Thank you!"),
    ],
    [
        ("diner", "Table for 3 tomorrow, 7 PM"),
        ("owner", "Noted! Under what name po?"),
        ("diner", "Under Forest, salamat"),
        ("owner", "Booked. See you tomorrow!"),
    ],
    [
        ("diner", "Naay available karon boss?"),
        ("owner", "Yes, walk-ins are fine until 9 PM"),
        ("diner", "Nice, adto mi ron"),
    ],
    [
        ("diner", "Do you have anything without pork?"),
        ("owner", "Yes - the seafood and vegetable dishes are all pork-free."),
        ("owner", "Happy to have the kitchen cook separately if you need it."),
        ("diner", "Perfect, thank you!"),
    ],
    [
        ("diner", "Is the signature dish still available tonight?"),
        ("owner", "It is, but it usually runs out by 8 PM."),
        ("diner", "Can you set one aside? On my way."),
        ("owner", "Done. It will be waiting for you."),
    ],
    [
        ("diner", "Do you take card payments?"),
        ("owner", "Card and e-wallet both work."),
    ],
    [
        ("diner", "Any parking near the restaurant?"),
        ("owner", "There is a free lot right behind the building."),
        ("diner", "Great, salamat!"),
    ],
]


class Command(BaseCommand):
    help = "Create sample conversations, messages and message notifications."

    def add_arguments(self, parser):
        parser.add_argument(
            "--fresh",
            action="store_true",
            help="Delete the sample conversations and message notifications first.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        random.seed(RANDOM_SEED)

        emails = [entry["email"] for entry in RESTAURANTS]
        restaurants = list(Restaurant.objects.filter(email__in=emails))
        diners = list(
            Account.objects.filter(
                username__in=[spec["username"] for spec in REVIEWERS]
            )
        )

        if not restaurants or not diners:
            self.stdout.write(
                self.style.ERROR(
                    "No sample restaurants or diners found. "
                    "Run `python manage.py seed_sample_data` first."
                )
            )
            return

        if options["fresh"]:
            self.wipe(restaurants)

        owners = {r.pk: r.account for r in restaurants}
        existing = set(
            Conversation.objects.filter(restaurant__in=restaurants).values_list(
                "restaurant_id", "account_id"
            )
        )

        now = timezone.now()
        new_conversations = []
        pairs = []

        for restaurant in restaurants:
            # Two or three diners have written to each restaurant.
            for diner in random.sample(diners, random.randint(2, 3)):
                if (restaurant.pk, diner.pk) in existing:
                    continue

                started = now - timedelta(
                    days=random.randint(0, 20), hours=random.randint(0, 20)
                )
                conversation = Conversation(
                    account=diner, restaurant=restaurant, status="open"
                )
                conversation.seeded_at = started
                new_conversations.append(conversation)
                pairs.append((conversation, restaurant, diner, started))

        if not new_conversations:
            self.stdout.write(self.style.WARNING("Every sample thread already exists."))
            return

        Conversation.objects.bulk_create(new_conversations, batch_size=200)

        for conversation in new_conversations:
            conversation.created_at = conversation.seeded_at
        Conversation.objects.bulk_update(new_conversations, ["created_at"], batch_size=200)

        messages = []
        notifications = []

        for conversation, restaurant, diner, started in pairs:
            script = random.choice(SCRIPTS)
            owner = owners[restaurant.pk]

            # The exchange plays out over a few minutes from when it started.
            sent = started
            last_incoming = {}

            for index, (who, text) in enumerate(script):
                sender = diner if who == "diner" else owner
                recipient = owner if who == "diner" else diner
                sent = sent + timedelta(minutes=random.randint(1, 9))

                # Only the last message can still be sitting unread, and only
                # for whoever didn't send it.
                is_last = index == len(script) - 1
                is_read = not (is_last and random.random() < 0.5)

                message = Message(
                    conversation=conversation,
                    sender=sender,
                    message=text,
                    is_read=is_read,
                )
                message.seeded_at = sent
                messages.append(message)

                if not is_read:
                    last_incoming[recipient.pk] = (recipient, text, sent, restaurant)

            # One notification per unread thread, matching what sendMessage does.
            for recipient, text, sent, restaurant_for_note in last_incoming.values():
                sender_name = (
                    f"{diner.first_name} {diner.last_name}".strip()
                    if recipient.pk == owners[restaurant_for_note.pk].pk
                    else restaurant_for_note.restaurant_name
                )
                notification = Notification(
                    account=recipient,
                    restaurant=restaurant_for_note,
                    title=f"New message from {sender_name}",
                    body=text[:160],
                    is_read=False,
                )
                notification.seeded_at = sent
                notifications.append(notification)

        self.write(Message, messages, ["sent_at"])
        self.write(Notification, notifications, ["created_at"])

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(new_conversations)} conversation(s), "
                f"{len(messages)} message(s) and "
                f"{len(notifications)} message notification(s)."
            )
        )

    # ------------------------------------------------------------------

    def write(self, model, rows, date_fields):
        """Insert, then restore the backdated auto_now_add timestamps.

        bulk_update reads the attribute off the instance instead of going
        through pre_save, which is what lets a seeded date stick.
        """
        if not rows:
            return

        model.objects.bulk_create(rows, batch_size=200)

        for row in rows:
            for field in date_fields:
                setattr(row, field, row.seeded_at)

        model.objects.bulk_update(rows, date_fields, batch_size=200)

    def wipe(self, restaurants):
        removed = Conversation.objects.filter(restaurant__in=restaurants).delete()[0]
        removed += Notification.objects.filter(
            restaurant__in=restaurants, title__startswith="New message from"
        ).delete()[0]
        self.stdout.write(self.style.WARNING(f"Removed {removed} sample row(s)."))
