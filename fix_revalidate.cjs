const fs = require('fs');

const files = [
  'src/app/(public)/page.jsx',
  'src/app/(public)/inventory/page.jsx',
];

for (const file of files) {
  let t = fs.readFileSync(file, 'utf8');
  t = t.replace(
    'export const dynamic = "force-dynamic"',
    'export const dynamic = "force-dynamic"\nexport const revalidate = 0'
  );
  fs.writeFileSync(file, t);
  console.log('Fixed: ' + file);
}

console.log('Done - revalidate=0 added to both pages');
