# Discord publishing uses channel policy and curator assignment

Devault will treat Discord as a first-class publishing input for community vaults. The Discord bot may send publishing events from slash commands, message actions, or configured channel watchers, but Devault will decide how those events become resources through vault-level curator assignment and Discord channel policy.

Channel policy can express curator-only publishing, approval queues, auto-publish, or ignored channels. Curator assignment may be managed inside Devault, mapped from Discord roles, or both; this keeps Discord access gating separate from the right to publish and organize resources.
