"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserTripSessions, deleteTripSession, type TripSession } from "@/lib/firestore";
import { getTheme } from "@/lib/themes";
import { Button } from "@/components/ui/Button";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { Calendar, MapPin, Trash2 } from "lucide-react";

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let unsubAuth: (() => void) | undefined;
    let lastLoadedUid: string | undefined;

    void (async () => {
      await auth.authStateReady();
      if (cancelled) return;

      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        router.replace("/");
        return;
      }

      const loadForUser = async (uid: string) => {
        try {
          const userTrips = await getUserTripSessions(uid);
          if (!cancelled) setTrips(userTrips);
        } catch (error) {
          console.error("Failed to load trips:", error);
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      lastLoadedUid = user.uid;
      await loadForUser(user.uid);

      unsubAuth = onAuthStateChanged(auth, async (nextUser) => {
        if (cancelled) return;
        if (!nextUser) {
          lastLoadedUid = undefined;
          setTrips([]);
          setLoading(false);
          router.replace("/");
          return;
        }
        if (nextUser.uid === lastLoadedUid) return;
        lastLoadedUid = nextUser.uid;
        setLoading(true);
        await loadForUser(nextUser.uid);
      });
    })();

    return () => {
      cancelled = true;
      unsubAuth?.();
    };
  }, [router]);

  const handleDelete = async (e: React.MouseEvent, tripId: string) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this trip?")) {
      return;
    }

    setDeleting(tripId);
    try {
      await deleteTripSession(tripId);
      setTrips(trips.filter(trip => trip.id !== tripId));
    } catch (error) {
      console.error("Failed to delete trip:", error);
      alert("Failed to delete trip. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <LoadingScreen
        statusSteps={["Loading your trips..."]}
        brandLabel="VoyageBlitz"
      />
    );
  }

  return (
    <>
      {/* Background image */}
      <div
        className="fixed inset-0 z-0 bg-app-photo-backdrop"
        style={{
          backgroundImage: "url(/bg.png)",
          backgroundAttachment: "fixed",
          filter: "saturate(0.5) brightness(1.05)",
        }}
      />
      <div className="fixed inset-0 z-0 bg-white/25" />

      <div className="relative z-10 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-mountain-brown">My Trips</h1>
          <Button onClick={() => router.push("/")}>
            New Trip
          </Button>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-stone-700 mb-2">No trips yet</h2>
            <p className="text-stone-600 mb-6">Start planning your first trip!</p>
            <Button onClick={() => router.push("/")}>
              Create Your First Trip
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/results/${trip.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-mountain-brown mb-2">
                      {trip.interpretation.travelArchetype}
                    </h3>
                    <div className="flex items-center gap-2 text-stone-600 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(trip.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-block bg-primary px-4 py-2 rounded-full">
                      <p className="text-sm font-semibold text-white">
                        {getTheme(trip.interpretation.selectedTheme).name}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, trip.id)}
                      disabled={deleting === trip.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      aria-label="Delete trip"
                    >
                      {deleting === trip.id ? (
                        <div className="animate-spin w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-stone-600 mb-4 line-clamp-2">
                  {trip.interpretation.archetypeDescription}
                </p>

                <div className="flex flex-wrap gap-2">
                  {trip.interpretation.comparisonCards.slice(0, 3).map((card) => (
                    <span
                      key={card.destinationName}
                      className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary"
                    >
                      <MapPin className="w-3 h-3" />
                      {card.destinationName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
