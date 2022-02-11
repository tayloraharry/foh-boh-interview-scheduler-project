from graphene_django import DjangoObjectType, DjangoListField
from interviewscheduler.models import Candidate, Interview
import graphene

class InterviewType(DjangoObjectType):
    class Meta:
        model = Interview
        fields = ("id", "scheduled_time", "location_name", "candidate")


class CandidateType(DjangoObjectType):
    class Meta:
        model = Candidate
        fields = ("id", "name", "email")

    interviews = DjangoListField(InterviewType)

    def resolve_interviews(self, info):
        return Interview.objects.filter(candidate=self.id)

class InterviewInput(graphene.InputObjectType):
    id = graphene.ID()
    scheduled_time = graphene.Date()
    location_name = graphene.String(required=True)
    candidate_id = graphene.String(required=True, name="candidate")

class CandidateInput(graphene.InputObjectType):
    id = graphene.ID()
    name = graphene.String(required=True)
    email = graphene.String(required=True)    