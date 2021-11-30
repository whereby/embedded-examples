import fetch from "node-fetch";
import crypto from "crypto";

class Whereby {
  static BASE_URL = "https://api.whereby.dev/v1/meetings";
  static MAX_ELAPSED_TIME = 1000 * 60; // 1 minutes in milliseconds

  constructor({ apiKey, webhookSecret }) {
    this._webhookSecret = webhookSecret;
    this._headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
  }

  isWebhookEventValid({ body, headers }) {
    const wbSignature = headers["whereby-signature"];

    try {
      const matches = wbSignature.matchAll(/t=(.*),v1=(.*)/gm);

      let timestamp, signature;
      for (const match of matches) {
        [, timestamp, signature] = match;
      }

      const current = new Date();
      const diffTime = current - parseInt(timestamp, 10) * 1000;

      const signedPayload = timestamp + "." + JSON.stringify(body);

      const sha256Hasher = crypto.createHmac("sha256", this._webhookSecret);
      const hash = sha256Hasher.update(signedPayload);
      const hashStr = hash.digest("hex");

      return (
        crypto.timingSafeEqual(
          Buffer.from(hashStr, "utf-8"),
          Buffer.from(signature, "utf-8")
        ) && diffTime < Whereby.MAX_ELAPSED_TIME
      );
    } catch (e) {
      return false;
    }
  }

  createMeeting({
    isLocked,
    roomNamePrefix,
    roomNamePattern,
    roomMode,
    endDate,
    fields,
  }) {
    return fetch(Whereby.BASE_URL, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        isLocked,
        roomNamePrefix,
        roomNamePattern,
        roomMode,
        endDate,
        fields,
      }),
    });
  }

  deleteMeeting(meetingId) {
    return fetch(`${Whereby.BASE_URL}/${meetingId}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  getMeeting(meetingId, { fields }) {
    return fetch(
      `${Whereby.BASE_URL}/${meetingId}?fields=${encodeURIComponent(fields)}`,
      {
        method: "GET",
        headers: this._headers,
      }
    );
  }
}

export default Whereby;
