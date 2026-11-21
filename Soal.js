(() => {
  const $ = (s, r = document) => [...r.querySelectorAll(s)],
    id = (x) => document.getElementById(x);
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
    { threshold: 0.05 },
  );
  $(".rv").forEach((e) => io.observe(e));
  $("pre.cb").forEach((p) => {
    const w = document.createElement("div"),
      b = document.createElement("button");
    w.className = "cbw";
    b.className = "cp";
    b.textContent = "Copy";
    b.onclick = () => {
      const t = p.textContent,
        ok = () => {
          b.textContent = "Tersalin!";
          setTimeout(() => (b.textContent = "Copy"), 1200);
        };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok);
      else {
        const a = document.createElement("textarea");
        a.value = t;
        document.body.append(a);
        a.select();
        document.execCommand("copy");
        a.remove();
        ok();
      }
    };
    p.replaceWith(w);
    w.append(p, b);
  });
  $(".tabwrap").forEach((w) => {
    const bs = $(".tabs button", w),
      ps = $(".tp", w);
    w.classList.add("tabs-on");
    bs.forEach(
      (b, i) =>
        (b.onclick = () => {
          bs.forEach((x, k) => x.classList.toggle("on", k == i));
          ps.forEach((p, k) => p.classList.toggle("on", k == i));
        }),
    );
  });
  const hud = () => {
    if (!id("clk")) return;
    const f = Math.min(
        1,
        scrollY / Math.max(1, document.body.scrollHeight - innerHeight),
      ),
      m = 480 + Math.round(f * 540),
      p = 1000000 - Math.round(f * 400) * 1000;
    id("clk").textContent =
      String((m / 60) | 0).padStart(2, 0) + ":" + String(m % 60).padStart(2, 0);
    id("pay").textContent = "Rp" + p.toLocaleString("id-ID") + " / Rp1.000.000";
  };
  addEventListener("scroll", hud, { passive: true });
  hud();
  const parse = (t) => {
    const L = t.trim().split("\n"),
      [n, m, q] = L[0].split(" ").map(Number),
      V = L[1].split(" ");
    return {
      n,
      V,
      E: L.slice(2, 2 + m).map((l) => {
        const [a, b, w] = l.split(" ");
        return [V.indexOf(a), V.indexOf(b), +w];
      }),
      Q: L.slice(2 + m, 2 + m + q).map((l) =>
        l.split(" ").map((c) => V.indexOf(c)),
      ),
    };
  };
  const dj = (g, s, t) => {
    const I = 1e9,
      d = Array(g.n).fill(I),
      p = Array(g.n).fill(-1),
      k = [];
    d[s] = 0;
    for (let i = 0; i < g.n; i++) {
      let u = -1;
      for (let j = 0; j < g.n; j++) if (!k[j] && (u < 0 || d[j] < d[u])) u = j;
      if (d[u] >= I) break;
      k[u] = 1;
      g.E.forEach(([a, b, w]) => {
        if (a == u && d[u] + w < d[b]) {
          d[b] = d[u] + w;
          p[b] = u;
        }
      });
    }
    if (d[t] >= I) return null;
    const r = [];
    for (let c = t; c >= 0; c = p[c]) r.unshift(c);
    return { r, c: d[t] };
  };
  const defs = ["#9db3d8", "#ffaa2b", "#1c5aa8"]
    .map(
      (c, i) =>
        `<marker id="a${i}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`,
    )
    .join("");
  $(".viz").forEach((box) => {
    const g = parse(id(box.dataset.src).textContent),
      n = g.n,
      W = [...Array(n)].map(() => Array(n).fill(0)),
      EL = {};
    let T = [];
    g.E.forEach(([a, b, w]) => (W[a][b] = w));
    const P = g.V.map((_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return [180 + 100 * Math.cos(a), 130 + 95 * Math.sin(a)];
    });
    let h =
      '<svg viewBox="0 0 360 260" role="img" aria-label="Graph contoh"><defs>' +
      defs +
      "</defs>";
    g.E.forEach(([a, b, w]) => {
      const [x1, y1] = P[a],
        [x2, y2] = P[b],
        dx = x2 - x1,
        dy = y2 - y1,
        l = Math.hypot(dx, dy) || 1,
        cx = (x1 + x2) / 2 - (dy / l) * 24,
        cy = (y1 + y2) / 2 + (dx / l) * 24;
      const mv = (x, y, px, py, r) => {
          const d = Math.hypot(cx - px, cy - py) || 1;
          return [px + ((cx - px) / d) * r, py + ((cy - py) / d) * r];
        },
        [sx, sy] = mv(0, 0, x1, y1, 16),
        [ex, ey] = mv(0, 0, x2, y2, 19);
      h += `<g class="e" data-k="${a}-${b}"><path d="M${sx} ${sy}Q${cx} ${cy} ${ex} ${ey}" marker-end="url(#a0)"/><text x="${0.25 * sx + 0.5 * cx + 0.25 * ex}" y="${0.25 * sy + 0.5 * cy + 0.25 * ey + 3}">${w}</text></g>`;
    });
    g.V.forEach(
      (v, i) =>
        (h += `<g class="n"><circle cx="${P[i][0]}" cy="${P[i][1]}" r="15"/><text x="${P[i][0]}" y="${P[i][1] + 5}">${v}</text></g>`),
    );
    h += "</svg>";
    const nm = (p) => p.r.map((i) => g.V[i]).join(" → ");
    box.innerHTML =
      h +
      '<div class="ctl"><button data-b="bfs">▶ BFS</button>' +
      g.Q.map(
        (q, i) =>
          `<button data-b="${i}">Query ${i + 1}: ${g.V[q[0]]}⇄${g.V[q[1]]}</button>`,
      ).join("") +
      '</div><p class="rd">Klik tombol untuk melihat animasinya.</p><p class="lg">🟠 jalur pergi &nbsp; 🔵 jalur kembali</p>';
    $(".e", box).forEach((e) => (EL[e.dataset.k] = e));
    const N = $(".n", box),
      rd = $(".rd", box)[0];
    const clr = () => {
      T.forEach(clearTimeout);
      T = [];
      $(".e", box).forEach((e) => {
        e.setAttribute("class", "e");
        e.firstChild.setAttribute("marker-end", "url(#a0)");
      });
      N.forEach((x) => x.setAttribute("class", "n"));
    };
    const mark = (p, c, k) => {
      for (let i = 0; i + 1 < p.r.length; i++) {
        const e = EL[p.r[i] + "-" + p.r[i + 1]];
        e.setAttribute("class", "e " + c);
        e.firstChild.setAttribute("marker-end", "url(#a" + k + ")");
      }
    };
    $("button", box).forEach(
      (b) =>
        (b.onclick = () => {
          clr();
          if (b.dataset.b == "bfs") {
            const s = [0],
              o = [0],
              v = { 0: 1 };
            rd.textContent = "BFS dari vertex berindeks 0…";
            for (let q = 0; q < s.length; q++)
              for (let j = 0; j < n; j++)
                if (W[s[q]][j] && !v[j]) {
                  v[j] = 1;
                  s.push(j);
                  o.push(j);
                }
            o.forEach((x, i) =>
              T.push(
                setTimeout(() => {
                  N[x].setAttribute("class", "n vis");
                  rd.textContent =
                    "BFS : " +
                    o
                      .slice(0, i + 1)
                      .map((y) => g.V[y])
                      .join(" -> ");
                }, i * 650),
              ),
            );
            return;
          }
          const [a, z] = g.Q[+b.dataset.b];
          N[a].setAttribute("class", "n vis");
          N[z].setAttribute("class", "n vis");
          if (a == z) {
            rd.textContent = "Asal = tujuan → cukup cetak " + g.V[a];
            return;
          }
          const f = dj(g, a, z),
            r = dj(g, z, a);
          if (f) mark(f, "go", 1);
          if (r) mark(r, "back", 2);
          rd.textContent =
            (f ? `Pergi: ${nm(f)} (${f.c})` : "Pergi: tidak ada") +
            " · " +
            (r ? `Kembali: ${nm(r)} (${r.c})` : "Kembali: tidak ada") +
            (f && r ? "" : " → Jalur Pergi/Kembali tidak ditemukan!");
        }),
    );
  });
})();
