/**
 * main.js — where the game starts up.
 *
 * It builds the pieces the game needs, hands them to every scene, and then
 * starts the loop that runs the game.
 */

import './style.css';

import { createCanvas } from './engine/canvas.js';
import { createInput } from './engine/input.js';
import { createScenes } from './engine/scenes.js';
import { createAudio } from './engine/audio.js';
import { createParticles } from './engine/particles.js';
import { startLoop } from './engine/loop.js';

import { config } from './game/config.js';
import { titleScene } from './game/scenes/title.js';
import { playScene } from './game/scenes/play.js';
import { gameOverScene } from './game/scenes/gameover.js';

document.title = config.title;

// The screen the game is drawn on.
const canvasHelper = createCanvas({
  parent: document.getElementById('game-frame'),
  width: config.width,
  height: config.height,
});

// Everything the scenes are allowed to use, gathered in one place.
const context = {
  canvas: canvasHelper,
  input: createInput({ canvasHelper }),
  sound: createAudio(),
  particles: createParticles(),
  scenes: null, // filled in on the next line
};

context.scenes = createScenes(context);

// Every screen in the game, and the name used to switch to it.
context.scenes
  .add('title', titleScene)
  .add('play', playScene)
  .add('gameover', gameOverScene);

context.scenes.go('title');

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
