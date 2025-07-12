import { createWindParticles, updateParticles, drawParticles } from './wind';

const canvas = document.getElementById('wind-canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl');

if (!gl) {
  alert('WebGL not supported');
  throw new Error('WebGL not supported');
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particleCount = 3000;
const particles = createWindParticles(particleCount, canvas.width, canvas.height);

function render() {
  updateParticles(particles, canvas.width, canvas.height);
  drawParticles(gl, particles);
  requestAnimationFrame(render);
}

render();
