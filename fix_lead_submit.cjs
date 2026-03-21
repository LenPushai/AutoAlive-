const fs = require('fs');
let t = fs.readFileSync('src/app/(public)/inventory/[id]/page.jsx', 'utf8');

const oldSubmit = `  function handleSubmit(e) {
    e.preventDefault();
    var sb = createClient();
    sb.from("leads").insert({
      dealer_id: v.dealer_id,
      vehicle_id: v.id,
      first_name: (form.name || '').split(' ')[0],
      last_name: (form.name || '').split(' ').slice(1).join(' ') || null,
      phone: form.phone,
      email: form.email || null,
      notes: form.msg || null,
      source: "website",
      status: "new",
    }).then(function (r) {
      if (r.error) {
        alert("Something went wrong. Please try WhatsApp instead.");
      } else {
        setSent(true);
      }
    });
  }`;

const newSubmit = `  async function handleSubmit(e) {
    e.preventDefault();
    const sb = createClient();
    const payload = {
      dealer_id: v.dealer_id,
      vehicle_id: v.id,
      first_name: (form.name || '').split(' ')[0],
      last_name: (form.name || '').split(' ').slice(1).join(' ') || null,
      phone: form.phone,
      email: form.email || null,
      notes: form.msg || null,
      source: "website",
      status: "new",
    };
    console.log('=== LEAD INSERT PAYLOAD ===', payload);
    const { data, error } = await sb
      .from('leads')
      .insert(payload)
      .select()
      .single();
    console.log('=== FULL RESPONSE ===', { data, error });
    if (error) {
      console.error('SUPABASE INSERT ERROR:', { code: error.code, message: error.message, details: error.details, hint: error.hint });
      alert('Error ' + error.code + ': ' + error.message);
    } else {
      console.log('Inserted successfully:', data);
      setSent(true);
    }
  }`;

if (t.includes(oldSubmit)) {
  t = t.replace(oldSubmit, newSubmit);
  console.log('Done - handleSubmit patched with async/await + .select()');
} else {
  // try CRLF
  const oldCRLF = oldSubmit.replace(/\n/g, '\r\n');
  if (t.includes(oldCRLF)) {
    t = t.replace(oldCRLF, newSubmit);
    console.log('Done - fixed with CRLF match');
  } else {
    console.log('WARNING - could not find handleSubmit block');
  }
}

fs.writeFileSync('src/app/(public)/inventory/[id]/page.jsx', t);
