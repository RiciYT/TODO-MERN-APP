import mongoose from 'mongoose';

import { requireEnv } from './env';

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnectionPromise: Promise<typeof mongoose> | undefined;
}

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!global.mongooseConnectionPromise) {
    mongoose.set('bufferCommands', false);

    global.mongooseConnectionPromise = mongoose
      .connect(requireEnv('DB_URL'), {
        dbName: 'todo-mern-app',
        serverSelectionTimeoutMS: 5000,
      })
      .then((connection) => {
        console.log('Connected to DB:', connection.connection.db?.databaseName);
        return connection;
      })
      .catch((error) => {
        global.mongooseConnectionPromise = undefined;
        throw error;
      });
  }

  return global.mongooseConnectionPromise;
}

export { connectToDatabase };
