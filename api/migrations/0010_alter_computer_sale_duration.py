# Generated by Django 4.0 on 2022-02-13 14:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_computer_cpu_computer_cpu_type_computer_gpu_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='computer',
            name='sale_duration',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]