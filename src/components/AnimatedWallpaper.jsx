import { useEffect, useRef } from "react";

// Misma regla que el @media de index.css que elige el fondo vertical
const PORTRAIT_QUERY = "(max-aspect-ratio: 1/1)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const WALLPAPERS = {
  landscape: { image: "/images/wallpaper-caribe.webp", mask: "/images/wallpaper-caribe-water.png", horizon: 0.61 },
  portrait: { image: "/images/wallpaper-caribe-mobile.webp", mask: "/images/wallpaper-caribe-mobile-water.png", horizon: 0.59 },
};

// 30 fotogramas por segundo bastan para un oleaje lento y gastan menos batería
const FRAME_INTERVAL = 1000 / 30;
const MAX_PIXEL_RATIO = 1.5;

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = vec2(aPosition.x + 1.0, 1.0 - aPosition.y) * 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;
uniform sampler2D uImage;
uniform sampler2D uMask;
uniform vec4 uCover;
uniform float uTime;
uniform float uHorizon;
uniform float uAspect;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Dos capas de olas que se cruzan para que el patrón no parezca desplazarse en bloque
float waves(vec2 p, float t) {
  float a = noise(p + vec2(t * 0.35, t * 0.5));
  float b = noise(p * 2.1 + vec2(-t * 0.45, t * 0.8));
  return a * 0.65 + b * 0.35;
}

void main() {
  vec2 uv = vUv * uCover.xy + uCover.zw;
  float mask = texture2D(uMask, uv).r;

  if (mask < 0.004) {
    gl_FragColor = texture2D(uImage, uv);
    return;
  }

  // Perspectiva: las olas lejanas son más pequeñas y se mueven menos
  float depth = clamp((uv.y - uHorizon) / (1.0 - uHorizon), 0.0, 1.0);
  float distance = 1.0 / (depth + 0.09);
  // Ondas finas y alargadas en horizontal, como se ven en el mar a ras de agua
  vec2 surface = vec2((uv.x - 0.5) * uAspect * distance * 1.6, distance * 11.0);

  float e = 0.05;
  float h = waves(surface, uTime);
  float dx = waves(surface + vec2(e, 0.0), uTime) - h;
  float dy = waves(surface + vec2(0.0, e), uTime) - h;

  float strength = mask * (0.2 + depth * 0.9);
  // En la foto vertical la misma fracción de altura son muchos más píxeles: se compensa
  vec2 offset = vec2(dx * 0.012, dy * 0.045 * min(uAspect, 1.0)) * strength;
  vec3 color = texture2D(uImage, uv + offset).rgb;

  // Destellos pequeños: solo donde la foto ya tiene el reflejo intenso del sol
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  float glint = pow(noise(surface * vec2(5.0, 1.6) + vec2(uTime * 0.9, -uTime * 1.3)), 12.0);
  color += glint * mask * smoothstep(0.72, 0.97, luminance) * 1.1;

  gl_FragColor = vec4(color, 1.0);
}`;

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
  return shader;
};

const createProgram = (gl) => {
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  return program;
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const createTexture = (gl, unit, image) => {
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  return texture;
};

// La foto de CSS sigue debajo: si WebGL falla o el visitante reduce el movimiento, se ve quieta
const AnimatedWallpaper = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const portrait = window.matchMedia(PORTRAIT_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });

    if (!gl) return;

    let program;
    try {
      program = createProgram(gl);
    } catch (error) {
      console.warn("Animated wallpaper disabled:", error);
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(program, "uImage"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "uMask"), 1);

    const uCover = gl.getUniformLocation(program, "uCover");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uHorizon = gl.getUniformLocation(program, "uHorizon");
    const uAspect = gl.getUniformLocation(program, "uAspect");

    let frame = 0;
    let lastDraw = 0;
    let imageAspect = 1;
    let ready = false;
    let loadId = 0;
    let textures = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      const width = Math.round(canvas.clientWidth * ratio);
      const height = Math.round(canvas.clientHeight * ratio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);

      // Mismo encuadre que background-size: cover con background-position: center
      const viewAspect = width / height;
      const scaleX = viewAspect > imageAspect ? 1 : viewAspect / imageAspect;
      const scaleY = viewAspect > imageAspect ? imageAspect / viewAspect : 1;
      gl.uniform4f(uCover, scaleX, scaleY, (1 - scaleX) / 2, (1 - scaleY) / 2);
      gl.uniform1f(uAspect, imageAspect);
    };

    const draw = (now) => {
      frame = requestAnimationFrame(draw);
      if (now - lastDraw < FRAME_INTERVAL) return;
      lastDraw = now;
      gl.uniform1f(uTime, now / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      canvas.style.opacity = "0";
    };

    const start = () => {
      if (frame || !ready || reducedMotion.matches || gl.isContextLost()) return;
      resize();
      frame = requestAnimationFrame(draw);
      canvas.style.opacity = "1";
    };

    const load = async () => {
      const id = ++loadId;
      const wallpaper = portrait.matches ? WALLPAPERS.portrait : WALLPAPERS.landscape;
      ready = false;
      stop();

      try {
        const [image, mask] = await Promise.all([loadImage(wallpaper.image), loadImage(wallpaper.mask)]);
        if (id !== loadId || gl.isContextLost()) return;

        textures.forEach((texture) => gl.deleteTexture(texture));
        textures = [createTexture(gl, 0, image), createTexture(gl, 1, mask)];
        imageAspect = image.naturalWidth / image.naturalHeight;
        gl.uniform1f(uHorizon, wallpaper.horizon);
        ready = true;
        start();
      } catch (error) {
        console.warn("Animated wallpaper disabled:", error);
      }
    };

    const onContextLost = (event) => {
      event.preventDefault();
      stop();
    };
    const onMotionChange = () => (reducedMotion.matches ? stop() : start());

    canvas.addEventListener("webglcontextlost", onContextLost);
    window.addEventListener("resize", resize);
    portrait.addEventListener("change", load);
    reducedMotion.addEventListener("change", onMotionChange);

    if (!reducedMotion.matches) load();

    return () => {
      loadId++;
      cancelAnimationFrame(frame);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("resize", resize);
      portrait.removeEventListener("change", load);
      reducedMotion.removeEventListener("change", onMotionChange);
      // El canvas conserva su contexto: React puede volver a montar este efecto sobre el mismo
      textures.forEach((texture) => gl.deleteTexture(texture));
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} id="animated-wallpaper" aria-hidden="true" />;
};

export default AnimatedWallpaper;
