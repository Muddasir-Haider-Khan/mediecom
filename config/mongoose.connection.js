// const mongoose = require('mongoose');
// const debug = require('debug')('production:mongoose');

// console.log("Connecting to MongoDB URI:",process.env.MONGODB_URI)
// mongoose.connect(process.env.MONGODB_URI)

// .then(() => {
//     debug('connected to MongoDB Successfully')
//     console.log("Connected to MongoDB Successfully")
// })
// .catch((err) => {
//     debug(err)
//     console.log("error connecting to DB", err)
// })

// let db =  mongoose.connection 

// module.exports = db

const mongoose = require('mongoose');
const debug = require('debug')('production:mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)

.then(() => {
    debug('connected to MongoDB Successfully')
    console.log("Connected to MongoDB Successfully")
})
.catch((err) => {
    debug(err)
    console.log("error connecting to DB", err)
})

let db =  mongoose.connection 

module.exports = db