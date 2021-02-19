import React from "react";
import PropTypes from "prop-types";

import styles from "./styles.module.css";

function TopBar({ roomUrl }) {
  return (
    <div className={styles.browserTopBar}>
      <div className={styles.topBarButtonsWrapper}>
        <div className={styles.topBarButton} />
        <div className={styles.topBarButton} />
      </div>
      <span className={styles.topBarTitle}>
        {roomUrl || "https://whereby.com"}
      </span>
      {roomUrl && (
        <a
          className={styles.openNew}
          href={`/?roomUrl=${roomUrl}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className={styles.openNewText}>
            Join the meeting in another tab ↗
          </span>
        </a>
      )}
    </div>
  );
}

TopBar.propTypes = {
  roomUrl: PropTypes.string,
};

export default TopBar;
