"use client";

import { useRef, useEffect } from "react";
import { Cpu, Globe } from "lucide-react";
import { skills, type Skill } from "@/data/skillsData";

// ═══════════════════════════════════════════════════════════════════════════════
//  Types
// ═══════════════════════════════════════════════════════════════════════════════

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Face {
  a: number;
  b: number;
  c: number;
}

interface SkillNode {
  position: Vec3;
  skill: Skill;
  icon: HTMLImageElement | null;
}

interface Projected {
  x: number;
  y: number;
  scale: number;
  depth: number;
  nodeIndex: number;
}

interface DragState {
  active: boolean;
  lastX: number;
  lastY: number;
  lastTime: number;
  velY: number;
  velX: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Constants
// ═══════════════════════════════════════════════════════════════════════════════

const TWO_PI = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;

// Physics
const BASE_OMEGA = TWO_PI / 90;
const DAMPING_B = Math.log(100) / 2;
const IMPULSE_SENSITIVITY = 1.0;
const STALE_THRESHOLD_MS = 100;
const DRAG_SMOOTH = 0.35;

// Visual
const PERSPECTIVE = 800;
const RADIUS_RATIO = 0.34;
const NODE_EXTRUSION = 0.25;
const ICON_SIZE = 32;
const SUBDIVISION_LEVEL = 1; // Reduced from 2→1: 42 verts, 80 faces, 120 edges (vs 162/320/480)

// Colors — pre-computed RGBA strings to avoid per-frame string concatenation
const LABEL_FRONT = "rgba(220, 220, 230, 0.92)";
const LABEL_BACK = "rgba(220, 220, 230, 0.22)";

// ═══════════════════════════════════════════════════════════════════════════════
//  3D Math
// ═══════════════════════════════════════════════════════════════════════════════

const v3 = (x: number, y: number, z: number): Vec3 => ({ x, y, z });

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z);
  return len === 0 ? v3(0, 0, 0) : v3(v.x / len, v.y / len, v.z / len);
}

