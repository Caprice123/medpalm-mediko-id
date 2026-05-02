import prisma from '#prisma/client'

const banners = [
  {
    unique_id: 'seed-banner-webinar-001',
    title: 'Webinar Medis Eksklusif',
    description: 'Daftar & ikuti webinar langsung dari para dokter dan spesialis terkemuka',
    redirect_url: '/webinar/',
    redirect_label: 'Lihat Webinar',
    gradient_start: '#0369a1',
    gradient_end: '#15803d',
    is_active: true,
    order: 0,
  },
  {
    unique_id: 'seed-banner-flashcard-002',
    title: 'Flashcard Baru Tersedia!',
    description: 'Ratusan flashcard terbaru telah ditambahkan — mulai belajar sekarang',
    redirect_url: '/flashcard/',
    redirect_label: 'Mulai Belajar',
    gradient_start: '#7c3aed',
    gradient_end: '#db2777',
    is_active: true,
    order: 1,
  },
  {
    unique_id: 'seed-banner-promo-003',
    title: 'Promo Langganan Bulan Ini',
    description: 'Dapatkan akses penuh ke semua fitur dengan harga spesial bulan ini',
    redirect_url: '/pricing/',
    redirect_label: 'Lihat Paket',
    gradient_start: '#b45309',
    gradient_end: '#15803d',
    is_active: false,
    order: 2,
  },
]

async function main() {
  console.log('Seeding banners...')

  for (const banner of banners) {
    await prisma.banners.upsert({
      where: { unique_id: banner.unique_id },
      update: {
        title: banner.title,
        description: banner.description,
        redirect_url: banner.redirect_url,
        redirect_label: banner.redirect_label,
        gradient_start: banner.gradient_start,
        gradient_end: banner.gradient_end,
        is_active: banner.is_active,
        order: banner.order,
      },
      create: banner,
    })
    console.log(`  ✓ ${banner.title}`)
  }

  console.log('Banners seeded successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
