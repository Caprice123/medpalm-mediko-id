import prisma from '../client.js'

export async function seedMcqData() {
  console.log('Seeding MCQ topic data...')

  try {
    // Get admin user and tags
    const adminUser = await prisma.users.findFirst({
      where: { role: 'admin' }
    })

    if (!adminUser) {
      console.log('No admin user found. Skipping MCQ seed.')
      return
    }

    // Get university and semester tags
    const universityTagGroup = await prisma.tag_groups.findFirst({
      where: { name: 'university' }
    })

    const semesterTagGroup = await prisma.tag_groups.findFirst({
      where: { name: 'semester' }
    })

    let universityTag, semesterTag

    if (universityTagGroup) {
      universityTag = await prisma.tags.findFirst({
        where: {
          tag_group_id: universityTagGroup.id,
          is_active: true
        }
      })
    }

    if (semesterTagGroup) {
      semesterTag = await prisma.tags.findFirst({
        where: {
          tag_group_id: semesterTagGroup.id,
          is_active: true
        }
      })
    }

    // Create MCQ Topic 1: Sistem Kardiovaskular
    const topic1 = await prisma.mcq_topics.create({
      data: {
        title: 'Sistem Kardiovaskular',
        description: 'Soal pilihan ganda tentang anatomi dan fisiologi sistem kardiovaskular manusia',
        content_type: 'manual',
        quiz_time_limit: 30,
        passing_score: 70,
        status: 'published',
        is_active: true,
        created_by: adminUser.id,
        mcq_questions: {
          create: [
            {
              question: 'Jantung manusia memiliki berapa ruang?',
              options: ['Dua ruang', 'Tiga ruang', 'Empat ruang', 'Lima ruang'],
              correct_answer: 2, // Index 2 = "Empat ruang"
              explanation: 'Jantung manusia terdiri dari 4 ruang: 2 atrium (serambi kanan dan kiri) dan 2 ventrikel (bilik kanan dan kiri). Struktur ini memungkinkan pemisahan darah teroksigenasi dan deoksigenasi secara efisien.',
              order: 0
            },
            {
              question: 'Berapa liter darah yang dipompa jantung per menit pada orang dewasa saat istirahat?',
              options: ['2-3 liter', '3-4 liter', '5-6 liter', '7-8 liter'],
              correct_answer: 2, // Index 2 = "5-6 liter"
              explanation: 'Jantung memompa sekitar 5-6 liter darah per menit saat istirahat pada orang dewasa. Ini dikenal sebagai cardiac output. Saat aktivitas fisik, volume ini dapat meningkat hingga 20-25 liter per menit.',
              order: 1
            },
            {
              question: 'Katup yang terletak antara atrium kanan dan ventrikel kanan disebut?',
              options: ['Katup mitral', 'Katup trikuspid', 'Katup aorta', 'Katup pulmonal'],
              correct_answer: 1, // Index 1 = "Katup trikuspid"
              explanation: 'Katup trikuspid terletak antara atrium kanan dan ventrikel kanan. Nama "trikuspid" berasal dari tiga daun katup (cusp) yang dimilikinya. Katup ini mencegah aliran balik darah dari ventrikel ke atrium.',
              order: 2
            },
            {
              question: 'Arteri yang membawa darah kaya oksigen dari ventrikel kiri ke seluruh tubuh adalah?',
              options: ['Arteri pulmonalis', 'Aorta', 'Vena cava superior', 'Arteri koronaria'],
              correct_answer: 1, // Index 1 = "Aorta"
              explanation: 'Aorta adalah arteri terbesar dalam tubuh yang membawa darah kaya oksigen dari ventrikel kiri ke seluruh tubuh. Aorta bercabang menjadi arteri-arteri yang lebih kecil untuk mendistribusikan darah ke semua organ.',
              order: 3
            },
            {
              question: 'Lapisan otot jantung yang bertanggung jawab untuk kontraksi disebut?',
              options: ['Endokardium', 'Miokardium', 'Perikardium', 'Epikardium'],
              correct_answer: 1, // Index 1 = "Miokardium"
              explanation: 'Miokardium adalah lapisan otot jantung yang tebal dan bertanggung jawab untuk kontraksi jantung. Lapisan ini terdiri dari sel-sel otot jantung khusus yang dapat berkontraksi secara ritmis dan terkoordinasi.',
              order: 4
            }
          ]
        },
        mcq_topic_tags: {
          create: [
            ...(universityTag ? [{ tag_id: universityTag.id }] : []),
            ...(semesterTag ? [{ tag_id: semesterTag.id }] : [])
          ]
        }
      }
    })

    console.log('Created topic:', topic1.title)

    // Create MCQ Topic 2: Sistem Respirasi
    const topic2 = await prisma.mcq_topics.create({
      data: {
        title: 'Sistem Respirasi',
        description: 'Soal pilihan ganda tentang anatomi dan fisiologi sistem pernapasan manusia',
        content_type: 'manual',
        quiz_time_limit: 20,
        passing_score: 65,
        status: 'published',
        is_active: true,
        created_by: adminUser.id,
        mcq_questions: {
          create: [
            {
              question: 'Organ utama dalam sistem respirasi yang bertugas untuk pertukaran gas adalah?',
              options: ['Trakea', 'Bronkus', 'Alveolus', 'Diafragma'],
              correct_answer: 2, // Index 2 = "Alveolus"
              explanation: 'Alveolus adalah kantung-kantung udara kecil di paru-paru tempat terjadinya pertukaran gas antara oksigen dan karbon dioksida. Dinding alveolus sangat tipis dan dikelilingi kapiler darah, memfasilitasi difusi gas.',
              order: 0
            },
            {
              question: 'Proses inspirasi (menarik napas) terjadi ketika?',
              options: [
                'Diafragma relaksasi dan bergerak ke atas',
                'Diafragma berkontraksi dan bergerak ke bawah',
                'Tekanan intra-pulmonal lebih tinggi dari tekanan atmosfer',
                'Volume rongga dada mengecil'
              ],
              correct_answer: 1, // Index 1 = "Diafragma berkontraksi dan bergerak ke bawah"
              explanation: 'Saat inspirasi, diafragma berkontraksi dan bergerak ke bawah, memperbesar volume rongga dada. Ini menurunkan tekanan intra-pulmonal di bawah tekanan atmosfer, sehingga udara masuk ke paru-paru.',
              order: 1
            },
            {
              question: 'Berapa persentase oksigen dalam udara atmosfer yang kita hirup?',
              options: ['10%', '21%', '30%', '40%'],
              correct_answer: 1, // Index 1 = "21%"
              explanation: 'Udara atmosfer mengandung sekitar 21% oksigen, 78% nitrogen, dan 1% gas-gas lain termasuk karbon dioksida. Konsentrasi oksigen ini cukup untuk memenuhi kebutuhan metabolisme tubuh kita.',
              order: 2
            },
            {
              question: 'Struktur yang mencegah makanan masuk ke trakea saat menelan adalah?',
              options: ['Epiglotis', 'Laring', 'Faring', 'Bronkiolus'],
              correct_answer: 0, // Index 0 = "Epiglotis"
              explanation: 'Epiglotis adalah kartilago berbentuk daun yang menutup trakea saat kita menelan. Refleks ini mencegah makanan atau minuman masuk ke saluran pernapasan dan mengarahkannya ke esofagus.',
              order: 3
            },
            {
              question: 'Volume udara normal yang dihirup atau dihembuskan dalam sekali napas biasa disebut?',
              options: ['Volume residu', 'Volume tidal', 'Kapasitas vital', 'Volume cadangan inspirasi'],
              correct_answer: 1, // Index 1 = "Volume tidal"
              explanation: 'Volume tidal adalah volume udara yang masuk atau keluar paru-paru dalam satu kali napas normal, biasanya sekitar 500 ml pada orang dewasa. Ini adalah parameter penting dalam pengukuran fungsi paru.',
              order: 4
            }
          ]
        },
        mcq_topic_tags: {
          create: [
            ...(universityTag ? [{ tag_id: universityTag.id }] : []),
            ...(semesterTag ? [{ tag_id: semesterTag.id }] : [])
          ]
        }
      }
    })

    console.log('Created topic:', topic2.title)

    // Create MCQ Topic 3: Sistem Pencernaan
    const topic3 = await prisma.mcq_topics.create({
      data: {
        title: 'Sistem Pencernaan',
        description: 'Soal pilihan ganda tentang anatomi dan fisiologi sistem pencernaan manusia',
        content_type: 'manual',
        quiz_time_limit: 0, // No time limit
        passing_score: 75,
        status: 'published',
        is_active: true,
        created_by: adminUser.id,
        mcq_questions: {
          create: [
            {
              question: 'Enzim dalam saliva yang memulai pencernaan karbohidrat adalah?',
              options: ['Pepsin', 'Amilase', 'Lipase', 'Tripsin'],
              correct_answer: 1, // Index 1 = "Amilase"
              explanation: 'Amilase saliva (atau ptialin) adalah enzim dalam air liur yang memulai pemecahan karbohidrat kompleks menjadi molekul yang lebih sederhana. Proses ini dimulai di mulut sebelum makanan masuk ke lambung.',
              order: 0
            },
            {
              question: 'pH lambung dalam kondisi normal berkisar antara?',
              options: ['1-3', '4-5', '6-7', '8-9'],
              correct_answer: 0, // Index 0 = "1-3"
              explanation: 'pH lambung sangat asam, berkisar antara 1-3. Kondisi asam ini dihasilkan oleh asam klorida (HCl) yang diproduksi sel parietal lambung. pH rendah ini membantu mencerna protein dan membunuh bakteri.',
              order: 1
            },
            {
              question: 'Organ yang menghasilkan empedu adalah?',
              options: ['Pankreas', 'Lambung', 'Hati', 'Kantung empedu'],
              correct_answer: 2, // Index 2 = "Hati"
              explanation: 'Hati (liver) menghasilkan empedu yang kemudian disimpan di kantung empedu. Empedu berperan dalam mengemulsifikasi lemak sehingga lebih mudah dicerna oleh enzim lipase. Kantung empedu hanya menyimpan dan melepaskan empedu, bukan memproduksinya.',
              order: 2
            }
          ]
        },
        mcq_topic_tags: {
          create: [
            ...(universityTag ? [{ tag_id: universityTag.id }] : []),
            ...(semesterTag ? [{ tag_id: semesterTag.id }] : [])
          ]
        }
      }
    })

    console.log('Created topic:', topic3.title)

    console.log('MCQ data seeding completed successfully!')
    console.log(`Created ${3} topics with multiple questions`)

  } catch (error) {
    console.error('Error seeding MCQ data:', error)
    throw error
  }
}
