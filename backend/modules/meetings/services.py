from .models import Meeting


def create_meeting(host, validated_data):

    meeting = Meeting.objects.create(
        host=host,
        **validated_data
    )

    return meeting