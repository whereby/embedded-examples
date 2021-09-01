import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { useState } from "react";

import TopBar from "./TopBar";

import styles from "./styles.module.css";

export default function Home() {
  const [roomInfo, setRoomInfo] = useState(null);
  const router = useRouter();

  useEffect(async () => {
    if (!router.isReady) return;

    const { roomUrl } = router.query;
    if (roomUrl) {
      setRoomInfo({ roomUrl });
    } else {
      const response = await fetch(
        "https://embedded-example.com:3001/meetings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { roomUrl, hostRoomUrl } = await response.json();
      setRoomInfo({
        roomUrl,
        hostRoomUrl,
      });
    }
  }, [router.isReady]);

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>Embedded Example</title>
      </Head>

      <div className={styles.content}>
        <div className={styles.browser}>
          <TopBar roomUrl={roomInfo?.roomUrl} />
          {roomInfo ? (
            <iframe
              className={styles.wherebyIframe}
              src={
                roomInfo.hostRoomUrl
                  ? `${roomInfo.hostRoomUrl}&embed&screenshare=on`
                  : `${roomInfo.roomUrl}?embed&screenshare=on`
              }
              allow="camera; microphone; fullscreen; speaker; display-capture"
            ></iframe>
          ) : null}
        </div>

        <span className={styles.repositoryLink}>
          GitHub repository:{" "}
          <a
            href="https://github.com/whereby/embedded-examples/tree/main/nextjs-express"
            target="_blank"
            rel="noreferrer"
          >
            https://github.com/whereby/embedded-examples/tree/main/nextjs-express
          </a>
        </span>
      </div>
    </div>
  );
}
