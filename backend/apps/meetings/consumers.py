from channels.generic.websocket import AsyncJsonWebsocketConsumer
import traceback


class ParticipantConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        try:
            print("WEBSOCKET CONNECT ATTEMPT")

            self.meeting_id = self.scope["url_route"]["kwargs"].get("meeting_id")

            if not self.meeting_id:
                print("NO MEETING ID")
                await self.close()
                return

            self.room_group_name = f"meeting_{self.meeting_id}"

            print("Meeting:", self.meeting_id)

            print("Channel Layer:", self.channel_layer)

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            print("GROUP ADDED")

            await self.accept()

            print("WEBSOCKET CONNECTED")

        except Exception as e:
            print("CONNECT ERROR:")
            print(str(e))
            traceback.print_exc()

    async def disconnect(self, close_code):
        print("WEBSOCKET DISCONNECTED")
        print("Close code:", close_code)

        try:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        except Exception as e:
            print("DISCONNECT ERROR:", e)

    async def participant_update(self, event):
        print("Broadcast received:", event)
        await self.send_json(event["data"])