const API_URL =
  `${import.meta.env.VITE_API_URL}/api/meetings/create-meeting/`;

const API_KEY =
  import.meta.env.VITE_API_KEY;

export const createMeeting = async (payload) => {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },

    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      "Failed to create meeting"
    );
  }

  return data;
};