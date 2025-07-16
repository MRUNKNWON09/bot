import express from "express";
import fetch from "node-fetch";
import { createServer } from "@vercel/node";

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "rafi_secret_123";
const PAGE_ACCESS_TOKEN = "EAAPpWjZB0NBUBPCVXNfM5iAxRhBTJMDSsBD7WmIULk0w1BZCdH3u6J0ZBn3jXdrQsmV5JWiRIfZBwKfCMOt0lZBzZANm2J3wVVNv0iG0Op9Jeol13XJzXWBZBgmv0y36uLvswiDBr7z0bz72RPaZCwLkqN1DyxmZCCAm4ZCqL5Y0WE86smOnZBk0r6ZAfrvXaZCVHzOwvZAivkrgZDZD"; // তোমার টোকেন

app.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post("/", async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      const webhook_event = entry.messaging[0];
      const sender_psid = webhook_event.sender.id;

      if (webhook_event.message && webhook_event.message.text) {
        const userMessage = webhook_event.message.text;

        const apiUrl = `https://chatgpt.apinepdev.workers.dev/?question=${encodeURIComponent(userMessage)}`;
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          const botReply = data.answer || data.response || "Sorry, I didn't understand.";
          await callSendAPI(sender_psid, botReply);
        } catch (error) {
          console.error("API call failed:", error);
          await callSendAPI(sender_psid, "Sorry, something went wrong.");
        }
      }
    }
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

async function callSendAPI(sender_psid, response) {
  const request_body = {
    recipient: { id: sender_psid },
    message: { text: response },
  };

  await fetch(`https://graph.facebook.com/v16.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request_body),
  });
}

export default app;
