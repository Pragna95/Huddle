export const fetchUsers = async () => {

  const response = await fetch(
    "http://localhost:8000/api/users/list/"
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch users"
    );
  }

  return await response.json();
};