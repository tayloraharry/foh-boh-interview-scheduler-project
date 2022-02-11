import graphene
from interviewschedulersite.types import InterviewInput, InterviewType, CandidateInput, CandidateType
from interviewscheduler.models import Interview, Candidate

class AddInterview(graphene.Mutation):
    class Arguments:
        input = InterviewInput(required=True)

    interview = graphene.Field(InterviewType)

    def mutate(parent, info, input=None):
        if input is None:
            return AddInterview(post=None)
        _interview = Interview.objects.create(**input)
        return AddInterview(interview=_interview)

class AddCandidate(graphene.Mutation):
    class Arguments:
        input = CandidateInput(required=True)

    candidate = graphene.Field(CandidateType)

    def mutate(parent, info, input=None):
        if input is None:
            return AddCandidate(author=None)
        _candidate = Candidate.objects.create(**input)
        return AddCandidate(candidate=_candidate)


class CancelInterview(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        interview_id = graphene.ID()

    @classmethod
    def mutate(cls, root, info, **kwargs):
        print(kwargs)
        obj = Interview.objects.get(pk=kwargs["interview_id"])
        obj.delete()
        return cls(ok=True)          

class Mutation(graphene.ObjectType):
    add_interview = AddInterview.Field()
    add_candidate = AddCandidate.Field()        
    cancel_interview = CancelInterview.Field()