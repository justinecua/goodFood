"""Track when a message was last rewritten.

Nullable, so existing messages keep reading as never edited.
"""

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("messaging", "0003_message_sender"),
    ]

    operations = [
        migrations.AddField(
            model_name="message",
            name="edited_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
