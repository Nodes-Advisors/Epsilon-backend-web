import express from "express";
const app = express();
import { Emails } from "./emails.js";
import cors from "cors";

app.use(cors());

app.get("/", (req, res) => {
  const { q } = req.query;

  const keys = ["subject", "sender", "toRecipients"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(q))
    );
  };

  q ? res.json(search(Emails).slice(0, 10)) : res.json(Emails.slice(0, 10));
});

app.listen(5001, () => console.log("API is working!"));
