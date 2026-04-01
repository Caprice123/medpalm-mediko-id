import prisma from '#prisma/client'

export async function seedGlobalConstants() {
  console.log('Seeding global constants...')

  const constants = [
    // Hero — Text (used on Home page and Login page)
    {
      key: 'home_hero_badge',
      value: '✨ Platform Medis Berbasis AI',
    },
    {
      key: 'home_hero_title',
      value: 'Better Learning.\nBetter Doctors.\nBetter Lives.',
    },
    {
      key: 'home_hero_subtitle',
      value:
        '18.000+ flashcards, 20.000+ soal UKMPPD, simulasi OSCE AI, dan medical calculator — semua dalam satu platform.',
    },

    // Hero — Feature Slides (used on Home page and as Login feature cards)
    {
      key: 'home_hero_slides',
      value: JSON.stringify([
        {
          icon: '📚',
          label: 'Flashcards',
          title: '18.000+ Flashcards',
          desc: 'Belajar efisien dengan flashcard terstruktur berbasis sistem organ.',
        },
        {
          icon: '📝',
          label: 'Bank Soal',
          title: '20.000+ Soal UKMPPD',
          desc: 'Latihan UKMPPD & ujian blok dengan pembahasan lengkap.',
        },
        {
          icon: '🤖',
          label: 'OSCE AI',
          title: 'Simulasi OSCE AI',
          desc: 'Latihan OSCE dengan pasien virtual berbasis kecerdasan buatan.',
        },
        {
          icon: '🧮',
          label: 'Kalkulator',
          title: 'Medical Calculator',
          desc: 'Kalkulator medis lengkap untuk keperluan klinis sehari-hari.',
        },
      ]),
    },

    // How It Works
    {
      key: 'home_how_it_works_youtube_url',
      value: '',
    },

    // FAQ
    {
      key: 'home_faq_items',
      value: JSON.stringify([
        {
          question: 'Apa itu MedPal?',
          answer:
            'MedPal adalah platform belajar kedokteran berbasis AI yang menyediakan flashcards, bank soal UKMPPD, simulasi OSCE, dan medical calculator dalam satu platform.',
        },
        {
          question: 'Apa itu kredit?',
          answer:
            'Kredit adalah mata uang virtual di MedPal yang digunakan untuk mengakses fitur AI seperti chat assistant dan simulasi OSCE.',
        },
        {
          question: 'Bagaimana cara mendapatkan kredit?',
          answer:
            'Kredit dapat diperoleh melalui paket langganan atau pembelian kredit secara terpisah di halaman Pricing.',
        },
      ]),
    },

    // Social Media
    {
      key: 'home_social_items',
      value: JSON.stringify([]),
    },

    // Login Page — Sign In Card
    {
      key: 'login_signin_title',
      value: 'Selamat Datang Kembali',
    },
    {
      key: 'login_signin_subtitle',
      value: 'Masuk untuk mengakses platform pembelajaran kedokteran berbasis AI',
    },
  ]

  for (const constant of constants) {
    await prisma.constants.upsert({
      where: { key: constant.key },
      update: { value: constant.value },
      create: constant,
    })
    console.log(`✓ Seeded constant: ${constant.key}`)
  }

  console.log('Global constants seeding completed!')
}

// Run if called directly
seedGlobalConstants()
  .then(async () => {
    console.log('Done!')
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Error seeding global constants:', error)
    await prisma.$disconnect()
    process.exit(1)
  })
