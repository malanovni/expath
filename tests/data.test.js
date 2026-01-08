import assert from "node:assert";
import { categories, routes, metroLines, metroGuide, viewBounds } from "../src/data/valencia.js";

// Helper: check if coordinate is within bounds
const within = ([lon, lat], [[minLon, minLat], [maxLon, maxLat]]) =>
  lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;

// Calculate expanded bbox to accommodate all data including airport
const bbox = [
  Math.min(viewBounds[0][0], viewBounds[1][0]) - 0.05, // expand west for airport
  Math.min(viewBounds[0][1], viewBounds[1][1]) - 0.02,
  Math.max(viewBounds[0][0], viewBounds[1][0]) + 0.02,
  Math.max(viewBounds[0][1], viewBounds[1][1]) + 0.02
];

console.log("🧪 Running Valencia Travel Guide data tests...\n");

// ============================================================================
// CATEGORIES TESTS
// ============================================================================
console.log("📍 Testing POI Categories...");

assert.ok(categories.length >= 5, "Should have at least 5 POI categories");
console.log(`  ✓ Found ${categories.length} categories`);

let totalPOIs = 0;
categories.forEach(cat => {
  assert.ok(cat.id, `Category missing id`);
  assert.ok(cat.label, `Category ${cat.id} missing label`);
  assert.ok(cat.iconKey, `Category ${cat.id} missing iconKey`); // Changed from icon to iconKey
  assert.ok(cat.color, `Category ${cat.id} missing color`);
  assert.ok(cat.features.length > 0, `Category ${cat.id} has no features`);

  cat.features.forEach(feature => {
    assert.ok(feature.name, `Feature in ${cat.id} missing name`);
    assert.ok(Array.isArray(feature.coords) && feature.coords.length === 2,
      `Invalid coordinates for ${feature.name}`);
    assert.ok(within(feature.coords, [[bbox[0], bbox[1]], [bbox[2], bbox[3]]]),
      `Coordinates for ${feature.name} outside Valencia bounds`);
    totalPOIs++;
  });

  console.log(`  ✓ ${cat.label}: ${cat.features.length} locations`);
});

console.log(`  ✓ Total POIs: ${totalPOIs}\n`);

// ============================================================================
// ROUTES TESTS
// ============================================================================
console.log("🛤️  Testing Routes...");

assert.ok(routes.length >= 3, "Should have at least 3 routes");
console.log(`  ✓ Found ${routes.length} routes`);

routes.forEach(route => {
  assert.ok(route.id, `Route missing id`);
  assert.ok(route.label, `Route ${route.id} missing label`);
  assert.ok(route.color, `Route ${route.id} missing color`);
  assert.ok(route.coordinates.length >= 2, `Route ${route.id} needs at least 2 points`);

  route.coordinates.forEach((coord, idx) => {
    assert.ok(Array.isArray(coord) && coord.length === 2,
      `Invalid point ${idx} in route ${route.id}`);
    assert.ok(within(coord, [[bbox[0], bbox[1]], [bbox[2], bbox[3]]]),
      `Point ${idx} of route ${route.id} outside bounds`);
  });

  console.log(`  ✓ ${route.label}: ${route.coordinates.length} waypoints`);
});

console.log();

// ============================================================================
// METRO LINES TESTS
// ============================================================================
console.log("🚇 Testing Metro Lines Info...");

assert.ok(metroLines.length >= 6, "Should have at least 6 metro lines");
console.log(`  ✓ Found ${metroLines.length} metro lines`);

metroLines.forEach(line => {
  assert.ok(line.id, `Metro line missing id`);
  assert.ok(line.number, `Metro line ${line.id} missing number`);
  assert.ok(line.name, `Metro line ${line.id} missing name`);
  assert.ok(line.color, `Metro line ${line.id} missing color`);
  assert.ok(line.description, `Metro line ${line.id} missing description`);
  assert.ok(line.keyStations && line.keyStations.length > 0,
    `Metro line ${line.id} missing key stations`);

  console.log(`  ✓ Line ${line.number}: ${line.keyStations.length} key stations`);
});

console.log();

// ============================================================================
// METRO GUIDE TESTS
// ============================================================================
console.log("🎫 Testing Metro Guide Info...");

assert.ok(metroGuide.ticketInfo, "Metro guide missing ticket info");
assert.ok(metroGuide.ticketInfo.zoneA, "Missing Zone A ticket info");
assert.ok(metroGuide.ticketInfo.airport, "Missing airport ticket info");
assert.ok(metroGuide.importantNote, "Missing important note");

console.log("  ✓ Ticket info complete");
console.log("  ✓ Important note present\n");

// ============================================================================
// SUMMARY
// ============================================================================
console.log("═══════════════════════════════════════════════════════════");
console.log("✅ All Valencia Travel Guide data tests passed!");
console.log("═══════════════════════════════════════════════════════════");
