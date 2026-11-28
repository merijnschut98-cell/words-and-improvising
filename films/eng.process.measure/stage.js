// The scenes and cards of the film eng.process.measure (measuring the process
// variables), put into the shared stage (films/eng.process.plant/
// stage-common.js) at its SCENES marker: every helper of the shared stage is
// in scope here. SCN[name] gets the beat b, its progress p, the scene's u and
// clock, and st (the state of the drawing) and vis (the cards' opacities).
/* global SCN, NL, tr, clamp, lerp, f1, txt, rect, path, circ, arrow, set, E, EX, C, span, num, pillsSvg */
// the four variables, each pinned to its instrument on the line
const TAGS = [
  { p: [-56, 0, C.PZ + 22], t: tr('debiet', 'flow'), n: 'F', left: true },
  { p: [-30, 2.2, 74], t: tr('druk', 'pressure'), n: 'P' },
  { p: [70, 12, 50], t: tr('temperatuur', 'temperature'), n: 'T' },
  { p: [C.VAT.c[0] + 46, C.VAT.c[1] + 14, C.LT.z], t: tr('niveau', 'level'), n: 'L', left: true },
];
function unitsSvg() {
  const x = 292;
  const y = 262;
  let out = rect(x, y, 336, 126);
  out += txt(x + 16, y + 30, tr('druk: kracht per oppervlak', 'pressure: force per area'), 20, 'start', 'pl-mute');
  out += txt(x + 16, y + 66, 'bar · kPa · psi', 22, 'start', 'pl-big');
  out += txt(x + 16, y + 102, num('1 bar = 100 kPa ≈ 14,5 psi'), 20, 'start', 'pl-mono');
  return out;
}
// gauge pressure against absolute pressure: two scales side by side, and vacuum below the outside air
function presSvg(step) {
  let out = rect(12, 12, 300, 376);
  out += txt(28, 44, tr('druk', 'pressure'), 20, 'start', 'pl-mute');
  if (step >= 3) out += txt(296, 44, EX, 20, 'end', 'pl-mute');
  const yOf = (barA) => 334 - barA * 66;
  const xa = 80;
  const xg = 236;
  out += path([[xg, yOf(0)], [xg, yOf(3.3)]], 'pl-line') + txt(xg, 88, 'bar(g)', 20, 'middle', 'pl-big');
  for (let v = 0; v <= 3; v++) out += path([[xg - 6, yOf(v)], [xg + 6, yOf(v)]], 'pl-line') + txt(xg + 14, yOf(v) + 7, String(v - 1).replace('-', '−'), 20, 'start', 'pl-mono');
  const xl = step >= 2 ? xa + 6 : xg - 96;
  if (step >= 2) {
    out += path([[xa, yOf(0)], [xa, yOf(3.3)]], 'pl-line') + txt(xa, 88, 'bar(a)', 20, 'middle', 'pl-big');
    for (let v = 0; v <= 3; v++) out += path([[xa - 6, yOf(v)], [xa + 6, yOf(v)]], 'pl-line') + txt(xa - 14, yOf(v) + 7, String(v), 20, 'end', 'pl-mono');
    out += txt(158, yOf(0) + 34, tr('0 = volledig vacuüm', '0 = full vacuum'), 20, 'middle', 'pl-mute');
  }
  out += path([[xl, yOf(1)], [xg - 6, yOf(1)]], 'pl-dim') + txt((xl + xg) / 2, yOf(1) - 10, tr('buitenlucht', 'outside air'), 20, 'middle', 'pl-mute');
  out += path([[xl, yOf(3)], [xg - 6, yOf(3)]], 'pl-accl') + txt((xl + xg) / 2, yOf(3) - 10, tr('manometer', 'gauge'), 20, 'middle', 'pl-on');
  if (step >= 3) {
    out += path([[xa + 6, yOf(0.5)], [xg - 6, yOf(0.5)]], 'pl-accl') + txt(158, yOf(0.5) + 26, tr('vacuüm', 'vacuum'), 20, 'middle', 'pl-on');
    out += txt(xa - 14, yOf(0.5) + 7, num('0,5'), 20, 'end', 'pl-on') + txt(xg + 14, yOf(0.5) + 7, num('−0,5'), 20, 'start', 'pl-on');
  }
  return out;
}
// flow: volume or mass per time, and mass flow = volume flow × density
function flowSvg(step) {
  let out = rect(12, 12, 300, 376);
  out += txt(28, 44, tr('debiet', 'flow'), 20, 'start', 'pl-mute');
  if (step >= 3) out += txt(296, 44, tr('volume of massa?', 'volume or mass?'), 20, 'end', 'pl-on');
  out += txt(28, 76, tr('volume per tijd', 'volume per time'), 20, 'start', 'pl-txt') + txt(28, 100, 'm³/h, l/min', 20, 'start', 'pl-mono');
  out += txt(28, 130, tr('massa per tijd', 'mass per time'), 20, 'start', 'pl-txt') + txt(28, 154, 'kg/h, t/h', 20, 'start', 'pl-mono');
  if (step >= 1) {
    out += path([[28, 170], [296, 170]], 'pl-dim');
    out += txt(28, 198, tr('massadebiet =', 'mass flow ='), 20, 'start', 'pl-txt');
    out += txt(28, 224, tr('volumedebiet × dichtheid', 'volume flow × density'), 20, 'start', 'pl-on');
  }
  if (step >= 2) {
    out += path([[28, 240], [296, 240]], 'pl-dim');
    out += txt(28, 266, tr('water, 1.000 kg/m³', 'water, 1,000 kg/m³'), 20, 'start', 'pl-mono');
    out += txt(28, 292, tr('1 m³/h ≈ 1.000 kg/h', '1 m³/h ≈ 1,000 kg/h'), 21, 'start', 'pl-big');
    out += txt(28, 328, tr('siroop, 1.250 kg/m³', 'syrup, 1,250 kg/m³'), 20, 'start', 'pl-mono');
    out += txt(28, 354, tr('1 m³/h = 1.250 kg/h', '1 m³/h = 1,250 kg/h'), 21, 'start', 'pl-big');
  }
  return out;
}
// four kinds of flow meter, each with a small sketch; the one being named is lit
function metersSvg(step, clockS) {
  let out = rect(12, 12, 340, 376);
  out += txt(28, 44, tr('debietmeters', 'flow meters'), 20, 'start', 'pl-mute');
  const rows = NL
    ? [['magnetisch-inductief', 'meet snelheid', 'niet: zuiver water, olie'], ['Coriolis', 'direct massa, ± 0,1%', 'duizenden euro’s'], ['vortex', 'telt wervels: snelheid'], ['drukverschil', 'drukval bij vernauwing']]
    : [['magnetic', 'measures speed', 'fails: pure water, oil'], ['Coriolis', 'mass directly, ± 0.1%', 'thousands of euros'], ['vortex', 'counts vortices: speed'], ['differential pressure', 'drop at a restriction']];
  const from = [0, 1, 2, 2];
  rows.forEach((r, i) => {
    if (step < from[i]) return;
    const y0 = 56 + i * 82;
    const hot = step === from[i];
    const cy = y0 + 34;
    const ln = hot ? 'pl-accl' : 'pl-line';
    const pipe = () => path([[24, cy - 10], [92, cy - 10]], 'pl-line') + path([[24, cy + 10], [92, cy + 10]], 'pl-line');
    if (i === 0) {
      // coils above and below the pipe, electrodes on its wall
      out += pipe() + rect(46, cy - 24, 24, 8, hot ? 'pl-acc' : 'pl-mid', 2) + rect(46, cy + 16, 24, 8, hot ? 'pl-acc' : 'pl-mid', 2);
      out += circ(58, cy - 10, 3, 'pl-bub') + circ(58, cy + 10, 3, 'pl-bub');
    } else if (i === 1) {
      // a bent tube that vibrates and twists
      const w = hot ? 4 * Math.sin(clockS * 9) : 0;
      const tw = hot ? 2 * Math.sin(clockS * 9 + 0.9) : 0;
      out += path([[24, cy - 12], [42, cy - 12], [42 + w - tw, cy + 18], [74 + w + tw, cy + 18], [74, cy - 12], [92, cy - 12]], ln);
    } else if (i === 2) {
      // a bluff body and the vortices it sheds, alternating above and below
      out += pipe() + `<path class="${hot ? 'pl-acc' : 'pl-mid'}" d="M36 ${cy - 7}L44 ${cy}L36 ${cy + 7}Z"/>`;
      const drift = hot ? (clockS * 10) % 12 : 0;
      for (let j = 0; j < 4; j++) { const x = 50 + j * 12 + drift; if (x < 90) out += circ(x, cy + (j % 2 ? 4 : -4), 3, ln === 'pl-accl' ? 'pl-acc' : 'pl-mid'); }
    } else {
      // an orifice plate with a tapping either side
      out += pipe() + path([[58, cy - 12], [58, cy - 4]], ln) + path([[58, cy + 4], [58, cy + 12]], ln);
      out += path([[44, cy - 10], [44, cy - 24]], 'pl-line') + path([[72, cy - 10], [72, cy - 24]], 'pl-line') + circ(44, cy - 26, 3, 'pl-bub') + circ(72, cy - 26, 3, 'pl-bub');
    }
    out += txt(104, y0 + 24, r[0], 20, 'start', hot ? 'pl-on' : 'pl-txt');
    out += txt(104, y0 + 50, r[1], 20, 'start', 'pl-mute');
    if (r[2]) out += txt(104, y0 + 72, r[2], 20, 'start', 'pl-mute');
  });
  return out;
}
function calSvg() {
  const x = 352;
  let out = rect(x, 284, 276, 104);
  out += txt(x + 16, 314, tr('kalibratie', 'calibration'), 20, 'start', 'pl-on');
  out += txt(x + 16, 344, tr('controle tegen een', 'a check against a'), 20, 'start', 'pl-txt');
  out += txt(x + 16, 370, tr('bekende referentie', 'known reference'), 20, 'start', 'pl-txt');
  return out;
}
// three ways to measure level: pressure at the bottom, radar from the top, a float; and where each is fooled
function lvlmSvg(step, clockS) {
  let out = rect(12, 12, 316, 376);
  out += txt(28, 44, tr('niveau', 'level'), 20, 'start', 'pl-mute');
  const tanks = [28, 128, 228];
  const top = 66;
  const bot = 226;
  const surf = 130;
  tanks.forEach((x, i) => {
    const s = i === 2 && step >= 2 ? surf + 34 : surf; // the float sticks while the product drops away under it
    out += rect(x, top, 80, bot - top, 'pl-wall', 4) + rect(x + 2, s, 76, bot - s - 2, 'pl-liq', 2);
  });
  // pressure: a sensor at the bottom weighs the column above it
  const hot0 = step === 0 || step === 1;
  out += circ(68, bot - 6, 5, 'pl-acc');
  if (step === 1) out += arrow([[96, surf + 4], [96, bot - 10]], 'pl-accl', 6);
  // radar: a horn on top, its pulse down to the surface (or to the foam on it)
  out += `<path class="${step === 0 || step === 2 ? 'pl-acc' : 'pl-mid'}" d="M160 ${top - 2}L176 ${top - 2}L180 ${top + 10}L156 ${top + 10}Z"/>`;
  const foam = step >= 2;
  if (foam) for (let j = 0; j < 9; j++) out += circ(134 + j * 8.4, surf - 5 - (j % 2) * 5, 4.4, 'pl-bub');
  const echo = foam ? surf - 14 : surf - 2;
  const k = (clockS * 0.8) % 1;
  out += path([[168, top + 12], [168, echo]], 'pl-sig') + circ(168, lerp(top + 14, echo, k), 3, 'pl-acc');
  // float: a ball on a guide rod; sticky product holds it up
  out += path([[268, top], [268, bot - 4]], 'pl-line') + circ(268, surf - 6, 9, step === 0 || step === 2 ? 'pl-acc' : 'pl-mid');
  if (step >= 2) out += `<path class="pl-dead" d="M262 ${surf + 4}L274 ${surf + 4}L272 ${surf + 30}L264 ${surf + 30}Z"/>`;
  const lab = NL ? [['druk', 'onderin'], ['radar', 'van boven'], ['vlotter', '']] : [['pressure', 'at bottom'], ['radar', 'from top'], ['float', '']];
  lab.forEach(([a, b2], i) => {
    const x = tanks[i] + 40;
    out += txt(x, 254, a, 20, 'middle', (i === 0 && hot0) || (i > 0 && (step === 0 || step === 2)) ? 'pl-on' : 'pl-txt');
    if (b2) out += txt(x, 278, b2, 20, 'middle', 'pl-mute');
  });
  if (step === 1) out += txt(28, 318, tr('druk = gewicht van de kolom', 'pressure = weight of the column'), 20, 'start', 'pl-on') + txt(28, 346, tr('hoogte klopt alleen', 'height is right only'), 20, 'start', 'pl-mute') + txt(28, 372, tr('bij de juiste dichtheid', 'at the right density'), 20, 'start', 'pl-mute');
  if (step >= 2) out += txt(28, 326, tr('schuim fopt de radar', 'foam fools the radar'), 20, 'start', 'pl-on') + txt(28, 356, tr('kleverig: vlotter zit vast', 'sticky: the float jams'), 20, 'start', 'pl-on');
  return out;
}
// the syrup level: real 2,0 m, shown 2,5 m
function lvlSvg(step) {
  let out = rect(12, 12, 300, 376);
  out += txt(28, 44, tr('niveau op druk', 'level by pressure'), 20, 'start', 'pl-mute') + txt(296, 44, EX, 20, 'end', 'pl-mute');
  const bot = 230;
  const mPer = 54;
  out += rect(44, bot - 3.3 * mPer, 80, 3.3 * mPer, 'pl-wall', 4);
  out += rect(46, bot - 2 * mPer, 76, 2 * mPer - 2, 'pl-liq', 2);
  out += path([[44, bot - 2 * mPer], [124, bot - 2 * mPer]], 'pl-line') + txt(134, bot - 2 * mPer + 6, tr('echt 2,0 m', 'real 2.0 m'), 20, 'start', 'pl-txt');
  out += circ(84, bot - 4, 5, 'pl-acc');
  if (step >= 1) out += txt(134, bot + 2, num('24.525 Pa'), 20, 'start', 'pl-mono');
  if (step >= 2) out += path([[40, bot - 2.5 * mPer], [128, bot - 2.5 * mPer]], 'pl-accl') + txt(134, bot - 2.5 * mPer + 6, tr('scherm 2,5 m', 'screen 2.5 m'), 20, 'start', 'pl-on');
  out += txt(28, 270, num('siroop 1.250 kg/m³').replace('siroop', tr('siroop', 'syrup')), 20, 'start', 'pl-mono');
  if (step >= 1) out += txt(28, 300, num('1.250 × 9,81 × 2,0'), 20, 'start', 'pl-mono');
  if (step >= 2) out += txt(28, 330, num('÷ 1.000 ÷ 9,81 = 2,5 m'), 20, 'start', 'pl-mono');
  if (step >= 3) out += txt(28, 366, tr('de massa klopt wel', 'the mass is still right'), 20, 'start', 'pl-on');
  return out;
}
// a difference of 1 °C is 1 K: the two scales side by side
function tempSvg() {
  let out = rect(12, 12, 300, 376);
  out += txt(28, 44, tr('verschil', 'difference'), 20, 'start', 'pl-mute') + txt(296, 44, '1 °C = 1 K', 22, 'end', 'pl-big');
  const yOf = (c) => 340 - c * 2.4;
  const xc = 100;
  const xk = 220;
  out += path([[xc, yOf(-6)], [xc, yOf(96)]], 'pl-line') + path([[xk, yOf(-6)], [xk, yOf(96)]], 'pl-line');
  out += txt(xc, 96, '°C', 20, 'middle', 'pl-big') + txt(xk, 96, 'K', 20, 'middle', 'pl-big');
  for (const [c, k] of [[20, 293], [80, 353]]) {
    out += path([[xc - 6, yOf(c)], [xc + 6, yOf(c)]], 'pl-line') + path([[xk - 6, yOf(c)], [xk + 6, yOf(c)]], 'pl-line');
    out += txt(xc - 14, yOf(c) + 7, String(c), 20, 'end', 'pl-mono') + txt(xk + 14, yOf(c) + 7, String(k), 20, 'start', 'pl-mono');
  }
  out += path([[xc + 18, yOf(20)], [xc + 18, yOf(80)]], 'pl-accl') + path([[xk - 18, yOf(20)], [xk - 18, yOf(80)]], 'pl-accl');
  out += txt(160, yOf(50) + 8, '+60', 22, 'middle', 'pl-on');
  out += txt(160, 378, tr('verschillen mogen in °C', 'differences may use °C'), 20, 'middle', 'pl-mute');
  return out;
}
// the two common sensors: a Pt100 and a thermocouple
function sensSvg(step) {
  let out = rect(12, 12, 300, 376);
  const row = (y0, hot, icon, lines) => {
    let s = icon;
    lines.forEach((l, i) => { s += txt(124, y0 + 24 + i * 26, l, i ? 20 : 21, 'start', i ? 'pl-mute' : hot ? 'pl-on' : 'pl-txt'); });
    return s;
  };
  // a Pt100: a small ceramic body with the platinum winding, and two leads
  const pt = rect(36, 52, 64, 30, 'pl-wall', 4) + path([[42, 67], [48, 59], [54, 75], [60, 59], [66, 75], [72, 59], [78, 75], [84, 59], [94, 67]], step === 1 ? 'pl-accl' : 'pl-line')
    + path([[36, 62], [24, 62], [24, 110]], 'pl-line') + path([[36, 72], [30, 72], [30, 110]], 'pl-line');
  out += row(32, step === 1, pt, NL ? ['Pt100', 'platina weerstand', '100 Ω bij 0 °C', 'paar tiende graad'] : ['Pt100', 'platinum resistor', '100 Ω at 0 °C', 'a few tenths °C']);
  if (step >= 2) {
    // a thermocouple: two different wires joined at the tip
    const tc = path([[30, 230], [30, 300], [62, 330]], 'pl-line') + path([[94, 230], [94, 300], [62, 330]], 'pl-accl') + circ(62, 330, 6, 'pl-acc');
    out += path([[28, 200], [296, 200]], 'pl-dim');
    out += row(208, true, tc, NL ? ['thermokoppel', 'twee metalen,', 'samen aan de punt', 'groter bereik', 'minder nauwkeurig'] : ['thermocouple', 'two metals,', 'joined at the tip', 'wider range', 'less accurate']);
  }
  return out;
}
// the sensor in its thermowell lags behind the product in a slow flow
function lagSvg(q) {
  let out = rect(12, 12, 300, 236);
  out += txt(28, 44, tr('weinig stroming', 'slow flow'), 20, 'start', 'pl-mute') + txt(296, 44, EX, 20, 'end', 'pl-mute');
  const x0 = 40;
  const x1 = 292;
  const yb = 200;
  out += path([[x0, 60], [x0, yb], [x1, yb]], 'pl-dim') + txt(x1, 228, tr('minuten', 'minutes'), 20, 'end', 'pl-mute');
  const xe = lerp(x0, x1, q);
  const xs = x0 + 50;
  const prod = [];
  const sens = [];
  for (let x = x0; x <= xe; x += 4) {
    prod.push([x, x < xs ? 170 : 84]);
    sens.push([x, x < xs ? 170 : 170 - 86 * (1 - Math.exp(-(x - xs) / 60))]);
  }
  if (prod.length > 1) out += path(prod, 'pl-line') + path(sens, 'pl-accl');
  if (q > 0.4) out += txt(x1, 72, tr('product', 'product'), 20, 'end', 'pl-txt') + txt(x1 - 10, 150, tr('sensor', 'sensor'), 20, 'end', 'pl-on');
  return out;
}

