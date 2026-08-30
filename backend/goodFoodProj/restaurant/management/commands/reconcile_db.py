"""One-off: apply reconcile_existing_db.sql through Django's DB connection.

For databases created before the full ER-diagram schema. `restaurant.0001_initial`
is recorded as applied (its file was regenerated), so `migrate` skips it and the
existing `restaurant_*` tables never get the new columns/tables. This runs the
SQL that migration would have produced.

    python manage.py reconcile_db
    python manage.py migrate

Safe to skip on a fresh database.
"""

from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import connections, transaction

SQL_FILE = Path(settings.BASE_DIR) / "reconcile_existing_db.sql"


class Command(BaseCommand):
    help = "Apply reconcile_existing_db.sql (schema catch-up for pre-ERD databases)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--check",
            action="store_true",
            help="Report whether the reconcile is still needed, then exit.",
        )

    def handle(self, *args, **options):
        cursor = connections["default"].cursor()
        cursor.execute(
            """
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'restaurant_restaurant' AND column_name = 'restaurant_id'
            """
        )
        already_done = cursor.fetchone() is not None

        if options["check"]:
            self.stdout.write("reconcile needed: %s" % ("no" if already_done else "yes"))
            return

        if already_done:
            self.stdout.write(
                self.style.WARNING(
                    "restaurant_restaurant.restaurant_id already exists - "
                    "nothing to do."
                )
            )
            return

        sql = SQL_FILE.read_text()
        with transaction.atomic(using="default"):
            connections["default"].cursor().execute(sql)

        self.stdout.write(
            self.style.SUCCESS("Reconcile applied. Now run: python manage.py migrate")
        )
