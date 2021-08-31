import React from "react";

const JoinMeeting = ({ roomUrl }) => {
  const [showRoom, setShowRoom] = React.useState(false);

  return (
    <div className="flex-1 flex flex-col justify-start items-center max-w-lg">
      <button
        className="bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4 disabled:opacity-50"
        type="button"
        onClick={() => setShowRoom(true)}
        disabled={!Boolean(roomUrl)}
      >
        Join meeting
      </button>
      {showRoom && roomUrl && (
        <div
          dangerouslySetInnerHTML={{
            __html: `
          <iframe
            style="width: 600px; height: 350px"
            src="${roomUrl}?minimal"
            allow="camera; microphone; fullscreen; speaker; display-capture"
          />
        `,
          }}
        />
      )}
    </div>
  );
};

export default JoinMeeting;
