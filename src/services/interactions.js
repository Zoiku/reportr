import { db } from "@/configs/firebase";
import { addDoc, collection } from "firebase/firestore";

export async function support(userId, reportId) {
  if (!userId || !reportId) return;
  const col = collection(db, "support");

  try {
    await addDoc(col, { userId, reportId });
  } catch (error) {
    throw new Error(error);
  }
}

export async function reup(userId, reportId) {
  if (!userId || !reportId) return;
  const col = collection(db, "reup");

  try {
    await addDoc(col, { userId, reportId });
  } catch (error) {
    throw new Error(error);
  }
}

export async function flag(userId, reportId, reason = "") {
  if (!userId || !reportId) return;
  const col = collection(db, "flag");

  try {
    await addDoc(col, { userId, reportId, reason });
  } catch (error) {
    throw new Error(error);
  }
}

export async function track(userId, reportId) {
  if (!userId || !reportId) return;
  const col = collection(db, "track");

  try {
    await addDoc(col, { userId, reportId });
  } catch (error) {
    throw new Error(error);
  }
}
