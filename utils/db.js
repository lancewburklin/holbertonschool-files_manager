const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    if (process.env.DB_HOST) {
      this.url = `${process.env.DB_HOST}:`;
    } else {
      this.url = 'localhost:';
    }
    if (process.env.DB_PORT) {
      this.url += process.env.DB_PORT;
    } else {
      this.url += '27017';
    }
    let nameDB;
    if (process.env.DB_DATABASE) {
      nameDB = process.env.DB_DATABASE;
    } else {
      nameDB = 'files_manager';
    }
    this.client = new MongoClient(`mongodb://${this.url}`);
    this.client.connect((err) => {
      if (err === null) {
        this.db = this.client.db(nameDB);
      }
    });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const collection = this.db.collection('users');
    const info = await collection.find({}).toArray();
    return info.length;
  }

  async nbFiles() {
    const collection = this.db.collection('files');
    const info = await collection.find({}).toArray();
    return info.length;
  }
}

const dbClient = new DBClient();
export default dbClient;
