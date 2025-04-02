const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const goalCollection = db.collection('goal');
const transactionCollection = db.collection('transaction');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

async function getUser(name) {
  return userCollection.findOne({ name: name });
}

async function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ name: user.name, family: user.family }, { $set: user });
}

async function addTransaction(transaction) {
    const result = await transactionCollection.insertOne(transaction);
    return { ...transaction, _id: result.insertedId };
}

async function getTransactions(family) {
  return transactioncollection.find({family: family}).toArray();
}

async function addGoal(goal) {
  const result = await goalCollection.insertOne(goal);
  return { ...goal, _id: result.insertedId };
}
async function getGoals(family) {
  return goalCollection.find({family: family}).toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addTransaction,
  getTransactions,
  addGoal,
  getGoals,
};
