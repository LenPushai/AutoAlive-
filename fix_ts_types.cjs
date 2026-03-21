const fs = require('fs');
const path = require('path');

const files = [
  'src/app/api/leads/route.ts',
  'src/app/api/contact/route.ts',
  'src/app/(admin)/dashboard/inventory/new/page.tsx',
  'src/app/(admin)/dashboard/inventory/[id]/page.tsx',
  'src/app/(admin)/dashboard/inventory/page.tsx',
  'src/app/(admin)/dashboard/leads/page.tsx',
  'src/app/(admin)/dashboard/page.tsx',
];

let fixed = 0;
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let t = fs.readFileSync(file, 'utf8');
  const orig = t;
  // Replace all .from('tablename') with (supabase/sb.from('tablename') as any)
  t = t.replace(/\bawait (supabase|sb)\.from\(/g, 'await ($1.from(');
  t = t.replace(/\bawait \((supabase|sb)\.from\(('[^']+'\))/g, 'await ($1.from($2 as any)');
  // Simpler approach - just cast the whole client
  t = t.replace(/(\bsupabase|\bsb)\.from\('vehicles'\)/g, '($1 as any).from(\'vehicles\')');
  t = t.replace(/(\bsupabase|\bsb)\.from\('leads'\)/g, '($1 as any).from(\'leads\')');
  t = t.replace(/(\bsupabase|\bsb)\.from\('vehicles'\)/g, '($1 as any).from(\'vehicles\')');
  if (t !== orig) {
    fs.writeFileSync(file, t);
    console.log('Fixed: ' + file);
    fixed++;
  } else {
    console.log('No change: ' + file);
  }
}
console.log('\nDone - ' + fixed + ' files updated');
