# WebSocket Real-Time Communication Guide

## What is WebSocket? (The Simple Explanation)

Think of WebSocket as a **phone call** between your browser (the website) and the server (backend). Unlike regular HTTP requests which are like sending a letter and waiting for a reply, WebSocket keeps the line open so both sides can talk anytime.

```mermaid
%%{init: {'flowchart': {'useMaxWidth': true}}}%%
flowchart LR
    classDef default rx:5,ry:5

    subgraph "Traditional HTTP (Mail)"
        A1["Browser<br/>Sends Request"] -->|"Wait..."| B1["Server<br/>Responds"]
        B1 -->|"Done"| A1
    end

    subgraph "WebSocket (Phone Call)"
        A2["Browser"] <-->|"🔄 Continuous Connection"| B2["Server"]
    end
```

---

## Why Do We Need WebSocket?

### The Problem: Real-Time Updates

Imagine you're a **Doctor** using our platform:

- A critical patient case gets flagged as "Urgent"
- Another doctor refers a patient to you
- A patient's status changes from "Pending" to "Under Review"

**Without WebSocket:** You'd have to refresh the page constantly to see updates

**With WebSocket:** Updates appear instantly, like a text message notification

```mermaid
%%{init: {'flowchart': {'useMaxWidth': true}}}%%
flowchart TB
    classDef default rx:5,ry:5

    subgraph "Without WebSocket ❌"
        direction TB
        D1["Doctor opens page"] --> D2["Sees 5 notifications"]
        D2 --> D3["Waits... refreshes..."]
        D3 --> D4["Still 5 notifications"]
        D3 --> D5["New notification arrived!<br/>(But doctor doesn't know yet)"]
    end

    D5 ~~~ W1

    subgraph "With WebSocket ✅"
        direction TB
        W1["Doctor opens page"] --> W2["Sees 5 notifications"]
        W2 --> W3["WebSocket connected<br/>Waiting for updates..."]
        E["New notification arrives"] --> W4["🔔 Instant alert shown!"]
        W3 -.->|"Listening"| W4
    end
```

---

## Our Communication Channel: STOMP WebSocket

We use a single **STOMP WebSocket** connection for all real-time features.

**Think of it like:** A hospital intercom system with different channels for different departments.

Each user connects once, then subscribes to the channels relevant to their role:

```mermaid
%%{init: {'flowchart': {'useMaxWidth': true}}}%%
flowchart LR
    classDef default rx:5,ry:5

    U["User Browser"] -->|"Connect<br/>/ws/notifications<br/>+ Subscribe to topics"| S["Server"]
    S -->|"/user/queue/notifications"| U
    S -->|"/topic/provider/{id}/urgent"| U
    S -->|"/topic/provider/{id}/notifications"| U
    S -->|"/topic/provider/{id}/patients"| U
    S -->|"/topic/curator/patient-results"| U
    S -->|"/topic/school/{id}/patient-results"| U

   style U fill:#1f592a
    style S fill:#231f59
```

---

## Understanding Topics (STOMP Channels)

Topics are like **radio channels**. You tune in to the channels relevant to you:

```mermaid
%%{init: {'flowchart': {'useMaxWidth': true}}}%%
flowchart TB
    classDef default rx:5,ry:5

    S["📡 STOMP Server<br/>(Broadcast Center)"]

    subgraph "Provider Channels"
        direction TB
        P1["/user/queue/notifications<br/>📬 Personal mailbox"]
        P2["/topic/provider/{id}/notifications<br/>📢 Public announcements"]
        P3["/topic/provider/{id}/urgent<br/>🚨 Urgent alerts"]
        P4["/topic/provider/{id}/patients<br/>📊 Patient updates"]

        P1 --> P2 --> P3 --> P4
    end

    subgraph "Curator Channels"
        direction TB
        C1["/user/queue/notifications<br/>📬 Personal mailbox"]
        C2["/topic/curator/patient-results<br/>🏫 All schools"]
        C3["/topic/school/{id}/patient-results<br/>📋 Specific school"]

        C1 --> C2 --> C3
    end

    S --> P1
    S --> C1

    P4 ~~~ C1
```

---

## The Complete Flow: From Login to Real-Time Updates

