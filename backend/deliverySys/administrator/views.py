import os
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from django.core.mail import BadHeaderError, send_mail
from email.mime.image import MIMEImage
from django.core.mail import EmailMultiAlternatives
from .models import User, Role, Business, Coupons, CouponHistory, DownHistory
from .serializers import *
from django.conf import settings

@api_view(['POST'])
def auth_login(request):
    if request.method == 'POST':
        try:
            data = User.objects.get(email = request.data.get('email'))
        except User.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST, data="This email doesn' t exist.")
        serializer = UserSerializer(data, context={'request': request})
        if request.data.get('password') == serializer.data.get('password'):
            return Response({'data': serializer.data})
        return Response(status=status.HTTP_400_BAD_REQUEST, data="Password isn' t correctly.")

@api_view(['POST'])
def auth_signUp(request):
    if request.method == 'POST':
        if User.objects.filter(email=request.data.get('email')).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST, data="This email already exists.")
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST, data="Bad request.")

@api_view(['POST'])
def user_add(request):
    if request.method == 'POST':
        if User.objects.filter(email=request.data.get('email')).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            sendBy_email = request.data.get("sendBy_email")
            if sendBy_email:
                sendBy_id = request.data.get("sendBy_id")
                sendTo_email = request.data.get("sendTo_email")
                sendBy_email = request.data.get("sendBy_email")
                send_code = request.data.get("send_code")
                html_message = render_to_string('emailtemplate.html', {'context': 'values'})
                html_message = html_message.replace("[Coupon Code]", "[" + send_code + "]")
                subject = 'You have just received a coupon.'
                msg = EmailMultiAlternatives(
                    subject,
                    html_message,
                    from_email=sendBy_email,
                    to=[sendTo_email]
                )
                msg.mixed_subtype = 'related'
                msg.attach_alternative(html_message, "text/html")
                img_dir = settings.STATIC_ROOT
                images = ['_icon.png', 'bee.png', 'line.png', 'logo-mtp-new.png', 'LOGO_labor_1.png', 'qr-code_3.png']
                for item in images:
                    file_path = os.path.join(img_dir, item)
                    with open(file_path, 'rb') as f:
                        img = MIMEImage(f.read())
                        img.add_header('Content-ID', '<{name}>'.format(name=item))
                        img.add_header('Content-Disposition', 'inline', filename=item)
                        msg.attach(img)
                try: 
                    msg.send(fail_silently=False)
                except BadHeaderError:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
                Coupons.objects.get(code=send_code, user_id=sendBy_id).delete()
                history_serializer = CouponHistorySerializer(data=request.data.get("history"))
                if history_serializer.is_valid():
                    history_serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET', 'POST'])
def users_list(request):
    if request.method == 'GET':
        users = User.objects.select_related().all().order_by('business')
        serializer = UserSerializer(users, context={'request': request} ,many=True)
        return Response({'data': serializer.data})
    
    elif request.method == 'POST':
        fullName = request.data.get('fullName')
        email = request.data.get('email')
        address = request.data.get('address')
        business_id = request.data.get('business')
        role_id = request.data.get('role')
        users = User.objects.select_related().all().order_by('business')
        if fullName:
            users = users.filter(fullName=fullName)
        if email:
            users = users.filter(email=email)
        if address:
            users = users.filter(address=address)
        if business_id:
            users = users.filter(business_id=business_id)
        if role_id:
            users = users.filter(role_id__gte=role_id)
        
        serializer = UserSerializer(users, context={'request': request}, many=True)
        return Response({'data': serializer.data})
    
@api_view(['POST'])
def users_download_select(request):
    if request.method == 'POST':
        from_user_id = request.data.get('from_user')
        business = request.data.get('business')
        downCount = request.data.get('downCount')
        role = request.data.get('role')
        downUsers = User.objects.all()
        if business:
            downUsers = downUsers.filter(business_id = business)
        if role:
            downUsers = downUsers.filter(role_id__gte=role)
        data = []
        index = 0
        for i in downUsers:
            if index < downCount:
                if not DownHistory.objects.filter(from_user=from_user_id, down_user=i.id).exists():
                    data.append(i)
                    index = index + 1
        serializer = UserSerializer(data, context={'request': request} ,many=True)
        return Response({'data': serializer.data})
    
