import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

const globalForMongoose = globalThis as unknown as {
  conn: Promise<typeof mongoose> | null;
};

export async function connectDB(): Promise<typeof mongoose> {
  if (globalForMongoose.conn) {
    try {
      const conn = await globalForMongoose.conn;
      if (conn.connection.readyState === 1) return conn;
    } catch {
      globalForMongoose.conn = null;
    }
  }

  let uri = process.env.MONGODB_URI?.trim();
  if (uri && uri.startsWith("MONGODB_URI=")) {
    uri = uri.replace(/^MONGODB_URI=/, "").trim();
  }
  if (uri && ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'")))) {
    uri = uri.slice(1, -1).trim();
  }
  const dbName = process.env.MONGODB_DB_NAME || "hotel_saas";

  if (!uri) {
    console.warn("[AI Studio] MONGODB_URI not set — database offline fallback active");
    throw new Error("Database is not configured. Set MONGODB_URI and MONGODB_DB_NAME.");
  }

  globalForMongoose.conn = mongoose
    .connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 2000,
      maxPoolSize: 10,
      bufferCommands: false,
    })
    .catch((err) => {
      console.warn("MongoDB not connected — some features may not work:", err.message);
      globalForMongoose.conn = null;
      throw err;
    });

  return globalForMongoose.conn;
}

export async function disconnectDB(): Promise<void> {
  if (globalForMongoose.conn) {
    await mongoose.disconnect().catch(() => {});
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