```mermaid
%%{init: {'sequenceDiagram': {'useMaxWidth': true}}}%%
sequenceDiagram
    participant U as User
    participant B as Browser
    participant S as Server
    participant D as Database

    U->>B: 1. Login with credentials
    B->>S: POST /api/auth/login
    S->>D: Verify credentials
    D->>S: Success + JWT Token
    S->>B: Return access token
    B->>B: Store token in localStorage

    Note over B,S: 🔌 STEP 2: WebSocket Connection

    B->>S: Connect to /ws/notifications?token=JWT
    S->>S: Validate token
    S->>S: Identify user role (Provider/Curator)
    S->>B: ✅ Connection Established

    Note over B,S: 📋 STEP 3: Subscribe to Topics

    alt User is Provider
        B->>S: SUBSCRIBE /user/queue/notifications
        B->>S: SUBSCRIBE /topic/provider/{id}/notifications
        B->>S: SUBSCRIBE /topic/provider/{id}/urgent
        B->>S: SUBSCRIBE /topic/provider/{id}/patients
    else User is Curator
        B->>S: SUBSCRIBE /user/queue/notifications
        B->>S: SUBSCRIBE /topic/curator/patient-results
    end

    Note over B,S: 🔄 STEP 4: Real-Time Updates Begin

    loop Continuous Connection
        S->>B: Heartbeat (keep connection alive)

        alt New Urgent Case
            D->>S: New patient marked urgent
            S->>B: 🚨 NEW_URGENT_CASE event
            B->>B: Show toast notification
            B->>B: Invalidate urgent cases cache
            B->>B: Refresh UrgentPanel
            B->>B: Play two-tone alert sound 🔊
        end

        alt New Notification
            D->>S: New notification created
            S->>B: 📬 NEW_NOTIFICATION event
            B->>B: Update unread count badge
            B->>B: Add to notification list
            B->>B: Show toast alert
        end

        alt Patient Status Change
            D->>S: Patient status updated
            S->>B: 📊 PATIENT_STATUS_CHANGED event
            B->>B: Invalidate patient cache
            B->>B: Refresh patient data
        end

        alt New Patient Result (Curator)
            D->>S: New patient result submitted
            S->>B: 📋 NEW_PATIENT_RESULT event
            B->>B: Invalidate school detail cache
            B->>B: Refresh patient lists
            B->>B: Show info toast
        end
    end
```

---

## Message Types Explained

### 1. 🔌 Raw WebSocket Events

#### CONNECTED (First Message)

```json
{
  "event": "CONNECTED",
  "timestamp": "2026-04-11T10:00:00",
  "userId": "a145c8f7-0f22-4e9f-b8cf-f0a74fb96c39",
  "role": "ROLE_PROVIDER"
}
```

**What it means:** "You're connected! Here's who you are."

#### NEW_NOTIFICATION

```json
{
  "event": "NEW_NOTIFICATION",
  "timestamp": "2026-04-11T10:01:00",
  "recipientId": "a145c8f7-0f22-4e9f-b8cf-f0a74fb96c39",
  "unreadCount": 4,
  "notification": {
    "id": "f9ad16f6-6f73-4f0e-b335-801d3f95d1ec",
    "type": "PATIENT_REFERRED",
    "title": "Patient Referred",
    "message": "Dr. Smith referred patient Jane Doe to you."
  }
}
```

**What it means:** "You have a new notification! Your total unread count is now 4."

#### UNREAD_COUNT_CHANGED

```json
{
  "event": "UNREAD_COUNT_CHANGED",
  "timestamp": "2026-04-11T10:03:00",
  "unreadCount": 0
}
```

**What it means:** "You marked some notifications as read. You now have 0 unread."

---

### 2. 📡 STOMP Topic Events

#### Provider Urgent Case Alert

```json
{
  "type": "NEW_URGENT_CASE",
  "patient": {
    "patientId": 456,
    "patientName": "Jane Doe",
    "score": 91.5,
    "status": "urgent",
    "schoolId": 12,
    "schoolName": "Lincoln High",
    "time": "2026-04-11T10:05:00",
    "preview": "Initial triage note..."
  }
}
```

**What it means:** "🚨 URGENT! Patient Jane Doe from Lincoln High needs immediate attention!"

#### Provider Patient Status Change

```json
{
  "type": "PATIENT_STATUS_CHANGED",
  "patient": {
    "patientId": 456,
    "patientName": "Jane Doe",
    "score": 91.5,
    "status": "reviewed",
    "schoolId": 12,
    "schoolName": "Lincoln High"
  }
}
```

