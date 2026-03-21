const fs = require('fs');
let t = fs.readFileSync('src/app/(public)/inventory/[id]/page.jsx', 'utf8');

const oldInsert = `      dealer_id: v.dealer_id,
      vehicle_id: v.id,
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email || null,
      notes: form.msg || null,
      source: "website",
      status: "new",`;

const newInsert = `      dealer_id: v.dealer_id,
      vehicle_id: v.id,
      first_name: (form.name || '').split(' ')[0],
      last_name: (form.name || '').split(' ').slice(1).join(' ') || null,
      phone: form.phone,
      email: form.email || null,
      notes: form.msg || null,
      source: "website",
      status: "new",`;

if (t.includes(oldInsert)) {
  t = t.replace(oldInsert, newInsert);
  console.log('Done - lead insert fixed to match schema');
} else {
  console.log('WARNING - old insert not found, checking CRLF...');
  const oldCRLF = oldInsert.replace(/\n/g, '\r\n');
  if (t.includes(oldCRLF)) {
    t = t.replace(oldCRLF, newInsert);
    console.log('Done - fixed with CRLF match');
  } else {
    console.log('FAILED - could not find insert block');
  }
}

fs.writeFileSync('src/app/(public)/inventory/[id]/page.jsx', t);
