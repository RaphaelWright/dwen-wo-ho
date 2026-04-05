# Notification WebSocket System - Developer Guide

A top-down walkthrough of how real-time notifications work in the Dwen Wo Ho application using STOMP over WebSocket.

---

## Table of Contents

1. [Quick Overview](#quick-overview)
2. [Architecture at a Glance](#architecture-at-a-glance)
3. [The Journey of a Notification](#the-journey-of-a-notification)
4. [Key Files and Their Roles](#key-files-and-their-roles)
5. [How to Use It (Code Examples)](#how-to-use-it-code-examples)
6. [Adding a New WebSocket Feature](#adding-a-new-websocket-feature)
7. [Debugging & Troubleshooting](#debugging--troubleshooting)
8. [Common Pitfalls](#common-pitfalls)

---

## Quick Overview

**What is this?**
A real-time notification system that replaces HTTP polling. When something happens in the backend (new patient, urgent case, etc.), the server pushes it instantly to the frontend via WebSocket.

**Technologies used:**

- **STOMP** - Simple Text Oriented Messaging Protocol (frames over WebSocket)
- **SockJS** - WebSocket fallback for older browsers
- **Jotai** - State management for notifications
- **TanStack Query** - Still used for initial data load and mutations

**The core principle:**

```
HTTP: Client asks "Any news?" every 60 seconds
WebSocket: Server says "Here's news!" instantly
```

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│  │   Patient    │────▶│ STOMP Broker │◀────│   Provider   │   │
│  │   Service    │     │  (Spring)    │     │   Service    │   │
│  └──────────────┘     └───────┬──────┘     └──────────────┘   │
│                               │                                 │
└───────────────────────────────┼─────────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │ /ws/notifications?    │
                    │    token=JWT          │
                    └───────────┬───────────┘
                                │
┌───────────────────────────────┼─────────────────────────────────┐
│                      FRONTEND  │                                 │
│                               │                                 │
│  ┌────────────────────────────▼────────────────────────────┐   │
│  │              stomp-client.ts (Singleton)                 │   │
│  │  • Manages SockJS connection                            │   │
│  │  • Handles reconnection with backoff                      │   │
│  │  • Provides subscribe/unsubscribe API                     │   │
│  └────────────────────────────┬─────────────────────────────┘   │
│                               │                                  │
│  ┌────────────────────────────▼────────────────────────────┐   │
│  │         subscription-manager.ts (Role-aware)            │   │
│  │  • Curator → subscribes to curator topics               │   │
│  │  • Provider → subscribes to provider topics             │   │
│  │  • Dispatches events via CustomEvent to window           │   │
│  └────────────────────────────┬─────────────────────────────┘   │
│                               │                                  │
│       ┌───────────────────────┼───────────────────────┐         │
│       │                       │                       │         │
│  ┌────▼──────┐         ┌────▼──────┐         ┌────▼──────┐   │
│  │ useNotif  │         │ useUrgent │         │ usePatient│   │
│  │ icationWS │         │ CasesWS   │         │ StatusWS  │   │
│  │           │         │           │         │           │   │
│  │ Listens:  │         │ Listens:  │         │ Listens:  │   │
│  │ ws:notif  │         │ ws:urgent │         │ ws:patien │   │
│  │ ication   │         │ -case     │         │ t-status  │   │
│  └────┬──────┘         └────┬──────┘         └────┬──────┘   │
│       │                       │                       │         │
│       └───────────────────────┼───────────────────────┘         │
│                               │                                 │
│                    ┌──────────▼──────────┐                   │
│                    │   Jotai Atoms (UI)    │                   │
│                    │ • notificationsAtom   │                   │
│                    │ • urgentCasesAtom     │                   │
│                    │ • unreadCountAtom     │                   │
│                    └───────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## The Journey of a Notification

Let's trace what happens when a patient is referred to a provider:

### Step 1: Backend Event

```java
// Spring Boot backend
@Service
public class PatientService {
    public void referPatient(Long patientId, Long providerId) {
        // ... business logic ...

        // Send WebSocket notification
        messagingTemplate.convertAndSendToUser(
            providerId.toString(),
            "/queue/notifications",
            new NotificationDTO(
                type: "PATIENT_REFERRED",
                message: "Dr. Smith referred patient Jane Doe to you",
                actionUrl: "/provider/patients/123"
            )
        );
    }
}
```

### Step 2: WebSocket Transport

The message travels through:

```
Backend → STOMP Broker → SockJS/WebSocket → Frontend
```

The frontend receives this JSON frame:

```json
{
  "id": "f9ad16f6-6f73-4f0e-b335-801d3f95d1ec",
  "type": "PATIENT_REFERRED",
  "title": "Patient Referred",
  "message": "Dr. Smith referred patient Jane Doe to you.",
  "read": false,
  "createdAt": "2026-04-02T12:01:00",
  "actionUrl": "/provider/patients/123"
}
```

### Step 3: Subscription Manager Receives

In `subscription-manager.ts`:

```typescript
// The manager is subscribed to "/user/queue/notifications"
// It receives the message and dispatches a CustomEvent

private handlePersonalNotification(payload: NewNotificationEvent): void {
  window.dispatchEvent(
    new CustomEvent("ws:notification", { detail: payload })
  );
}
```

### Step 4: React Hook Listens

In `use-notification-websocket.ts`:

```typescript
useEffect(() => {
  const handleNotification = (event: CustomEvent<NewNotificationEvent>) => {
    const { notification, unreadCount } = event.detail;

    // 1. Add to Jotai atom (updates UI)
    setNotifications((prev) => [newNotif, ...prev]);

    // 2. Invalidate TanStack Query cache
    queryClient.invalidateQueries({ queryKey: ["notifications"] });

    // 3. Show toast notification
    toast.success(notification.title, {
      action: {
        label: "View",
        onClick: () => router.push(notification.actionUrl),
      },
    });
  };

  window.addEventListener("ws:notification", handleNotification);
  return () =>
    window.removeEventListener("ws:notification", handleNotification);
}, []);
```

### Step 5: UI Updates

The notification appears in three places simultaneously:

1. **Toast** - Pops up immediately
2. **Notification Bell** - Badge count increments
3. **Notification Sheet** - New item added to list

---

## Key Files and Their Roles

### 1. Service Layer (The Engine)

**`stomp-client.ts`** - The WebSocket connection

```typescript
// This is a SINGLETON - only one instance exists
class StompWebSocketClient {
  connect(token: string) → Opens SockJS connection
  subscribe(topic, handler) → Listen to a channel
  unsubscribe(id) → Stop listening
  disconnect() → Clean shutdown
}

// Usage:
stompClient.connect("jwt-token-here");
stompClient.subscribe("/user/queue/notifications", (msg) => {
  console.log("Got message:", msg);
});
```

**`subscription-manager.ts`** - The Traffic Cop

```typescript
// Decides WHO gets WHAT based on user role
class SubscriptionManager {
  initialize() {
    const userType = getUserType(); // "curator" | "provider"

    if (userType === "curator") {
      this.subscribeToTopic("/topic/curator/patient-results");
    } else if (userType === "provider") {
      this.subscribeToTopic(`/topic/provider/${providerId}/urgent`);
    }
  }
}
```

### 2. React Hooks (The Consumers)

**`use-stomp-websocket.ts`** - Connection state

```typescript
const { connectionStatus, connect, disconnect, isConnected } =
  useStompWebSocket();
// Returns: "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "ERROR"
```

**`use-notification-websocket.ts`** - Notification events

```typescript
const { notifications, unreadCount } = useNotificationWebSocket();
// Automatically listens to "ws:notification" events
// Updates notificationsAtom and shows toasts
```

**`use-urgent-cases-websocket.ts`** - Urgent patient alerts

```typescript
const { urgentCases } = useUrgentCasesWebSocket();
// Listens to "ws:urgent-case" events
// Adds patients to urgent panel
```

**`use-patient-status-websocket.ts`** - Status changes

```typescript
usePatientStatusWebSocket();
// No return value - just invalidates queries when patients change
```

### 3. Provider Component (The Glue)

**`stomp-provider.tsx`** - Global setup

```typescript
export function StompProvider({ children }) {
  // 1. Connect when user logs in
  useEffect(() => {
    if (hasValidToken()) connect();
  }, []);

  // 2. Initialize subscriptions when connected
  useEffect(() => {
    if (connectionStatus === "CONNECTED") {
      subscriptionManager.initialize();
    }
  }, [connectionStatus]);

  // 3. All hooks listen for events
  useNotificationWebSocket();
  useUrgentCasesWebSocket();
  usePatientStatusWebSocket();

  return children;
}
```

### 4. State Atoms (The Data Store)

**`atoms/websocket.ts`**

```typescript
export const connectionStatusAtom = atom<ConnectionStatus>("DISCONNECTED");
export const unreadCountAtom = atom<number>(0);
export const urgentCasesAtom = atom<Array<UrgentCasePatient>>([]);
```

**`atoms/notification.ts`** (existing)

```typescript
export const notificationsAtom = atom<Notification[]>([]);
export const notificationSheetOpenAtom = atom<boolean>(false);
```

---

## How to Use It (Code Examples)

### Reading Notifications

```typescript
// In any component
import { useAtom } from "jotai";
import { notificationsAtom } from "@/atoms/notification";

function MyComponent() {
  const [notifications] = useAtom(notificationsAtom);

  return (
    <div>
      {notifications.map(n => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
}
```

### Sending "Mark as Read"

```typescript
// HTTP mutations still work
import { useMarkNotificationReadMutation } from "@/hooks/queries/use-provider";

function NotificationItem({ notification }) {
  const markRead = useMarkNotificationReadMutation();

  const handleClick = () => {
    markRead.mutate(notification.id);
    // This updates backend AND triggers WebSocket to other sessions
  };
}
```

### Role-Aware Notification Loading

The system automatically uses the correct endpoint based on user role:

| Role         | HTTP Endpoint (Initial Load)          | WebSocket Topic             |
| ------------ | ------------------------------------- | --------------------------- |
| **Curator**  | `GET /api/v1/curator/notifications`   | `/user/queue/notifications` |
| **Provider** | `GET /api/v1/providers/notifications` | `/user/queue/notifications` |

**Implementation in `use-notification-websocket.ts`:**

```typescript
const userType = getUserType();

const queryKey =
  userType === "curator"
    ? [QUERY_KEYS.curator, "notifications"]
    : [QUERY_KEYS.providers, "notifications"];

const queryFn =
  userType === "curator"
    ? curatorService.getNotifications // Curator endpoint
    : providersService.getNotifications; // Provider endpoint

// One-time HTTP load for history, then WebSocket for real-time
const { data: initialNotifications } = useQuery({
  queryKey,
  queryFn,
  staleTime: 5 * 60 * 1000,
  enabled: !!userType,
});
```

**Why this matters:**

- Curators get admin-level notifications (new providers, schools, etc.)
- Providers get patient-specific notifications (referrals, assignments, etc.)
- Backend enforces this separation (403 if wrong endpoint used)

---

### Checking Connection Status

```typescript
import { useStompWebSocket } from "@/hooks/use-stomp-websocket";

function ConnectionIndicator() {
  const { connectionStatus, reconnect } = useStompWebSocket();

  return (
    <div>
      {connectionStatus === "CONNECTED" && <GreenDot />}
      {connectionStatus === "ERROR" && (
        <button onClick={reconnect}>Reconnect</button>
      )}
    </div>
  );
}
```

---

## Adding a New WebSocket Feature

Let's say you want to add "School Announcements" for curators:

### Step 1: Add Type Definition

```typescript
// src/lib/types/websocket.ts

export interface SchoolAnnouncementEvent {
  type: "NEW_ANNOUNCEMENT";
  schoolId: number;
  title: string;
  content: string;
  postedAt: string;
}
```

### Step 2: Add to Subscription Manager

```typescript
// src/services/websocket/subscription-manager.ts

private initializeCuratorSubscriptions(): void {
  // Existing subscriptions...
  this.subscribeToTopic(
    "/topic/curator/announcements",
    "curator-announcements"
  );
}

// Add handler
private handleSchoolAnnouncement(payload: SchoolAnnouncementEvent): void {
  window.dispatchEvent(
    new CustomEvent("ws:announcement", { detail: payload })
  );
}
```

### Step 3: Create React Hook

```typescript
// src/hooks/use-announcements-websocket.ts

export function useAnnouncementsWebSocket() {
  const [announcements, setAnnouncements] = useAtom(announcementsAtom);

  useEffect(() => {
    const handler = (event: CustomEvent<SchoolAnnouncementEvent>) => {
      setAnnouncements((prev) => [event.detail, ...prev]);
      toast.info(`New announcement: ${event.detail.title}`);
    };

    window.addEventListener("ws:announcement", handler);
    return () => window.removeEventListener("ws:announcement", handler);
  }, [setAnnouncements]);

  return { announcements };
}
```

### Step 4: Register in StompProvider

```typescript
// src/components/providers/stomp-provider.tsx

import { useAnnouncementsWebSocket } from "@/hooks/use-announcements-websocket";

export function StompProvider({ children }) {
  // Existing hooks...
  useAnnouncementsWebSocket(); // Add this line

  return <>{children}</>;
}
```

Done! The new feature is live.

---

## Debugging & Troubleshooting

### Check Connection Status

Open browser console and look for:

```
[STOMP] Connected successfully
[STOMP] Subscribed: /user/queue/notifications (abc-123)
[SubscriptionManager] Initializing for provider
```

### Connection Not Working?

1. **Check token**: `localStorage.getItem("token")` should return JWT
2. **Check user type**: `localStorage.getItem("userType")` should be "provider" or "curator"
3. **Check network tab**: Look for WebSocket/SockJS request in Network → WS
4. **Check backend**: Verify `/ws/notifications` endpoint is running

### Enable Debug Logging

```typescript
// In stomp-client.ts, set debug: true
this.client = new Client({
  debug: (msg) => console.log("[STOMP DEBUG]", msg), // Full protocol logs
});
```

### Reconnection Issues

The client auto-reconnects with exponential backoff:

```
1s → 2s → 4s → 8s → 16s → 30s (max)
```

If it's not reconnecting:

- Check if `stompClient.disconnect()` was called
- Check if token expired (re-auth needed)

---

## Common Pitfalls

### ❌ Don't Do This

```typescript
// WRONG: Creating new subscriptions every render
useEffect(() => {
  stompClient.subscribe("/topic/foo", handler);
}, []); // ❌ Never cleaned up!

// WRONG: Using HTTP polling alongside WebSocket
const { data } = useQuery({
  queryKey: ["notifications"],
  refetchInterval: 60000, // ❌ Unnecessary! WebSocket handles updates
});
```

### ✅ Do This Instead

```typescript
// RIGHT: Subscribe once, cleanup on unmount
useEffect(() => {
  const id = stompClient.subscribe("/topic/foo", handler);
  return () => stompClient.unsubscribe(id);
}, []);

// RIGHT: One-time load, then WebSocket takes over
const { data } = useQuery({
  queryKey: ["notifications"],
  staleTime: Infinity, // ✅ Don't refetch
});
```

### ❌ Don't Forget

- Always unsubscribe in cleanup functions
- Don't call `connect()` multiple times (use singleton)
- Don't store WebSocket messages in localStorage (state is in Jotai)

---

## Summary

1. **Connection**: `StompProvider` auto-connects when user is authenticated
2. **Subscriptions**: `subscription-manager` subscribes to role-specific topics
3. **Events**: Backend pushes → STOMP receives → CustomEvent dispatched
4. **React**: Hooks listen to CustomEvents → Update Jotai atoms → UI updates
5. **HTTP**: Only for initial load, mark read, and clear operations

**Need help?** Check browser console for `[STOMP]` and `[SubscriptionManager]` logs.