**What it means:** "Patient Jane Doe's status changed from 'urgent' to 'reviewed'."

#### Curator New Patient Result

```json
{
  "type": "NEW_PATIENT_RESULT",
  "schoolId": 12,
  "patientName": "Jane Doe",
  "patientResultId": 456,
  "lockinId": 789,
  "createdAt": "2026-04-11T10:05:00"
}
```

**What it means:** "A new patient result was submitted at Lincoln High."

---

## How Messages Travel: The Journey of a Notification

```mermaid
%%{init: {'flowchart': {'useMaxWidth': true}}}%%
flowchart TB
    classDef default rx:5,ry:5

    subgraph "1. Something Happens"
        A["🏥 Dr. Smith refers a patient<br/>to Dr. Johnson"]
    end

    subgraph "2. Backend Processes"
        B["Server receives request"]
        C["Save to Database"]
        D["Create Notification Record"]
        E["Trigger WebSocket Event"]
    end

    subgraph "3. WebSocket Delivery"
        F["Check: Is Dr. Johnson connected?"]
        G["Send to /user/queue/notifications"]
        H["Send to /topic/provider/{id}/notifications"]
    end

    subgraph "4. Frontend Receives"
        I["Browser receives message"]
        J["Update Notification List"]
        K["Update Unread Badge"]
        L["Show Toast Alert"]
        M["🔔 'Patient Referred: Jane Doe'"]
    end

    A --> B --> C --> D --> E --> F
    F -->|"Yes"| G
    F -->|"Yes"| H
    G --> I
    H --> I
    I --> J --> K --> L --> M
```

---

## Connection Lifecycle

```mermaid
%%{init: {'stateDiagram': {'useMaxWidth': true}}}%%
stateDiagram-v2
    [*] --> Disconnected : User opens app
    Disconnected --> Connecting : User logs in

    Connecting --> Connected : Auth success
    Connecting --> Error : Invalid token / Network error

    Connected --> Receiving : Subscribed to topics
    Receiving --> Receiving : New message arrives

    Connected --> Disconnected : Tab closed / Network lost
    Receiving --> Disconnected : Connection lost

    Error --> Connecting : Retry with backoff
    Disconnected --> Connecting : Auto-reconnect attempt

    Connected --> [*] : User logs out
```

---

## Reconnection Strategy

What happens when your internet hiccups? We've got you covered:

```mermaid
%%{init: {'flowchart': {'useMaxWidth': true}}}%%
flowchart TB
    classDef default rx:5,ry:5

    A["Connection Lost 😞"] --> B["Wait 1 second"]
    B --> C["Try Reconnect..."]

    C -->|"Success! 🎉"| D["Connected ✅"]
    C -->|"Failed 😓"| E["Wait 2 seconds"]

    E --> F["Try Reconnect..."]
    F -->|"Success! 🎉"| D
    F -->|"Failed 😓"| G["Wait 4 seconds"]

    G --> H["Try Reconnect..."]
    H -->|"Success! 🎉"| D
    H -->|"Failed 😓"| I["Wait 8 seconds"]

    I --> J["Continue doubling..."]
    J --> K["Max 30 second intervals"]
    K --> C

    D --> L["🔄 Re-fetch all data<br/>to catch missed updates"]
```

**Why this matters:** If you're offline for 5 minutes and 3 urgent cases come in, we'll reconnect and fetch everything you missed!

---

## Authentication: How We Know It's Really You

```mermaid
%%{init: {'flowchart': {'useMaxWidth': true}}}%%
flowchart TB
    classDef default rx:5,ry:5

    A["Browser wants to connect"] --> B["Send JWT Token<br/>in URL parameter"]
    B --> C["Server validates token"]

    C -->|"Invalid ❌"| D["Reject Connection<br/>401 Unauthorized"]
    C -->|"Valid ✅"| E["Check user exists in<br/>Provider/Curator table"]

    E -->|"Not found ❌"| D
    E -->|"Found ✅"| F["Accept Connection"]

    F --> G["Send CONNECTED event<br/>with user info"]
```

**Security Note:** The token travels in the URL query parameter (`?token=xxx`) because WebSocket handshake headers are limited in browser environments.

---

## Visual: What Users See

### Provider Dashboard with WebSocket

