# Generated by Django 4.0.2 on 2022-02-11 18:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('interviewscheduler', '0004_alter_candidate_id_alter_interview_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidate',
            name='id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='interview',
            name='id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]
