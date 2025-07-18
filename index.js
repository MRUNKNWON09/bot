
const { Telegraf } = require("telegraf");

const bot = new Telegraf("7994148332:AAEsD6iiGddt3Ddvg2EKOONS9aZUV-d94fo");

// Main channel ID (from where message will be forwarded)
const MAIN_CHANNEL_ID = "-1002792792265";

// Target channel ID (where the message will be sent)
const TARGET_CHANNEL_ID = "-1002585596681";

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
      console.error("❌ Failed to forward:", err);
    }
  }
});

bot.launch();
console.log("🤖 Bot is running");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = (req, res) => {
  res.status(200).send("Bot is running");
};