```mermaid
%%{init: {'flowchart': {'useMaxWidth': true}}}%%
flowchart TB
    classDef default rx:5,ry:5
    classDef header fill:#1f592a,stroke:#333,stroke-width:2px,color:#fff
    classDef urgent fill:#fef2f2,stroke:#ef4444,stroke-width:2px,color:#7f1d1d
    classDef notif fill:#fefce8,stroke:#eab308,stroke-width:2px,color:#713f12
    classDef table fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#334155
    classDef toast fill:#ecfdf5,stroke:#22c55e,stroke-width:2px,color:#14532d

    H["JustGo Health  -  3 notifications  -  Dr. Johnson"]
    U["URGENT: Jane Doe - Score 91.5 CRITICAL - Lincoln High"]
    N1["New Star Provider Assigned"]
    N2["Patient Referred"]
    P1["John Smith | In Review | School A"]
    P2["Sarah Connor | Urgent | School B"]
    P3["Mike Ross | Completed | School A"]
    T["Toast: Patient Sarah Connor marked as Urgent!"]

    H --> U
    H --> N1
    N1 --> N2
    U --> P1
    N2 --> P1
    P1 --> P2
    P2 --> P3
    P3 --> T

    class H header
    class U urgent
    class N1,N2 notif
    class P1,P2,P3 table
    class T toast
```

---

## Common Scenarios

### Scenario 1: New Provider Logs In

```mermaid
%%{init: {'sequenceDiagram': {'useMaxWidth': true}}}%%
sequenceDiagram
    participant P as New Provider
    participant F as Frontend
    participant S as Server
    participant NS as Notification Service

    P->>F: Opens dashboard
    F->>F: Check: Token exists? ✅
    F->>S: Connect WebSocket
    S->>F: CONNECTED event
    F->>F: Fetch existing notifications
    F->>S: Subscribe to topics

    Note over P,NS: Later...

    NS->>S: New notification: "Welcome to JustGo!"
    S->>F: NEW_NOTIFICATION event
    F->>P: Show toast + Update badge
```

### Scenario 2: Curator Monitors Multiple Schools

```mermaid
%%{init: {'sequenceDiagram': {'useMaxWidth': true}}}%%
sequenceDiagram
    participant C as Curator User
    participant F as Frontend
    participant S as Server
    participant D as Database

    C->>F: Views "School A" dashboard
    F->>S: SUBSCRIBE /topic/school/A/patient-results

    C->>F: Switches to "School B" dashboard
    F->>S: UNSUBSCRIBE /topic/school/A/patient-results
    F->>S: SUBSCRIBE /topic/school/B/patient-results

    D->>S: New patient result at School B
    S->>F: NEW_PATIENT_RESULT (School B only)
    F->>C: 🔔 "New patient result at School B"

    Note over C,S: User doesn't get School A updates<br/>while viewing School B - efficient!
```

### Scenario 3: Network Interruption

```mermaid
%%{init: {'sequenceDiagram': {'useMaxWidth': true}}}%%
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Server
    participant D as Database

    U->>F: Working on dashboard
    F->>S: WebSocket Connected
    S->>F: Heartbeat

    Note over F,S: Connection Lost (WiFi drops)

    F->>F: Show "Reconnecting..." (1s)
    F->>S: Retry connection
    S--xF: Failed

    F->>F: Wait 2s...
    F->>S: Retry connection
    S--xF: Failed

    F->>F: Wait 4s...
    F->>S: Retry connection
    S->>F: Connected

    F->>D: Fetch all notifications
    F->>D: Fetch urgent cases
    F->>U: "Welcome back! Synced 3 missed updates"
```

---

## Technical Architecture Overview

### Frontend Files

```
src/
├── services/websocket/
│   ├── stomp-client.ts              ← STOMP connection manager (singleton)
│   └── subscription-manager.ts      ← Topic subscriptions & event routing
├── hooks/
│   ├── use-stomp-websocket.ts       ← Main WebSocket connection hook
│   ├── use-notification-websocket.ts ← Notification handling (Provider + Curator)
│   ├── use-urgent-cases-websocket.ts ← Urgent case alerts + audio beep
│   ├── use-patient-status-websocket.ts ← Patient status changes
│   ├── use-patient-result-websocket.ts ← New patient results (Curator)
│   └── use-school-subscription.ts   ← Dynamic per-school subscriptions
└── components/providers/
    └── stomp-provider.tsx           ← WebSocket context provider (initializes all hooks)
```

