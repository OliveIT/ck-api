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

  const kitID = req.param('id', null);

  if (kitID >= 0) {

    con.query(`SELECT * FROM account_emailaddress WHERE id=${kitID} LIMIT 1`, function (err, result) {
      if (err){
        return res.json({ success: false, data: 'kittie with this id doesnt exist' });
      }
      console.log(result);

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
        kai_genes: kittieInfo.kai_genes,
      }
      return res.json({ success: true, data: formattedData });
    });
  }

  return res.status(400).json({ success: false, message: 'invalid id supplied' });
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
