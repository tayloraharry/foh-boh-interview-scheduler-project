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

class UpdateInterview(graphene.Mutation):
    class Arguments:
        interview_id = graphene.ID()
        scheduled_time = graphene.DateTime()
        location_name = graphene.String(required=True)
        
    interview = graphene.Field(InterviewType)
    
    def mutate(self, info, interview_id, scheduled_time, location_name):
        interview = Interview.objects.get(pk=interview_id)
        interview.scheduled_time = scheduled_time
        interview.location_name = location_name
        interview.save()
        return UpdateInterview(interview=interview)

class Mutation(graphene.ObjectType):
    add_interview = AddInterview.Field()     
    cancel_interview = CancelInterview.Field()
    update_interview = UpdateInterview.Field()