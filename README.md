# Lab Bridge

A cross-lab sponsor map for TUM Venture Labs.

Twelve domain-specific labs each develop their own sponsors. Sponsors are not domain
specific. A corporate partner engaged by one lab is frequently a warm relationship for three
others, and no single lab can see that from where it sits. This makes it visible.

**This is an independent prototype.** It was built in response to a public job posting for a
Working Student in Business Development and Operations at TUM Venture Labs. It is not
affiliated with, endorsed by, or requested by TUM Venture Labs, TUM, or UnternehmerTUM, and it
is built entirely from information published on their own website.

---

## What it does

Three views, one page.

**The map.** A matrix of every collected partner against all twelve labs. Four cell states:
a solid green square means a relationship already exists, the same square hollow means an
untapped strong fit, a faint grey square means a possible fit, and an empty cell means no fit.
The encoding is the argument — reading across a row, the pattern of solid and hollow squares
is the finding, before you read a word.

**Partner detail.** Click any partner: what they do, which labs they are visibly associated
with and on what evidence, and all twelve labs ranked with the reasoning sentence for each.

**Opportunity queue.** Every partner-and-lab pair scored a strong candidate where that partner
already works with a different lab, ranked by how many existing relationships the partner
holds. The final column names the lab that would make the introduction. That column is the
operational payload: it turns an observation into a next action with a named owner.

---

## The honest part

This is built from publicly listed partners. That has a hard limit, and it is better stated
first than discovered later.

- **A public logo tells you a relationship exists somewhere. It does not tell you which lab
  owns it, how deep it goes, whether it is active, or who the contact is.** Existing
  associations here are indicative, not authoritative.
- Where a partner appears in a named "Partners" or "Sponsors" section on a lab page, the
  association is marked **confirmed**. Where it appears in any other page context — an event
  sponsor credit, a venue mention, a programme listing — it is marked **inferred**, and the
  exact wording found on the page is shown in the interface.
- Every partner links back to the page it was found on.
- Model-written assessments that a person has not yet checked are marked unreviewed, with an
  amber dot on the cell and the word "Unreviewed" in every table row.

Not collected, by choice: named individuals, contact details, anything behind a login,
anything purchased or scraped. This is an organisation-level map, which is both correct under
GDPR and the right answer if anyone asks.

Not produced, by choice: euro values for sponsorship potential. There is no public basis for
one and inventing it would undermine everything else on the page.

---

## How the scoring works

There is no weighted algorithm, and that is deliberate. A transparent sentence saying why
Wacker fits Additive Manufacturing can be argued with by someone who knows the industry. A
score of 0.82 cannot.

Every partner is assessed against every one of the twelve labs. A language model wrote the
first pass under a deliberately narrow brief:

- reason only from the partner's actual sectors and the lab's stated domain
- invent no facts about a company's activities, funding, or existing relationships
- return `no_fit` rather than stretch for a justification
- name the specific overlap in every sentence

A person then reviewed the output. Every cell and every row in the interface shows which state
it is in.

### The failure mode, since it is worth writing down

The model over-reaches toward `possible`. Given any two organisations it will find some thread
connecting them, because finding threads is what it is good at. The first pass returned
sentences like "strong strategic alignment with this lab's focus areas", which names nothing
and survives no scrutiny.

The rule that fixed it is narrow: **if the sentence does not name a product line, a material,
a market, or a technology that both sides actually touch, it is not a fit — it is a sentence
about a fit.** Reviewing was mostly deleting.

---

## Running it

```bash
npm install
npm run dev
```

Build for deployment:

```bash
npm run build
```

Static output lands in `dist/`. There is no backend, no database and no authentication — the
data is seeded JSON compiled into the bundle, which is all this needs.

To produce a single self-contained HTML file for sharing:

```bash
SINGLEFILE=1 npm run build
```

---

## Where the data lives

| File | What it holds |
| --- | --- |
| `src/data/labs.ts` | The twelve labs, with domain descriptions taken from their own lab pages |
| `src/data/partners.ts` | Collected partners, their sectors, source URLs and lab associations |
| `src/data/fits.ts` | One assessment per partner per lab, with reasoning, evidence and review state |
| `src/derive.ts` | Rankings, the opportunity queue, and the counts shown in the opening statement |

Legal Tech Colab is noted in the interface but deliberately not scored. It is a separate
non-profit on its own domain, funded by the Bavarian Ministry of Justice,
rather than one of the twelve domain labs.

---

## What would come next, with their data behind it

Everything above is limited by working from outside. With their actual contact management
system:

- every association carries real ownership, stage and history instead of a confirmed or
  inferred flag
- **collision detection** becomes possible — two labs approaching the same partner in the same
  quarter without knowing it. Public data cannot support this at all.
- a **best-practice layer** per partner, so the next lab to approach a company starts from what
  the last one learned rather than from nothing

Both of those are named in the job description, and neither is buildable from the outside.

---

## Design notes

Near-monochrome, one accent colour that means one thing, a serif for anything a person wrote
and a tabular sans for anything the data says. No gradients, no shadows, no rounded cards, no
decorative icons, no motion that is not a direct response to a click.

The test that mattered most: print the page to PDF. If it still holds up as a document, the
information design is doing the work. If it collapses, the layout was leaning on
interactivity to hide weak structure.

---

Built by Harshil Sojitra, September 2026.
