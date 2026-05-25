from django.core.mail import send_mail


def send_meeting_email(meeting):

    subject = f"Meeting Invitation: {meeting.title}"

    message = f"""
    Meeting: {meeting.title}

    Description:
    {meeting.description}

    Join Link:
    {meeting.join_link}
    """

    send_mail(
        subject,
        message,
        'admin@huddle.com',
        meeting.participants,
        fail_silently=False,
    )