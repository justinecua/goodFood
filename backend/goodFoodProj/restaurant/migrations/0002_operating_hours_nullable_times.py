"""Drop NOT NULL from the operating-hours times.

The model has declared these `null=True` since 0001_initial (a restaurant that
is closed on a given day has no opening or closing time), but the live database
predates that file and still carries the NOT NULL constraints. Django sees no
model-state change here, so an AlterField would emit nothing - the ALTER has to
be spelled out.
"""

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("restaurant", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE restaurant_operating_hours
                    ALTER COLUMN opening_time DROP NOT NULL,
                    ALTER COLUMN closing_time DROP NOT NULL;
            """,
            reverse_sql="""
                ALTER TABLE restaurant_operating_hours
                    ALTER COLUMN opening_time SET NOT NULL,
                    ALTER COLUMN closing_time SET NOT NULL;
            """,
        ),
    ]
