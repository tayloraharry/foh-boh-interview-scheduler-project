from turtle import st
import graphene
from .types import CandidateType, InterviewType
from interviewscheduler.models import Candidate, Interview


class Query(graphene.ObjectType):
    interviews_by_date = graphene.List(InterviewType, start=graphene.Date(), end=graphene.Date());
    interviews = graphene.List(InterviewType)
    interview = graphene.Field(InterviewType, interviewId=graphene.String())
    candidates = graphene.List(CandidateType)
    candidate = graphene.Field(CandidateType, candidateId=graphene.String())

    def resolve_interviews_by_date(parent, info, start, end):
        return Interview.objects.filter(scheduled_time__range=[start, end])

    def resolve_interviews(parent, info):
        return Interview.objects.all()

    def resolve_interview(parent, info, interviewId):
        return Interview.objects.get(id=interviewId)

    def resolve_candidates(parent, info):
        return Candidate.objects.all()

    def resolve_candidate(parent, info, candidateId):
        return Candidate.objects.get(id=candidateId)