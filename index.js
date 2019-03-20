const axios = require("axios");
const fs = require("fs");

const main = () => {
  const [, , ...args] = process.argv;
  if (!args) {
    process.exit();
  }

  if (args[0]) {
    fetchData(args[0]);
  }
};

async function fetchData(entry) {
  const response = await axios.get(
    `https://od-api.oxforddictionaries.com:443/api/v1/entries/en/${entry}`,
    {
      headers: {
        Accept: "application/json",
        app_id: "40ea3c70",
        app_key: "a6da97671faf29ac523fca72aa29d87d"
      }
    }
  );

  const message = mutateResponse(response);
  writeEntryToTxt(entry, message);
}

function mutateResponse(response) {
  const { results } = response.data;
  const terms = results[0].lexicalEntries.map(entry => entry.text);
  const categories = results[0].lexicalEntries.map(
    entry => entry.lexicalCategory
  );

  const definitions = results[0].lexicalEntries.map(
    entry => entry.entries[0].senses[0].short_definitions[0]
  );

  let temporary = [];
  for (let i = 0; i < terms.length; i++) {
    temporary.push([terms[i], categories[i], definitions[i]]);
  }

  let message = temporary.map(
    entry => `\n${entry[0]} (${entry[1]}): ${entry[2]}`
  );

  message.push("\nProvided by Oxford University Press");
  return message;
}

function writeEntryToTxt(entry, message) {
  fs.writeFile(`./${entry}.txt`, message, err => {
    if (err) {
      console.log("there as an error");
    }
  });
}
// module.exports = main;
main();
