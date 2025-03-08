const { writeFileSync, readFileSync } = require("fs");
const csv = require("csv");

function convertJsonToCsv() {
  const jsonData = JSON.parse(readFileSync("contacts.json", "utf8"));

  const contacts = jsonData.map((d) => {
    return {
      id: d.id._serialized,
      name: d.name,
      pushname: d.pushname,
      number: d.number,
    };
  });

  csv.stringify(
    contacts,
    {
      header: true,
      columns: ["id", "name", "pushname", "number"],
      //   delimiter: ",",
      skip_empty_lines: true,
    },
    (err, csvData) => {
      if (err) {
        throw err;
      }
      // Write CSV file
      writeFileSync("contacts.csv", "\uFEFF" + csvData, "utf-8");
      console.log(`CSV file saved successfully`);
    }
  );
}

function convertCsvToJson() {
  const fileName = "contacts-new";
  const csvData = readFileSync(`./data/${fileName}.csv`, "utf8");

  csv.parse(csvData, { columns: true }, (err, records) => {
    if (err) {
      console.error("Error parsing CSV:", err);
      return;
    }

    writeFileSync(
      `./data/${fileName}.json`,
      JSON.stringify(records, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing JSON file:", err);
        } else {
          console.log("CSV successfully converted to JSON:", outputJsonFile);
        }
      }
    );
  });
}

function mappingNamesWithIndex() {
  const newJsonFile = JSON.parse(
    readFileSync(`./data/contacts-new.json`, "utf8")
  );
  const oldJsonFile = JSON.parse(readFileSync(`./data/contacts.json`, "utf8"));
  const contactsWithNames = oldJsonFile.filter((c) => !!c?.name);

  for (let i = 0; i < contactsWithNames.length; i++) {
    // console.log("==>>", newJsonFile[i].id);
    const contact = newJsonFile.find(
      (c) => c.id === contactsWithNames[i].id._serialized
    );
    if (!contact) continue;

    contact.index = i;
    contact.name = contactsWithNames[i].name;
    contact.pushname = contactsWithNames[i].pushname;
  }

  writeFileSync(
    `./data/contacts-new.json`,
    JSON.stringify(
      newJsonFile.filter((c) => !!c?.name),
      null,
      2
    ),
    (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
      } else {
        console.log("CSV successfully converted to JSON:", outputJsonFile);
      }
    }
  );
}

convertCsvToJson();
