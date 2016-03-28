# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Colleague',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('username', models.CharField(max_length=200)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('manager', models.CharField(max_length=200)),
                ('title', models.CharField(max_length=200)),
                ('region', models.CharField(max_length=200)),
                ('office', models.CharField(max_length=200)),
                ('organization', models.CharField(max_length=200)),
                ('team', models.CharField(max_length=200)),
                ('sub_team', models.CharField(max_length=200)),
                ('expertise', models.CharField(max_length=5000)),
                ('interests', models.CharField(max_length=5000)),
                ('fun_fact', models.CharField(max_length=5000)),
            ],
        ),
    ]
