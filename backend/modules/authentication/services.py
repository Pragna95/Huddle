from .models import User


def generate_new_api_key(user):

    user.save()

    return user.api_key