### How They Work Together

```mermaid
%%{init: {'flowchart': {'useMaxWidth': true}}}%%
flowchart TB
    classDef default rx:5,ry:5
    classDef title fill:none,stroke:none,color:#666,font-size:14px

    subgraph Provider[ ]
        SP["StompProvider<br/>(App Root)<br/>&lt;StompProvider /&gt;"]
    end

    subgraph "Custom Hooks"
        H1["useStompWebSocket<br/>(Manages connection)"]
        H2["useNotificationWebSocket<br/>(Notifications + unread count)"]
        H3["useUrgentCasesWebSocket<br/>(Urgent alerts + audio 🔊)"]
        H4["usePatientStatusWebSocket<br/>(Patient status changes)"]
        H5["usePatientResultWebSocket<br/>(New patient results - Curator)"]
        H6["useSchoolSubscription<br/>(Dynamic per-school topics)"]
    end

    subgraph "WebSocket Services"
        SC["stompClient<br/>(Singleton)"]
        SM["subscriptionManager<br/>(Topic routing)"]
    end

    subgraph "State Management"
        A1["connectionStatusAtom"]
        A2["unreadCountAtom"]
        A3["notificationListAtom"]
    end

    subgraph "Cache Invalidation"
        TQ1["TanStack Query<br/>notifications"]
        TQ2["TanStack Query<br/>urgent patients"]
        TQ3["TanStack Query<br/>school details"]
    end

    subgraph "UI Components"
        UI1["NotificationBell<br/>(shows unread count)"]
        UI2["NotificationSheet<br/>(slide-out panel)"]
        UI3["UrgentPanel<br/>(real-time via cache)"]
        UI4["Toast Notifications"]
        UI5["Audio Alert 🔊"]
    end

    SP --> H1 & H2 & H3 & H4 & H5

    H1 --> SC
    SC --> SM
    SM -->|"dispatches events"| H2 & H3 & H4 & H5
    H6 -->|"add/remove school"| SM

    H1 --> A1
    H2 --> A2 & A3

    A2 --> UI1
    A3 --> UI2

    H2 --> TQ1 --> UI2
    H3 --> TQ2 --> UI3
    H5 --> TQ3

    H2 --> UI4
    H3 --> UI4 & UI5
    H4 --> UI4
    H5 --> UI4

```

### Complete Event Pipeline

This diagram traces **every event** from the backend through to the final UI rendering:

```mermaid
%%{init: {'flowchart': {'useMaxWidth': true}}}%%
flowchart LR
    classDef default rx:5,ry:5

    subgraph "Backend"
        BE["Server sends<br/>STOMP message"]
    end

    subgraph "Transport"
        SC["stomp-client.ts<br/>(parses JSON)"]
        SM["subscription-manager.ts<br/>(routes by topic)"]
    end

    subgraph "Event Bus (window events)"
        CE1["ws:notification"]
        CE2["ws:unread-count"]
        CE3["ws:urgent-case"]
        CE4["ws:patient-status"]
        CE5["ws:patient-result"]
        CE6["ws:reconnect"]
    end

    subgraph "Consumer Hooks"
        H1["useNotificationWebSocket"]
        H2["useUrgentCasesWebSocket"]
        H3["usePatientStatusWebSocket"]
        H4["usePatientResultWebSocket"]
    end

    subgraph "State + Cache"
        A1["notificationListAtom"]
        A2["unreadCountAtom"]
        TQ1["TanStack Query<br/>urgent patients"]
        TQ2["TanStack Query<br/>patient data"]
        TQ3["TanStack Query<br/>school details"]
    end

    subgraph "UI Output"
        U1["NotificationSheet"]
        U2["NotificationBell"]
        U3["Toast Alerts"]
        U4["UrgentPanel"]
        U5["Patient Tables"]
        U6["Audio Alert 🔊"]
    end

    BE --> SC --> SM
    SM --> CE1 & CE2 & CE3 & CE4 & CE5

    CE1 --> H1
    CE2 --> H1
    CE3 --> H2
    CE4 --> H3
    CE5 --> H4
    CE6 --> H1 & H2 & H3 & H4

    H1 --> A1 --> U1
    H1 --> A2 --> U2
    H1 --> U3

    H2 --> TQ1 --> U4
    H2 --> U3
    H2 --> U6

    H3 --> TQ2 --> U5
    H3 --> U3

    H4 --> TQ3 --> U5
    H4 --> U3
```

