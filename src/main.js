/**
 * main.js — where the game starts up.
 *
 * It builds the pieces the game needs, hands them to every screen, and then
 * starts the loop that runs the game.
 *
 * Right now there is one screen and it isn't a game yet. As the game takes
 * shape, add each new screen to the list below.
 */

import './style.css';

import { createCanvas } from './engine/canvas.js';
import { createInput } from './engine/input.js';
import { createScenes } from './engine/scenes.js';
import { createAudio } from './engine/audio.js';
import { createParticles } from './engine/particles.js';
import { startLoop } from './engine/loop.js';

import { config } from './game/config.js';
import { welcomeScene } from './game/scenes/welcome.js';

document.title = config.title;

// The screen the game is drawn on.
const canvasHelper = createCanvas({
  parent: document.getElementById('game-frame'),
  width: config.width,
  height: config.height,
});

// Everything the screens are allowed to use, gathered in one place.
const context = {
  canvas: canvasHelper,
  input: createInput({ canvasHelper }),
  sound: createAudio(),
  particles: createParticles(),
  scenes: null, // filled in on the next line
};

context.scenes = createScenes(context);

// Every screen in the game, and the name used to switch to it.
// Add more here as they are built:  .add('play', playScene)
context.scenes.add('welcome', welcomeScene);

context.scenes.go('welcome');

startLoop({
  update: (dt) => {
    context.particles.update(dt);
    context.scenes.update(dt);
  },
  draw: () => {
    canvasHelper.clear();
    context.scenes.draw(canvasHelper.ctx);
  },
  onFrameEnd: () => context.input.endFrame(),
});
