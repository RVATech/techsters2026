---
name: game-types
description: "Use when the student's idea is starting to resemble a particular kind of game — jumping, puzzles, words, racing, exploring in 3D, running a shop, telling a story — or when she asks what kinds of games she could make. Covers what makes each kind work, the questions worth asking for each, the traps to avoid, and how much each one really takes to build. Doesn't apply to the opening 'what do you want to make' conversation."
---

# Kinds of games

A reference for when her idea is taking a recognisable shape, or when she has
asked what her options are.

**Read `context.md` first.** No technical words, ask more than you tell, she
decides.

## Before you use any of this

**Do not open with this list.** The first conversation is about what *she*
wants — a feeling, a character, something that annoys her, something she
loves. Handing a beginner a menu of eighteen genres replaces her imagination
with a multiple-choice question, and the game becomes a copy of a category
instead of something of hers.

Reach for this file when:

- She has described something and it clearly resembles one of these — use the
  entry to ask sharper questions
- She is genuinely stuck after you have tried the open questions, and needs
  something concrete to react to *(offer three or four, never the whole list)*
- She has picked a direction and you need to know what makes it good
- She asks directly what kinds of games she could make

**Her idea does not have to be on this list.** A game about talking your way
out of trouble at a sleepover isn't any of these, and that makes it more
interesting, not less. Never bend her idea to fit a category.

**Most good games are two of these mixed.** A word game with a race against
time. A cooking game with a story. If she describes a mash-up, build the
mash-up.

**Never present these by name.** Say "a game where you jump between platforms
and try not to fall," not "a platformer."

---

## Kinds of games

Each entry: what it feels like, what to ask her, what makes it good, what to
watch for, and — for you only — how much work it really is and what art is
already here.

---

### Jumping and climbing games *(platformers)*

**Feels like:** getting somewhere tricky by timing your jumps. Tense in short
bursts, satisfying when you finally make it.

**She spends her time:** running, jumping, avoiding falling, reaching things.

**Ask her:**
- Is it about getting somewhere, collecting things, or escaping something?
- Should jumping feel floaty and dreamy, or heavy and real?
- What's below — a bottomless drop, spikes, water you can swim in?
- Can she do anything special? Double jump, wall climb, glide, dash?

**Makes it good:** jumping that feels good on its own, before any level exists.
Levels that teach a move, then ask you to use it. Being generous — letting a
jump pressed slightly late still count.

**Watch out for:** levels far too hard because she has played them a hundred
times. Long stretches with nothing in them. Falling to your death and being
sent back a long way — restart close to where she died.

*Build notes: very achievable in 2D. Gravity plus grounded-checks plus
rectangle overlap. Get jump feel right before building any level. Art on hand:
`ART.platformerTiles` (18px) and `ART.platformerCharacters` (24px, with walk
frames).*

---

### Top-down adventure games

**Feels like:** exploring somewhere and slowly working out what's going on.

**She spends her time:** walking around, finding things, talking to characters,
opening what was locked.

**Ask her:**
- What's she looking for?
- Does she meet anyone? What do they want?
- Is there somewhere she can't go until she finds something?
- Is it dangerous, or is it about exploring in peace?

**Makes it good:** a world that rewards poking at it. Small discoveries close
together. Characters with one clear personality each.

**Watch out for:** a big empty map. Getting lost with no idea where to go —
there should always be something obvious to head toward.

*Build notes: a grid of tiles plus a walking character. Very achievable. Art on
hand: `ART.dungeon` and `ART.town` (both 16px, with characters, buildings,
scenery).*

---

### Puzzle games

**Feels like:** the click when you spot it. Calm, then suddenly satisfying.

**She spends her time:** matching, sorting, sliding, connecting, arranging.

**Ask her:**
- What's the moment that feels good — clearing a lot at once, finding the one
  right answer, or beating the clock?
- Are the puzzles handmade by you, or made up fresh every time?
- Can she get stuck with no moves left? What happens then?
- Is there a time limit, or as long as she likes?

**Makes it good:** one rule, explained by playing rather than reading, then
built on. Every puzzle teaching something the next one needs. Being clearly
told *why* a move didn't work.

**Watch out for:** puzzles that are obvious to her and impossible for everyone
else. Getting stuck with no way back — always allow undo or a reshuffle.

