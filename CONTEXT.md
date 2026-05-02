# Devault

Devault is a community-first knowledge vault for saving, organizing, and sharing useful links. It borrows retrieval mechanics from modern bookmark managers, but its center of gravity is shared community spaces rather than a private personal library.

## Language

**Vault**:
A shared or private knowledge space that contains curated resources for a person, team, or community.
_Avoid_: collection, folder, raindrop

**Resource**:
A saved item inside a vault, usually a link with extracted metadata and optional knowledge attached to it.
_Avoid_: bookmark when discussing the product concept; link when discussing enriched saved items

**Community-first vault product**:
A product whose primary value is helping groups curate and retrieve shared resources.
_Avoid_: Raindrop clone, personal bookmark manager

**Retrieval mechanics**:
Features that help people find, resurface, and trust saved resources after they have been added.
_Avoid_: all Raindrop features

**Retrieval Core**:
The first serious retrieval milestone: metadata previews, categories, tags, notes, highlights, content-type filters, duplicate detection, and a staged path from metadata search to full-text search.
_Avoid_: MVP, basic bookmarks

**Metadata Search**:
Search over resource title, URL, description, category, tags, and vault notes without indexing full page content.
_Avoid_: full-text search

**Extracted Content Search**:
Search over readable page text extracted from a live URL at save time.
_Avoid_: archive search

**Duplicate Detection**:
A retrieval cleanup feature that warns when the same normalized URL already exists in a vault.
_Avoid_: global duplicate tracking

**Content Type**:
A curator-visible classification for what kind of thing a linked resource points to, such as article, tool, video, repository, documentation, image, PDF, or thread.
_Avoid_: MIME type when discussing product filtering

**Content Type Suggestion**:
An automated guess for a resource's content type based on URL, domain, metadata, or AI.
_Avoid_: final content type

**Link Health**:
The reachability status of a resource URL observed when Devault processes the resource.
_Avoid_: uptime monitoring

**Link Import/Export**:
Moving linked resources and their metadata into or out of Devault without transferring underlying files or page copies.
_Avoid_: archive import/export

**Publication State**:
Whether a vault resource is draft, pending approval, or published.
_Avoid_: per-resource privacy

**Resource Discussion**:
Conversation about a resource, such as relevance, alternatives, or questions.
_Avoid_: resource metadata, vault note

**Quality Signal**:
A curator-managed marker that helps viewers judge a resource, such as featured, recommended, start here, outdated, or needs review.
_Avoid_: vote, rating

**Full-stack Web App**:
The current deployment shape where the Next.js app owns UI, server actions, API routes, auth, and database access.
_Avoid_: frontend-only app

**Service Split**:
A future deployment shape where web UI, backend API, and Discord bot can run as separate services.
_Avoid_: required architecture now

**Standalone API**:
A future Hono API service that owns resource ingestion contracts and can run on Cloudflare Workers, VPS, or another server runtime.
_Avoid_: immediate replacement for all Next.js API routes

**Database Access Layer**:
The code boundary that owns database queries and schema access for API services.
_Avoid_: direct database access from every app

**Thin Discord Adapter**:
A Discord bot that translates Discord actions into authenticated API requests without owning database writes or domain rules.
_Avoid_: bot-owned backend

**Monorepo**:
A repository shape that keeps the web app, Discord bot, extension, and shared packages together.
_Avoid_: unrelated repo collection

**Knowledge Archive**:
A future premium capability set for durable saved knowledge: permanent page copies, file uploads, document indexing, import/export, broken-link checking, and reminders.
_Avoid_: Retrieval Core, free baseline

**Canonical Resource**:
Shared source-level facts about a saved URL or file, independent of any single vault.
_Avoid_: global bookmark

**Vault Resource**:
A vault-owned saved resource with local curation such as category, tags, notes, highlights, attribution, and ordering.
_Avoid_: user bookmark, personal copy

**Contribution**:
A resource or edit submitted by a member for inclusion in a vault.
_Avoid_: user-owned bookmark

**Curation**:
The act of approving, editing, organizing, or removing resources in a vault.
_Avoid_: moderation when discussing ordinary resource organization

**Publishing Mode**:
The vault-level rule that decides whether member contributions appear immediately, require approval, or are restricted to curators.
_Avoid_: permissions when discussing the contribution workflow

**Curator**:
A trusted vault member who can publish resources and organize the vault from Discord or the platform.
_Avoid_: generic member

**Curator Assignment**:
The way a vault grants curation rights, either directly in Devault or by mapping Discord roles.
_Avoid_: access gating

