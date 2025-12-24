# Terrain Ecosystem Event Contract (v1)

## Overview

TerrainToken.com serves as the **observability hub** for the Terrain Ecosystem. All apps emit events to a single endpoint, which provides:

- **Idempotent processing** (duplicate events are safely ignored)
- **HMAC signature verification** (prevents unauthorized submissions)
- **Retry-safe writes** (failed events are automatically retried)
- **Health monitoring** (stale producers trigger alerts)

---

## Endpoint

```
POST https://dihbqhofqfcvjgpzmskx.supabase.co/functions/v1/ecosystem-events
```

---

## Required Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-Idempotency-Key` | ✅ Yes | UUID for deduplication (or in body as `idempotency_key`) |
| `X-TV-Signature` | ✅ Yes | HMAC-SHA256 signature or shared secret |
| `Content-Type` | ✅ Yes | Must be `application/json` |
| `X-Correlation-Id` | Optional | Track related events across lifecycle |

---

## Request Body

```typescript
interface EcosystemEvent {
  // REQUIRED
  event_type: string;        // e.g., "tv.analysis.completed"
  idempotency_key?: string;  // UUID (can also be in header)
  producer: "terrainvision" | "stormwaterscm" | "carolinaterrain" | "terrainguard" | "trn";
  payload: Record<string, unknown>;

  // OPTIONAL (for lifecycle linking)
  property_id?: string;      // UUID reference to canonical property
  correlation_id?: string;   // Track related events
  user_id?: string;          // Auth user ID
  session_id?: string;       // Anonymous session ID
  wallet_address?: string;   // If TRN-related
  report_month?: string;     // YYYY-MM format for monthly events
}
```

---

## Canonical Event Types

### TerrainVision (producer: `terrainvision`)
| Event Type | Description |
|------------|-------------|
| `tv.analysis.created` | AI analysis started |
| `tv.analysis.completed` | AI analysis finished |
| `tv.payment.succeeded` | Payment processed |
| `tv.payment.failed` | Payment failed |
| `tv.month.closed` | Monthly period closed |

### StormwaterSCM (producer: `stormwaterscm`)
| Event Type | Description |
|------------|-------------|
| `scm.inspection.scheduled` | Inspection scheduled |
| `scm.inspection.completed` | Inspection finished |
| `scm.finding.created` | Finding/issue recorded |
| `scm.workorder.created` | Work order generated |

### Carolina Terrain (producer: `carolinaterrain`)
| Event Type | Description |
|------------|-------------|
| `ct.lead.created` | New lead from Wix/Jobber |
| `ct.quote.sent` | Quote sent to customer |
| `ct.job.scheduled` | Job scheduled |
| `ct.job.completed` | Job finished |

### TerrainGuard (producer: `terrainguard`)
| Event Type | Description |
|------------|-------------|
| `tg.reminder.sent` | Compliance reminder sent |
| `tg.compliance.due` | Compliance item due |
| `tg.document.uploaded` | Document added |

### TRN Token (producer: `trn`)
| Event Type | Description |
|------------|-------------|
| `trn.wallet.linked` | Wallet connected |
| `trn.reward.created` | Reward earned |
| `trn.reward.distributed` | Reward sent |
| `trn.burn.executed` | Tokens burned |
| `trn.report.published` | Monthly report published |

---

## Example Request

```bash
curl -X POST "https://dihbqhofqfcvjgpzmskx.supabase.co/functions/v1/ecosystem-events" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \
  -H "X-TV-Signature: your_shared_secret_or_hmac" \
  -d '{
    "event_type": "tv.analysis.completed",
    "producer": "terrainvision",
    "property_id": "123e4567-e89b-12d3-a456-426614174000",
    "payload": {
      "analysis_id": "abc123",
      "property_address": "123 Main St",
      "findings_count": 3,
      "severity": "moderate"
    }
  }'
```

---

## Response Codes

| Code | Meaning |
|------|---------|
| `200` | Event accepted (new or already processed) |
| `400` | Invalid payload (missing fields, bad format) |
| `401` | Invalid or missing signature |
| `413` | Payload too large (max 1MB) |
| `429` | Rate limited (100 req/min/IP) |
| `500` | Internal error |

---

## Success Response

```json
{
  "success": true,
  "event_id": "uuid",
  "event_type": "tv.analysis.completed",
  "idempotency_key": "550e8400-e29b-41d4-a716-446655440000",
  "processing_time_ms": 45
}
```

---

## Signature Generation (HMAC-SHA256)

```typescript
// Node.js example
const crypto = require('crypto');

function createSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

const payload = JSON.stringify(eventBody);
const signature = createSignature(payload, process.env.TRN_SYNC_SECRET);
```

---

## Rate Limits

- **100 requests per minute per IP**
- **1MB max payload size**
- Retry with exponential backoff on 429

---

## Token Safety

All lifecycle actions work **WITHOUT** wallet connection.

- ✅ Events can include `wallet_address` for optional TRN tracking
- ✅ Events without wallet_address are fully processed
- ❌ No lifecycle step is blocked by token status
- ❌ No wallet connection required for any producer

---

## Contact

Integration issues: ecosystem@terraintoken.fun
