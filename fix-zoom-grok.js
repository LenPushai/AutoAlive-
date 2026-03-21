const fs = require('fs');
const p = 'src/app/(public)/inventory/[id]/page.jsx';
let c = fs.readFileSync(p, 'utf8');

// Fix 1: Update zoomPos state to include width/height
c = c.replace(
  'var [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });',
  'var [zoomPos, setZoomPos] = useState({ x: 0, y: 0, width: 0, height: 0 });'
);

// Fix 2: Update handleMouseMove to use pixel coordinates
let hmmStart = c.indexOf('var handleMouseMove = useCallback');
let hmmEnd = c.indexOf(']);', hmmStart) + 3;
c = c.substring(0, hmmStart) +
  'var handleMouseMove = useCallback(function (e) {\n' +
  '    if (!mainImgRef.current) return;\n' +
  '    var rect = mainImgRef.current.getBoundingClientRect();\n' +
  '    var offsetX = e.clientX - rect.left;\n' +
  '    var offsetY = e.clientY - rect.top;\n' +
  '    setZoomPos({ x: offsetX, y: offsetY, width: rect.width, height: rect.height });\n' +
  '  }, []);' +
  c.substring(hmmEnd);

// Fix 3: Update onMouseEnter to also call handleMouseMove
c = c.replace(
  'onMouseEnter={function () { setZoom(true); }}',
  'onMouseEnter={function (e) { setZoom(true); handleMouseMove(e); }}'
);

// Fix 4: Replace the zoom lens block
let zStart = c.indexOf('zoom && images.length > 0 &&');
if (zStart === -1) {
  console.log('Zoom block not found!');
  process.exit(1);
}

// Find the end of the zoom block by matching parens
let depth = 0;
let zEnd = zStart;
let foundFirst = false;
for (let i = zStart; i < c.length; i++) {
  if (c[i] === '(') { depth++; foundFirst = true; }
  if (c[i] === ')') {
    depth--;
    if (foundFirst && depth === 0) { zEnd = i + 1; break; }
  }
}

console.log('Found zoom block from', zStart, 'to', zEnd);

let newZoom = `zoom && images.length > 0 && (
                <div style={{
                  position: "absolute",
                  left: zoomPos.x,
                  top: zoomPos.y,
                  transform: "translate(-50%, -50%)",
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  border: "3px solid var(--gold)",
                  boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
                  overflow: "hidden",
                  pointerEvents: "none",
                  zIndex: 10,
                  backgroundImage: "url(" + currentImg + ")",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: (zoomPos.width * 4) + "px " + (zoomPos.height * 4) + "px",
                  backgroundPosition: "-" + (zoomPos.x * 4 - 90) + "px -" + (zoomPos.y * 4 - 90) + "px",
                }} />
              )`;

c = c.substring(0, zStart) + newZoom + c.substring(zEnd);
fs.writeFileSync(p, c);
console.log('Grok zoom fix applied! All 4 changes made.');