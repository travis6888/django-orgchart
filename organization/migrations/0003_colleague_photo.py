# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organization', '0002_auto_20151201_2209'),
    ]

    operations = [
        migrations.AddField(
            model_name='colleague',
            name='photo',
            field=models.CharField(max_length=500, null=True, blank=True),
        ),
    ]
