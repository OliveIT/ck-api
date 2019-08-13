const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const port = 8000;

app.get("/kittie", (req, res) => {

  if (!req.query || !parseInt(req.query.id) >= 0) {
    return res.status(400).json({ success: false, message: 'invalid id supplied' });
  }

  const kitID = parseInt(req.query.id);

  con.query(`SELECT * FROM kittylist WHERE id=${kitID} LIMIT 1`, function (err, result) {
    if (err){
      return res.json({ success: false, data: 'kittie with this id doesnt exist' });
    }

    let kittieInfo = result[0];

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
      kai_genes: kittieInfo.kai_genes.trim(),
    }

    console.log(kittieInfo);

    return res.json({ success: true, data: formattedData });
  });
});

app.get("/", (req, res) => {
  return res.json({ success: true, data: 'server running' });
});

app.listen(port, () => console.log(`server running on port ${port} 🔥`));

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yourpass",
  database: "kfdb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("DB Connected!");
});
