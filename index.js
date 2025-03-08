const { writeFileSync, readFileSync } = require("fs");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// const myGroupName = "M&A_4";
// const contactName = "Amit";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true, // Run in background (set false to see the browser)
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Fixes some deployment issues
  },
});

function readContacts(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

// function listMethods(obj) {
//   let properties = new Set();
//   let currentObj = obj;
//   do {
//     Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
//   } while ((currentObj = Object.getPrototypeOf(currentObj)));
//   return [...properties.keys()].filter(
//     (item) => typeof obj[item] === "function"
//   );
// }

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("Client is ready!");

  const groups = await client.getChats();

  // const contacts = await client.getContacts();
  writeFileSync("./data/chats.json", JSON.stringify(groups, null, 2));

  // const selectedGroup = groups.find((chat) => chat.name === myGroupName);

  // console.log("GROUP RESULTS: ", selectedGroup, selectedGroup?.isGroup);

  // const participants = ["9647722105809@c.us", "9647513716149@c.us"];

  // await selectedGroup.addParticipants(
  //   participants /** contactToAdd.id._serialized */
  // ); // Pass an array of contact IDs [id1, id2, id3 .....]

  // console.log(`Successfully added ${contactName} to the group ${myGroupName}`);
});

client.on("message", (msg) => {
  if (msg.body == "!ping") {
    msg.reply("pong");
  }
});

client.on("remote_session_saved", () => {
  console.log("Session has been saved");
});

client.initialize();
