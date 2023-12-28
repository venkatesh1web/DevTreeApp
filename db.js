// const MongoClient = require('mongodb').MongoClient
// const dotenv = require('dotenv')
// dotenv.config()

// const url = process.env.URL

// MongoClient.connect(url, (err, client)=>{
//     if(err) throw err

//     console.log("db connected...")
//     module.exports = client

//     const app = require('./app')
//     app.listen(process.env.PORT, ()=>{
//         console.log("server listening on 8000...")
//     })
// })

// const { MongoClient } = require('mongodb');
// const dotenv = require('dotenv');
// dotenv.config();

// const url = process.env.URL;
// let db;

// MongoClient.connect(url, (err, client) => {
//   if (err) throw err;
//   console.log("db connected...");
//   db = client.db(); // Assuming you have a default database
// });

// module.exports = {
//   db: () => db,
// };

// const { MongoClient } = require('mongodb');
// const dotenv = require('dotenv');
// dotenv.config();

// const url = process.env.URL;

// MongoClient.connect(url, (err, client) => {
//     if (err) throw err;

//     console.log("db connected...");

//     // Make the MongoDB client available globally or in another module if needed
//     global.db = client.db();

//     // Start the HTTP server
//     server.listen(process.env.PORT, () => {
//         console.log("server listening on 8000...");
//     });
// });


// const { MongoClient } = require('mongodb');
// const dotenv = require('dotenv');
// dotenv.config();

// const url = process.env.URL;

// let db;

// MongoClient.connect(url, (err, client) => {
//     if (err) throw err;

//     console.log("db connected...");
//     db = client.db();
// });

// module.exports = {
//     getDb: function() {
//         return db;
//     }
// };


// const { MongoClient } = require('mongodb');
// const dotenv = require('dotenv');
// dotenv.config();

// const url = process.env.URL;

// let db;

// const connectToDB = async () => {
//     try {
//         const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log('Connected to the database');
//         db = client.db();
//     } catch (error) {
//         console.error('Error connecting to the database:', error);
//         throw error;
//     }
// };

// const getDb = () => {
//     if (!db) {
//         throw new Error('Database not initialized');
//     }
//     return db;
// };

// module.exports = {
//     connectToDB,
//     getDb,
// };


// db.js
// const { MongoClient } = require('mongodb');
// const dotenv = require('dotenv');
// dotenv.config();

// const url = process.env.URL;

// let db;

// const connectToDB = async () => {
//     try {
//         const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log('Connected to the database');
//         db = client.db();
//     } catch (error) {
//         console.error('Error connecting to the database:', error);
//         throw error;
//     }
// };

// const getDb = () => {
//     if (!db) {
//         throw new Error('Database not initialized');
//     }
//     return db;
// };

// module.exports = {
//     connectToDB,
//     getDb,
// };


const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const url = process.env.URL;

let db;

const connectToDB = async () => {
    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to the database');
        db = client.db();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};

module.exports = {
    connectToDB,
    getDb,
};