**Discord Publishing**:
Publishing resources to Devault from Discord through slash commands, message actions, or configured channel watching.
_Avoid_: Discord access gating

**Discord Channel Policy**:
The publishing rule for a configured Discord channel, such as curator-only, approval queue, auto-publish, or ignore.
_Avoid_: bot permission

**Category**:
A primary browsable section inside a vault; each vault resource belongs to one category.
_Avoid_: folder when discussing Devault product language

**Tag**:
A flexible cross-cutting label for retrieval, filtering, and search.
_Avoid_: category

**Tag Vocabulary**:
The normalized set of tags used within a vault.
_Avoid_: free-form tag soup

**AI Tag Suggestion**:
An automated tag proposal that helps contributors or curators classify a resource.
_Avoid_: authoritative tagging

**Vault Highlight**:
A shared excerpt or annotation on a vault resource that helps viewers understand what matters.
_Avoid_: private highlight

**Vault Note**:
Shared editorial context on a vault resource that explains why it is useful or how to use it.
_Avoid_: personal note

**Personal Annotation**:
A private user-owned note or highlight on a resource.
_Avoid_: vault curation

## Relationships

- A **Vault** contains many **Resources**
- The current code may still use "Bookmark"; product and domain language should prefer **Resource**
- A **Canonical Resource** can support many **Vault Resources**
- A **Vault Resource** belongs to exactly one **Vault**
- A shared **Vault Resource** is owned by the **Vault**, not by the user who saved it
- A **Vault Resource** may record which user contributed it for attribution
- Members may create **Contributions** in shared vaults
- Vault owners or **Curators** perform **Curation** over all resources in a shared vault
- Members may edit or remove their own **Contributions** only within the rules set by the vault
- A vault's **Publishing Mode** can allow immediate publishing, approval queues, or curator-only publishing
- Community vaults should default toward curator-only or approval-based publishing rather than open publishing
- **Curators** should be able to publish resources from Discord and from the Devault platform
- **Curator Assignment** may be Devault-native, Discord-role-based, or both
- Discord access gating decides who can enter a vault; **Curator Assignment** decides who can publish and organize resources
- **Discord Publishing** may happen through slash commands, message actions, or configured channel watchers
- The Discord bot can already support slash commands, message actions, and channel watchers
- A **Discord Channel Policy** decides how watched-channel links become resources or contributions
- A curator-only **Discord Channel Policy** preserves the bot's existing actor-check behavior
- Each **Vault Resource** belongs to one **Category**
- A **Vault Resource** may have many **Tags**
- **Categories** provide browsable structure; **Tags** provide cross-cutting retrieval
- Draft or submitted resources may use free-form tags
- Published resources should normalize tags into the vault's **Tag Vocabulary**
- **AI Tag Suggestions** may help with tagging but should not be treated as authoritative
- **Vault Highlights** and **Vault Notes** should ship before private **Personal Annotations**
- **Personal Annotations** may be added later for personal-library or premium use cases
- A **Vault** may be personal, private, public, password-protected, or gated to a community
- **Retrieval mechanics** improve a **Vault** without changing Devault into a personal-first bookmark manager
- **Retrieval Core** comes before **Knowledge Archive**
- **Metadata Search** should ship before **Extracted Content Search**
- **Metadata Search** should search title, URL, description, category, tags, and vault note
- **Metadata Search** should be vault-scoped first
- Global search across accessible vaults can come later
- Contributor, Discord source, curator, and approval status are not part of the first normal search scope
- **Extracted Content Search** can be added after metadata search proves the retrieval workflow
- **Duplicate Detection** should start within a single vault using normalized URLs
- The same URL may validly exist in different vaults
- **Duplicate Detection** should warn rather than block saving
- Duplicate merge can come later after warning behavior is proven
- Devault may create a **Content Type Suggestion**, but curators can override the final **Content Type**
- **Content Type** supports filtering and browsing inside a vault
- Initial **Content Types** should cover a broad retrieval set, such as article, book, music, video, file, image, document, repository, documentation, tool, newsletter, course, podcast, social post, thread, and other
- **Content Types** should start as controlled product defaults rather than fully vault-custom taxonomies
- In **Retrieval Core**, **Content Type** classifies linked resources; Devault does not store the underlying file, page, video, image, or document itself
- Storing actual resource content belongs to **Knowledge Archive**
- **Link Health** should be captured when a resource is saved or refreshed
- Recurring broken-link monitoring can come later as an admin or premium feature
- **Link Import/Export** should come before Raindrop-specific migration or archive transfer
- First import/export should include linked resources and metadata only, not underlying files or page copies
- A **Vault Resource** may have a **Publication State** before it is published
- Published resources inherit vault access; Devault should not start with full per-resource privacy
- **Resource Discussion** should stay outside Devault for now, usually in Discord
- Devault should prioritize curated resource metadata over comment threads
- **Quality Signals** should start as curator-only flags: featured, recommended, start here, outdated, and needs review
- Each **Category** should have at most one start here resource at first
- Ordered learning paths can come later if start here behavior proves useful
- Difficulty levels, votes, ratings, popularity, and usage analytics are not part of the first quality model
- Devault should remain a **Full-stack Web App** while budget and infrastructure are limited
- Devault should use monorepo boundaries and shared contracts so a future **Service Split** is easier
- The Discord bot may run inside the cheapest practical environment until a VPS or dedicated deployment budget exists
- The future **Standalone API** should use Hono for a portable Web Standards HTTP layer
- The future **Database Access Layer** may use Drizzle with Neon/Postgres for Cloudflare and serverless friendliness
- Hono and Drizzle are optional future extraction tools, not immediate requirements
- The Discord bot should remain a **Thin Discord Adapter** that calls the web-hosted API
- Domain rules, permissions, and database writes should stay behind the API, not inside the bot
- Devault should move toward a **Monorepo** with the Discord bot in `apps/bot`
- The bot repo should be merged after the current landing page branch is reviewed or merged
- The monorepo should move into a private personal repository before major monorepo restructuring
- Devault should be closed-source for now because open-source maintenance would create extra burden before the product is stable
- Public/open-source positioning can be revisited later only if maintenance expectations are clear
- **Knowledge Archive** is a candidate premium tier because it requires storage, indexing, background jobs, and ongoing maintenance

