"""Record who wrote each message.

The original Message model had no sender, so a thread could not be split into
"mine" and "theirs" and there was no way to tell who a reply should notify.
`messaging_message` is empty, so the column can go in as NOT NULL with no
backfill.
"""

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("messaging", "0002_initial"),
        ("account", "0003_alter_account_mobile_number"),
    ]

    operations = [
        migrations.AddField(
            model_name="message",
            name="sender",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="account.account",
            ),
        ),
    ]
