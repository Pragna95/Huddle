import dotenv
from rest_framework.decorators import api_view
from rest_framework.response import Response
from dotenv import load_dotenv
import uuid
import os

load_dotenv()

@api_view(['GET','POST'])
def create_room(request):
    
    received_key=request.headers.get("api_key")
    if received_key != API_KEY:
        return Response({"error": "Invalid API key"}, status=403)
    
    meeting_id = str(uuid.uuid4())[:8]
    return Response({"meeting_link": f"http://localhost:5173/meeting/{meeting_id}"})
    


API_KEY = os.getenv("API_KEY")