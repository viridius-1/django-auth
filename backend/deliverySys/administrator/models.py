from django.db import models

class Role(models.Model):
	roleType = models.CharField("Type of Role", max_length=255)
	
	def __str__(self):
		return self.roleType

class Business(models.Model):
	businessType = models.CharField("Type of Business", max_length=255)

	def __str__(self):
		return self.businessType
	
class User(models.Model):
	fullName = models.CharField("Full Name", max_length=255)
	email = models.EmailField()
	phone = models.CharField(max_length=20, null=True)
	address = models.TextField(blank=True, null=True)
	birthday = models.DateField("Birthday", null=True)
	couponCount = models.IntegerField("Current Coupon Count")
	createdAt = models.DateTimeField("Created At", auto_now_add=True)
	updatedAt = models.DateTimeField("Updated At", auto_now=True)
	password = models.CharField("Password", max_length=255)
	role = models.ForeignKey(Role, on_delete=models.CASCADE, null=True)
	business = models.ForeignKey(Business, on_delete=models.CASCADE, null=True)
	
	def __str__(self):
		return self.email
	
	def serialize(self):
		return self.__dict__
	
class Coupons(models.Model):
	code = models.CharField("Coupon Code", max_length=255)
	user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

	def __str__(self):
		return self.code

class CouponHistory(models.Model):
	fullName = models.CharField("Full Name", max_length=255)
	email = models.EmailField()
	couponCount = models.IntegerField("Current Coupon Count")
	createdAt = models.DateTimeField("Created At", auto_now_add=True)
	createdBy = models.CharField("Created By", max_length=255, null=True)

	def __str__(self):
		return self.email
	
class DownHistory(models.Model):
	from_user = models.IntegerField("from_user id", null=True)
	down_user = models.IntegerField("down_user id", null=True)