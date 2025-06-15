from django.shortcuts import render
from rest_framework import viewsets, filters, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import JobListing, JobSkillRequirement, Company, Bookmark, SavedSearch
from .serializers import JobListingSerializer, JobSkillRequirementSerializer, CompanySerializer, BookmarkSerializer, SavedSearchSerializer

# Create your views here.

class JobListingViewSet(viewsets.ModelViewSet):
    queryset = JobListing.objects.all()
    serializer_class = JobListingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'requirements', 'company__name']
    ordering_fields = ['posted_date', 'salary_min', 'salary_max', 'view_count']
    ordering = ['-posted_date']

    def get_queryset(self):
        queryset = JobListing.objects.all()
        
        # Filter by active jobs and not expired
        queryset = queryset.filter(
            Q(is_active=True) & (Q(application_deadline__isnull=True) | Q(application_deadline__gt=timezone.now()))
        )
        
        # Advanced filtering
        job_type = self.request.query_params.get('job_type')
        experience_level = self.request.query_params.get('experience_level')
        remote_option = self.request.query_params.get('remote_option')
        salary_min = self.request.query_params.get('salary_min')
        salary_max = self.request.query_params.get('salary_max')
        company_id = self.request.query_params.get('company_id')
        is_featured = self.request.query_params.get('is_featured')
        
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        if experience_level:
            queryset = queryset.filter(experience_level=experience_level)
        if remote_option:
            queryset = queryset.filter(remote_option=remote_option)
        if salary_min:
            queryset = queryset.filter(salary_min__gte=salary_min)
        if salary_max:
            queryset = queryset.filter(salary_max__lte=salary_max)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        if is_featured:
            queryset = queryset.filter(is_featured=True)
            
        return queryset

    @action(detail=True, methods=['post'])
    def increment_view_count(self, request, pk=None):
        job = self.get_object()
        job.view_count += 1
        job.save()
        return Response({'status': 'view count incremented'})

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_jobs = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(featured_jobs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Search query is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        queryset = self.get_queryset().filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(requirements__icontains=query) |
            Q(company__name__icontains=query)
        )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'industry']

class JobSkillRequirementViewSet(viewsets.ModelViewSet):
    queryset = JobSkillRequirement.objects.all()
    serializer_class = JobSkillRequirementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = JobSkillRequirement.objects.all()
        job_id = self.request.query_params.get('job_id')
        if job_id:
            queryset = queryset.filter(job_id=job_id)
        return queryset

class BookmarkViewSet(viewsets.ModelViewSet):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavedSearchViewSet(viewsets.ModelViewSet):
    serializer_class = SavedSearchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedSearch.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        saved_search = self.get_object()
        # Here you would implement the search logic using the saved criteria
        # For now, we'll just return the search criteria
        return Response(saved_search.criteria)
