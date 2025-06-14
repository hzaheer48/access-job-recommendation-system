from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Job, JobSkill, Company
from .serializers import JobSerializer, JobSkillSerializer, CompanySerializer
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Job.objects.all()
        # Filter by active jobs by default
        queryset = queryset.filter(is_active=True)
        
        # Add filters for search
        title = self.request.query_params.get('title', None)
        company = self.request.query_params.get('company', None)
        location = self.request.query_params.get('location', None)
        
        if title:
            queryset = queryset.filter(title__icontains=title)
        if company:
            queryset = queryset.filter(company_name__icontains=company)
        if location:
            queryset = queryset.filter(location__icontains=location)
            
        return queryset

class JobSkillViewSet(viewsets.ModelViewSet):
    queryset = JobSkill.objects.all()
    serializer_class = JobSkillSerializer
    permission_classes = [IsAuthenticated]

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

class JobSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = Job.objects.filter(is_active=True)
        title = request.query_params.get('title')
        location = request.query_params.get('location')
        company = request.query_params.get('company')
        if title:
            queryset = queryset.filter(title__icontains=title)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if company:
            queryset = queryset.filter(company_name__icontains=company)
        serializer = JobSerializer(queryset, many=True)
        return Response(serializer.data)
