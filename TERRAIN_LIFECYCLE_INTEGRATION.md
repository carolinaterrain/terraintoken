# TerrainToken.com ↔ Terrain Lifecycle V1 Integration

## Status: ✅ INTEGRATED (Read-Only + Light Event Emission)

---

## 1. Supabase Configuration

### Local (Lovable Cloud - TerrainToken's Own Data)
```
SUPABASE_URL=https://dihbqhofqfcvjgpzmskx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Source: .env, src/integrations/supabase/client.ts (auto-managed)
```

### Canonical (Shared Terrain Lifecycle)
```
ECOSYSTEM_URL=https://izxzkqprhekrgiwakepm.supabase.co
ECOSYSTEM_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Source: src/lib/ecosystemClient.ts (read-only client)
```

---

## 2. Pages & Queries (Read-Only)

| Page | Query | Table | Purpose |
|------|-------|-------|---------|
| `/ecosystem` | `useCanonicalEvents()` | `ecosystem_events` | Activity feed from all apps |
| `/ecosystem` | `useCanonicalPropertyStats()` | `properties` | Total property count |
| `/ecosystem` | `useCanonicalWorkOrderStats()` | `work_orders` | Work order status breakdown |
| `/ecosystem` | `useCanonicalComplianceStats()` | `compliance_schedules` | Overdue/upcoming counts |
| `/ecosystem` | `useCanonicalEventsByProducer()` | `ecosystem_events` | Producer activity health |

### UI Location
- **Ecosystem page** (`/ecosystem`) → "Terrain Lifecycle (Canonical)" tab

---

## 3. Events Emitted by TerrainToken

TerrainToken emits ONLY token-adjacent events. It does NOT own lifecycle entities.

### Event Types

| Event Type | Trigger | Payload Shape |
|------------|---------|---------------|
| `trn.wallet.linked` | User links wallet | `{ wallet_address, linked_at, verification_method }` |
| `trn.wallet.unlinked` | User unlinks wallet | `{ wallet_address, unlinked_at, reason }` |
| `trn.tier.updated` | User tier changes | `{ wallet_address, previous_tier, new_tier, updated_at }` |

### Emission Behavior
- Events are emitted to BOTH:
  1. **Local Supabase** (via `ecosystem-events` edge function) - guaranteed delivery
  2. **Canonical Supabase** (via HTTP POST) - best-effort, non-blocking

### Event Emitter Usage
```typescript
import { emitTerrainTokenEvent } from '@/lib/eventEmitter';

// Example: Wallet linked
await emitTerrainTokenEvent({
  event_type: 'trn.wallet.linked',
  wallet_address: '...',
  payload: {
    wallet_address: '...',
    linked_at: new Date().toISOString(),
    verification_method: 'signature',
  },
});
```

---

## 4. Files Changed/Added

| File | Purpose |
|------|---------|
| `src/lib/ecosystemClient.ts` | Read-only client for canonical Supabase |
| `src/hooks/useCanonicalEcosystem.tsx` | React Query hooks for canonical data |
| `src/components/ecosystem/CanonicalEcosystemDashboard.tsx` | Read-only dashboard UI |
| `src/lib/eventEmitter.ts` | Event emission utility |
| `src/pages/Ecosystem.tsx` | Updated with tabbed dashboard |

---

## 5. Acceptance Checklist

### Read-Only Access
- [x] `CanonicalEcosystemDashboard` displays property count from canonical DB
- [x] `CanonicalEcosystemDashboard` displays work order stats from canonical DB
- [x] `CanonicalEcosystemDashboard` displays compliance due counts from canonical DB
- [x] `CanonicalEcosystemDashboard` displays producer activity from canonical DB
- [x] Dashboard clearly labeled as "Read-Only" with data source attribution

### Event Emission
- [x] `emitTerrainTokenEvent()` function implemented
- [x] Events include: `event_type`, `source_app=terraintoken`, `producer=trn`, `idempotency_key`
- [x] Dual emission to local + canonical (best-effort)
- [x] Event payload schemas documented

### Token Safety (V1 Requirement)
- [x] Wallet connection remains OPTIONAL
- [x] No lifecycle actions depend on tokens
- [x] TerrainToken does NOT create/own properties, work_orders, documents, compliance_schedules

---

## 6. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    TerrainToken.com                              │
│                   (Lovable Cloud)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐     ┌──────────────────────────────────┐  │
│  │ Local Supabase   │     │ Canonical Ecosystem Client       │  │
│  │ (dihbqhofq...)   │     │ (izxzkqprh...)                   │  │
│  │                  │     │                                  │  │
│  │ • TRN rewards    │     │ READ-ONLY:                       │  │
│  │ • User data      │     │ • ecosystem_events               │  │
│  │ • Local events   │     │ • properties (count)             │  │
│  └────────┬─────────┘     │ • work_orders (stats)            │  │
│           │               │ • compliance_schedules (counts)  │  │
│           │               └──────────────────────────────────┘  │
│           │                                                      │
│  ┌────────▼─────────┐                                           │
│  │ Event Emitter    │──────────────────────────────────────────▶│
│  │                  │  POST to canonical ecosystem-events       │
│  │ trn.wallet.*     │  (best-effort, non-blocking)              │
│  └──────────────────┘                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Notes for Other Apps

When integrating with TerrainToken:

1. **TerrainToken does NOT own lifecycle entities** - it only observes
2. **Event emission is best-effort** - canonical endpoint must handle duplicates via `idempotency_key`
3. **Canonical endpoint needs CORS** for `terraintoken.com` origin
4. **No TRN_SYNC_SECRET on client** - canonical endpoint must allow unsigned POSTs from trusted origins OR TerrainToken must emit via its own edge function proxy
