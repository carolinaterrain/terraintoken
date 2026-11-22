# Project Rules

- Wallet ownership in access rules comes only from `get_user_wallet_address()`, which reads server-set app metadata — never from user-editable metadata or request headers, because those can be spoofed.
- Anonymous visitor uploads (memes, project photos) go through edge functions that validate and write with the service role; storage buckets have no anonymous upload rules, so nobody can write arbitrary files.
- Anonymous session features (live viewer counter, A/B assignment) use validated SECURITY DEFINER functions instead of open table policies, because anonymous sessions have no verifiable identity.
- Purchases, payments, stakes, rewards and achievements are written only by edge functions (service role); client policies never allow these inserts.
