const fs = require('fs');
const p = 'src/app/(public)/inventory/[id]/page.jsx';
let c = fs.readFileSync(p, 'utf8');

let marker = 'zoom && images.length > 0 && (';
let idx = c.indexOf(marker);
if (idx === -1) { console.log('Zoom section not found'); process.exit(); }

let start = idx;
let depth = 0;
let end = start;
let foundFirst = false;
for (let i = start; i < c.length; i++) {
  if (c[i] === '(') { depth++; foundFirst = true; }
  if (c[i] === ')') {
    depth--;
    if (foundFirst && depth === 0) { end = i + 1; break; }
  }
}

console.log('Found zoom block from', start, 'to', end);
console.log('Old block preview:', c.substring(start, start + 80) + '...');

let nw = `zoom && images.length > 0 && (<div style={{position:"absolute",left:zoomPos.x+"%",top:zoomPos.y+"%",transform:"translate(-50%, -50%)",width:180,height:180,borderRadius:"50%",border:"3px solid var(--gold)",boxShadow:"0 4px 30px rgba(0,0,0,0.5)",overflow:"hidden",pointerEvents:"none",zIndex:10,backgroundImage:"url("+currentImg+")",backgroundSize:"400%",backgroundPosition:zoomPos.x+"% "+zoomPos.y+"%"}}/>)`;

c = c.substring(0, start) + nw + c.substring(end);
fs.writeFileSync(p, c);
console.log('Magnifier fixed! Total lines:', c.split('\n').length);