*Build notes: usually a grid of values plus match/clear/refill rules. Very
achievable, and often better drawn with plain shapes than sprites. Art on hand:
`ART.ui`, or simple coloured rounded rectangles.*

---

### Word games

**Feels like:** your brain doing something clever. Good in short sittings.

**She spends her time:** guessing, spelling, unscrambling, finding words.

**Ask her:**
- Guessing a hidden word, making words from letters, or finding words hidden
  in a grid?
- How does she know she's getting warmer?
- How many tries does she get?
- Should the words be about something in particular — animals, food, her
  friends' names?

**Makes it good:** a word list that fits who's playing — school-friendly and
not too obscure. Clear feedback on every guess. A satisfying reveal at the end.
Being able to play again immediately with a new word.

**Watch out for:** words nobody knows, which feel unfair rather than hard.
Accepting only one spelling when several are reasonable. Being cruel about
typos.

*Build notes: the easiest kind of game here to build well, and one of the most
replayable. A word list plus comparison logic — no art needed at all. Let her
write the word list herself; it's the part that makes it hers.*

---

### Dodging and surviving games *(arcade, endless)*

**Feels like:** heart rate rising. "One more go."

**She spends her time:** avoiding things, grabbing things, lasting longer.

**Ask her:**
- What's chasing or falling, and what is she trying to grab?
- Does it get faster, more crowded, or both?
- Does it ever end, or go until she loses?
- Anything that helps her — shields, slow-motion, extra lives?

**Makes it good:** instant restarts. A score she wants to beat. Difficulty that
climbs smoothly. Near-misses that feel thrilling rather than unfair.

**Watch out for:** getting hit by something she couldn't have seen. Boring
first thirty seconds because it starts too easy.

*Build notes: the quickest route to something genuinely fun, and a good first
project. Spawn, move, check overlaps, score.*

---

### Space and shooting games

**Feels like:** fast, loud, satisfying. Things exploding.

**She spends her time:** dodging, aiming, firing, clearing waves.

**Ask her:**
- What's she flying or controlling? What's she up against?
- Does her weapon get stronger?
- Are there waves with breathing room, or is it constant?
- Is there something big at the end?

**Makes it good:** firing that feels punchy — sound, screen shake, particles.
Enemies whose patterns can be learned. Bullets that are easy to see.

**Watch out for:** so much on screen the player can't find herself. Being hit
by something off-screen.

*Build notes: very achievable. Art on hand: `ART.space` and `ART.spaceShips`
(16px, ships, lasers, asteroids, explosions).*

---

### Racing games

**Feels like:** speed, and the pull of a corner taken well.

**She spends her time:** steering, keeping speed up, beating a time or a rival.

**Ask her:**
- Racing other people, or against the clock?
- Realistic, or slidey and silly?
- Anything to pick up along the way — boosts, shortcuts, banana skins?
- One track or several?

**Makes it good:** a real sense of speed — blur, sound, things rushing past.
Losing feeling like her fault, not the game's. Rivals who stay close.

**Watch out for:** steering that fights the player. Rivals so far ahead there's
no point trying.

*Build notes: top-down is far easier than behind-the-car and plays just as
well. Art on hand: `npm run art -- pixel-vehicle-pack`.*

---

### Building and running things *(shops, farms, towns, pets)*

**Feels like:** cosy, absorbing, "just one more day."

**She spends her time:** planting, serving, arranging, upgrading, looking after.

**Ask her:**
- What's she in charge of?
- What does she start with, and what's she working toward?
- Does anything go wrong if she ignores it?
- Can she make it look how she wants?

**Makes it good:** something always finishing soon. Visible growth. Choices
that matter but aren't ruinous. Being able to decorate.

**Watch out for:** waiting with nothing to do. Being punished for stopping
playing — cosy games shouldn't hold a grudge.

*Build notes: mostly state, timers, and menus rather than fast action —
achievable, though the interface takes longer than the logic. Art on hand:
`ART.town`, `ART.ui`, or `npm run art -- tiny-farm`.*

---

### Story and choice games

**Feels like:** reading something where you decide what happens.

**She spends her time:** reading, choosing, seeing what changed.

**Ask her:**
- Who is she in the story?
- What's the choice she'll agonise over?
- Do the endings really differ, or is it one story with detours?
- Is there anything to do besides choose?

