from django.db import migrations

def create_data(apps, schema_editor):
    User = apps.get_model('administrator', 'User')
    Role = apps.get_model('administrator', 'Role')
    Business = apps.get_model('administrator', 'Business')
    User(fullName="superAdmin", email="superAdmin@gmail.com", address="adminAddress", birthday="2000-01-01", phone="123456789", password="123456", business_id=1, role_id=1, couponCount=0).save()
    Role(roleType="admin").save()
    Business(businessType="admin").save()

class Migration(migrations.Migration):

    dependencies = [
        ('administrator', '0007_remove_user_avatar_remove_user_createdby_and_more'),
    ]

    operations = [
        migrations.RunPython(create_data),
    ]