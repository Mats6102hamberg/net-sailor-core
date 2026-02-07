import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Skapa demo-områden
  const areas = await Promise.all([
    prisma.area.upsert({
      where: { slug: "sodermalm" },
      update: {},
      create: { name: "Södermalm", slug: "sodermalm", lat: 59.3154, lng: 18.0711 },
    }),
    prisma.area.upsert({
      where: { slug: "kungsholmen" },
      update: {},
      create: { name: "Kungsholmen", slug: "kungsholmen", lat: 59.3326, lng: 18.0292 },
    }),
    prisma.area.upsert({
      where: { slug: "vasastan" },
      update: {},
      create: { name: "Vasastan", slug: "vasastan", lat: 59.3450, lng: 18.0500 },
    }),
    prisma.area.upsert({
      where: { slug: "ostermalm" },
      update: {},
      create: { name: "Östermalm", slug: "ostermalm", lat: 59.3386, lng: 18.0890 },
    }),
    prisma.area.upsert({
      where: { slug: "gamla-stan" },
      update: {},
      create: { name: "Gamla Stan", slug: "gamla-stan", lat: 59.3258, lng: 18.0716 },
    }),
  ]);

  console.log(`✅ ${areas.length} områden skapade/uppdaterade`);

  // Skapa demo-händelser för Södermalm
  const sodermalm = areas[0];
  const events = await Promise.all([
    prisma.areaEvent.create({
      data: {
        areaId: sodermalm.id,
        type: "WARNING",
        title: "Inbrott på Hornsgatan",
        description: "Flera bilar uppbrutna under natten mellan tisdag och onsdag. Polisen utreder.",
        severity: 2,
        reporterName: "Grannsamverkan Söder",
      },
    }),
    prisma.areaEvent.create({
      data: {
        areaId: sodermalm.id,
        type: "INFO",
        title: "Vattenavstängning fredag 14-18",
        description: "Planerat underhåll av vattenledningar på Götgatan 45-67.",
        severity: 1,
      },
    }),
    prisma.areaEvent.create({
      data: {
        areaId: sodermalm.id,
        type: "NEIGHBOUR_WATCH",
        title: "Grannsamverkan möte söndag 10:00",
        description: "Vi träffas i innergården för att planera sommarens aktiviteter.",
        severity: 1,
        reporterName: "Anna K",
      },
    }),
    prisma.areaEvent.create({
      data: {
        areaId: sodermalm.id,
        type: "TIP",
        title: "Lås alltid ytterdörren",
        description: "Påminnelse: stäng och lås alltid porten efter dig, även dagtid.",
        severity: 1,
      },
    }),
  ]);

  // En händelse för Kungsholmen
  await prisma.areaEvent.create({
    data: {
      areaId: areas[1].id,
      type: "WARNING",
      title: "Misstänkt person vid Fridhemsplan",
      description: "Flera grannar har rapporterat en person som ringer på dörrar och utger sig för att vara hantverkare.",
      severity: 2,
      reporterName: "Erik S",
    },
  });

  console.log(`✅ ${events.length + 1} händelser skapade`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
