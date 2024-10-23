# Generated by Django 5.1.2 on 2024-10-23 10:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
    name='StudentUser',
    fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('email', models.EmailField(max_length=255, unique=True)),
        ('password', models.CharField(max_length=128)),
    ],
)
,
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('duration_from_year', models.IntegerField()),
                ('duration_from_month', models.IntegerField()),
                ('duration_to_year', models.IntegerField()),
                ('duration_to_month', models.IntegerField()),
                ('description', models.TextField()),
                ('skills', models.CharField(default='N/A', max_length=300)),
                ('link', models.URLField(blank=True, null=True)),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to='users.studentuser')),
            ],
        ),
        migrations.CreateModel(
            name='Experience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('employer', models.CharField(max_length=255)),
                ('location', models.CharField(max_length=100)),
                ('role_title', models.CharField(max_length=100)),
                ('duration_from_year', models.IntegerField()),
                ('duration_from_month', models.IntegerField()),
                ('duration_to_year', models.IntegerField()),
                ('duration_to_month', models.IntegerField()),
                ('description', models.TextField()),
                ('skills', models.CharField(max_length=255)),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='experiences', to='users.studentuser')),
            ],
        ),
        migrations.CreateModel(
            name='Education',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('institute_name', models.CharField(max_length=200)),
                ('duration_from_year', models.IntegerField()),
                ('duration_from_month', models.IntegerField()),
                ('duration_to_year', models.IntegerField()),
                ('duration_to_month', models.IntegerField()),
                ('marks_or_grade', models.CharField(max_length=100)),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='education', to='users.studentuser')),
            ],
        ),
        migrations.CreateModel(
            name='Certificate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('file_link', models.URLField()),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='certificates', to='users.studentuser')),
            ],
        ),
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address_line_1', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=100)),
                ('state', models.CharField(max_length=100)),
                ('pincode', models.CharField(max_length=10)),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='addresses', to='users.studentuser')),
            ],
        ),
    ]
