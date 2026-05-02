# Hybrid resource model with vault-owned curation

Devault will separate shared source-level facts from vault-specific curation. A Canonical Resource represents normalized facts about a URL or future file, while each Vault Resource belongs to exactly one vault and carries category, tags, notes, highlights, publication state, quality signals, attribution, and ordering.

This avoids treating the same URL as one global user-owned bookmark while still preventing repeated metadata extraction for the same source. Existing Bookmark data should migrate forward into this model without deleting the current database: each existing bookmark becomes a vault-specific resource linked to a canonical source created from its URL.
