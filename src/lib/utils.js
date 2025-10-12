import { clsx } from "clsx";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function sanitizeReportData(report) {
  if (!report) return;
  const sanitizedReport = { ...report };

  sanitizedReport.createdAt = Timestamp.now();
  sanitizedReport.status = "received";
  sanitizedReport.categories = ["Road", "Flooding", "Transport"];
  sanitizedReport.agency = ["Ministry of Roads"];
  sanitizedReport.aiConfidenceScore = 0.3;
  sanitizedReport.urgencyScore = 0.9;
  sanitizedReport.reportedBy = {
    id: "TjIRSaQq3-zK_Jvi",
    displayName: "Mark Zoiku",
  };
  return sanitizedReport;
}

export function toDateFromTimestamp(timestamp) {
  if (!timestamp) return new Date().toLocaleDateString();
  if (timestamp instanceof Timestamp) {
    return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
  }
}

export async function share({ title = "Reportr", text = "", url = "" }) {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("Unsupported.");
  }
}
