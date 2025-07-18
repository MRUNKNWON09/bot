
const { Telegraf } = require("telegraf");

// Use environment variable for token (secure and clean)
const bot = new Telegraf(process.env.BOT_TOKEN);

// IDs
const MAIN_CHANNEL_ID = "-1002792792265";
const TARGET_CHANNEL_ID = "-1002585596681";

// Message handler for incoming channel posts
bot.on("channel_post", async (ctx) => {
  const post = ctx.channelPost;

  if (ctx.chat.id.toString() === MAIN_CHANNEL_ID) {
    try {
      await ctx.telegram.forwardMessage(
        TARGET_CHANNEL_ID,
        MAIN_CHANNEL_ID,
        post.message_id
      );
      console.log("✅ Message forwarded");
    } catch (err) {
      console.error("❌ Forwarding failed:", err);
    }
  }
});

// Vercel Serverless Function Handler
module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Error handling update", err);
    res.status(500).send("Failed");
  }
};
