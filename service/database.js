const { MongoClient, ObjectId } = require('mongodb');
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
  try {
      const result = await transactionCollection.insertOne(transaction);
      return { ...transaction, _id: result.insertedId };
  } catch (error) {
      console.error('Error inserting transaction:', error);
      throw error;
  }
}

async function getTransactions(family) {
  try {
      const result = await transactionCollection.find({ family }).toArray();
      return result || [];
  } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
  }
}

async function addGoal(goal) {
  const result = await goalCollection.insertOne(goal);
  return { result, _id: result.insertedId };
}

async function getGoals(family) {
  return goalCollection.find({family: family}).toArray();
}

async function updateTransactionNotes(transactionId, notes) {
  console.log('Updating transaction notes:', transactionId, notes);
  try {
      const result = await transactionCollection.updateOne(
          { _id: new ObjectId(transactionId) }, // Use ObjectId here
          { $set: { notes } }
      );
      return result;
  } catch (error) {
      console.error('Error updating transaction notes:', error);
      throw error;
  }
}

async function updateTransactionCategory(transactionId, category) {
  console.log('Updating transaction category:', transactionId, category);
  try {
      const result = await transactionCollection.updateOne(
          { _id: new ObjectId(transactionId) }, // Use ObjectId here
          { $set: { category } }
      );
      return result;
  } catch (error) {
      console.error('Error updating transaction category:', error);
      throw error;
  }
}

async function deleteTransaction(transactionId) {
  console.log('Deleting transaction:', transactionId);
  try {
      const result = await transactionCollection.deleteOne({ _id: new ObjectId(transactionId) });
      return result;
  } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
  }
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addTransaction,
  getTransactions,
  updateTransactionCategory,
  updateTransactionNotes,
  deleteTransaction,
  addGoal,
  getGoals,
};
