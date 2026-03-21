const fs = require('fs');

// Fix leads page
let t = fs.readFileSync('src/app/(admin)/dashboard/leads/page.tsx', 'utf8');
t = t.replace(
  "await sb.from('leads').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', leadId)",
  "await (sb.from('leads') as any).update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', leadId)"
);
t = t.replace(
  "await sb.from('leads').delete().eq('id', leadId)",
  "await (sb.from('leads') as any).delete().eq('id', leadId)"
);
fs.writeFileSync('src/app/(admin)/dashboard/leads/page.tsx', t);
console.log('✅ leads/page.tsx fixed');

// Fix inventory new page
t = fs.readFileSync('src/app/(admin)/dashboard/inventory/new/page.tsx', 'utf8');
t = t.replace(
  "await sb.from('vehicles').insert({",
  "await (sb.from('vehicles') as any).insert({"
);
fs.writeFileSync('src/app/(admin)/dashboard/inventory/new/page.tsx', t);
console.log('✅ inventory/new/page.tsx fixed');

// Fix inventory [id] page
t = fs.readFileSync('src/app/(admin)/dashboard/inventory/[id]/page.tsx', 'utf8');
t = t.replace(
  "await sb.from('vehicles').update({",
  "await (sb.from('vehicles') as any).update({"
);
fs.writeFileSync('src/app/(admin)/dashboard/inventory/[id]/page.tsx', t);
console.log('✅ inventory/[id]/page.tsx fixed');

// Fix inventory list page
t = fs.readFileSync('src/app/(admin)/dashboard/inventory/page.tsx', 'utf8');
t = t.replace("await sb.from('vehicles').delete()", "await (sb.from('vehicles') as any).delete()");
t = t.replace("await sb.from('vehicles').update(", "await (sb.from('vehicles') as any).update(");
fs.writeFileSync('src/app/(admin)/dashboard/inventory/page.tsx', t);
console.log('✅ inventory/page.tsx fixed');

console.log('\n🎉 All TypeScript fixes applied - run npm run build');
