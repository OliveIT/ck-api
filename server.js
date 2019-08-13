const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const port = 80;

app.get("/kittie", (req, res) => {
  if (!isCSVLoaded) {
    return res.status(500).json({ success: false, message: 'csv is not loaded fully' });
  }

  const kitID = req.param('id', null);

  if (kitID >= 0) {
    let kittieInfo = jsonData[kitID];
    if (kittieInfo) {
      const formattedData = {
        id: Number(kittieInfo.id),
        isGestating: kittieInfo.isGestating === "True",
        isReady: kittieInfo.isReady === "True",
        cooldownIndex: Number(kittieInfo.cooldownIndex),
        nextActionAt: Number(kittieInfo.nextActionAt),
        siringWithId: Number(kittieInfo.siringWithId),
        birthTime: Number(kittieInfo.birthTime),
        matronId: Number(kittieInfo.matronId),
        sireId: Number(kittieInfo.sireId),
        generation: Number(kittieInfo.generation),
        genes: kittieInfo.genes,
        kai_genes: kittieInfo.kai_genes,
      }
      return res.json({ success: true, data: formattedData });
    }
    else {
      return res.json({ success: false, data: 'kittie with this id doesnt exist' });
    }
  }

  return res.status(400).json({ success: false, message: 'invalid id supplied' });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      serverRunning: true,
      csvFullyLoaded: isCSVLoaded
    }
  });
});

app.listen(port, () => console.log(`server running on port ${port} 🔥`));

let isCSVLoaded = false;
let jsonData;

// let csvToJson = require('convert-csv-to-json');

// let fileInputName = 'kittylist.csv'; 
// let fileOutputName = 'kittylist.json';

// csvToJson.fieldDelimiter(',').generateJsonFileFromCsv(fileInputName, fileOutputName);

const fs = require('fs')

fs.readFile('./kittylist.json', 'utf8', (err, jsonString) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    return
  }
  try {
    jsonData = JSON.parse(jsonString);
    isCSVLoaded = true;
    console.log("Finished loading.  total kittie count:", jsonData.length)
  } catch (err) {
    console.log('Error parsing JSON string:', err);
  }
})