---

## Troubleshooting Guide

### "I'm not getting notifications!"

```mermaid
%%{init: {'flowchart': {'useMaxWidth': true}}}%%
flowchart TD
    classDef default rx:5,ry:5

    A["No notifications?"] --> B{"Check WebSocket status"}
    B -->|"❌ DISCONNECTED"| C["Check internet connection"]
    C --> D["Reconnect manually or refresh page"]

    B -->|"✅ CONNECTED"| E{"Check user role"}
    E -->|"Provider"| F["Should see /topic/provider/* events"]
    E -->|"Curator"| G["Should see /topic/curator/* events"]

    F --> H{"Subscribed to topics?"}
    H -->|"No"| I["Check providerId is set in localStorage"]
    H -->|"Yes"| J["Check browser console for errors"]
```

### "Notifications are delayed"

| Possible Cause        | Solution                                            |
| --------------------- | --------------------------------------------------- |
| Network latency       | Check WiFi/cellular connection                      |
| Browser in background | Some browsers throttle background tabs              |
| Server load           | Notifications may take 1-5 seconds during high load |

### "I see duplicate notifications"

This happens when:

1. You have multiple tabs open (each connects separately)
2. You reconnected and old + new notifications merged

**Fix:** Page refresh clears duplicates

---

## Quick Reference: Event Types

| Event                    | When It Fires            | Who Receives It               | Frontend Action                              |
| ------------------------ | ------------------------ | ----------------------------- | -------------------------------------------- |
| `CONNECTED`              | WebSocket first connects | Everyone                      | Set connection status                        |
| `NEW_NOTIFICATION`       | New notification created | Intended recipient            | Toast + update sheet + update badge          |
| `UNREAD_COUNT_CHANGED`   | Unread count updates     | The user                      | Update unread badge                          |
| `NEW_URGENT_CASE`        | Patient marked urgent    | Assigned provider             | Toast + audio alert 🔊 + refresh UrgentPanel |
| `PATIENT_STATUS_CHANGED` | Patient status updates   | Assigned provider             | Toast + refresh patient list                 |
| `NEW_PATIENT_RESULT`     | New result submitted     | Curators watching that school | Toast + refresh school patient lists         |

---

## Security Best Practices

1. **Token Expiration:** JWT tokens expire after a set time. WebSocket will auto-reconnect with a fresh token.

2. **Role Verification:** Server checks if you're actually a Provider/Curator before allowing connection.

3. **No Sensitive Data:** Notifications show summaries, not full patient records.

4. **Automatic Cleanup:** When you logout or close the tab, WebSocket disconnects immediately.

---

## Glossary

| Term             | Simple Explanation                                                    |
| ---------------- | --------------------------------------------------------------------- |
| **WebSocket**    | A persistent connection between browser and server for real-time data |
| **STOMP**        | A protocol (like a language) that runs over WebSocket for messaging   |
| **Topic**        | A channel name like a radio station - you subscribe to get messages   |
| **JWT Token**    | Your digital ID card that proves who you are                          |
| **Heartbeat**    | Periodic "ping" to keep connection alive                              |
| **Payload**      | The actual data/content of a message                                  |
| **Atom**         | A piece of shared state (like unread count) that updates everywhere   |
| **Subscription** | Telling the server "I want messages on this topic"                    |

---

## Summary

### For Providers:

- WebSocket keeps you updated on **urgent cases** and **patient referrals**
- You'll get instant alerts (visual toast + audio beep 🔊) when a patient needs urgent attention
- UrgentPanel refreshes automatically when new urgent cases arrive
- No need to refresh the page - updates appear automatically

### For Curators:

- Monitor **new patient results** across all schools in real-time
- Get notified when schools submit new data (toast + badge)
- Per-school subscriptions activate automatically when viewing a school detail page
- Dashboard stays current without manual refreshing

### For Everyone:

- WebSocket = **Live updates** without page refresh
- Single **STOMP** connection handles all real-time features
- Auto-reconnects if connection drops (exponential backoff)
- On reconnect, all data is automatically re-fetched to catch missed updates
- All authentication is handled automatically

---

_Last Updated: April 2026_
_Questions? Contact the development team_
