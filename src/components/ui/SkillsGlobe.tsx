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
const BASE_OMEGA = TWO_PI / 90; // Full 360° rotation in 90 seconds ≈ 0.0698 rad/s
const DAMPING_B = Math.log(100) / 2; // ≈ 2.3026 — impulse drops to 1% in ~2s
const IMPULSE_SENSITIVITY = 1.0; // Tuned scale: px/ms → rad/s
const STALE_THRESHOLD_MS = 100; // If pointer idle >100ms before release, zero impulse
const DRAG_SMOOTH = 0.35; // Velocity smoothing factor (0 = no smoothing, 1 = full)

// Visual
const PERSPECTIVE = 800;
const RADIUS_RATIO = 0.34; // Sphere radius as fraction of min(width, height)
const NODE_EXTRUSION = 0.25; // How far nodes float above sphere surface
const ICON_SIZE = 32; // Base icon pixel size
const SUBDIVISION_LEVEL = 2; // Icosahedron subdivision → 162 verts, 320 faces

// Colors
const WIRE_GLOW_COLOR = "rgba(255, 80, 50, 0.12)";
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
//  React Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function SkillsGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Mutable State ────────────────────────────────────────────────────────
    let rotY = 0;
    let rotXAngle = -0.2; // Slight initial tilt for a 3/4 view
    let impulseY = 0;
    let impulseX = 0;
    let animId = 0;
    let lastFrameTime = performance.now();
    let hoveredIdx = -1;

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
    // ALL nodes distributed via Fibonacci sphere, extruded above the mesh hull
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
        const dt = Math.max(now - drag.lastTime, 1); // ms
        const dx = e.clientX - drag.lastX;
        const dy = e.clientY - drag.lastY;

        // Smoothed velocity tracking (exponential moving average)
        const instantVelY = dx / dt;
        const instantVelX = dy / dt;
        drag.velY = drag.velY * DRAG_SMOOTH + instantVelY * (1 - DRAG_SMOOTH);
        drag.velX = drag.velX * DRAG_SMOOTH + instantVelX * (1 - DRAG_SMOOTH);

        // Apply direct rotation while dragging
        // NEGATED dx so horizontal motion follows cursor direction
        rotY -= dx * 0.005;
        rotXAngle += dy * 0.003;
        rotXAngle = Math.max(-1.2, Math.min(1.2, rotXAngle));

        drag.lastX = e.clientX;
        drag.lastY = e.clientY;
        drag.lastTime = now;
      } else {
        // Hover hit-test
        hitTest(mx, my);
      }
    }

    function onPointerUp() {
      if (drag.active) {
        drag.active = false;
        const elapsed = performance.now() - drag.lastTime;
        if (elapsed > STALE_THRESHOLD_MS) {
          // User paused before releasing — no momentum
          impulseY = 0;
          impulseX = 0;
        } else {
          // Convert px/ms velocity → rad/s angular impulse
          // NEGATED Y impulse to match corrected drag direction
          impulseY = -drag.velY * IMPULSE_SENSITIVITY;
          impulseX = drag.velX * IMPULSE_SENSITIVITY * 0.4;
        }
        canvas!.style.cursor = hoveredIdx >= 0 ? "pointer" : "grab";
      }
    }

    function onClick(e: MouseEvent) {
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

      // Check front-most nodes first (iterate from end of back-to-front array)
      for (let i = projectedNodes.length - 1; i >= 0; i--) {
        const p = projectedNodes[i];
        const w = canvas!.width / dpr;
        const radius = Math.min(w, canvas!.height / dpr) * RADIUS_RATIO;
        // Only interact with front-hemisphere nodes
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

    // ── Render Loop ──────────────────────────────────────────────────────────
    function render() {
      const now = performance.now();
      const dt = Math.min((now - lastFrameTime) / 1000, 0.1); // seconds, capped
      lastFrameTime = now;

      const w = canvas!.width / dpr;
      const h = canvas!.height / dpr;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * RADIUS_RATIO;

      // ── Physics update ─────────────────────────────────────────────────
      if (!drag.active) {
        // ω(t) = ω_default + ω_impulse · e^(-b·t)
        rotY += (BASE_OMEGA + impulseY) * dt;
        rotXAngle += impulseX * dt;
        rotXAngle = Math.max(-1.2, Math.min(1.2, rotXAngle));

        // Exponential damped decay
        const decay = Math.exp(-DAMPING_B * dt);
        impulseY *= decay;
        impulseX *= decay;
      }

      // ── Clear ──────────────────────────────────────────────────────────
      ctx!.clearRect(0, 0, w, h);

      // ── Ambient center glow ────────────────────────────────────────────
      const glow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.6);
      glow.addColorStop(0, "rgba(255, 80, 50, 0.04)");
      glow.addColorStop(0.5, "rgba(255, 80, 50, 0.015)");
      glow.addColorStop(1, "transparent");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, w, h);

      // ── Transform mesh vertices ────────────────────────────────────────
      const tVerts = geo.vertices.map((v) => {
        let tv = rotateY(v, rotY);
        tv = rotateX(tv, rotXAngle);
        return v3(tv.x * radius, tv.y * radius, tv.z * radius);
      });
      const pVerts = tVerts.map((v) => project(v, PERSPECTIVE, cx, cy));

      // ── Draw mesh faces (translucent, back-to-front) ───────────────────
      const sortedFaces = geo.faces
        .map((f) => ({
          ...f,
          avgZ: (tVerts[f.a].z + tVerts[f.b].z + tVerts[f.c].z) / 3,
        }))
        .sort((a, b) => b.avgZ - a.avgZ);

      ctx!.save();
      for (const face of sortedFaces) {
        const pa = pVerts[face.a];
        const pb = pVerts[face.b];
        const pc = pVerts[face.c];
        const depthNorm = 1 - (face.avgZ / radius + 1) / 2; // 0→back, 1→front
        const alpha = 0.012 + depthNorm * 0.035;

        ctx!.beginPath();
        ctx!.moveTo(pa.x, pa.y);
        ctx!.lineTo(pb.x, pb.y);
        ctx!.lineTo(pc.x, pc.y);
        ctx!.closePath();
        ctx!.fillStyle = `rgba(255, 80, 50, ${alpha})`;
        ctx!.fill();
      }
      ctx!.restore();

      // ── Draw mesh wireframe edges ──────────────────────────────────────
      ctx!.save();
      ctx!.shadowColor = WIRE_GLOW_COLOR;
      ctx!.shadowBlur = 3;
      ctx!.lineWidth = 0.5;

      for (const [i, j] of geo.edges) {
        const pa = pVerts[i];
        const pb = pVerts[j];
        const avgZ = (tVerts[i].z + tVerts[j].z) / 2;
        const depthNorm = 1 - (avgZ / radius + 1) / 2;
        const alpha = 0.05 + depthNorm * 0.16;

        ctx!.beginPath();
        ctx!.moveTo(pa.x, pa.y);
        ctx!.lineTo(pb.x, pb.y);
        ctx!.strokeStyle = `rgba(255, 80, 50, ${alpha})`;
        ctx!.stroke();
      }
      ctx!.restore();

      // ── Transform & project skill nodes ────────────────────────────────
      projectedNodes = nodes.map((node, idx) => {
        let tv = rotateY(node.position, rotY);
        tv = rotateX(tv, rotXAngle);
        const scaled = v3(tv.x * radius, tv.y * radius, tv.z * radius);
        const p = project(scaled, PERSPECTIVE, cx, cy);
        return { ...p, nodeIndex: idx };
      });
      // Sort back-to-front (painter's algorithm)
      projectedNodes.sort((a, b) => b.depth - a.depth);

      // ── Draw skill nodes ───────────────────────────────────────────────
      ctx!.save();
      ctx!.textAlign = "center";
      ctx!.textBaseline = "top";
      ctx!.imageSmoothingEnabled = true;
      ctx!.imageSmoothingQuality = "high";

      for (const pn of projectedNodes) {
        const node = nodes[pn.nodeIndex];
        const depthNorm = (pn.depth / radius + 1) / 2; // 0→front, 1→back
        const opacity = Math.max(0.12, 1 - depthNorm * 0.88);
        const iconScale = pn.scale * (0.65 + (1 - depthNorm) * 0.55);
        const size = ICON_SIZE * iconScale;
        const isHovered = hoveredIdx === pn.nodeIndex;

        ctx!.globalAlpha = opacity;

        // Hover glow
        if (isHovered && depthNorm < 0.6) {
          ctx!.save();
          ctx!.globalAlpha = 1;
          ctx!.shadowColor = "rgba(255, 255, 255, 0.35)";
          ctx!.shadowBlur = 18;
          ctx!.beginPath();
          ctx!.arc(pn.x, pn.y, size * 0.65, 0, TWO_PI);
          ctx!.fillStyle = "rgba(255, 255, 255, 0.06)";
          ctx!.fill();
          ctx!.restore();
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
          // Placeholder circle while loading
          ctx!.beginPath();
          ctx!.arc(pn.x, pn.y, size * 0.3, 0, TWO_PI);
          ctx!.fillStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
          ctx!.fill();
        }

        // Label
        const fontSize = Math.max(8, 11 * iconScale);
        ctx!.font = `500 ${fontSize.toFixed(1)}px ui-monospace, SFMono-Regular, "SF Mono", monospace`;
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
      ctx!.restore();

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden glass border border-white/[0.06] shadow-2xl">
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
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-lg">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">
            Drag to explore skills universe
          </span>
        </div>
      </div>
    </div>
  );
}
