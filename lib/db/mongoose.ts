import mongoose from "mongoose";

const globalForMongoose = globalThis as unknown as {
  conn: Promise<typeof mongoose> | null;
};

export async function connectDB(): Promise<typeof mongoose> {
  if (globalForMongoose.conn) {
    const conn = await globalForMongoose.conn;
    if (conn.connection.readyState === 1) return conn;
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri || !dbName) {
    throw new Error("Database is not configured. Set MONGODB_URI and MONGODB_DB_NAME.");
  }

  globalForMongoose.conn = mongoose.connect(uri, {
    dbName,
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
    bufferCommands: false,
  });

  return globalForMongoose.conn;
}

export async function disconnectDB(): Promise<void> {
  if (globalForMongoose.conn) {
    await mongoose.disconnect();
    globalForMongoose.conn = null;
  }
}

export async function withTransaction<T>(
  fn: (session: mongoose.ClientSession) => Promise<T>
): Promise<T> {
  const conn = await connectDB();
  const session = await conn.startSession();
  session.startTransaction();
  try {
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}