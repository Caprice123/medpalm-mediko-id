import prisma from '#client'

const SEED_DATA = [
  {
    name: 'Kardiologi',
    slug: 'fc-seed-kardiologi',
    classification: 'sistem_blok',
    subtopics: [
      {
        name: 'Anatomi Jantung',
        slug: 'fc-seed-kardiologi-anatomi-jantung',
        cards: [
          { front: 'Berapa ruang jantung manusia?', back: '4 ruang: 2 atrium (kanan & kiri) dan 2 ventrikel (kanan & kiri)' },
          { front: 'Katup apa yang memisahkan atrium kiri dan ventrikel kiri?', back: 'Katup mitral (bikuspid) — memiliki 2 daun katup' },
          { front: 'Katup apa yang memisahkan atrium kanan dan ventrikel kanan?', back: 'Katup trikuspid — memiliki 3 daun katup' },
          { front: 'Apa fungsi nodus sinoatrial (SA)?', back: 'Pacemaker alami jantung, menghasilkan impuls 60–100x/menit' },
          { front: 'Ventrikel mana yang memiliki dinding paling tebal dan mengapa?', back: 'Ventrikel kiri — harus memompa darah ke seluruh tubuh melawan tekanan aorta yang tinggi' },
          { front: 'Apa itu chordae tendineae?', back: 'Tali fibrous yang menghubungkan daun katup AV ke muskulus papilaris, mencegah eversi katup saat sistol' },
          { front: 'Apa 3 lapisan dinding jantung dari luar ke dalam?', back: 'Epikardium → Miokardium → Endokardium' },
          { front: 'Darah teroksigenasi dari paru-paru masuk ke jantung melalui apa?', back: 'Vena pulmonalis → atrium kiri → ventrikel kiri → aorta' },
          { front: 'Apa fungsi perikardium?', back: 'Kantong fibrosa pelindung jantung; mengandung cairan perikardial untuk mengurangi gesekan' },
          { front: 'Apa itu nodus AV dan di mana letaknya?', back: 'Nodus atrioventrikular di septum interatrial; memperlambat konduksi impuls dari atrium ke ventrikel' },
        ],
      },
      {
        name: 'Fisiologi Jantung',
        slug: 'fc-seed-kardiologi-fisiologi-jantung',
        cards: [
          { front: 'Apa rumus cardiac output (CO)?', back: 'CO = HR (heart rate) × SV (stroke volume); normal ±5 L/menit' },
          { front: 'Apa yang terjadi pada fase sistol ventrikel?', back: 'Ventrikel berkontraksi, katup AV menutup, katup semilunar membuka, darah dipompa ke aorta/arteri pulmonalis' },
          { front: 'Apa yang dimaksud dengan Frank-Starling law?', back: 'Semakin besar regangan otot jantung saat diastolik (preload ↑), semakin kuat kontraksi sistol' },
          { front: 'Apa itu preload?', back: 'Volume darah di ventrikel pada akhir diastol (end-diastolic volume)' },
          { front: 'Apa itu afterload?', back: 'Resistensi yang harus dilawan ventrikel untuk memompa darah; ditentukan oleh tekanan aorta / SVR' },
          { front: 'Bunyi jantung S1 disebabkan oleh?', back: 'Penutupan katup mitral dan trikuspid pada awal sistol' },
          { front: 'Bunyi jantung S2 disebabkan oleh?', back: 'Penutupan katup aorta dan pulmonal pada awal diastol' },
          { front: 'Apa efek sistem saraf simpatis pada jantung?', back: 'Meningkatkan HR (kronotropi +) dan kekuatan kontraksi (inotropi +) melalui norepinefrin' },
          { front: 'Apa itu ejection fraction (EF) dan nilai normalnya?', back: 'Persentase darah yang dipompa tiap siklus; normal EF kiri ≥55%' },
          { front: 'Ion apa yang berperan pada fase plateau potensial aksi jantung?', back: 'Ca²⁺ masuk melalui kanal L-type, mempertahankan depolarisasi dan memungkinkan kontraksi' },
        ],
      },
      {
        name: 'Aritmia',
        slug: 'fc-seed-kardiologi-aritmia',
        cards: [
          { front: 'Definisi takikardi dan bradikardi?', back: 'Takikardi: HR >100x/menit; Bradikardi: HR <60x/menit' },
          { front: 'Apa itu atrial fibrilasi (AF)?', back: 'Aktivitas listrik atrium yang kacau dan tidak teratur → detak jantung ireguler' },
          { front: 'Komplikasi utama atrial fibrilasi?', back: 'Stroke emboli — trombus terbentuk di aurikel atrium kiri akibat stasis darah' },
          { front: 'Gambaran EKG atrial fibrilasi?', back: 'Tidak ada gelombang P yang jelas, baseline ireguler (fibrillatory waves), interval RR ireguler' },
          { front: 'Apa itu VF (ventricular fibrillation)?', back: 'Kontraksi ventrikel kacau dan tidak efektif — henti jantung, perlu defibrilasi segera' },
          { front: 'Apa itu blok AV derajat 3 (complete heart block)?', back: 'Tidak ada konduksi dari atrium ke ventrikel; atrium & ventrikel berdetak independen' },
          { front: 'Obat pilihan untuk SVT yang gagal dengan manuver vagal?', back: 'Adenosin IV — memblok sementara konduksi nodus AV' },
          { front: 'Apa itu torsades de pointes?', back: 'VT polimorfik dengan QRS berputar di sekitar garis isoelektrik; sering terkait QT memanjang' },
          { front: 'Kapan kardioversi elektrik dilakukan?', back: 'Aritmia dengan hemodinamik tidak stabil (hipotensi, nyeri dada, penurunan kesadaran)' },
          { front: 'Apa gambaran EKG atrial flutter?', back: 'Gelombang "gigi gergaji" (sawtooth) pada lead inferior; HR ventrikel biasanya 150x/menit (konduksi 2:1)' },
        ],
      },
      {
        name: 'Gagal Jantung',
        slug: 'fc-seed-kardiologi-gagal-jantung',
        cards: [
          { front: 'Definisi gagal jantung?', back: 'Kondisi jantung tidak mampu memompa darah sesuai kebutuhan metabolisme tubuh' },
          { front: 'Beda HFrEF dan HFpEF?', back: 'HFrEF: EF <40% (disfungsi sistolik); HFpEF: EF ≥50% dengan disfungsi diastolik' },
          { front: 'Gejala khas gagal jantung kiri?', back: 'Dyspnea (sesak napas), orthopnea, PND (paroxysmal nocturnal dyspnea), edema paru' },
          { front: 'Gejala khas gagal jantung kanan?', back: 'Edema tungkai bilateral, hepatomegali, ascites, JVP meningkat' },
          { front: 'Klasifikasi NYHA gagal jantung?', back: 'I: tanpa gejala | II: gejala aktivitas sedang | III: gejala aktivitas ringan | IV: gejala saat istirahat' },
          { front: 'Obat yang terbukti menurunkan mortalitas HFrEF?', back: 'ACE inhibitor/ARB, beta-blocker, MRA (spironolakton), SGLT2 inhibitor' },
          { front: 'Apa peran diuretik pada gagal jantung?', back: 'Mengurangi kongesti (retensi cairan) dan menurunkan preload — tidak menurunkan mortalitas' },
          { front: 'Apa biomarker utama gagal jantung?', back: 'BNP / NT-proBNP — meningkat akibat peregangan miokardium; digunakan untuk diagnosis dan monitoring' },
          { front: 'Tatalaksana edema paru akut?', back: 'Posisi duduk tegak, oksigen, furosemid IV, nitrogliserin sublingual' },
          { front: 'Apa itu cardiac remodeling?', back: 'Perubahan struktural jantung (dilatasi, hipertrofi, fibrosis) akibat overload kronik yang memperburuk fungsi' },
        ],
      },
      {
        name: 'Penyakit Jantung Koroner',
        slug: 'fc-seed-kardiologi-pjk',
        cards: [
          { front: 'Apa itu aterosklerosis?', back: 'Penumpukan plak (lipid, sel inflamasi, kalsium) di dinding arteri yang menyempitkan lumen pembuluh darah' },
          { front: 'Faktor risiko utama PJK?', back: 'Hipertensi, dislipidemia, DM, merokok, obesitas, riwayat keluarga, usia tua, jenis kelamin pria' },
          { front: 'Beda STEMI dan NSTEMI?', back: 'STEMI: ada elevasi ST ≥2mm di ≥2 lead + troponin naik; NSTEMI: troponin naik tapi tanpa elevasi ST' },
          { front: 'Biomarker pilihan diagnosis AMI?', back: 'Troponin I atau T — paling sensitif dan spesifik untuk nekrosis miokardium' },
          { front: 'Target waktu reperfusi pada STEMI?', back: 'Door-to-balloon ≤90 menit untuk PCI primer; fibrinolisis dalam 30 menit jika PCI tidak tersedia' },
          { front: 'Terapi antiplatelet pada ACS?', back: 'Dual antiplatelet: Aspirin + P2Y12 inhibitor (clopidogrel, ticagrelor, atau prasugrel)' },
          { front: 'Arteri apa yang paling sering menyebabkan infark anterior?', back: 'LAD (Left Anterior Descending) — memperdarahi dinding anterior dan septum ventrikel kiri' },
          { front: 'Gambaran EKG STEMI inferior?', back: 'Elevasi ST di lead II, III, aVF' },
          { front: 'Komplikasi mekanik AMI?', back: 'Ruptur dinding ventrikel, ruptur septum ventrikel (VSD akut), regurgitasi mitral akut' },
          { front: 'Peran statin pada PJK?', back: 'Menstabilkan plak, menurunkan LDL, mengurangi inflamasi — terbukti menurunkan mortalitas kardiovaskular' },
        ],
      },
    ],
  },
  {
    name: 'Respirologi',
    slug: 'fc-seed-respirologi',
    classification: 'sistem_blok',
    subtopics: [
      {
        name: 'Anatomi Saluran Napas',
        slug: 'fc-seed-respirologi-anatomi',
        cards: [
          { front: 'Apa fungsi epiglotis?', back: 'Menutup trakea saat menelan untuk mencegah aspirasi makanan/minuman ke saluran napas' },
          { front: 'Apa perbedaan bronkus kanan dan kiri secara anatomi?', back: 'Bronkus kanan: lebih lebar, pendek, dan vertikal — lebih mudah tersedak benda asing' },
          { front: 'Di mana pertukaran gas terjadi di paru-paru?', back: 'Alveolus — kantung udara kecil dengan dinding tipis dan dikelilingi kapiler darah' },
          { front: 'Apa itu surfaktan paru dan fungsinya?', back: 'Zat lipoprotein yang diproduksi pneumosit tipe II; menurunkan tegangan permukaan alveolus agar tidak kolaps' },
          { front: 'Berapa lobus paru kanan dan kiri?', back: 'Paru kanan: 3 lobus (superior, medial, inferior); paru kiri: 2 lobus (superior, inferior)' },
          { front: 'Apa itu dead space anatomis?', back: 'Volume udara di saluran napas konduksi yang tidak ikut pertukaran gas (trakea hingga bronkiolus terminal); ±150 mL' },
          { front: 'Saraf apa yang mengontrol diafragma?', back: 'Nervus frenikus (C3, C4, C5) — "C3, 4, 5 keeps the diaphragm alive"' },
          { front: 'Apa itu mucociliary clearance?', back: 'Mekanisme pertahanan saluran napas: silia menggerakkan lendir beserta partikel asing ke arah faring' },
          { front: 'Di mana letak karina dan apa signifikansinya?', back: 'Titik percabangan trakea menjadi bronkus kanan dan kiri (setinggi T4/T5); area sensitif refleks batuk' },
          { front: 'Apa itu pleura dan cairan pleura?', back: 'Pleura: 2 lapis selaput (viseral & parietal) yang membungkus paru; cairan pleura (±15 mL) mengurangi gesekan' },
        ],
      },
      {
        name: 'Fisiologi Pernapasan',
        slug: 'fc-seed-respirologi-fisiologi',
        cards: [
          { front: 'Apa yang mendorong udara masuk saat inspirasi?', back: 'Diafragma dan otot interkostal berkontraksi → rongga dada mengembang → tekanan intrapleural turun → udara masuk' },
          { front: 'Apa itu volume tidal?', back: 'Volume udara yang masuk/keluar dalam satu napas biasa; ±500 mL' },
          { front: 'Apa itu kapasitas vital (VC)?', back: 'Volume maksimum yang dapat dihembuskan setelah inspirasi maksimal; VC = IRV + TV + ERV' },
          { front: 'Apa itu volume residu (RV)?', back: 'Volume udara yang tersisa di paru setelah ekspirasi maksimal; tidak bisa diukur spirometri biasa' },
          { front: 'Bagaimana O₂ diangkut dalam darah?', back: '98% terikat hemoglobin (oksihemoglobin); 2% terlarut dalam plasma' },
          { front: 'Bagaimana CO₂ diangkut dalam darah?', back: '70% sebagai bikarbonat (HCO₃⁻); 23% terikat hemoglobin; 7% terlarut' },
          { front: 'Apa yang menggeser kurva disosiasi O₂ ke kanan?', back: 'Peningkatan suhu, CO₂, H⁺ (pH turun), 2,3-DPG → afinitas Hb terhadap O₂ menurun → pelepasan O₂ ke jaringan ↑' },
          { front: 'Apa perbedaan ventilasi dan perfusi?', back: 'Ventilasi (V): aliran udara ke alveolus; Perfusi (Q): aliran darah ke kapiler paru; rasio V/Q normal ±0,8' },
          { front: 'Apa itu hipoksia hipoksik?', back: 'Hipoksia akibat pO₂ inspirasi rendah atau gangguan pertukaran gas (mis. pneumonia, ARDS, ketinggian)' },
          { front: 'Apa kontrol utama pernapasan?', back: 'Pusat pernapasan di medula oblongata; terutama dirangsang oleh peningkatan CO₂ (hiperkapnia) dan penurunan pH' },
        ],
      },
      {
        name: 'Asma',
        slug: 'fc-seed-respirologi-asma',
        cards: [
          { front: 'Definisi asma?', back: 'Penyakit inflamasi kronis saluran napas dengan obstruksi yang reversibel dan hiper-responsivitas bronkus' },
          { front: 'Tiga komponen patofisiologi asma?', back: 'Bronkospasme, edema mukosa saluran napas, dan hipersekresi lendir' },
          { front: 'Gambaran spirometri khas asma?', back: 'Pola obstruktif: FEV1 turun, FVC normal/turun, rasio FEV1/FVC <70%; reversibel dengan bronkodilator' },
          { front: 'Obat pelega (reliever) pertama pada serangan asma akut?', back: 'SABA (Short-Acting Beta-2 Agonist) inhalasi — salbutamol/albuterol; bronkodilator kerja cepat' },
          { front: 'Obat pengontrol jangka panjang asma ringan persisten?', back: 'ICS (Inhaled Corticosteroid) dosis rendah — mis. budesonid, flutikason' },
          { front: 'Apa itu status asmatikus?', back: 'Serangan asma berat yang tidak respons terhadap bronkodilator standar; kegawatan medis' },
          { front: 'Trigger asma yang umum?', back: 'Alergen (debu, bulu hewan), infeksi viral, olahraga, udara dingin, asap rokok, NSAID, stres' },
          { front: 'Tanda bahaya asma berat?', back: 'Silent chest (wheezing tidak terdengar), pulsus paradoksus, sianosis, tidak bisa berbicara, SpO₂ <92%' },
          { front: 'Apa peran leukotriene pada asma?', back: 'Mediator inflamasi yang menyebabkan bronkospasme, edema, dan hipersekresi mukus; dihambat montelukast' },
          { front: 'Perbedaan asma dan PPOK?', back: 'Asma: reversibel, dimulai muda, alergi; PPOK: tidak reversibel penuh, perokok, progresif, usia tua' },
        ],
      },
      {
        name: 'PPOK',
        slug: 'fc-seed-respirologi-ppok',
        cards: [
          { front: 'Kepanjangan PPOK dan definisinya?', back: 'Penyakit Paru Obstruktif Kronik; obstruksi aliran udara yang persisten dan progresif, umumnya akibat rokok' },
          { front: 'Dua fenotip utama PPOK?', back: 'Emfisema (pink puffer): hiperinflasi, kurus, barrel chest; Bronkitis kronik (blue bloater): sianosis, edema, produktif' },
          { front: 'Kriteria diagnosis bronkitis kronik?', back: 'Batuk berdahak minimal 3 bulan/tahun selama ≥2 tahun berturut-turut' },
          { front: 'Gambaran spirometri PPOK?', back: 'FEV1/FVC <70% pasca bronkodilator (tidak reversibel sepenuhnya)' },
          { front: 'Penyebab utama PPOK?', back: 'Merokok (80–90%); juga paparan debu/bahan kimia kerja, polusi udara dalam ruangan (biomassa)' },
          { front: 'Patofisiologi emfisema?', back: 'Destruksi dinding alveolus akibat ketidakseimbangan protease-antiprotease → hilangnya elastisitas paru → air trapping' },
          { front: 'Apa itu PPOK eksaserbasi akut?', back: 'Perburukan gejala akut (sesak ↑, dahak ↑, perubahan warna dahak) yang melebihi variasi harian normal' },
          { front: 'Tatalaksana bronkodilator PPOK stabil?', back: 'LAMA (tiotropium) dan/atau LABA (salmeterol, formoterol) — bronkodilator kerja panjang' },
          { front: 'Mengapa oksigen tinggi berbahaya pada PPOK berat?', back: 'Menghilangkan hipoksia drive pernapasan → hipoventilasi dan hiperkapnia (CO₂ retention)' },
          { front: 'Apa itu cor pulmonale?', back: 'Pembesaran dan kegagalan ventrikel kanan akibat hipertensi pulmonal kronik — komplikasi PPOK lanjut' },
        ],
      },
      {
        name: 'Pneumonia',
        slug: 'fc-seed-respirologi-pneumonia',
        cards: [
          { front: 'Definisi pneumonia?', back: 'Infeksi parenkim paru (alveolus) yang menyebabkan konsolidasi dan gangguan pertukaran gas' },
          { front: 'Penyebab paling sering pneumonia komunitas (CAP)?', back: 'Streptococcus pneumoniae (pneumokokus) — tersering pada dewasa' },
          { front: 'Gejala klasik pneumonia bakterial?', back: 'Demam tinggi mendadak, batuk produktif dahak purulen/berdarah, nyeri dada pleuritik, sesak napas' },
          { front: 'Temuan auskultasi khas pneumonia?', back: 'Suara napas bronkial, ronki basah halus (krepitasi), egofoni, peningkatan fremitus taktil di area konsolidasi' },
          { front: 'Gambaran foto toraks pneumonia?', back: 'Konsolidasi (opasitas) homogen berbatas segmen/lobus, air bronchogram sign' },
          { front: 'Skor PSI/PORT atau CURB-65 digunakan untuk?', back: 'Menilai derajat keparahan pneumonia dan menentukan perlu rawat inap atau bisa rawat jalan' },
          { front: 'Kriteria CURB-65?', back: 'Confusion, Urea >7, RR ≥30, BP <90/60, age ≥65; skor ≥2 pertimbangkan rawat inap' },
          { front: 'Antibiotik empiris CAP rawat jalan?', back: 'Amoksisilin (tanpa komorbid) atau azitromisin/doksisiklin (atipik); Indonesia: amoksisilin + azitromisin' },
          { front: 'Pneumonia atipik disebabkan oleh apa?', back: 'Mycoplasma pneumoniae, Chlamydophila pneumoniae, Legionella pneumophila — tidak terlihat pada Gram stain' },
          { front: 'Komplikasi pneumonia?', back: 'Efusi pleura parapneumonik, empiema, abses paru, bakteremia/sepsis, gagal napas' },
        ],
      },
    ],
  },
]

