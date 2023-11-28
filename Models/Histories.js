const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Description: { type: String, required: true },
});
const History = mongoose.model('History', historySchema);

module.exports = History;