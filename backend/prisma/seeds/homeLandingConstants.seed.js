import prisma from '#prisma/client'

// Constants introduced by the landing-page revamp (Figma frame 1:2).
//
// Kept separate from globalConstants.seed.js on purpose: that seed overwrites
// `value` on every run, which would wipe admin edits. Here the upsert leaves an
// existing row untouched, so re-running only fills in keys that are missing.
export async function seedHomeLandingConstants() {
  console.log('Seeding landing page constants...')

  const constants = [
    // Navigation links in the landing header.
    {
      key: 'home_nav_items',
      value: JSON.stringify([
        { label: 'Tentang', target: 'about' },
        { label: 'Fitur', target: 'features' },
        { label: 'Produk', target: 'pricing' },
        { label: 'FAQ', target: 'faq' },
      ]),
    },

    // Event section. The public events endpoint requires a login, so the
    // landing page reads this list instead.
    {
      key: 'home_event_items',
      value: JSON.stringify([
        {
          title: 'Nama Event',
          description: 'Deskripsi singkat webinar akan ditempatkan di sini oleh tim MedPal.',
          status: 'Gratis',
          date: 'Tanggal Menyusul',
          url: '',
        },
        {
          title: 'Nama Event',
          description: 'Deskripsi singkat webinar akan ditempatkan di sini oleh tim MedPal.',
          status: 'Gratis',
          date: 'Tanggal Menyusul',
          url: '',
        },
        {
          title: 'Nama Event',
          description: 'Deskripsi singkat webinar akan ditempatkan di sini oleh tim MedPal.',
          status: 'Gratis',
          date: 'Tanggal Menyusul',
          url: '',
        },
      ]),
    },

    // Challenge section — same reasoning as events.
    {
      key: 'home_challenge_items',
      value: JSON.stringify([
        {
          title: 'Nama Challenge',
          description: 'Deskripsi singkat challenge akan ditempatkan di sini oleh tim MedPal.',
          status: 'Sedang Berlangsung',
          duration: '7 Hari',
          participants: '120',
          cost: 'Gratis',
          url: '',
        },
        {
          title: 'Nama Challenge',
          description: 'Deskripsi singkat challenge akan ditempatkan di sini oleh tim MedPal.',
          status: 'Segera Dibuka',
          duration: '14 Hari',
          participants: '80',
          cost: 'Gratis',
          url: '',
        },
      ]),
    },

    // Testimonial section.
    {
      key: 'home_testimonial_items',
      value: JSON.stringify([
        {
          quote: 'Testimoni pengguna akan ditempatkan di sini oleh tim MedPal.',
          name: 'Nama Pengguna',
          detail: 'Mahasiswa Kedokteran',
          rating: 5,
        },
        {
          quote: 'Testimoni pengguna akan ditempatkan di sini oleh tim MedPal.',
          name: 'Nama Pengguna',
          detail: 'Mahasiswa Kedokteran',
          rating: 5,
        },
        {
          quote: 'Testimoni pengguna akan ditempatkan di sini oleh tim MedPal.',
          name: 'Nama Pengguna',
          detail: 'Mahasiswa Kedokteran',
          rating: 5,
        },
      ]),
    },
  ]

  for (const constant of constants) {
    await prisma.constants.upsert({
      where: { key: constant.key },
      // Intentionally empty: never clobber a value an admin has already set.
      update: {},
      create: constant,
    })
    console.log(`✓ Seeded constant: ${constant.key}`)
  }

  console.log('Landing page constants seeding completed!')
}

// Run if called directly
seedHomeLandingConstants()
  .then(async () => {
    console.log('Done!')
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Error seeding landing page constants:', error)
    await prisma.$disconnect()
    process.exit(1)
  })
