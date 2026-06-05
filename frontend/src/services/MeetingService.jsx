const API_URL =
  "http://localhost:8000/api/meetings/create-meeting/";
  
const API_KEY =
  "9df8ad47b793b72fd7c085473191d4bafdad5f263949f6b3e12ca0e0e029ec83";

export const createMeeting = async (
  payload
) => {
  const response = await fetch(
    API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${API_KEY}`,
      },

      body: JSON.stringify(
        payload
      ),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Failed to create meeting"
    );
  }

  return data;
};