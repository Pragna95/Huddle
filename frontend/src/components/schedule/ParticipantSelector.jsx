export default function ParticipantSelector({
  participants,
  setParticipants,
}) {
  const addEmail = (email) => {
    const trimmed =
      email.trim();

    if (!trimmed) return;

    if (
      participants.includes(
        trimmed
      )
    )
      return;

    setParticipants([
      ...participants,
      trimmed,
    ]);
  };

  const removeEmail = (
    email
  ) => {
    setParticipants(
      participants.filter(
        (p) => p !== email
      )
    );
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">
        Add Participants
      </h3>

      <input
        placeholder="Enter email and press Enter"
        className="w-full border p-3 rounded"
        onKeyDown={(e) => {
          if (
            e.key === "Enter"
          ) {
            addEmail(
              e.target.value
            );

            e.target.value =
              "";
          }
        }}
      />

      <div className="mt-4 space-y-2">
        {participants.map(
          (email, index) => (
            <div
              key={index}
              className="
                flex
                justify-between
                items-center
                border
                p-2
                rounded
              "
            >
              <span>
                {email}
              </span>

              <button
                onClick={() =>
                  removeEmail(
                    email
                  )
                }
              >
                ✕
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}