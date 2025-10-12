import { db } from "@/configs/firebase";
import { sanitizeReportData } from "@/lib/utils";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { uploadWithCloudinary } from "@/services/upload";

const col = collection(db, "reports");

export async function getReport(id) {
  const rel = doc(db, "reports", id);
  try {
    const snap = await getDoc(rel);
    if (snap.exists()) {
      return {
        id: snap.id,
        ...snap.data(),
      };
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function getReports() {
  const q = query(col, orderBy("createdAt", "desc"));
  try {
    const snaps = await getDocs(q);
    return snaps.docs.map((snap) => {
      if (snap.exists()) {
        return {
          id: snap.id,
          ...snap.data(),
        };
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}

export async function createReport(report) {
  if (!report) return;
  const sanitizedReport = sanitizeReportData(report);

  if (
    Array.isArray(sanitizedReport.attachments) &&
    sanitizedReport.attachments.length > 0
  ) {
    sanitizedReport.attachments = await Promise.all(
      sanitizedReport.attachments.map(
        async (attachment) => await uploadWithCloudinary(attachment)
      )
    );
  }
  try {
    const ref = await addDoc(col, sanitizedReport);
    return ref.id;
  } catch (error) {
    throw new Error(error);
  }
}

export async function flagReport(id) {}
