import React from "react";
import Head from "next/head";

import CreateMeetingAPI from "../components/CreateMeetingAPI";
import GetMeetingAPI from "../components/GetMeetingAPI";
import DeleteMeetingAPI from "../components/DeleteMeetingAPI";
import WherebyLogo from "../components/WherebyLogo";

export default function Home() {
  const [createdMeetingInfo, setCreatedMeetingInfo] = React.useState(null);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <Head>
        <title>Whereby Embedded example</title>
        <meta
          name="description"
          content="Whereby embedded Next.js serverless functions example"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-1 flex flex-col justify-center items-center py-10">
        <h1 className="m-0 leading-normal text-6xl font-headline">
          Welcome to Whereby Embedded
        </h1>

        <p className={"leading-normal text-2xl"}>
          Documentation can be found at{" "}
          <a className="text-primary" href="https://whereby.dev">
            developer guide
          </a>
        </p>

        <CreateMeetingAPI
          onMeetingCreated={(info) => setCreatedMeetingInfo(info)}
          createdMeetingInfo={createdMeetingInfo}
        />
        <GetMeetingAPI defaultMeetingId={createdMeetingInfo?.meetingId} />
        <DeleteMeetingAPI
          defaultMeetingId={createdMeetingInfo?.meetingId}
          onMeetingDeleted={() => setCreatedMeetingInfo(null)}
        />
      </main>

      <footer className="w-full h-24 border-t border-gray-200 flex justify-center items-center">
        <a
          className="flex flex-1 justify-center items-center"
          href="https://whereby.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className="h-4 ml-2">
            <WherebyLogo />
          </span>
        </a>
      </footer>
    </div>
  );
}
