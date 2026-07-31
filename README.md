# Game Studio Starter

A template for running a game-making workshop with middle-school students who
have **no technical background**.

A student opens this in [bolt.new](https://bolt.new) and says *"I want to make
a game."* From there she has a conversation about characters, rules, colours,
and what makes a game fun — and a real, playable, shareable browser game gets
built around her answers. She never sees code, file names, or an error message.

**There is nothing for a student to read.** She only ever talks to the
assistant — no instructions, no getting-started document, no plan to fill in.
Everything she needs to know, she learns because the assistant said it at the
right moment. This file is for whoever is running the session.

## How it works

The assistant's behaviour comes from three places:

| File | Role |
| --- | --- |
| [`context.md`](context.md) | The ground rules — tone, encouragement, the no-technical-words rule, how to open the conversation, and what to keep notes on. Read first, outranks everything. |
| [`.bolt/prompt`](.bolt/prompt) | Always-on summary of those rules. |
| `.bolt/skills/<name>/SKILL.md` | Seven specialists, each loaded when its description matches what's happening. |

## The seven skills

Each is plain prose — worth reading if you're running a session, and worth
editing if you want to change how it goes.

### [design-thinking](.bolt/skills/design-thinking/SKILL.md)

Empathise, define, ideate, prototype, test — applied to making a game. Written
for groups who have **already had a design thinking discussion**, so it uses
the stage names openly and lets students recognise the process they were
taught in something they actually care about.

Techniques for each stage: interviewing a real player, the one-sentence
definition, ten-fast-ideas and worst-possible-idea for ideating, paper
prototypes before screen prototypes, and the hard rules for watching someone
play — *don't explain, don't help, don't defend*. Also covers the student who
is attached to her first idea.

### [game-designer](.bolt/skills/game-designer/SKILL.md)

The opening conversation, and the one that runs longest. What the game is, who's
in it, where it happens, what you do over and over, how you win and lose, how it
gets harder, who it's for.

Deliberately builds nothing. It's a list of what to find out, not a script — with
techniques for getting better answers out of someone who says "I don't know",
and a checkpoint for knowing when design is done.

### [game-types](.bolt/skills/game-types/SKILL.md)

Thirteen kinds of games — jumping and climbing, top-down adventure, puzzle,
word, dodging, space shooter, racing, shops and farms, story and choice,
rhythm, seek-and-find, two-player, and first-person 3D. Each with what it feels
like, what to ask her, what makes it good, what to watch for, and honest
scoping of what it really takes to build.

**Held back on purpose.** It opens by saying *don't open with this list* —
handing a beginner a menu of genres replaces her imagination with a
multiple-choice question. It fires once her idea already has a shape, or when
she's genuinely stuck, and then offers three or four options, never the lot.

### [game-builder](.bolt/skills/game-builder/SKILL.md)

Turning ideas into a working game. Small steps, always playable, "try it now"
after every change.

Split in two: how to talk to her, then a *Behind the curtain* section marked as
never spoken aloud, holding the project layout, the engine reference, the
bundled art, and the rules for the code itself. Also lists the game-feel
touches — particles, screen shake, squash and stretch — worth adding without
being asked.

### [player-experience](.bolt/skills/player-experience/SKILL.md)

How it feels to play: the first thirty seconds, control feel, difficulty,
feedback, menus, sound, phones, and making it playable by everyone.

Includes a triage for the most common report a student gives — "it's not fun" —
which splits into boring, confusing, or frustrating, each needing a completely
different fix.

### [visual-designer](.bolt/skills/visual-designer/SKILL.md)

How it looks: mood before style, then palette, characters, backgrounds, titles,
layout, and motion. Starts from a feeling rather than a picture, because "what
should it look like?" is too big a question to answer cold.

Ends with an ordered checklist for "it looks boring", which is usually contrast
before anything else.

### [asking-for-what-you-want](.bolt/skills/asking-for-what-you-want/SKILL.md)

What to do when the assistant isn't sure what she's asking for. How to ask a
clarifying question that doesn't stall the work, and how to help her get at
something she can picture but can't describe.

Includes a table of the words that always need unpacking — *better*, *boring*,
*wrong*, *cooler*, *too hard* — each of which means several different things.

Its real job is teaching her to ask clearly, which is a skill worth far more
than the game. But it does that **by modelling, never by explaining**: the
assistant reflects her loose request back in a sharper form as a check, and she
absorbs the shape without ever being told she was unclear. Saying "be more
specific" to a twelve-year-old just makes her stop asking.

Its first rule is not to over-use itself — most vague requests should just be
answered with a good guess she can react to, because playing something beats
answering a question.

## The arc of a session

Design comes first, deliberately. The assistant is instructed not to build
anything until the student has a clear idea and wants to see it — because
deciding what the game *is* is the part that's genuinely hers, and the part
she'll remember.

1. **Opening** — `context.md` sets the tone; `design-thinking` frames it as the
   process she already knows
2. **Deciding what it is** — `game-designer` asks; `game-types` sharpens the
   questions once her idea has a shape
3. **Making it real** — `game-builder` builds in small steps, showing her after
   each one
4. **Making it good** — `player-experience` and `visual-designer` take over,
   driven by her playing it and reacting
5. **Round again** — `design-thinking` closes the loop, and testing sends her
   back to ideas

`asking-for-what-you-want` runs across all of it, whenever a request could mean
more than one thing.

The assistant keeps its own notes in a `GAME-PLAN.md` it creates as decisions
land — that's what lets a student pick up where she left off a week later. She
is never shown it.

## Running it

### In bolt.new

Import the repository. Everything is picked up automatically.

### Locally

```bash
npm install
npm run dev
```

You'll see a blank title card. **There is deliberately no starter game** — no
character, no score, no timer, no win condition. A working sample game would
quietly set expectations about what a game is supposed to be, and students
would start editing it instead of designing their own. The first thing built
should be hers.

| Command | Does |
| --- | --- |
| `npm run dev` | Start the game |
| `npm run build` | Build for sharing |
| `npm run art` | List free art packs; `-- <slug>` to add one |
| `npm run icons` | `-- search <word>` to find icons; `-- <name>` to add |

## What's in the box

Plain JavaScript, no framework. Vite for the dev server and build.

```
context.md            the rules — read this to understand the whole template
.bolt/
  prompt              always-on instructions
  skills/             one folder per specialist, each holding a SKILL.md
docs/ART-AND-SOUND.md every art pack, icon, and sound available
src/
  engine/             input, scenes, drawing, sound, particles, sprites, saving
  game/               config, theme, art index, and a blank welcome screen
public/assets/
  art/                6 public-domain art and sound packs
  icons/              23 tintable SVG icons
scripts/              art and icon fetchers
```

### The engine

Small, commented helpers so games get built out of readable pieces rather than
from scratch each time: a delta-timed loop, a canvas that scales to any screen,
unified keyboard/mouse/touch input, scene switching, drawing shortcuts, sprite
sheets and animation, particles, sound (including file-free generated beeps),
asset preloading, and save-to-browser storage.

Comments are written for a curious beginner who opens a file to look — plain
language, explaining *why*.

### Art and sound

Bundled and working offline: top-down dungeon and town sets, a side-on
platformer set, a space shooter set, a menu/UI set, 101 interface sounds, and
23 icons. All public domain ([kenney.nl](https://kenney.nl), CC0).

Two icon libraries are installed as dependencies — 4,134 game icons and 1,817
interface icons — with a script that extracts just the ones a game uses, so the
6 MB of source data never reaches the browser.

More packs are one command away. Full inventory in
[docs/ART-AND-SOUND.md](docs/ART-AND-SOUND.md).

## Adapting it

The tone and rules are all in [`context.md`](context.md) and the seven
`SKILL.md` files, in plain prose. To change the age group, the subject, or how
much technical detail is appropriate, edit those — no other changes needed.

Adding a skill: make a folder under `.bolt/skills/`, put a `SKILL.md` in it
with `name` (matching the folder) and `description` frontmatter, and write the
body in plain sentences. The `description` is what decides when it loads, so
say what triggers it *and* what it doesn't cover — see `game-types` for a
skill scoped to deliberately stay out of the way.

## Licences

Template code: use it however you like. Bundled art and sounds are CC0. The
`game-icons` library is CC BY 3.0 (credit needed if a game is published);
`lucide` is ISC.
