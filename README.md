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

The assistant's behaviour is set by two things:

| File | Role |
| --- | --- |
| `context.md` | The ground rules — tone, encouragement, the no-technical-words rule, how to open the conversation, and what to keep notes on. Read first, outranks everything. |
| `.bolt/prompt` | Always-on summary of those rules. |
| `.bolt/skills/<name>/SKILL.md` | Six specialists, loaded when relevant. |

### The six skills

| Skill | Handles |
| --- | --- |
| **design-thinking** | Empathise, define, ideate, prototype, test — applied to making a game. Uses vocabulary the students have already been taught, plus techniques for each stage. |
| **game-designer** | The opening conversation. What the game is, who's in it, what you do, how you win and lose. Asks lots of questions, doesn't build anything yet. |
| **game-types** | What makes each kind of game work — jumping, puzzles, words, dodging, racing, shops, stories, rhythm, seek-and-find, two-player, 3D. Questions and traps for each, plus honest scoping. |
| **game-builder** | Turning ideas into a working game. Small steps, always playable, "try it now" after every change. |
| **player-experience** | How it feels to play — controls, the first thirty seconds, difficulty, feedback, sound, phones, accessibility, playtesting. |
| **visual-designer** | How it looks — art style, colour, characters, backgrounds, titles, layout, polish. |

Design comes first, deliberately. The assistant is instructed not to build
anything until the student has a clear idea and wants to see it — because
deciding what the game *is* is the part that's genuinely hers, and it's the
most fun part.

`game-types` is held back on purpose. Opening with a menu of genres replaces a
student's imagination with a multiple-choice question, so the skill is scoped
to *after* her idea has a shape, or to when she is genuinely stuck.

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

The tone and rules are all in `context.md` and the six skill files, in plain
prose. To change the age group, the subject, or how much technical detail is
appropriate, edit those — no other changes needed.

## Licences

Template code: use it however you like. Bundled art and sounds are CC0. The
`game-icons` library is CC BY 3.0 (credit needed if a game is published);
`lucide` is ISC.
