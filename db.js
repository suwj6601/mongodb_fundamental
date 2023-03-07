const { MongoClient, ServerApiVersion } = require("mongodb");

let dbConnection;

const uri =
  "mongodb+srv://tranvansu2001:661002@cluster0.o0fvmbo.mongodb.net/test";

module.exports = {
  connectToDb: (cb) => {
    // MongoClient.connect("mongodb://localhost:27017/bookstore")
    MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    })
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
