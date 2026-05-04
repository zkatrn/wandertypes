import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import type { TripInterpretation } from "@/types/interpretation";
import type { SurveyAnswers } from "@/types/survey";
import { normalizeTripInterpretation } from "@/lib/normalizeInterpretation";

export type TripSession = {
  id: string;
  userId?: string;
  surveyAnswers: SurveyAnswers;
  interpretation: TripInterpretation;
  createdAt: Date;
};

export async function saveTripSession(
  sessionId: string,
  surveyAnswers: SurveyAnswers,
  interpretation: TripInterpretation,
  userId?: string
): Promise<void> {
  const sessionRef = doc(db, "tripSessions", sessionId);
  
  await setDoc(sessionRef, {
    userId: userId || null,
    surveyAnswers,
    interpretation,
    createdAt: serverTimestamp(),
  });
}

export async function getTripSession(sessionId: string): Promise<TripSession | null> {
  const sessionRef = doc(db, "tripSessions", sessionId);
  const sessionSnap = await getDoc(sessionRef);
  
  if (!sessionSnap.exists()) {
    return null;
  }
  
  const data = sessionSnap.data();
  return {
    id: sessionId,
    userId: data.userId,
    surveyAnswers: data.surveyAnswers,
    interpretation: normalizeTripInterpretation(
      data.interpretation as Partial<TripInterpretation> & Record<string, unknown>
    ),
    createdAt: data.createdAt?.toDate() || new Date(),
  };
}

export async function getUserTripSessions(userId: string): Promise<TripSession[]> {
  const sessionsRef = collection(db, "tripSessions");
  const q = query(
    sessionsRef,
    where("userId", "==", userId)
  );
  
  const querySnapshot = await getDocs(q);
  const sessions: TripSession[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    sessions.push({
      id: doc.id,
      userId: data.userId,
      surveyAnswers: data.surveyAnswers,
      interpretation: normalizeTripInterpretation(
        data.interpretation as Partial<TripInterpretation> & Record<string, unknown>
      ),
      createdAt: data.createdAt?.toDate() || new Date(),
    });
  });
  
  // Sort in JavaScript instead of Firestore
  return sessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function deleteTripSession(sessionId: string): Promise<void> {
  const sessionRef = doc(db, "tripSessions", sessionId);
  await deleteDoc(sessionRef);
}

/**
 * Deletes every trip session owned by the user (Firestore batches of 500).
 * Requires rules that allow delete when `resource.data.userId == request.auth.uid`.
 */
export async function deleteAllTripSessionsForUser(userId: string): Promise<void> {
  const sessionsRef = collection(db, "tripSessions");
  const q = query(sessionsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const docs = snapshot.docs;
  const chunkSize = 500;
  for (let i = 0; i < docs.length; i += chunkSize) {
    const batch = writeBatch(db);
    for (const d of docs.slice(i, i + chunkSize)) {
      batch.delete(d.ref);
    }
    await batch.commit();
  }
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
