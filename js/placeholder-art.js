// LE ROSÈA - abstract line-art "art" blocks stand in for campaign photography.
// Deterministic per seed so the same product looks the same everywhere it appears.

function hashSeed(str){
  let h = 0;
  for (let i = 0; i < str.length; i++){ h = (h * 31 + str.charCodeAt(i)) >>> 0; }
  return h;
}

function roseGlyph(cx, cy, s, stroke, opacity){
  return `<g transform="translate(${cx} ${cy}) scale(${s})" fill="none" stroke="${stroke}" stroke-width="1.1" opacity="${opacity}">
    <path d="M0 -6.5c3.5 0 6.5-2.7 6.5-6.5S3.5-19.5 0-19.5-6.5-16.7-6.5-13 -3.5-6.5 0-6.5z"/>
    <path d="M0-6.5c-3.8 1-6 3.6-6 6.8 0 3.6 3 6.7 6.8 6.4"/>
    <path d="M0-6.5c3.8 1 6 3.6 6 6.8 0 3.6-3 6.7-6.8 6.4"/>
    <path d="M-5.4-10.6c-2.4-1.6-5.6-1.3-7.6.9-2 2.3-1.9 5.7.3 7.8"/>
    <path d="M5.4-10.6c2.4-1.6 5.6-1.3 7.6.9 2 2.3 1.9 5.7-.3 7.8"/>
  </g>`;
}

function variantMarkup(variant, dark){
  const line = dark ? '#D8C7A8' : '#241C18';
  const gold = '#B08A3C';
  const faint = dark ? 0.35 : 0.22;
  const gfaint = 0.55;
  let inner = '';
  switch (variant){
    case 'rose':
      inner = roseGlyph(150, 165, 2.6, line, faint) + roseGlyph(150, 165, 2.6, gold, 0);
      inner += `<circle cx="150" cy="165" r="70" fill="none" stroke="${gold}" stroke-width="0.6" opacity="${gfaint}"/>`;
      break;
    case 'drape':
      inner = Array.from({length: 7}).map((_,i)=>{
        const x = 30 + i*36;
        return `<path d="M${x} 10 C ${x-30} 110, ${x+40} 200, ${x-10} 320" stroke="${line}" stroke-width="1" fill="none" opacity="${faint - i*0.01}"/>`;
      }).join('');
      inner += roseGlyph(150, 60, 1.4, gold, gfaint);
      break;
    case 'botanical':
      inner = `<path d="M20 300 C 80 220, 60 140, 140 90 C 190 60, 230 70, 270 30" stroke="${gold}" stroke-width="1" fill="none" opacity="${gfaint}"/>`;
      for (let i=0;i<6;i++){
        const t = i/5;
        const x = 20 + t*250, y = 300 - t*270;
        inner += `<ellipse cx="${x+ (i%2?14:-14)}" cy="${y-6}" rx="10" ry="5" fill="none" stroke="${line}" stroke-width="0.9" opacity="${faint}" transform="rotate(${i%2?35:-35} ${x} ${y})"/>`;
      }
      inner += roseGlyph(230, 55, 1.6, line, faint);
      break;
    case 'grid':
      inner = Array.from({length: 8}).map((_,r)=>Array.from({length:6}).map((_,c)=>{
        const x = 26 + c*44, y = 24 + r*40;
        return `<circle cx="${x}" cy="${y}" r="2" fill="${line}" opacity="${faint*0.9}"/>`;
      }).join('')).join('');
      inner += roseGlyph(150, 165, 2.2, gold, gfaint);
      break;
    case 'bloom':
    default:
      inner = [[80,90,1.1],[210,70,0.9],[150,190,1.6],[60,250,1],[240,240,1.05]]
        .map(([x,y,s])=>roseGlyph(x,y,s, line, faint)).join('');
      break;
  }
  return `<svg viewBox="0 0 300 330" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${inner}</svg>`;
}

const VARIANTS = ['rose','drape','botanical','grid','bloom'];

function paintArt(el){
  const seedStr = el.getAttribute('data-art') || el.id || Math.random().toString();
  const dark = el.classList.contains('on-dark') || el.hasAttribute('data-art-dark');
  const forced = el.getAttribute('data-art-variant');
  const variant = forced || VARIANTS[hashSeed(seedStr) % VARIANTS.length];
  el.innerHTML = variantMarkup(variant, dark);
  const label = el.getAttribute('data-art-label');
  if (label){
    const span = document.createElement('span');
    span.className = 'art-caption';
    span.textContent = label;
    el.appendChild(span);
  }
}

function initPlaceholderArt(root=document){
  root.querySelectorAll('.art[data-art]').forEach(paintArt);
}

document.addEventListener('DOMContentLoaded', () => initPlaceholderArt());
