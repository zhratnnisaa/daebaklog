import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding started...");
  // Clear existing data
  await prisma.song.deleteMany({});
  await prisma.albumOrder.deleteMany({});
  await prisma.album.deleteMany({});
  await prisma.ticketOrder.deleteMany({});
  await prisma.concert.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.fandomPhoto.deleteMany({});
  await prisma.comebackSchedule.deleteMany({});
  await prisma.boyGroup.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Existing data cleared.");
  
  // Seed Users
  const userPassword = await bcrypt.hash("user123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      name: "Budi K-Popers",
      email: "user@gmail.com",
      password: userPassword,
      role: "USER"
    }
  });

  await prisma.user.create({
    data: {
      name: "Administrator",
      email: "admin123",
      password: adminPassword,
      role: "ADMIN"
    }
  });

  console.log("Users seeded.");

  // Seed BoyGroups
  const bts = await prisma.boyGroup.create({
    data: {
      name: "BTS",
      agency: "BIGHIT MUSIC",
      debutYear: 2013,
      description: "BTS (Bangtan Sonyeondan), juga dikenal sebagai Bangtan Boys, adalah grup vokal pria asal Korea Selatan yang dibentuk oleh Big Hit Entertainment pada tahun 2013. Grup ini terdiri dari tujuh anggota: RM, Jin, Suga, J-Hope, Jimin, V, dan Jungkook.",
      logoUrl: "https://utfs.io/f/b2a758d4-539c-473d-8854-f5c786a34cdb-bts.png"
    }
  });

  const seventeen = await prisma.boyGroup.create({
    data: {
      name: "SEVENTEEN",
      agency: "PLEDIS Entertainment",
      debutYear: 2015,
      description: "SEVENTEEN adalah grup vokal pria beranggotakan 13 orang asal Korea Selatan yang dibentuk oleh Pledis Entertainment. Grup ini terbagi menjadi tiga unit khusus: hip-hop unit, vocal unit, dan performance unit.",
      logoUrl: "https://utfs.io/f/9de67be9-338f-41cc-b2d9-1bc9cd3b0922-svt.png"
    }
  });

  const straykids = await prisma.boyGroup.create({
    data: {
      name: "Stray Kids",
      agency: "JYP Entertainment",
      debutYear: 2018,
      description: "Stray Kids adalah grup vokal pria asal Korea Selatan yang dibentuk oleh JYP Entertainment melalui acara survival dengan nama yang sama pada tahun 2017. Grup ini aktif sejak debut tahun 2018.",
      logoUrl: "https://utfs.io/f/2df37b4b-91cc-4903-8d65-b778263ca776-skz.png"
    }
  });

  const enhypen = await prisma.boyGroup.create({
    data: {
      name: "ENHYPEN",
      agency: "BELIFT LAB",
      debutYear: 2020,
      description: "ENHYPEN adalah grup vokal pria asal Korea Selatan yang dibentuk oleh Belift Lab (kolaborasi CJ ENM dan HYBE) melalui ajang survival I-LAND pada tahun 2020.",
      logoUrl: "https://utfs.io/f/5df87e2b-231f-490b-9ee5-c729221ca942-en.png"
    }
  });

  console.log("BoyGroups seeded.");

  // Seed Members
  // BTS
  await prisma.member.createMany({
    data: [
      {
        boyGroupId: bts.id,
        stageName: "Jungkook",
        realName: "Jeon Jung-kook",
        birthDate: new Date("1997-09-01"),
        position: "Main Vocalist, Lead Dancer, Center",
        favoriteFood: "Ramen, Pizza, Sup Babi, Ayam Goreng",
        funFact: "Dia sering dijuluki 'Golden Maknae' karena memiliki banyak talenta mulai dari menyanyi, menari, menggambar, hingga olahraga.",
        photoUrl: "https://utfs.io/f/a44db609-b6eb-46c5-af41-c793f77395db-jk.png"
      },
      {
        boyGroupId: bts.id,
        stageName: "V",
        realName: "Kim Tae-hyung",
        birthDate: new Date("1995-12-30"),
        position: "Lead Dancer, Sub Vocalist, Visual",
        favoriteFood: "Japchae, Segala jenis daging kepiting",
        funFact: "V menyukai seni lukis, fotografi, dan musik jazz klasik. Dia juga pernah berakting di drama Hwarang.",
        photoUrl: "https://utfs.io/f/a44db609-b6eb-46c5-af41-c793f77395db-v.png"
      },
      {
        boyGroupId: bts.id,
        stageName: "Jimin",
        realName: "Park Ji-min",
        birthDate: new Date("1995-10-13"),
        position: "Main Dancer, Lead Vocalist",
        favoriteFood: "Daging babi, Bebek, Ayam, Kimchi Jjigae",
        funFact: "Jimin adalah siswa terbaik dalam tari kontemporer di Busan High School of Arts sebelum debut bersama BTS.",
        photoUrl: "https://utfs.io/f/a44db609-b6eb-46c5-af41-c793f77395db-jm.png"
      }
    ]
  });

  // SEVENTEEN
  await prisma.member.createMany({
    data: [
      {
        boyGroupId: seventeen.id,
        stageName: "Hoshi",
        realName: "Kwon Soon-young",
        birthDate: new Date("1996-06-15"),
        position: "Performance Team Leader, Main Dancer, Lead Vocalist",
        favoriteFood: "Nasi goreng kimchi, Tteokbokki",
        funFact: "Hoshi sangat menyukai harimau (Tiger) dan sering membuat tanda cakar harimau dengan teriakan 'Horanghae' (I tiger you).",
        photoUrl: "https://utfs.io/f/a44db609-b6eb-46c5-af41-c793f77395db-hoshi.png"
      },
      {
        boyGroupId: seventeen.id,
        stageName: "Woozi",
        realName: "Lee Ji-hoon",
        birthDate: new Date("1996-11-22"),
        position: "Vocal Team Leader, Lead Vocalist, Producer",
        favoriteFood: "Galbi (Iga bakar Korea), Jjajangmyeon",
        funFact: "Woozi adalah produser jenius yang memproduksi dan mengaransemen hampir seluruh lagu SEVENTEEN sejak awal debut.",
        photoUrl: "https://utfs.io/f/a44db609-b6eb-46c5-af41-c793f77395db-woozi.png"
      },
      {
        boyGroupId: seventeen.id,
        stageName: "Mingyu",
        realName: "Kim Min-gyu",
        birthDate: new Date("1997-04-06"),
        position: "Lead Rapper, Sub Vocalist, Visual",
        favoriteFood: "Segala jenis daging, Makanan pedas",
        funFact: "Mingyu terkenal sangat tinggi (187 cm) dan sangat pandai memasak, membersihkan asrama, serta memperbaiki barang elektronik.",
        photoUrl: "https://utfs.io/f/a44db609-b6eb-46c5-af41-c793f77395db-mingyu.png"
      }
    ]
  });

  // Stray Kids
  await prisma.member.createMany({
    data: [
      {
        boyGroupId: straykids.id,
        stageName: "Felix",
        realName: "Lee Yong-bok",
        birthDate: new Date("2000-09-15"),
        position: "Lead Dancer, Lead Rapper",
        favoriteFood: "Daging sapi panggang, Sushi, Brownies manis",
        funFact: "Meskipun memiliki wajah yang sangat manis dan berbintik-bintik (freckles) alami, Felix memiliki suara bass yang sangat dalam.",
        photoUrl: "https://utfs.io/f/a44db609-b6eb-46c5-af41-c793f77395db-felix.png"
      },
      {
        boyGroupId: straykids.id,
        stageName: "Bang Chan",
        realName: "Christopher Bang",
        birthDate: new Date("1997-10-03"),
        position: "Leader, Producer, Lead Vocalist, Lead Dancer",
        favoriteFood: "Ramen instan, Ayam goreng Korea",
        funFact: "Bang Chan menjalani masa training selama 7 tahun di JYP. Dia mahir bahasa Inggris, Korea, Jepang, dan sedikit Mandarin.",
        photoUrl: "https://utfs.io/f/a44db609-b6eb-46c5-af41-c793f77395db-chan.png"
      }
    ]
  });

  // ENHYPEN
  await prisma.member.createMany({
    data: [
      {
        boyGroupId: enhypen.id,
        stageName: "Jungwon",
        realName: "Yang Jung-won",
        birthDate: new Date("2004-02-09"),
        position: "Leader, Lead Vocalist, Lead Dancer",
        favoriteFood: "Kari, Samgyeopsal",
        funFact: "Jungwon merupakan mantan atlet Taekwondo berprestasi sebelum terjun penuh waktu menjadi idola.",
        photoUrl: "https://utfs.io/f/a44db609-b6eb-46c5-af41-c793f77395db-jw.png"
      },
      {
        boyGroupId: enhypen.id,
        stageName: "Ni-ki",
        realName: "Nishimura Riki",
        birthDate: new Date("2005-12-09"),
        position: "Main Dancer, Sub Rapper, Maknae",
        favoriteFood: "Mandu (Pangsit Korea), Bungeoppang",
        funFact: "Ni-ki berasal dari Okayama, Jepang. Dia mulai menari sejak usia 3 tahun karena sangat terinspirasi oleh Michael Jackson.",
        photoUrl: "https://utfs.io/f/a44db609-b6eb-46c5-af41-c793f77395db-niki.png"
      }
    ]
  });

  console.log("Members seeded.");

  // Seed Concerts
  await prisma.concert.create({
    data: {
      boyGroupId: bts.id,
      title: "BTS 'Permission to Dance on Stage' - Jakarta",
      date: new Date("2026-11-20T19:00:00Z"),
      location: "Stadion Utama Gelora Bung Karno, Jakarta",
      price: 3500000,
      quota: 100,
      posterUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80"
    }
  });

  await prisma.concert.create({
    data: {
      boyGroupId: seventeen.id,
      title: "SEVENTEEN 'Right Here' World Tour - Jakarta",
      date: new Date("2026-12-12T18:30:00Z"),
      location: "Stadion Madya GBK, Jakarta",
      price: 2800000,
      quota: 150,
      posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80"
    }
  });

  await prisma.concert.create({
    data: {
      boyGroupId: straykids.id,
      title: "Stray Kids 'dominATE' World Tour - Tangerang",
      date: new Date("2026-10-05T19:00:00Z"),
      location: "ICE BSD Hall 5-6, Tangerang",
      price: 2500000,
      quota: 120,
      posterUrl: "https://images.unsplash.com/photo-1542204172-e7052809a8a7?auto=format&fit=crop&w=400&q=80"
    }
  });

  console.log("Concerts seeded.");

  // Seed Albums & Songs
  // BTS Proof
  const a1 = await prisma.album.create({
    data: {
      boyGroupId: bts.id,
      title: "Proof",
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
      price: 540000,
      stock: 45,
      releaseDate: new Date("2022-06-10")
    }
  });

  await prisma.song.createMany({
    data: [
      {
        albumId: a1.id,
        title: "Yet To Come (The Most Beautiful Moment)",
        duration: 193,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      },
      {
        albumId: a1.id,
        title: "Dynamite",
        duration: 199,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
      },
      {
        albumId: a1.id,
        title: "Butter",
        duration: 164,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
      }
    ]
  });

  // SEVENTEEN SPILL THE FEELS
  const a2 = await prisma.album.create({
    data: {
      boyGroupId: seventeen.id,
      title: "SPILL THE FEELS",
      coverUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=400&q=80",
      price: 380000,
      stock: 60,
      releaseDate: new Date("2024-10-14")
    }
  });

  await prisma.song.createMany({
    data: [
      {
        albumId: a2.id,
        title: "LOVE, MONEY, FAME (feat. DJ Khaled)",
        duration: 184,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
      },
      {
        albumId: a2.id,
        title: "Eyes on you",
        duration: 177,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
      }
    ]
  });

  // Stray Kids ATE
  const a3 = await prisma.album.create({
    data: {
      boyGroupId: straykids.id,
      title: "ATE",
      coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
      price: 350000,
      stock: 80,
      releaseDate: new Date("2024-07-19")
    }
  });

  await prisma.song.createMany({
    data: [
      {
        albumId: a3.id,
        title: "Chk Chk Boom",
        duration: 148,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
      },
      {
        albumId: a3.id,
        title: "JJAM",
        duration: 172,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
      }
    ]
  });

  // ENHYPEN ROMANCE : UNTOLD
  const a4 = await prisma.album.create({
    data: {
      boyGroupId: enhypen.id,
      title: "ROMANCE : UNTOLD",
      coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80",
      price: 360000,
      stock: 50,
      releaseDate: new Date("2024-07-12")
    }
  });

  await prisma.song.createMany({
    data: [
      {
        albumId: a4.id,
        title: "XO (Only If You Say Yes)",
        duration: 188,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
      },
      {
        albumId: a4.id,
        title: "Brought The Heat Back",
        duration: 175,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
      }
    ]
  });

  console.log("Albums and Songs seeded.");

  // Seed Fandom Photos
  await prisma.fandomPhoto.createMany({
    data: [
      {
        boyGroupId: bts.id,
        imageUrl: "https://images.unsplash.com/photo-1542204172-e7052809a8a7?auto=format&fit=crop&w=800&q=80",
        caption: "Keindahan lautan Army Bomb ungu di konser dunia BTS."
      },
      {
        boyGroupId: seventeen.id,
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
        caption: "Carat Bong menyala serentak menerangi malam konser SEVENTEEN."
      },
      {
        boyGroupId: straykids.id,
        imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
        caption: "Semangat luar biasa dari para Stay saat meramaikan dome tour Stray Kids."
      },
      {
        boyGroupId: enhypen.id,
        imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80",
        caption: "Konser perdana ENHYPEN dihadiri ribuan Engene dengan lightstick berkilau."
      }
    ]
  });

  console.log("Fandom Photos seeded.");

  // Seed Comeback Schedules
  await prisma.comebackSchedule.createMany({
    data: [
      {
        boyGroupId: bts.id,
        title: "Jin Special Solo Single Debut Release",
        date: new Date("2026-08-15T09:00:00Z"),
        type: "Single"
      },
      {
        boyGroupId: seventeen.id,
        title: "SEVENTEEN New Mini Album & Title MV Release",
        date: new Date("2026-09-10T09:00:00Z"),
        type: "Album"
      },
      {
        boyGroupId: straykids.id,
        title: "Stray Kids New Comeback Teaser #1 Video",
        date: new Date("2026-07-28T15:00:00Z"),
        type: "Teaser"
      },
      {
        boyGroupId: enhypen.id,
        title: "ENHYPEN 'XO' Japanese Version Official MV Release",
        date: new Date("2026-08-05T15:00:00Z"),
        type: "MV"
      }
    ]
  });

  console.log("Comeback Schedules seeded.");
  console.log("Database seeded successfully!");
  
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
