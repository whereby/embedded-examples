import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { useState } from "react";

import styles from "./styles.module.css";

export default function Home() {
  const [metadata, setMetadata] = useState(null);
  const router = useRouter();

  useEffect(async () => {
    if (!router.isReady) return;

    const { roomUrl } = router.query;
    if (roomUrl) {
      setMetadata({ roomUrl });
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
      setMetadata({
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
          <div className={styles.browserTopBar}>
            <div className={styles.topBarButtonsWrapper}>
              <div className={styles.topBarButton} />
              <div className={styles.topBarButton} />
            </div>
            <span className={styles.topBarTitle}>
              {metadata?.roomUrl || ""}
            </span>
            {metadata && (
              <a
                className={styles.openNew}
                href={`/?roomUrl=${metadata.roomUrl}`}
                target="_blank"
              >
                <span className={styles.openNewText}>
                  Open new window ↗
                </span>
              </a>
            )}
          </div>
          {metadata ? (
            <iframe
              className={styles.wherebyIframe}
              src={
                metadata.hostRoomUrl
                  ? `${metadata.hostRoomUrl}&embed&screenshare=on`
                  : `${metadata.roomUrl}?embed&screenshare=on`
              }
              allow="camera; microphone; fullscreen; speaker; display-capture"
            ></iframe>
          ) : null}
        </div>

        <span className={styles.repositoryLink}>
          GitHub repository: <a href="https://github.com/whereby/embedded-example" target="_blank">https://github.com/whereby/embedded-example</a>
        </span>
      </div>
    </div>
  );
}
