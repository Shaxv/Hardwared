from re import S
from this import d
from time import strftime
from django.urls import reverse
from rest_framework.serializers import Serializer
from .serializers import ComputerSerializer, LoginSerializer, RegisterSerializer, UserSerializer, ProfileSerializer
from .models import Computer, Profile
from django.contrib.auth.models import User
from django.db.models import Avg, Q
from django.shortcuts import get_object_or_404

from rest_framework import generics, status, authentication, exceptions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.authtoken.models import Token

class ComputerView(generics.GenericAPIView):
    serializer_class = ComputerSerializer

    def get(self, request, *args, **kwargs):
        if request.GET.get("id"):
            serializer = ComputerSerializer(Computer.objects.get(id=request.GET.get("id")))
            serializer = serializer.data
            serializer.update({"rating": Computer.objects.get(id=request.GET.get("id")).get_rating()})
            serializer.update({"rating_len": Computer.objects.get(id=request.GET.get("id")).get_rating_len()})
            serializer.update({"sale_ends": Computer.objects.get(id=request.GET.get("id")).sale_end()})
            return Response(serializer)
        else:
            serializer = ComputerSerializer(Computer.objects.all(), many=True)
            for i in serializer.data:
                i.update({"rating": Computer.objects.get(id=i["id"]).get_rating()})
                i.update({"rating_len": Computer.objects.get(id=i["id"]).get_rating_len()})
                i.update({"sale_ends": Computer.objects.get(id=i["id"]).sale_end()})
            return Response(serializer.data)

class UserCreate(generics.GenericAPIView):
    serializer_class = RegisterSerializer, ProfileSerializer
    permission_classes = (AllowAny,)
    http_method_names = ["post", "files"]

    def post(self, request, format="json", *args, **kwargs):
        serializer = RegisterSerializer(data={
                "username": request.POST.get("username"),
                "email": request.POST.get("email"),
                "password": request.POST.get("password"),
                
            })
        profile_serializer = ProfileSerializer(data={
            "birth_date": request.POST.get("birth_date"),
            "country": request.POST.get("country"),
            "address": request.POST.get("address"),
        })
        serializer.is_valid(raise_exception=True)
        profile_serializer.is_valid(raise_exception=True)
        if serializer.is_valid() and profile_serializer.is_valid():
            user = serializer.save()
            profile = Profile.objects.create(
                user = user,
                birth_date = profile_serializer.data["birth_date"],
                country = profile_serializer.data["country"],
                address = profile_serializer.data["address"],
                avatar = request.FILES.get("avatar"),
            )
            profile.save()
            return Response({"isCreated": "true"}, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors + profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserAuth(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.is_valid():
            user = serializer.validated_data
            profile = Profile.objects.get(user=user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "user": UserSerializer(user).data,
                "profile": ProfileSerializer(profile).data,
                "token": token.key
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetUser(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)

    serializer_class = UserSerializer

    def post(self, *args, **kwargs):
        return Response({
            "user": UserSerializer(self.request.user).data
        })