const TelegramBot = require("node-telegram-bot-api");

require("dotenv").config();

const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

const images = [
  {
    url: "https://tg.steamp2e.com/images/bot_1.jpg",
    caption:
      "*ТУТ ВЫБИРАЕМ СТАВКУ*\nЕсли выиграете матч, заработаете благодаря всем проигравшим. Иначе победители получат вашу сумму.",
    buttonText: "Далее",
  },
  {
    url: "https://tg.steamp2e.com/images/bot_2.jpg",
    caption:
      "*ТУТ ПРОГНОЗ НА ВЫИГРЫШ*\nПеред тем как сделать ставку, видим примерный прогноз своего выигрыша, исходя из побед игроков и общей суммы всех ставок за период.",
    buttonText: "Далее",
  },
  {
    url: "https://tg.steamp2e.com/images/bot_3.jpg",
    caption:
      '*СДЕЛАТЬ СТАВКУ ДО 05:00*\nМожно сделать ставку, нажав эту кнопку "play" в приложении. Если не успели сделать ставку до 05:00 минуты в игре, то ставку не учтут и вернут всю сумму. Ставим на рейтинговые матчи All Pick.',
    buttonText: "Начать",
    webAppUrl: "https://t.me/SteamP2Ebot/play",
  },
];

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  sendImage(chatId, 0);
});

bot.on("callback_query", (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const index = parseInt(callbackQuery.data, 10);

  if (index < images.length) {
    sendImage(chatId, index);
  } else {
    bot.sendMessage(chatId, "No more images.");
  }
});

function sendImage(chatId, index) {
  const image = images[index];
  let replyMarkup;

  if (image.webAppUrl) {
    replyMarkup = {
      inline_keyboard: [
        [
          {
            text: image.buttonText,
            url: image.webAppUrl,
          },
        ],
      ],
    };
  } else {
    replyMarkup = {
      inline_keyboard: [
        [
          {
            text: image.buttonText,
            callback_data: (index + 1).toString(),
          },
        ],
      ],
    };
  }

  bot.sendPhoto(chatId, image.url, {
    caption: image.caption,
    parse_mode: "Markdown",
    reply_markup: replyMarkup,
  });
}

console.log("Bot is running...");
