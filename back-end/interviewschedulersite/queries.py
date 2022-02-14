from turtle import st
import graphene
from .types import CandidateType, InterviewType
from interviewscheduler.models import Candidate, Interview


class Query(graphene.ObjectType):
    interviews = graphene.List(InterviewType)
    interview = graphene.Field(InterviewType, interviewId=graphene.String())
    candidates = graphene.List(CandidateType)

    def resolve_interviews(parent, info):
        return Interview.objects.all()

    def resolve_interview(parent, info, interviewId):
        return Interview.objects.get(id=interviewId)

    def resolve_candidates(parent, info):
        return Candidate.objects.all()