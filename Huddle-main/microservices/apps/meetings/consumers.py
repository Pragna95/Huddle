from channels.generic.websocket import AsyncJsonWebsocketConsumer

class MeetingConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.meeting_id = self.scope["url_route"]["kwargs"]["meeting_id"]
        self.room_group_name = f"meeting_{self.meeting_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive_json(self, content):

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "signal_message",
                "message": content
            }
        )

    async def signal_message(self, event):
        await self.send_json(event["message"])