@api_view(['POST'])
def users_download_save(request):
    if request.method == 'POST':
        from_user= request.data.get('from_user')
        downUsers = request.data.get('downUsers')
        for i in downUsers:
            downhistory = DownHistory.objects.create(from_user=from_user, down_user=i)
            histrySerializer = DownHistorySerializer(data=downhistory)
            if histrySerializer.is_valid():
                histrySerializer.save()
        return Response(status=status.HTTP_201_CREATED)
    
@api_view(['POST'])
def users_downloadCount(request):
    if request.method == "POST":
        from_user_id = request.data.get('from_user')
        role = request.data.get('role')
        business = request.data.get('business')
        downUsers = User.objects.all()
        if business:
            downUsers = downUsers.filter(business_id = business)
        if role:
            downUsers = downUsers.filter(role_id__gte=role)
        count = 0
        for i in downUsers:
            if not DownHistory.objects.filter(from_user=from_user_id).filter(down_user=i.id).exists():
                count = count + 1
        return Response({'downableCount': count})
                
@api_view(['GET', 'PUT', 'DELETE'])
def users_detail(request, id):
    try:
        data = User.objects.get(id=id)

    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(data, context={'request': request})
        return Response(serializer.data)

    if request.method == 'PUT':
        User.objects.filter(id=id).update(role=request.data.get("role"))
        data = User.objects.get(id = id)
        serializer = UserSerializer(data, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'DELETE':
        data.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET', 'POST'])
def roles_list(request):
    if request.method == 'GET':
        roles = Role.objects.all()
        serializer = RoleSerializer(roles,context={'request': request} ,many=True)
        return Response({'data': serializer.data })
        
    elif request.method == 'POST':
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            roles = Role.objects.all()
            serializer = RoleSerializer(roles, context={'request': request}, many=True)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT', 'DELETE'])
def roles_edit(request, id):
    try:
        data = Role.objects.get(id=id)
    except Role.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        serializer = RoleSerializer(data, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        data.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET', 'POST'])
def businesses_list(request):
    if request.method == 'GET':
        businesses = Business.objects.all().order_by('id')
        serializer = BusinessSerializer(businesses,context={'request': request} ,many=True)
        return Response({'data': serializer.data})

    elif request.method == 'POST':
        serializer = BusinessSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            businesses = Business.objects.all()
            serializer = BusinessSerializer(businesses,context={'request': request} ,many=True)
            return Response({'data': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT', 'DELETE'])
def businesses_edit(request, id):
    try:
        data = Business.objects.get(id=id)
    except Business.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        Business.objects.filter(id=id).update(businessType = request.data.get("businessType"))
        businesses = Business.objects.all().order_by('id')
        serializer = BusinessSerializer(businesses, context={'request': request} ,many=True)
        return Response({'data': serializer.data})

    elif request.method == 'DELETE':
        data.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def coupon_add(request, id):
    if request.method == 'POST':
        same_code = 0
        success_code = 0
        for i in request.data:
            if Coupons.objects.filter(code=i.get("code")).exists():
                same_code = same_code + 1
            else:
                success_code = success_code + 1
                serializer = CouponSerializer(data=i)
                if serializer.is_valid():
                    serializer.save()
        data = Coupons.objects.all().filter(user_id=id)
        codeSerializer = CouponSerializer(data, context={'request': request}, many=True)
        return Response({'data': codeSerializer.data, 'same_code': same_code, "success_code": success_code})
    
@api_view(['GET', 'POST'])
def coupons_list(request, id):
    if request.method == 'GET':
        data = Coupons.objects.all().filter(user_id=id)
        serializer = CouponSerializer(data,context={'request': request} ,many=True)
        return Response({'data': serializer.data})
    if request.method == 'POST':
        count = request.data.get('count')
        couponSome = Coupons.objects.filter(user_id = id)[:count]
        serializer = CouponSerializer(couponSome,context={'request': request} ,many=True)
        return Response({'data': serializer.data})
    
@api_view(['GET'])
def coupons_count(request, id):
    if request.method == 'GET':
        count = Coupons.objects.all().filter(user_id=id).count()
        return Response({'count': count})
    
@api_view(['POST'])
def coupons_sendToBsUser(request):
    if request.method == 'POST':
        sendTo_id = request.data.get("sendTo_id")
        sendTo_email = request.data.get("sendTo_email")
        sendBy_id = request.data.get("sendBy_id")
        sendBy_email = request.data.get("sendBy_email")
        sendCount = int(request.data.get("sendCount"))
        send_coupons = Coupons.objects.filter(user_id = sendBy_id)[:sendCount]
        for i in range(sendCount):
            Coupons.objects.filter(id=send_coupons[i].id).update(user_id=sendTo_id)
        data = Coupons.objects.filter(user_id = sendBy_id)
        serializer = CouponSerializer(data,context={'request': request} ,many=True)
        subject = 'Successfully!'
        message = 'You have just received ' + str(sendCount) + ' Coupons from ' + sendBy_email
        email_from = sendBy_email
        recipient_list = [sendTo_email]
        send_mail( subject, message, email_from, recipient_list )
        history_serializer = CouponHistorySerializer(data=request.data.get("history"))
        if history_serializer.is_valid():
            history_serializer.save()
        return Response({'data': serializer.data})

@api_view(['GET'])
def coupons_history(request):
    if request.method == 'GET':
        coupons = CouponHistory.objects.all()
        serializer = CouponHistorySerializer(coupons,context={'request': request} ,many=True)
        return Response({'data': serializer.data})
    
@api_view(['POST'])
def send_message(request):
    if request.method == 'POST':
        subject = request.data.get("subject")
        message = request.data.get("message")
        from_email = request.data.get("from_email")
        recipient_list = request.data.get("recipient_list")
        if from_email and recipient_list:
            try: 
                send_mail(subject=subject, message=message, from_email=from_email, recipient_list=recipient_list)
            except BadHeaderError:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def coupons_sendToCustomer(request):
    if request.method == 'POST':
        sendBy_id = request.data.get("sendBy_id")
        sendTo_email = request.data.get("sendTo_email")
        sendBy_email = request.data.get("sendBy_email")
        send_code = request.data.get("send_code")
        html_message = render_to_string('emailtemplate.html', {'context': 'values'})
        html_message = html_message.replace("[Coupon Code]", "[" + send_code + "]")
        subject = 'You have just received a coupon.'
        msg = EmailMultiAlternatives(
            subject,
            html_message,
            from_email=sendBy_email,
            to=[sendTo_email]
        )
        msg.mixed_subtype = 'related'
        msg.attach_alternative(html_message, "text/html")
        img_dir = settings.STATIC_ROOT
        images = ['_icon.png', 'bee.png', 'line.png', 'logo-mtp-new.png', 'LOGO_labor_1.png', 'qr-code_3.png']
        for item in images:
            file_path = os.path.join(img_dir, item)
            with open(file_path, 'rb') as f:
                img = MIMEImage(f.read())
                img.add_header('Content-ID', '<{name}>'.format(name=item))
                img.add_header('Content-Disposition', 'inline', filename=item)
                msg.attach(img)
        try: 
            msg.send(fail_silently=False)
        except BadHeaderError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        Coupons.objects.get(code=send_code, user_id=sendBy_id).delete()
        history_serializer = CouponHistorySerializer(data=request.data.get("history"))
        if history_serializer.is_valid():
            history_serializer.save()
        return Response(status=status.HTTP_201_CREATED)
