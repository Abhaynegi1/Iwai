import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AttendeeEntity, EventEntity, GuestSession } from "@iwai/shared";
import type { JoinEventByCodeInput, UpdateAttendeeProfileInput } from "@iwai/validation";
import { apiClient, setGuestAuthToken } from "../services/api";

const GUEST_SESSION_STORAGE_KEY = "@iwai_guest_session";

export interface GuestSessionContextType {
  session: GuestSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  joinEvent: (input: JoinEventByCodeInput) => Promise<GuestSession>;
  leaveEvent: () => Promise<void>;
  updateProfile: (input: UpdateAttendeeProfileInput) => Promise<AttendeeEntity>;
  refreshEvent: () => Promise<EventEntity | null>;
}

const GuestSessionContext = createContext<GuestSessionContextType | null>(null);

export const GuestSessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<GuestSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore guest session on app startup
  useEffect(() => {
    async function loadStoredSession() {
      try {
        const stored = await AsyncStorage.getItem(GUEST_SESSION_STORAGE_KEY);
        if (stored) {
          const parsedSession: GuestSession = JSON.parse(stored);
          setSession(parsedSession);
          setGuestAuthToken(parsedSession.guestToken);
        }
      } catch (err) {
        console.error("Failed to restore guest session from storage:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredSession();
  }, []);

  // Join an event and store the session
  const joinEvent = useCallback(
    async (input: JoinEventByCodeInput): Promise<GuestSession> => {
      const response = await apiClient.attendees.join(input);
      const newSession = response.data;

      setSession(newSession);
      setGuestAuthToken(newSession.guestToken);

      try {
        await AsyncStorage.setItem(
          GUEST_SESSION_STORAGE_KEY,
          JSON.stringify(newSession),
        );
      } catch (err) {
        console.error("Failed to persist guest session:", err);
      }

      return newSession;
    },
    [],
  );

  // Leave active event and clear credentials
  const leaveEvent = useCallback(async () => {
    setSession(null);
    setGuestAuthToken(null);
    try {
      await AsyncStorage.removeItem(GUEST_SESSION_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to remove guest session from storage:", err);
    }
  }, []);

  // Update guest display name or avatar
  const updateProfile = useCallback(
    async (input: UpdateAttendeeProfileInput): Promise<AttendeeEntity> => {
      if (!session) {
        throw new Error("No active guest session found");
      }

      const response = await apiClient.attendees.updateMyProfile(input);
      const updatedAttendee = response.data;

      const updatedSession: GuestSession = {
        ...session,
        attendee: updatedAttendee,
      };

      setSession(updatedSession);
      await AsyncStorage.setItem(
        GUEST_SESSION_STORAGE_KEY,
        JSON.stringify(updatedSession),
      );

      return updatedAttendee;
    },
    [session],
  );

  // Refresh current event details
  const refreshEvent = useCallback(async (): Promise<EventEntity | null> => {
    if (!session?.event?.eventCode) {
      return null;
    }

    try {
      const response = await apiClient.events.getByCode(session.event.eventCode);
      const updatedEvent = response.data;

      const updatedSession: GuestSession = {
        ...session,
        event: updatedEvent,
      };

      setSession(updatedSession);
      await AsyncStorage.setItem(
        GUEST_SESSION_STORAGE_KEY,
        JSON.stringify(updatedSession),
      );

      return updatedEvent;
    } catch (err) {
      console.error("Failed to refresh event:", err);
      return null;
    }
  }, [session]);

  return (
    <GuestSessionContext.Provider
      value={{
        session,
        isLoading,
        isAuthenticated: Boolean(session?.guestToken),
        joinEvent,
        leaveEvent,
        updateProfile,
        refreshEvent,
      }}
    >
      {children}
    </GuestSessionContext.Provider>
  );
};

/**
 * Hook to consume the Guest Session context
 */
export function useGuestSession(): GuestSessionContextType {
  const context = useContext(GuestSessionContext);
  if (!context) {
    throw new Error("useGuestSession must be used within a GuestSessionProvider");
  }
  return context;
}
