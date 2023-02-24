// import * as mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server'

// const mongoServer = new MongoMemoryServer();

// exports.dbConnect = async () => {
//     const uri = await mongoServer.getUri();

//     const mongooseOpts : any = {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//     };

//     await mongoose.connect(uri, mongooseOpts);
// }

// exports.dbDisconnect = async () => {
//     await mongoose.connection.dropDatabase();
//     await mongoose.connection.close();
//     await mongoServer.stop();
// }