"""deliverySys URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from administrator import views

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^auth/login/', views.auth_login), 
    re_path(r'^auth/signUp/', views.auth_signUp),
    re_path(r'^users/add/', views.user_add),
    re_path(r'^users/list/', views.users_list),
    re_path(r'^users/download/select/', views.users_download_select),
    re_path(r'^users/download/save/', views.users_download_save),
    re_path(r'^users/downableCount/', views.users_downloadCount),
    re_path(r'^users/(?P<id>[0-9]+)$', views.users_detail),
    re_path(r'^roles/$', views.roles_list),
    re_path(r'^roles/(?P<id>[0-9]+)$', views.roles_edit),
    re_path(r'^businesses/$', views.businesses_list),
    re_path(r'^businesses/(?P<id>[0-9]+)$', views.businesses_edit),
    re_path(r'^coupons/add/(?P<id>[0-9]+)$', views.coupon_add),
    re_path(r'^coupons/(?P<id>[0-9]+)$', views.coupons_list),
    re_path(r'^coupons/count/(?P<id>[0-9]+)$', views.coupons_count),
    re_path(r'^coupons/sendToBsUser/$', views.coupons_sendToBsUser),
    re_path(r'^coupons/sendToCustomer/$', views.coupons_sendToCustomer),
    re_path(r'^coupons/history/', views.coupons_history),
    re_path(r'^email/message/', views.send_message),
]