## Example dialogue

> **Dev:** "Should we copy Raindrop's full feature list?"
> **Domain expert:** "No — Devault stays a **community-first vault product**. We add **retrieval mechanics** like search, tags, highlights, and cleanup when they make shared **Vaults** more useful."
>
> **Dev:** "Do permanent page copies and file uploads belong in the first milestone?"
> **Domain expert:** "No — ship **Retrieval Core** first. Save **Knowledge Archive** for a future premium tier."
>
> **Dev:** "Should search index full page content immediately?"
> **Domain expert:** "No — start with **Metadata Search**, then add **Extracted Content Search** once the workflow is proven."
>
> **Dev:** "Does Metadata Search include Discord source and contributor fields?"
> **Domain expert:** "No — first search title, URL, description, category, tags, and vault note. Social and moderation metadata can come later."
>
> **Dev:** "Should search cross every vault the user can access?"
> **Domain expert:** "Not first — search the current vault first. Global accessible search can come later."
>
> **Dev:** "Is the same URL in two vaults a duplicate?"
> **Domain expert:** "No — **Duplicate Detection** starts within one vault. Cross-vault duplication can be valid."
>
> **Dev:** "Should duplicate detection block saving?"
> **Domain expert:** "No — warn first and let curators continue when duplication is intentional."
>
> **Dev:** "Can Devault decide content type automatically?"
> **Domain expert:** "It can suggest a **Content Type**, but curators can override it."
>
> **Dev:** "Should content types start tiny?"
> **Domain expert:** "No — start with a broad retrieval set, but keep it as controlled product defaults."
>
> **Dev:** "Does a PDF content type mean Devault stores the PDF?"
> **Domain expert:** "No — in **Retrieval Core**, **Content Type** classifies the linked target. Storing files or page copies belongs to **Knowledge Archive**."
>
> **Dev:** "Does Devault need recurring broken-link checks now?"
> **Domain expert:** "No — capture **Link Health** when a resource is saved or refreshed. Recurring monitoring can come later."
>
> **Dev:** "Does import/export move archived files?"
> **Domain expert:** "Not first — **Link Import/Export** moves URLs and metadata only."
>
> **Dev:** "Can one published resource be curator-only inside a shared vault?"
> **Domain expert:** "Not first — use **Publication State** for draft or pending resources, then published resources inherit vault access."
>
> **Dev:** "Should users discuss resources inside Devault?"
> **Domain expert:** "No — keep **Resource Discussion** in Discord for now. Devault stores curated knowledge, not comment threads."
>
> **Dev:** "Should the community vote on resource quality?"
> **Domain expert:** "Not first — curators manage **Quality Signals** like featured, recommended, start here, outdated, and needs review."
>
> **Dev:** "Can every resource be marked start here?"
> **Domain expert:** "No — each **Category** should have at most one start here resource at first."
>
> **Dev:** "Is Devault frontend-only if deployed on Cloudflare?"
> **Domain expert:** "No — today Devault is a **Full-stack Web App**. A future **Service Split** can separate web, API, and bot when budget allows."
>
> **Dev:** "Should Hono and Drizzle replace the current app immediately?"
> **Domain expert:** "No — Hono and Drizzle are future extraction tools. Keep the Discord bot as a **Thin Discord Adapter** that calls the API."
>
> **Dev:** "Should the Discord bot write to Neon directly?"
> **Domain expert:** "No — the bot should send authenticated API requests. The API owns permissions and database writes."
>
> **Dev:** "Should the Discord bot stay in a separate repo?"
> **Domain expert:** "No — move it into the **Monorepo** as `apps/bot` so contracts can be shared."
>
> **Dev:** "Should Devault stay public while the product is still forming?"
> **Domain expert:** "No — move to a private personal repository first. Devault should be closed-source for now because open-source maintenance would distract from product work."
>
> **Dev:** "If Alice saves a resource to a shared vault and later leaves the community, should the resource disappear?"
> **Domain expert:** "No — shared **Vault Resources** are owned by the **Vault**. Alice can remain recorded as the contributor."
>
> **Dev:** "Can any community member edit the whole vault?"
> **Domain expert:** "No — members can make **Contributions**, while owners or curators are responsible for **Curation**."
>
> **Dev:** "Can a Discord moderator publish a resource without opening Devault?"
> **Domain expert:** "Yes — a **Curator** should be able to publish resources from Discord or from the platform."
>
> **Dev:** "Is every Discord member a curator?"
> **Domain expert:** "No — Discord access and **Curator Assignment** are separate. A vault can map specific Discord roles to curator rights."
>
> **Dev:** "Which Discord publishing workflow should Devault assume?"
> **Domain expert:** "The Discord bot already supports slash commands, message actions, and channel watchers, so Devault should define how those publishing events are trusted and processed."
>
> **Dev:** "Should tags replace categories?"
> **Domain expert:** "No — **Categories** are the primary structure inside a vault. **Tags** are optional retrieval labels."
>
> **Dev:** "Can AI decide the final tags?"
> **Domain expert:** "No — AI can make **AI Tag Suggestions**, but curators keep the **Tag Vocabulary** clean."
>
> **Dev:** "Are highlights and notes private by default?"
> **Domain expert:** "No — ship **Vault Highlights** and **Vault Notes** first. **Personal Annotations** can come later."

