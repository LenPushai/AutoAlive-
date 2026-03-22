const fs = require('fs');

const files = [
  'src/app/(public)/page.jsx',
  'src/app/(public)/inventory/page.jsx',
];

for (const file of files) {
  let t = fs.readFileSync(file, 'utf8');
  
  // Remove the force-dynamic line wherever it is
  t = t.replace(/export const dynamic = "force-dynamic"\n\n/g, '');
  t = t.replace(/export const dynamic = "force-dynamic"\r\n\r\n/g, '');
  
  // Remove existing "use client" wherever it is
  t = t.replace(/"use client";\n\n/g, '');
  t = t.replace(/"use client"\n\n/g, '');
  t = t.replace(/"use client";\r\n\r\n/g, '');
  t = t.replace(/"use client"\r\n\r\n/g, '');
  t = t.replace(/"use client";\n/g, '');
  t = t.replace(/"use client"\n/g, '');

  // Add both in correct order at the very top
  t = '"use client"\n\nexport const dynamic = "force-dynamic"\n\n' + t;
  
  fs.writeFileSync(file, t);
  console.log('Fixed: ' + file);
}

console.log('Done - use client is now first in both files');
