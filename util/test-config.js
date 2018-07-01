const mongoose = require('mongoose');
const Mockgoose = require('mockgoose');

const mkgoose = new Mockgoose(mongoose);

const connectDB = async () => {
  await mkgoose.prepareStorage();
  await mongoose
    .connect('mongodb://localhost:27017/mern-test')
    .catch(() => 'Unable to connect to test database');
};

const dropDB = async () => {
  await mkgoose.helper.reset().catch(() => 'Unable to reset test database');
};

module.exports = {
  connectDB,
  dropDB,
};