**Makes it good:** choices with no obviously right answer. Consequences that
show up later. Characters who sound like real people. Short scenes.

**Watch out for:** choices that change nothing — players notice fast. Walls of
text.

*Build notes: mostly writing, which is why it suits a student who loves writing
more than mechanics. Structurally simple; the work is words. Encourage her to
write them herself.*

---

### Rhythm and music games

**Feels like:** being in time with something. Physical and satisfying.

**She spends her time:** hitting things on the beat.

**Ask her:**
- What's the song or the sound?
- Does she press in time, or make the music herself?
- What happens when she misses — does it stop, or keep going?
- Is it about a perfect run, or just having fun?

**Makes it good:** feedback that is exactly on time. Missing being obvious but
not brutal. A run of hits building into something.

**Watch out for:** timing that feels slightly off, which ruins it entirely.
Being too strict about accuracy.

*Build notes: harder than it looks — timing accuracy is unforgiving. Start with
a simple fixed pattern rather than a real song.*

---

### Seek-and-find games

**Feels like:** peaceful concentration, with little bursts of triumph.

**She spends her time:** searching a busy picture for particular things.

**Ask her:**
- What kind of scene is it?
- What's she hunting for?
- Is there a clock, or is it relaxed?
- Should there be a hint if she's stuck for ages?

**Makes it good:** scenes that are busy but not noisy. Things genuinely
hidden rather than tiny. A satisfying click when one is found.

**Watch out for:** targets so small they're invisible on a phone. Frustration
with no hint available.

*Build notes: one of the easiest to build, and a great fit if she wants to draw
her own scenes. Mostly "did she tap inside this area?"*

---

### Two-player games

**Feels like:** playing with someone in the room. Loud.

**She spends her time:** competing or cooperating at the same keyboard.

**Ask her:**
- Against each other, or working together?
- Same time, or taking turns?
- What makes it fair when one player is better?

**Makes it good:** simple rules, quick rounds, both players always able to see
what's happening. Coming from behind being possible.

**Watch out for:** one player winning so early the other stops caring. Both
players needing the same keys.

*Build notes: a modifier on other kinds, not a kind of its own. Turn-based is
much easier than simultaneous. Two sets of keys on one keyboard is
straightforward.*

---

### Games you walk around in *(first-person and 3D)*

**Feels like:** actually being somewhere.

**She spends her time:** exploring a space from inside it, looking around.

**Ask her:**
- What does she see when she looks around?
- Is she exploring, escaping, finding something, or building?
- Is it somewhere real, or somewhere impossible?
- Should it be calm and beautiful, or tense?

**Makes it good:** a space worth being in. Somewhere obvious to head toward.
Controls that don't make people queasy — never move the view without her
asking.

**Watch out for:** wide-open emptiness, which is far more boring than a small
detailed space. Motion sickness from fast or automatic camera movement. Getting
lost.

*Build notes: this is genuinely more work than everything above, and needs
`three`. Be honest with yourself, never with her — don't talk her out of it,
scope it down. One small, richly detailed room beats a vast empty world, and is
achievable in a session. A calm exploration or hidden-object game in 3D is a
much better first attempt than anything needing fast aiming. Kits available:
`npm run art -- nature-kit castle-kit city-kit-suburban blocky-characters`.*

---

## When she's stuck, offer these — not the whole list

Pick three or four that suit what she has already said, described in her words:

> "Do you want a game where you jump around and try not to fall, one where you
> figure out puzzles, one where you run a shop and watch it grow, or one where
> you dodge stuff and try to last as long as you can? Or something totally
> different?"

If she has said anything at all about what she likes, bias the options toward
it. Someone who mentioned writing gets story and word games. Someone who
mentioned being competitive gets racing and two-player.

## Honest scoping, silently

Never tell her something is too hard. Judge it yourself and offer a version
that will actually get finished in the time available.

**Quickest to something fun:** dodging games, word games, seek-and-find,
puzzles.
**Very achievable:** platformers, top-down adventures, space shooters,
two-player, story games.
**Takes longer:** management and building games *(lots of interface)*, racing
*(feel is fiddly)*, rhythm *(timing is unforgiving)*.
**Much bigger:** anything first-person or 3D — scope it to one small space.

When something is big, don't refuse. Split it:

> "Let's get the first room working, then add the rest — that way you can play
> it sooner."