async function upsertNode(data) {
  return prisma.feature_nodes.upsert({
    where: { slug: data.slug },
    update: { name: data.name },
    create: data,
  })
}

async function seedFlashcardNodes() {
  console.log('Seeding flashcard nodes...')

  for (const topic of SEED_DATA) {
    const topicNode = await upsertNode({
      name: topic.name,
      slug: topic.slug,
      classification: topic.classification ?? null,
      layer: 1,
      visibility: 'general',
    })
    console.log(`✓ Topic: ${topicNode.name} (id: ${topicNode.id})`)

    for (const sub of topic.subtopics) {
      const subNode = await upsertNode({
        name: sub.name,
        slug: sub.slug,
        parent_id: topicNode.id,
        layer: 2,
        visibility: 'general',
      })
      console.log(`  ✓ Subtopic: ${subNode.name} (id: ${subNode.id})`)

      const existing = await prisma.flashcard_cards.count({ where: { node_id: subNode.id } })
      if (existing > 0) {
        console.log(`    ⊘ Skipped — ${existing} cards already exist`)
        continue
      }

      await prisma.flashcard_cards.createMany({
        data: sub.cards.map((c, i) => ({
          node_id: subNode.id,
          front: c.front,
          back: c.back,
          order: i,
          is_deleted: false,
        })),
      })
      console.log(`    ✓ Created ${sub.cards.length} cards`)
    }
  }

  console.log('\nFlashcard nodes seeding completed!')
}

seedFlashcardNodes()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