SCN.four = ({ b, p, st, vis }) => {
  st.mix = true;
  const n = b === 0 ? 1 + Math.floor(span(p, 0.15, 0.85) * 3.99) : 4;
  vis.tags = span(b === 0 ? p : 1, 0, 0.1);
  set(E.tags, pillsSvg(TAGS.slice(0, n).map((t, i) => ({ ...t, hot: b === 1 ? i === 1 : i === n - 1 && b === 0 }))));
  vis.units = b === 1 ? span(p, 0, 0.1) : 0;
  if (vis.units > 0.01) set(E.units, unitsSvg());
};
SCN.gauge = ({ b, st, vis }) => {
  st.mix = true;
  vis.pres = 1;
  set(E.pres, presSvg(b + 1));
};
SCN.flow = ({ b, st, vis }) => {
  st.mix = true;
  vis.flow = 1;
  set(E.flow, flowSvg(b));
};
SCN.meters = ({ b, p, clockS, st, vis }) => {
  st.mix = true;
  vis.meters = 1;
  set(E.meters, metersSvg(b, clockS));
  vis.cal = b === 3 ? span(p, 0, 0.1) : 0;
  if (vis.cal > 0.01) set(E.cal, calSvg());
};
SCN.level = ({ b, clockS, st, vis }) => {
  st.mix = true;
  vis.lvlm = 1;
  set(E.lvlm, lvlmSvg(b, clockS));
};
SCN.syrup = ({ b, st, vis }) => {
  st.flow = {};
  st.pump = false;
  st.belt = 0;
  st.level = 2.0 / 3.3;
  st.mark = b >= 2 ? 2.5 / 3.3 : undefined;
  vis.lvl = 1;
  set(E.lvl, lvlSvg(b));
};
SCN.temp = ({ b, p, st, vis }) => {
  st.flow = { fA: 1, fB: 1, fC: 1, fH: 0.7, fR: 0.7 };
  if (b === 3) st.flow = { fA: 0.15, fB: 0.15, fC: 0.15, fH: 0.4, fR: 0.4 };
  vis.temp = b === 0 ? 1 : 0;
  if (vis.temp) set(E.temp, tempSvg());
  vis.sens = b === 1 || b === 2 ? 1 : 0;
  if (vis.sens) set(E.sens, sensSvg(b));
  vis.lag = b === 3 ? span(p, 0, 0.1) : 0;
  if (vis.lag > 0.01) set(E.lag, lagSvg(span(p, 0.05, 0.85)));
};
