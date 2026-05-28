import random
import string

from apps.users.models import ProductApiKey


def verify_api_key(raw_key):
#hashed version of the raw key
    hashed_key = ProductApiKey.hash_key(raw_key)

    api_key = ProductApiKey.objects.filter(
        api_key_hash=hashed_key,
        is_active=True
    ).select_related("product").first()

    return api_key


def generate_meeting_code():
    return ''.join(
        random.choices(
            string.ascii_lowercase + string.digits,
            k=8
        )
    )