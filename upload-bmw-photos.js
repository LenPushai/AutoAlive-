/**
 * upload-bmw-photos.js
 * Uploads BMW X5 photos to Supabase Storage and updates the vehicle record.
 *
 * BEFORE RUNNING:
 * 1. Go to Supabase Dashboard > Storage
 * 2. Create a new bucket called "vehicle-photos" (set to PUBLIC)
 * 3. Make sure your .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * USAGE: node upload-bmw-photos.js
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY in .env.local");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

/* Photo mapping: original WhatsApp filename -> clean name + metadata */
const PHOTOS=fs.readdirSync(path.join(__dirname,'bmw-x5-photos')).filter(f=>f.endsWith('.jpeg')).map((f,i)=>({orig:f,clean:'bmw-x5-'+(i+1)+'.jpg',label:'Photo '+(i+1),cat:'E',order:i+1}))

const BUCKET = "vehicle-photos";
const FOLDER = "bmw-x5";

async function main() {
  console.log("\n=== Auto Alive Photo Upload ===\n");

  /* Step 1: Find photos locally */
  const photoDir = path.join(__dirname, "public", "images", "vehicles");
  const uploadsDir = path.join(__dirname);

  /* Try multiple possible locations for the original photos */
  let sourceDir = null;
  const possibleDirs = [
    path.join(__dirname, "bmw-x5-photos"),
    path.join(__dirname, "public", "images", "vehicles", "bmw-x5"),
    path.join(process.env.USERPROFILE || "", "Downloads", "bmw-x5-photos"),
  ];

  for (const dir of possibleDirs) {
    if (fs.existsSync(dir)) {
      sourceDir = dir;
      console.log("Found photos in:", dir);
      break;
    }
  }

  /* If no renamed photos found, use original WhatsApp files from project root area */
  const useOriginals = !sourceDir;
  if (useOriginals) {
    console.log("No renamed photo folder found. Will use original WhatsApp filenames.");
    console.log("Looking for photos in project root...\n");
  }

  /* Step 2: Upload each photo */
  const uploadedUrls = [];
  let successCount = 0;

  for (const photo of PHOTOS) {
    let filePath;
    let fileBuffer;

    if (useOriginals) {
      filePath = path.join(__dirname, "bmw-x5-photos", photo.orig);
      if (!fs.existsSync(filePath)) {
        /* Try public/images/vehicles */
        filePath = path.join(__dirname, "public", "images", "vehicles", photo.orig);
      }
    } else {
      filePath = path.join(sourceDir, photo.clean);
    }

    if (!fs.existsSync(filePath)) {
      console.log("  SKIP: " + photo.clean + " (file not found at " + filePath + ")");
      continue;
    }

    fileBuffer = fs.readFileSync(filePath);
    const storagePath = FOLDER + "/" + photo.clean;

    console.log("  Uploading: " + photo.clean + " (" + Math.round(fileBuffer.length / 1024) + " KB)...");

    const { data, error } = await sb.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.log("  ERROR: " + error.message);
      continue;
    }

    const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(storagePath);
    uploadedUrls.push(urlData.publicUrl);
    successCount++;
    console.log("  OK: " + urlData.publicUrl);
  }

  console.log("\n" + successCount + " / " + PHOTOS.length + " photos uploaded.\n");

  if (uploadedUrls.length === 0) {
    console.log("No photos uploaded. Make sure the photo files are accessible.");
    console.log("\nTo fix: copy the BMW X5 WhatsApp photos into a folder called 'bmw-x5-photos' in your project root.");
    process.exit(1);
  }

  /* Step 3: Find the BMW X5 vehicle record */
  console.log("Looking for BMW X5 in database...");
  const { data: vehicles, error: vErr } = await sb
    .from("vehicles")
    .select("id, make, model, year, variant")
    .ilike("make", "%BMW%")
    .ilike("model", "%X5%");

  if (vErr) {
    console.log("DB error:", vErr.message);
    console.log("\nManual SQL to run in Supabase:");
    console.log("UPDATE vehicles SET");
    console.log("  thumbnail = '" + uploadedUrls[0] + "',");
    console.log("  images = '" + JSON.stringify(uploadedUrls) + "'");
    console.log("WHERE make ILIKE '%BMW%' AND model ILIKE '%X5%';");
    process.exit(0);
  }

  if (!vehicles || vehicles.length === 0) {
    console.log("No BMW X5 found in vehicles table.");
    console.log("\nYou can update any vehicle manually with this SQL in Supabase SQL editor:");
    console.log("UPDATE vehicles SET");
    console.log("  thumbnail = '" + uploadedUrls[0] + "',");
    console.log("  images = '" + JSON.stringify(uploadedUrls) + "'::jsonb");
    console.log("WHERE id = 'YOUR_VEHICLE_ID';");
    process.exit(0);
  }

  const bmw = vehicles[0];
  console.log("Found: " + bmw.year + " " + bmw.make + " " + bmw.model + " (id: " + bmw.id + ")");

  /* Step 4: Update the vehicle record */
  const { error: uErr } = await sb
    .from("vehicles")
    .update({
      thumbnail: uploadedUrls[0],
      images: uploadedUrls,
    })
    .eq("id", bmw.id);

  if (uErr) {
    console.log("Update error:", uErr.message);
    console.log("Try running this SQL manually in Supabase:");
    console.log("UPDATE vehicles SET thumbnail = '" + uploadedUrls[0] + "', images = '" + JSON.stringify(uploadedUrls) + "'::jsonb WHERE id = '" + bmw.id + "';");
  } else {
    console.log("\nVehicle record updated with " + uploadedUrls.length + " photos!");
    console.log("Thumbnail: " + uploadedUrls[0]);
  }

  console.log("\n=== DONE! Restart dev server and check the BMW X5 detail page. ===\n");
}

main().catch(function (e) {
  console.error("Fatal error:", e);
  process.exit(1);
});
