export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function createWindParticles(count: number, width: number, height: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    });
  }
  return particles;
}

export function updateParticles(particles: Particle[], width: number, height: number) {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
    }
  }
}

export function drawParticles(gl: WebGLRenderingContext, particles: Particle[]) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0.05); // fading trail
  gl.clear(gl.COLOR_BUFFER_BIT);

  const vertices = new Float32Array(particles.length * 2);
  for (let i = 0; i < particles.length; i++) {
    vertices[i * 2] = (particles[i].x / gl.canvas.width) * 2 - 1;
    vertices[i * 2 + 1] = (particles[i].y / gl.canvas.height) * -2 + 1;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);

  const vertCode = `
    attribute vec2 coordinates;
    void main(void) {
      gl_PointSize = 1.5;
      gl_Position = vec4(coordinates, 0.0, 1.0);
    }
  `;
  const fragCode = `
    void main(void) {
      gl_FragColor = vec4(0.0, 0.7, 1.0, 1.0);
    }
  `;

  const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vertShader, vertCode);
  gl.compileShader(vertShader);

  const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fragShader, fragCode);
  gl.compileShader(fragShader);

  const shaderProgram = gl.createProgram()!;
  gl.attachShader(shaderProgram, vertShader);
  gl.attachShader(shaderProgram, fragShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  const coord = gl.getAttribLocation(shaderProgram, 'coordinates');
  gl.enableVertexAttribArray(coord);
  gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.POINTS, 0, particles.length);
  gl.deleteBuffer(buffer);
}

