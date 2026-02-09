import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // ── Områden (Trygg Nära) ──
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

  console.log(`  ${areas.length} areas created/updated`);

  // Demo-händelser
  const sodermalm = areas[0];
  await prisma.areaEvent.createMany({
    data: [
      {
        areaId: sodermalm.id,
        type: "WARNING",
        status: "APPROVED",
        title: "Inbrott på Hornsgatan",
        description: "Flera bilar uppbrutna under natten mellan tisdag och onsdag.",
        severity: 2,
        reporterName: "Grannsamverkan Söder",
      },
      {
        areaId: sodermalm.id,
        type: "INFO",
        status: "APPROVED",
        title: "Vattenavstängning fredag 14-18",
        description: "Planerat underhåll av vattenledningar på Götgatan 45-67.",
        severity: 1,
      },
      {
        areaId: sodermalm.id,
        type: "NEIGHBOUR_WATCH",
        status: "APPROVED",
        title: "Grannsamverkan möte söndag 10:00",
        description: "Vi träffas i innergården för att planera sommarens aktiviteter.",
        severity: 1,
        reporterName: "Anna K",
      },
      {
        areaId: sodermalm.id,
        type: "TIP",
        status: "APPROVED",
        title: "Lås alltid ytterdörren",
        description: "Påminnelse: stäng och lås alltid porten efter dig, även dagtid.",
        severity: 1,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.areaEvent.create({
    data: {
      areaId: areas[1].id,
      type: "WARNING",
      status: "APPROVED",
      title: "Misstänkt person vid Fridhemsplan",
      description: "Flera grannar har rapporterat en person som ringer på dörrar och utger sig för att vara hantverkare.",
      severity: 2,
      reporterName: "Erik S",
    },
  });

  console.log("  Area events created");

  // ── Lektioner (Captain) ──
  console.log("  Creating lessons with quiz questions...");

  await prisma.lesson.create({
    data: {
      order: 1,
      translations: {
        create: [
          {
            locale: "sv",
            title: "Välkommen till Net Sailor",
            summary: "Lär dig grunderna i digital säkerhet",
            contentMd: `# Välkommen ombord! \u{1F6A2}

Du är nu en **Net Sailor** \u2013 en digital sjöfarare som lär sig navigera säkert på internet.

## Vad är Net Sailor?

Net Sailor hjälper dig att:
- Förstå hur internet fungerar
- Hålla dig säker online
- Bli en ansvarsfull digital medborgare

## Hur fungerar det?

1. **Lär dig** \u2013 Läs varje lektion noggrant
2. **Testa dig** \u2013 Svara på quiz-frågor
3. **Lås upp** \u2013 När du klarar quizet får du tillgång till sociala medier

## Regler för sjöresan

- Var alltid vänlig online
- Dela aldrig personlig information
- Berätta för en vuxen om något känns konstigt

Redo att börja? Låt oss sätta segel! \u26F5`,
          },
          {
            locale: "en",
            title: "Welcome to Net Sailor",
            summary: "Learn the basics of digital safety",
            contentMd: `# Welcome aboard! \u{1F6A2}

You are now a **Net Sailor** \u2013 a digital navigator learning to sail safely on the internet.

## What is Net Sailor?

Net Sailor helps you:
- Understand how the internet works
- Stay safe online
- Become a responsible digital citizen

## How does it work?

1. **Learn** \u2013 Read each lesson carefully
2. **Test yourself** \u2013 Answer quiz questions
3. **Unlock** \u2013 When you pass the quiz, you get access to social media

## Rules for the voyage

- Always be kind online
- Never share personal information
- Tell an adult if something feels wrong

Ready to start? Let's set sail! \u26F5`,
          },
        ],
      },
      questions: {
        create: [
          {
            order: 1,
            correctIndex: 0,
            translations: {
              create: [
                { locale: "sv", prompt: "Vad är det viktigaste när du är på internet?", optionA: "Att vara säker och vänlig", optionB: "Att få många likes", optionC: "Att vara online hela tiden", optionD: "Att ha många följare", explanation: "Säkerhet och vänlighet är alltid viktigast online!" },
                { locale: "en", prompt: "What is most important when you are on the internet?", optionA: "To be safe and kind", optionB: "To get many likes", optionC: "To be online all the time", optionD: "To have many followers", explanation: "Safety and kindness are always most important online!" },
              ],
            },
          },
          {
            order: 2,
            correctIndex: 2,
            translations: {
              create: [
                { locale: "sv", prompt: "Vad ska du göra om något känns konstigt online?", optionA: "Ignorera det", optionB: "Dela det med vänner", optionC: "Berätta för en vuxen", optionD: "Fortsätt som vanligt", explanation: "Berätta alltid för en vuxen du litar på om något känns fel!" },
                { locale: "en", prompt: "What should you do if something feels strange online?", optionA: "Ignore it", optionB: "Share it with friends", optionC: "Tell an adult", optionD: "Continue as usual", explanation: "Always tell a trusted adult if something feels wrong!" },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.lesson.create({
    data: {
      order: 2,
      translations: {
        create: [
          {
            locale: "sv",
            title: "Personlig information",
            summary: "Lär dig vad du får och inte får dela",
            contentMd: `# Skydda din personliga information \u{1F512}

Din personliga information är som en skatt \u2013 du måste skydda den!

## Vad är personlig information?

- Ditt fullständiga namn
- Din adress och telefonnummer
- Din skola
- Ditt födelsedatum
- Lösenord
- Familjemedlemmars information

## Varför är det viktigt?

Om främmande personer får din personliga information kan de:
- Hitta var du bor
- Låtsas vara dig
- Lura dig eller din familj

## Vad får du dela?

\u2705 **OK att dela:** Ditt förnamn (om föräldrarna säger OK), dina intressen och hobbies

\u274C **Dela ALDRIG:** Fullständigt namn, adress, telefonnummer, skola, lösenord

När du är osäker \u2013 fråga alltid en vuxen först! \u{1F6E1}\u{FE0F}`,
          },
          {
            locale: "en",
            title: "Personal Information",
            summary: "Learn what you can and cannot share",
            contentMd: `# Protect your personal information \u{1F512}

Your personal information is like treasure \u2013 you must protect it!

## What is personal information?

- Your full name
- Your address and phone number
- Your school
- Your date of birth
- Passwords
- Family members' information

## Why is it important?

If strangers get your personal information they can:
- Find where you live
- Pretend to be you
- Trick you or your family

## What can you share?

\u2705 **OK to share:** Your first name (if parents say OK), your interests and hobbies

\u274C **NEVER share:** Full name, address, phone number, school, passwords

When in doubt \u2013 always ask an adult first! \u{1F6E1}\u{FE0F}`,
          },
        ],
      },
      questions: {
        create: [
          {
            order: 1,
            correctIndex: 3,
            translations: {
              create: [
                { locale: "sv", prompt: "Vilken information är OK att dela online?", optionA: "Din hemadress", optionB: "Din skola", optionC: "Ditt telefonnummer", optionD: "Dina favoritfilmer", explanation: "Det är säkert att dela dina intressen, men aldrig personlig information som adress eller skola!" },
                { locale: "en", prompt: "Which information is OK to share online?", optionA: "Your home address", optionB: "Your school", optionC: "Your phone number", optionD: "Your favorite movies", explanation: "It is safe to share your interests, but never personal information like address or school!" },
              ],
            },
          },
          {
            order: 2,
            correctIndex: 1,
            translations: {
              create: [
                { locale: "sv", prompt: "Någon online frågar var du bor. Vad gör du?", optionA: "Berättar din adress", optionB: "Säger nej och berättar för en vuxen", optionC: "Berättar bara staden", optionD: "Blockerar och glömmer det", explanation: "Dela aldrig var du bor och berätta alltid för en vuxen när någon frågar!" },
                { locale: "en", prompt: "Someone online asks where you live. What do you do?", optionA: "Tell your address", optionB: "Say no and tell an adult", optionC: "Only tell the city", optionD: "Block and forget it", explanation: "Never share where you live and always tell an adult when someone asks!" },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.lesson.create({
    data: {
      order: 3,
      translations: {
        create: [
          {
            locale: "sv",
            title: "Cybermobbing",
            summary: "Förstå och förhindra nätmobbning",
            contentMd: `# Stoppa cybermobbing \u{1F6D1}

Cybermobbing är när någon är elak mot andra online. Det är aldrig OK!

## Vad är cybermobbing?

- Elaka kommentarer eller meddelanden
- Att sprida rykten online
- Att dela pinsamma bilder utan tillåtelse
- Att utesluta någon med flit
- Att hota eller skrämma någon

## Om du blir mobbad

1. **Svara inte** \u2013 Engagera dig inte med mobbare
2. **Spara bevis** \u2013 Ta skärmdumpar
3. **Blockera** \u2013 Blockera personen
4. **Berätta** \u2013 Prata med en vuxen du litar på

## Var en upstander, inte en bystander!

Du har makten att göra internet till en vänligare plats. \u{1F4AA}`,
          },
          {
            locale: "en",
            title: "Cyberbullying",
            summary: "Understand and prevent online bullying",
            contentMd: `# Stop cyberbullying \u{1F6D1}

Cyberbullying is when someone is mean to others online. It's never OK!

## What is cyberbullying?

- Mean comments or messages
- Spreading rumors online
- Sharing embarrassing pictures without permission
- Excluding someone on purpose
- Threatening or scaring someone

## If you are bullied

1. **Don't respond** \u2013 Don't engage with bullies
2. **Save evidence** \u2013 Take screenshots
3. **Block** \u2013 Block the person
4. **Tell** \u2013 Talk to a trusted adult

## Be an upstander, not a bystander!

You have the power to make the internet a kinder place. \u{1F4AA}`,
          },
        ],
      },
      questions: {
        create: [
          {
            order: 1,
            correctIndex: 2,
            translations: {
              create: [
                { locale: "sv", prompt: "Vad ska du göra om någon mobbar dig online?", optionA: "Mobba tillbaka", optionB: "Ignorera det helt", optionC: "Spara bevis och berätta för en vuxen", optionD: "Ta bort ditt konto", explanation: "Dokumentera alltid mobbning och berätta för en vuxen som kan hjälpa dig!" },
                { locale: "en", prompt: "What should you do if someone bullies you online?", optionA: "Bully back", optionB: "Ignore it completely", optionC: "Save evidence and tell an adult", optionD: "Delete your account", explanation: "Always document bullying and tell an adult who can help you!" },
              ],
            },
          },
          {
            order: 2,
            correctIndex: 1,
            translations: {
              create: [
                { locale: "sv", prompt: "Du ser att någon blir mobbad i en gruppchatt. Vad gör du?", optionA: "Ingenting, det är inte mitt problem", optionB: "Stöttar personen och rapporterar till en vuxen", optionC: "Skrattar med de andra", optionD: "Lämnar gruppen tyst", explanation: "Var en upstander! Stöd offret och rapportera alltid mobbning." },
                { locale: "en", prompt: "You see someone being bullied in a group chat. What do you do?", optionA: "Nothing, it's not my problem", optionB: "Support the person and report to an adult", optionC: "Laugh with the others", optionD: "Leave the group quietly", explanation: "Be an upstander! Support the victim and always report bullying." },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.lesson.create({
    data: {
      order: 4,
      translations: {
        create: [
          {
            locale: "sv",
            title: "Lösenord och säkerhet",
            summary: "Skapa starka lösenord och håll dem säkra",
            contentMd: `# Starka lösenord = Stark säkerhet \u{1F510}

Ditt lösenord är nyckeln till ditt digitala liv. Skydda det!

## Vad är ett starkt lösenord?

- Minst 12 tecken långt
- Stora och små bokstäver
- Siffror och specialtecken (!@#$%)
- INTE ditt namn eller födelsedatum

## Lösenordsregler

1. **Använd olika lösenord** \u2013 Ett för varje konto
2. **Dela ALDRIG** \u2013 Inte ens med bästa vänner
3. **Byt regelbundet** \u2013 Speciellt om något känns konstigt

Ett starkt lösenord är din första försvarslinje online! \u{1F6E1}\u{FE0F}`,
          },
          {
            locale: "en",
            title: "Passwords and Security",
            summary: "Create strong passwords and keep them safe",
            contentMd: `# Strong passwords = Strong security \u{1F510}

Your password is the key to your digital life. Protect it!

## What is a strong password?

- At least 12 characters long
- Uppercase and lowercase letters
- Numbers and special characters (!@#$%)
- NOT your name or birthdate

## Password rules

1. **Use different passwords** \u2013 One for each account
2. **NEVER share** \u2013 Not even with best friends
3. **Change regularly** \u2013 Especially if something feels strange

A strong password is your first line of defense online! \u{1F6E1}\u{FE0F}`,
          },
        ],
      },
      questions: {
        create: [
          {
            order: 1,
            correctIndex: 2,
            translations: {
              create: [
                { locale: "sv", prompt: "Vilket är det starkaste lösenordet?", optionA: "password123", optionB: "mittnamn", optionC: "Tr0ll$k0g!99", optionD: "12345678", explanation: "Ett starkt lösenord kombinerar stora/små bokstäver, siffror och specialtecken!" },
                { locale: "en", prompt: "Which is the strongest password?", optionA: "password123", optionB: "myname", optionC: "Tr0ll$F0r!99", optionD: "12345678", explanation: "A strong password combines uppercase/lowercase letters, numbers and special characters!" },
              ],
            },
          },
          {
            order: 2,
            correctIndex: 0,
            translations: {
              create: [
                { locale: "sv", prompt: "Din bästa vän frågar efter ditt lösenord. Vad gör du?", optionA: "Säger nej, lösenord delas aldrig", optionB: "Delar det, det är ju min bästa vän", optionC: "Delar ett gammalt lösenord", optionD: "Säger att jag glömt det", explanation: "Dela ALDRIG ditt lösenord med någon, inte ens bästa vänner!" },
                { locale: "en", prompt: "Your best friend asks for your password. What do you do?", optionA: "Say no, passwords are never shared", optionB: "Share it, they're my best friend", optionC: "Share an old password", optionD: "Say I forgot it", explanation: "NEVER share your password with anyone, not even best friends!" },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.lesson.create({
    data: {
      order: 5,
      translations: {
        create: [
          {
            locale: "sv",
            title: "Tänk innan du delar",
            summary: "Lär dig att tänka kritiskt innan du postar",
            contentMd: `# Tänk innan du delar! \u{1F914}

Allt du delar online kan stanna där för alltid. Tänk noga!

## Den digitala fotavtrycket

Allt du gör online lämnar ett spår: foton, kommentarer, likes, incheckningar. Detta är ditt **digitala fotavtryck** \u2013 och det kan påverka din framtid!

## Frågor att ställa innan du delar

1. **Är det sant?** \u2013 Dela inte falsk information
2. **Är det snällt?** \u2013 Skulle det såra någon?
3. **Är det nödvändigt?** \u2013 Behöver alla veta detta?
4. **Är det säkert?** \u2013 Delar jag för mycket information?
5. **Skulle mina föräldrar godkänna?**

**Om du inte skulle vilja att det fanns kvar om 10 år \u2013 dela inte!**

Du har kontrollen över ditt digitala fotavtryck. Bygg ett du är stolt över! \u2B50`,
          },
          {
            locale: "en",
            title: "Think Before You Share",
            summary: "Learn to think critically before posting",
            contentMd: `# Think before you share! \u{1F914}

Everything you share online can stay there forever. Think carefully!

## The digital footprint

Everything you do online leaves a trace: photos, comments, likes, check-ins. This is your **digital footprint** \u2013 and it can affect your future!

## Questions to ask before sharing

1. **Is it true?** \u2013 Don't share false information
2. **Is it kind?** \u2013 Would it hurt someone?
3. **Is it necessary?** \u2013 Does everyone need to know this?
4. **Is it safe?** \u2013 Am I sharing too much information?
5. **Would my parents approve?**

**If you wouldn't want it to exist in 10 years \u2013 don't share!**

You control your digital footprint. Build one you're proud of! \u2B50`,
          },
        ],
      },
      questions: {
        create: [
          {
            order: 1,
            correctIndex: 3,
            translations: {
              create: [
                { locale: "sv", prompt: "Innan du delar något online, vad ska du tänka på?", optionA: "Om det får många likes", optionB: "Om det är coolt", optionC: "Om mina vänner gillar det", optionD: "Om det är sant, snällt, nödvändigt och säkert", explanation: "Tänk alltid: Är det sant, snällt, nödvändigt och säkert innan du delar!" },
                { locale: "en", prompt: "Before you share something online, what should you think about?", optionA: "If it gets many likes", optionB: "If it's cool", optionC: "If my friends like it", optionD: "If it's true, kind, necessary and safe", explanation: "Always think: Is it true, kind, necessary and safe before sharing!" },
              ],
            },
          },
          {
            order: 2,
            correctIndex: 1,
            translations: {
              create: [
                { locale: "sv", prompt: "Vad är ett digitalt fotavtryck?", optionA: "En bild på dina fötter", optionB: "Allt du gör och delar online", optionC: "Din profilbild", optionD: "Ditt användarnamn", explanation: "Ditt digitala fotavtryck är allt du gör online \u2013 och det stannar där länge!" },
                { locale: "en", prompt: "What is a digital footprint?", optionA: "A picture of your feet", optionB: "Everything you do and share online", optionC: "Your profile picture", optionD: "Your username", explanation: "Your digital footprint is everything you do online \u2013 and it stays there for a long time!" },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("  5 lessons with quiz questions created (sv + en)");

  // ── Demo Guardian + Kids ──
  console.log("  Creating demo guardian and kids...");

  const demoGuardian = await prisma.guardian.upsert({
    where: { clerkId: "demo_clerk_id" },
    update: {},
    create: {
      clerkId: "demo_clerk_id",
      email: "demo@netsailor.com",
      name: "Demo Guardian",
      locale: "sv",
      kids: {
        create: [
          {
            name: "Emma",
            pinHash: await bcrypt.hash("1234", 10),
            locale: "sv",
            status: "LOCKED",
            currentLessonOrder: 1,
          },
          {
            name: "Lucas",
            pinHash: await bcrypt.hash("5678", 10),
            locale: "sv",
            status: "LOCKED",
            currentLessonOrder: 1,
          },
        ],
      },
    },
    include: { kids: true },
  });

  console.log(`  Demo guardian: ${demoGuardian.email}`);
  console.log(`  Kids: ${demoGuardian.kids.map((k) => k.name).join(", ")}`);
  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
