const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

// init app & middleware

const app = express();
app.use(express.json());

let db;

// db connection
let dbConnection;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });

    db = getDb();
  } else {
    console.log(err);
  }
});

app.get("/books", (req, res) => {
  const page = req?.query?.p || 0;
  const booksPerPage = 3;

  let books = [];
  db.collection("test1")
    .find()
    .sort({ author: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
});

app.get("/books/:id", (req, res) => {
  const { id } = req.params;

  if (ObjectId.isValid(id)) {
    db.collection("test1")
      .findOne({ _id: new ObjectId(id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not fetch document" });
      });
  } else res.status(500).json({ error: "Invalid id" });
});

app.post("/books", (req, res) => {
  const book = req.body;

  console.log("book: ", book);
  db.collection("test1")
    .insertOne(book)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not insert document" });
    });
});

app.delete("/books/:id", (req, res) => {
  const { id } = req.params;

  if (ObjectId.isValid(id)) {
    db.collection("test1")
      .deleteOne({ _id: new ObjectId(id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not delete document" });
      });
  } else {
    res.status(500).json({ error: "Invalid id" });
  }
});

app.patch("/books/:id", (req, res) => {
  const { id } = req.params;
  const book = req.body;

  if (ObjectId.isValid(id)) {
    db.collection("test1")
      .updateOne({ _id: new ObjectId(id) }, { $set: book })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not update document" });
      });
  } else {
    res.status(500).json({ error: "Invalid id" });
  }
});
