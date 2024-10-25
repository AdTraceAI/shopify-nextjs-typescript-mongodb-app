import { Session } from "@shopify/shopify-api";
import cryption from "./cryption";
import SessionModel from "@/models/session";

/**
 * Stores the session data in the database.
 */
const storeSession = async (session: Session) => {
  await SessionModel.findOneAndUpdate(
    { id: session.id },
    {
      content: cryption.encrypt(JSON.stringify(session)),
      shop: session.shop,
    },
    {
      upsert: true,
      new: true,
    }
  );

  return true;
};

/**
 * Loads the session data from the database.
 */
const loadSession = async (id: string) => {
  const sessionResult = await SessionModel.findOne({ id });

  if (sessionResult === null) {
    return undefined;
  }
  if (sessionResult.content && sessionResult.content.length > 0) {
    const sessionObj = JSON.parse(cryption.decrypt(sessionResult.content));
    return new Session(sessionObj);
  }
  return undefined;
};

/**
 * Deletes the session data from the database.
 */
const deleteSession = async (id: string) => {
  await SessionModel.deleteOne({ id });

  return true;
};

/**
 * Session handler object containing storeSession, loadSession, and deleteSession functions.
 */
const sessionHandler = { storeSession, loadSession, deleteSession };

export default sessionHandler;
