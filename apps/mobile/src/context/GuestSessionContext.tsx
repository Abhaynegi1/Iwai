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
const GUEST_NICKNAME_STORAGE_KEY = "@iwai_guest_nickname";

export interface GuestSessionContextType {
  session: GuestSession | null;
  guestNickname: string;
  setGuestNickname: (name: string) => Promise<void>;
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
  const [guestNickname, setGuestNicknameState] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore guest session and nickname on app startup
  useEffect(() => {
    async function loadStoredSession() {
      try {
        const [storedSession, storedNickname] = await Promise.all([
          AsyncStorage.getItem(GUEST_SESSION_STORAGE_KEY),
          AsyncStorage.getItem(GUEST_NICKNAME_STORAGE_KEY),
        ]);

        if (storedSession) {
          const parsedSession: GuestSession = JSON.parse(storedSession);
          setSession(parsedSession);
          setGuestAuthToken(parsedSession.guestToken);
          if (parsedSession.attendee?.nickname) {
            setGuestNicknameState(parsedSession.attendee.nickname);
          }
        } else if (storedNickname) {
          setGuestNicknameState(storedNickname);
        }
      } catch (err) {
        console.error("Failed to restore guest session from storage:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredSession();
  }, []);

  const setGuestNickname = useCallback(async (name: string) => {
    const trimmed = name.trim();
    setGuestNicknameState(trimmed);
    try {
      if (trimmed) {
        await AsyncStorage.setItem(GUEST_NICKNAME_STORAGE_KEY, trimmed);
      } else {
        await AsyncStorage.removeItem(GUEST_NICKNAME_STORAGE_KEY);
      }
    } catch (err) {
      console.error("Failed to save nickname:", err);
    }
  }, []);

  // Join an event and store the session
  const joinEvent = useCallback(
    async (input: JoinEventByCodeInput): Promise<GuestSession> => {
      const response = await apiClient.attendees.join(input);
      const newSession = response.data;

      setSession(newSession);
      setGuestAuthToken(newSession.guestToken);
      if (newSession.attendee?.nickname) {
        setGuestNicknameState(newSession.attendee.nickname);
      }

      try {
        await Promise.all([
          AsyncStorage.setItem(
            GUEST_SESSION_STORAGE_KEY,
            JSON.stringify(newSession),
          ),
          AsyncStorage.setItem(
            GUEST_NICKNAME_STORAGE_KEY,
            newSession.attendee.nickname,
          ),
        ]);
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
      if (updatedAttendee.nickname) {
        setGuestNicknameState(updatedAttendee.nickname);
      }

      await Promise.all([
        AsyncStorage.setItem(
          GUEST_SESSION_STORAGE_KEY,
          JSON.stringify(updatedSession),
        ),
        AsyncStorage.setItem(
          GUEST_NICKNAME_STORAGE_KEY,
          updatedAttendee.nickname,
        ),
      ]);

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
        guestNickname,
        setGuestNickname,
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
