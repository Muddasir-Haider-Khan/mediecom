
const mongoose = require("mongoose")

const essentialsSchema = new mongoose.Schema({
  heroImage: String,
});

module.exports = mongoose.model("essentials", essentialsSchema);