## Flagged ambiguities

- "All Raindrop features" could mean cloning Raindrop as a personal bookmark manager or borrowing mature retrieval features. Resolved: Devault should remain a **community-first vault product** with Raindrop-level **retrieval mechanics**.
- "Raindrop-level retrieval" could include expensive archival features. Resolved: **Retrieval Core** is the first milestone; **Knowledge Archive** is future premium.
- "Search" could mean metadata, extracted live content, or archived copies. Resolved: ship **Metadata Search** first, then **Extracted Content Search**, with archive search reserved for **Knowledge Archive**.
- "Duplicate" could mean duplicate within a category, vault, or the whole product. Resolved: first **Duplicate Detection** means same normalized URL inside the same vault.
- "Resource" could mean either shared source metadata or the vault-specific saved item. Resolved: use **Canonical Resource** for shared source facts and **Vault Resource** for the vault-owned curated item.
- "Member contribution" could mean open publishing or moderated submission. Resolved: each vault has a **Publishing Mode**; community vaults should prefer curator-only or approval-based publishing.
- "Discord-gated" could be confused with curator permissions. Resolved: access gating controls entry; **Curator Assignment** controls publishing and organization rights.
- "Discord actor check" could be confused with a complete publishing model. Resolved: use **Discord Channel Policy**, with curator-only as one policy mode.
- "Category" and "Tag" both organize resources. Resolved: **Category** is the primary browsable section; **Tag** is a cross-cutting retrieval label.
- "AI tagging" could imply fully automatic classification. Resolved: **AI Tag Suggestions** assist humans; published tags normalize into a vault **Tag Vocabulary**.
- "Notes" and "highlights" could mean shared curation or private annotation. Resolved: ship **Vault Notes** and **Vault Highlights** first; **Personal Annotations** come later.