function midpoint(a: Vec3, b: Vec3): Vec3 {
  return v3((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
}

function rotateY(v: Vec3, θ: number): Vec3 {
  const c = Math.cos(θ),
    s = Math.sin(θ);
  return v3(v.x * c + v.z * s, v.y, -v.x * s + v.z * c);
}

function rotateX(v: Vec3, θ: number): Vec3 {
  const c = Math.cos(θ),
    s = Math.sin(θ);
  return v3(v.x, v.y * c - v.z * s, v.y * s + v.z * c);
}

function project(
  v: Vec3,
  p: number,
  cx: number,
  cy: number
): { x: number; y: number; scale: number; depth: number } {
  const scale = p / (p + v.z);
  return { x: cx + v.x * scale, y: cy + v.y * scale, scale, depth: v.z };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Geodesic Sphere (Subdivided Icosahedron)
// ═══════════════════════════════════════════════════════════════════════════════

function buildGeodesic(level: number) {
  const t = PHI;
  const raw: Vec3[] = [
    v3(-1, t, 0),
    v3(1, t, 0),
    v3(-1, -t, 0),
    v3(1, -t, 0),
    v3(0, -1, t),
    v3(0, 1, t),
    v3(0, -1, -t),
    v3(0, 1, -t),
    v3(t, 0, -1),
    v3(t, 0, 1),
    v3(-t, 0, -1),
    v3(-t, 0, 1),
  ];
  let verts = raw.map(normalize);
  let faces: Face[] = [
    { a: 0, b: 11, c: 5 },
    { a: 0, b: 5, c: 1 },
    { a: 0, b: 1, c: 7 },
    { a: 0, b: 7, c: 10 },
    { a: 0, b: 10, c: 11 },
    { a: 1, b: 5, c: 9 },
    { a: 5, b: 11, c: 4 },
    { a: 11, b: 10, c: 2 },
    { a: 10, b: 7, c: 6 },
    { a: 7, b: 1, c: 8 },
    { a: 3, b: 9, c: 4 },
    { a: 3, b: 4, c: 2 },
    { a: 3, b: 2, c: 6 },
    { a: 3, b: 6, c: 8 },
    { a: 3, b: 8, c: 9 },
    { a: 4, b: 9, c: 5 },
    { a: 2, b: 4, c: 11 },
    { a: 6, b: 2, c: 10 },
    { a: 8, b: 6, c: 7 },
    { a: 9, b: 8, c: 1 },
  ];

  for (let i = 0; i < level; i++) {
    const cache = new Map<string, number>();
    const next: Face[] = [];
    const mid = (a: number, b: number): number => {
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      let idx = cache.get(key);
      if (idx !== undefined) return idx;
      idx = verts.length;
      verts.push(normalize(midpoint(verts[a], verts[b])));
      cache.set(key, idx);
      return idx;
    };
    for (const f of faces) {
      const ab = mid(f.a, f.b),
        bc = mid(f.b, f.c),
        ca = mid(f.c, f.a);
      next.push(
        { a: f.a, b: ab, c: ca },
        { a: f.b, b: bc, c: ab },
        { a: f.c, b: ca, c: bc },
        { a: ab, b: bc, c: ca }
      );
    }
    faces = next;
  }

  // Extract unique edges for wireframe rendering
  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  for (const f of faces) {
    for (const [i, j] of [
      [f.a, f.b],
      [f.b, f.c],
      [f.c, f.a],
    ] as [number, number][]) {
      const key = i < j ? `${i}_${j}` : `${j}_${i}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([i, j]);
      }
    }
  }

  return { vertices: verts, faces, edges };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Fibonacci Sphere — Golden Ratio point distribution with organic jitter
// ═══════════════════════════════════════════════════════════════════════════════

function fibonacciSphere(n: number, jitter = 0.05): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const θ =
      (TWO_PI * i) / PHI + (Math.random() - 0.5) * 2 * jitter;
    const φ =
      Math.acos(1 - 2 * (i + 0.5) / n) +
      (Math.random() - 0.5) * 2 * jitter;
    pts.push(
      v3(
        Math.sin(φ) * Math.cos(θ),
        Math.cos(φ),
        Math.sin(φ) * Math.sin(θ)
      )
    );
  }
  return pts;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Icon Loader — Simple Icons CDN with CORS
// ═══════════════════════════════════════════════════════════════════════════════

function loadIconImage(skill: Skill): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    // Use custom iconUrl if provided, otherwise Simple Icons CDN
    img.src = skill.iconUrl || `https://cdn.simpleicons.org/${skill.slug}/${skill.color}`;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Pre-compute alpha lookup tables to avoid per-draw string allocation
// ═══════════════════════════════════════════════════════════════════════════════

const ALPHA_STEPS = 32;
const faceAlphaLUT: string[] = [];
const edgeAlphaLUT: string[] = [];
for (let i = 0; i < ALPHA_STEPS; i++) {
  const t = i / (ALPHA_STEPS - 1);
  const faceA = 0.012 + t * 0.035;
  const edgeA = 0.05 + t * 0.16;
  faceAlphaLUT.push(`rgba(255, 80, 50, ${faceA.toFixed(4)})`);
  edgeAlphaLUT.push(`rgba(255, 80, 50, ${edgeA.toFixed(4)})`);
}

function alphaIndex(depthNorm: number): number {
  return Math.min(ALPHA_STEPS - 1, Math.max(0, (depthNorm * (ALPHA_STEPS - 1)) | 0));
}

// ═══════════════════════════════════════════════════════════════════════════════
//  React Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function SkillsGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // ── Mutable State ────────────────────────────────────────────────────────
    let rotY = 0;
    let rotXAngle = -0.2;
    let impulseY = 0;
    let impulseX = 0;
    let animId = 0;
    let lastFrameTime = performance.now();
    let hoveredIdx = -1;
    let isVisible = true;

    const drag: DragState = {
      active: false,
      lastX: 0,
      lastY: 0,
      lastTime: 0,
      velY: 0,
      velX: 0,
    };

    // ── Build Geometry (once) ────────────────────────────────────────────────
    const geo = buildGeodesic(SUBDIVISION_LEVEL);

    // ── Build Skill Nodes ────────────────────────────────────────────────────
    const fibPts = fibonacciSphere(skills.length, 0.05);
    const nodes: SkillNode[] = skills.map((skill, i) => ({
      position: v3(
        fibPts[i].x * (1 + NODE_EXTRUSION),
        fibPts[i].y * (1 + NODE_EXTRUSION),
        fibPts[i].z * (1 + NODE_EXTRUSION)
      ),
      skill,
      icon: null,
    }));

    // Load icons (async, graceful fallback to text-only labels)
    for (const node of nodes) {
      loadIconImage(node.skill)
        .then((img) => {
          node.icon = img;
        })
        .catch(() => {
          /* icon stays null – label-only */
        });
    }

    // ── High-DPI Canvas Setup ────────────────────────────────────────────────
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = container!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ── IntersectionObserver: pause rendering when offscreen ─────────────────
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastFrameTime = performance.now(); // reset delta to prevent jump
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    // ── Pointer Event Handlers ───────────────────────────────────────────────
    function onPointerDown(e: PointerEvent) {
      drag.active = true;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      drag.lastTime = performance.now();
      drag.velY = 0;
      drag.velX = 0;
      canvas!.setPointerCapture(e.pointerId);
      canvas!.style.cursor = "grabbing";
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (drag.active) {
        const now = performance.now();
        const dt = Math.max(now - drag.lastTime, 1);
        const dx = e.clientX - drag.lastX;
        const dy = e.clientY - drag.lastY;

        const instantVelY = dx / dt;
        const instantVelX = dy / dt;
        drag.velY = drag.velY * DRAG_SMOOTH + instantVelY * (1 - DRAG_SMOOTH);
        drag.velX = drag.velX * DRAG_SMOOTH + instantVelX * (1 - DRAG_SMOOTH);

        rotY -= dx * 0.005;
        rotXAngle += dy * 0.003;
        rotXAngle = Math.max(-1.2, Math.min(1.2, rotXAngle));

        drag.lastX = e.clientX;
        drag.lastY = e.clientY;
        drag.lastTime = now;
      } else {
        hitTest(mx, my);
      }
    }

    function onPointerUp() {
      if (drag.active) {
        drag.active = false;
        const elapsed = performance.now() - drag.lastTime;
        if (elapsed > STALE_THRESHOLD_MS) {
          impulseY = 0;
          impulseX = 0;
        } else {
          impulseY = -drag.velY * IMPULSE_SENSITIVITY;
          impulseX = drag.velX * IMPULSE_SENSITIVITY * 0.4;
        }
        canvas!.style.cursor = hoveredIdx >= 0 ? "pointer" : "grab";
      }
    }

    function onClick() {
      if (hoveredIdx >= 0) {
        window.open(nodes[hoveredIdx].skill.url, "_blank", "noopener,noreferrer");
      }
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);
    canvas.addEventListener("click", onClick);

    // ── Hit-Testing ──────────────────────────────────────────────────────────
    let projectedNodes: Projected[] = [];

    function hitTest(mx: number, my: number) {
      hoveredIdx = -1;
      const hitR = ICON_SIZE * 0.75;

      for (let i = projectedNodes.length - 1; i >= 0; i--) {
        const p = projectedNodes[i];
        const w = canvas!.width / dpr;
        const radius = Math.min(w, canvas!.height / dpr) * RADIUS_RATIO;
        if (p.depth > radius * 0.2) continue;
        const dx = mx - p.x;
        const dy = my - p.y;
        const r = hitR * p.scale;
        if (dx * dx + dy * dy < r * r) {
          hoveredIdx = p.nodeIndex;
          break;
        }
      }
      canvas!.style.cursor = hoveredIdx >= 0 ? "pointer" : "grab";
    }

    // ── Pre-allocate reusable arrays ──────────────────────────────────────────
    const tVertsArr: Vec3[] = new Array(geo.vertices.length);
    const pVertsArr: { x: number; y: number; scale: number; depth: number }[] = new Array(geo.vertices.length);
    for (let i = 0; i < geo.vertices.length; i++) {
      tVertsArr[i] = v3(0, 0, 0);
      pVertsArr[i] = { x: 0, y: 0, scale: 0, depth: 0 };
    }

    // ── Render Loop ──────────────────────────────────────────────────────────
    function render() {
      if (!isVisible) return; // Don't schedule next frame if offscreen

      const now = performance.now();
      const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;

      const w = canvas!.width / dpr;
      const h = canvas!.height / dpr;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * RADIUS_RATIO;

      // ── Physics update ─────────────────────────────────────────────────
      if (!drag.active) {
        rotY += (BASE_OMEGA + impulseY) * dt;
        rotXAngle += impulseX * dt;
        rotXAngle = Math.max(-1.2, Math.min(1.2, rotXAngle));
        const decay = Math.exp(-DAMPING_B * dt);
        impulseY *= decay;
        impulseX *= decay;
      }

      // ── Clear ──────────────────────────────────────────────────────────
      ctx!.clearRect(0, 0, w, h);

      // ── Transform mesh vertices (in-place, no allocation) ──────────────
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotXAngle), sinX = Math.sin(rotXAngle);

      for (let i = 0; i < geo.vertices.length; i++) {
        const v = geo.vertices[i];
        // rotateY
        const rx = v.x * cosY + v.z * sinY;
        const ry = v.y;
        const rz = -v.x * sinY + v.z * cosY;
        // rotateX
        const fx = rx;
        const fy = ry * cosX - rz * sinX;
        const fz = ry * sinX + rz * cosX;
        // scale
        const sx = fx * radius;
        const sy = fy * radius;
        const sz = fz * radius;
        tVertsArr[i].x = sx;
        tVertsArr[i].y = sy;
        tVertsArr[i].z = sz;
        // project
        const scale = PERSPECTIVE / (PERSPECTIVE + sz);
        pVertsArr[i].x = cx + sx * scale;
        pVertsArr[i].y = cy + sy * scale;
        pVertsArr[i].scale = scale;
        pVertsArr[i].depth = sz;
      }

      // ── Draw mesh wireframe edges (NO shadowBlur — major perf win) ─────
      ctx!.lineWidth = 0.6;
      for (const [i, j] of geo.edges) {
        const pa = pVertsArr[i];
        const pb = pVertsArr[j];
        const avgZ = (tVertsArr[i].z + tVertsArr[j].z) / 2;
        const depthNorm = 1 - (avgZ / radius + 1) / 2;

        ctx!.beginPath();
        ctx!.moveTo(pa.x, pa.y);
        ctx!.lineTo(pb.x, pb.y);
        ctx!.strokeStyle = edgeAlphaLUT[alphaIndex(depthNorm)];
        ctx!.stroke();
      }

      // ── Transform & project skill nodes ────────────────────────────────
      projectedNodes = nodes.map((node, idx) => {
        const v = node.position;
        const rx = v.x * cosY + v.z * sinY;
        const ry = v.y;
        const rz = -v.x * sinY + v.z * cosY;
        const fx = rx;
        const fy = ry * cosX - rz * sinX;
        const fz = ry * sinX + rz * cosX;
        const sx = fx * radius, sy = fy * radius, sz = fz * radius;
        const scale = PERSPECTIVE / (PERSPECTIVE + sz);
        return {
          x: cx + sx * scale,
          y: cy + sy * scale,
          scale,
          depth: sz,
          nodeIndex: idx,
        };
      });
      projectedNodes.sort((a, b) => b.depth - a.depth);

      // ── Draw skill nodes ───────────────────────────────────────────────
      ctx!.textAlign = "center";
      ctx!.textBaseline = "top";

      for (const pn of projectedNodes) {
        const node = nodes[pn.nodeIndex];
        const depthNorm = (pn.depth / radius + 1) / 2;
        const opacity = Math.max(0.12, 1 - depthNorm * 0.88);
        const iconScale = pn.scale * (0.65 + (1 - depthNorm) * 0.55);
        const size = ICON_SIZE * iconScale;
        const isHovered = hoveredIdx === pn.nodeIndex;

        ctx!.globalAlpha = opacity;

        // Hover glow (lightweight — no shadowBlur)
        if (isHovered && depthNorm < 0.6) {
          ctx!.globalAlpha = 0.12;
          ctx!.beginPath();
          ctx!.arc(pn.x, pn.y, size * 0.8, 0, TWO_PI);
          ctx!.fillStyle = "rgba(255, 255, 255, 0.5)";
          ctx!.fill();
          ctx!.globalAlpha = 1;
        }

        // Icon
        if (node.icon) {
          ctx!.drawImage(
            node.icon,
            pn.x - size / 2,
            pn.y - size / 2,
            size,
            size
          );
        } else {
          ctx!.beginPath();
          ctx!.arc(pn.x, pn.y, size * 0.3, 0, TWO_PI);
          ctx!.fillStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
          ctx!.fill();
        }

        // Label
        const fontSize = Math.max(8, 11 * iconScale);
        ctx!.font = `500 ${fontSize | 0}px ui-monospace, SFMono-Regular, "SF Mono", monospace`;
        ctx!.fillStyle =
          isHovered && depthNorm < 0.6
            ? "#ffffff"
            : depthNorm < 0.5
              ? LABEL_FRONT
              : LABEL_BACK;

        if (isHovered && depthNorm < 0.6) ctx!.globalAlpha = 1;
        ctx!.fillText(node.skill.name, pn.x, pn.y + size / 2 + 4);
      }

      ctx!.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden bg-[rgba(19,20,26,0.75)] border border-white/[0.06] shadow-2xl">
      {/* Grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Header: CPU icon ▸ # ▸ Skills.json */}
      <div className="absolute top-0 left-0 right-0 p-5 z-20 flex items-center pointer-events-none">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-[#ff5032]" />
          <span className="text-gray-500 font-mono">#</span>
          <span className="text-gray-200 font-mono font-medium tracking-wide">
            Skills.json
          </span>
        </div>
      </div>

      {/* Canvas container — responsive height */}
      <div
        ref={containerRef}
        className="relative w-full z-10"
        style={{ height: "clamp(420px, 55vw, 650px)" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none"
          style={{ cursor: "grab" }}
        />
      </div>

      {/* Footer capsule badge */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 shadow-lg">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">
            Drag to explore skills universe
          </span>
        </div>
      </div>
    </div>
  );
}
