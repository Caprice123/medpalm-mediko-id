import prisma from '#prisma/client'

const RECORD_TYPE = 'diagnostic_question'
const VISIBILITY = 'diagnostic'

const SEED_DATA = [
  // ── PRIMARY ──────────────────────────────────────────────────────────────
  {
    name: 'Kardiologi',
    slug: 'dq-seed-kardiologi',
    classification: 'primary',
    subtopics: [
      {
        name: 'EKG Dasar',
        slug: 'dq-seed-kardiologi-ekg-dasar',
        questions: [
          {
            question: 'Gelombang P pada EKG merepresentasikan apa?',
            vignette: null,
            choices: ['Depolarisasi ventrikel', 'Repolarisasi ventrikel', 'Depolarisasi atrium', 'Repolarisasi atrium'],
            answer: 'Depolarisasi atrium',
            explanation: 'Gelombang P terjadi saat impuls listrik dari nodus SA menyebar ke seluruh atrium (depolarisasi atrium), menyebabkan kontraksi atrium.',
          },
          {
            question: 'Interval PR normal pada EKG dewasa adalah?',
            vignette: null,
            choices: ['0,06–0,10 detik', '0,12–0,20 detik', '0,20–0,30 detik', '0,30–0,40 detik'],
            answer: '0,12–0,20 detik',
            explanation: 'Interval PR mengukur waktu dari awal depolarisasi atrium hingga awal depolarisasi ventrikel. Normal 0,12–0,20 detik (3–5 kotak kecil). Memanjang pada blok AV.',
          },
          {
            question: 'Kompleks QRS yang lebar (>0,12 detik) menunjukkan?',
            vignette: null,
            choices: ['Blok AV derajat 1', 'Hipertrofi atrium', 'Gangguan konduksi intraventrikular (BBB)', 'Bradikardia sinus'],
            answer: 'Gangguan konduksi intraventrikular (BBB)',
            explanation: 'QRS normal <0,12 detik. Jika melebar, terdapat keterlambatan konduksi di His-Purkinje atau ventrikel, seperti pada Bundle Branch Block (LBBB/RBBB).',
          },
          {
            question: 'Pasien 55 tahun datang dengan nyeri dada. EKG menunjukkan elevasi ST di lead II, III, aVF. Area mana yang infark?',
            vignette: 'Pria 55 tahun dengan riwayat hipertensi datang ke UGD dengan nyeri dada substernal sejak 1 jam, menjalar ke rahang bawah, disertai keringat dingin. TD 100/70 mmHg, nadi 95x/menit.',
            choices: ['Anterior', 'Lateral', 'Inferior', 'Posterior'],
            answer: 'Inferior',
            explanation: 'Elevasi ST di lead II, III, dan aVF menandakan infark miokard inferior, biasanya akibat oklusi arteri koroner kanan (RCA) yang memperdarahi dinding inferior ventrikel kiri.',
          },
          {
            question: 'Gambaran EKG "sawtooth pattern" (gigi gergaji) khas untuk?',
            vignette: null,
            choices: ['Atrial fibrilasi', 'Atrial flutter', 'Ventrikel takikardi', 'Blok AV total'],
            answer: 'Atrial flutter',
            explanation: 'Atrial flutter ditandai gelombang flutter berbentuk gigi gergaji di lead inferior (II, III, aVF) dengan frekuensi atrium 250–350x/menit. Respons ventrikel biasanya 2:1 → HR sekitar 150x/menit.',
          },
        ],
      },
      {
        name: 'Gagal Jantung',
        slug: 'dq-seed-kardiologi-gagal-jantung',
        questions: [
          {
            question: 'Manakah temuan yang PALING khas pada gagal jantung kiri?',
            vignette: null,
            choices: ['Edema tungkai bilateral', 'Hepatomegali kongestif', 'Ronki basah di basal paru', 'Distensi vena jugularis'],
            answer: 'Ronki basah di basal paru',
            explanation: 'Gagal jantung kiri menyebabkan kongesti vena pulmonalis → edema paru → ronki basah (krepitasi) di basal paru. Edema perifer, hepatomegali, dan JVD lebih khas gagal jantung kanan.',
          },
          {
            question: 'Klasifikasi NYHA pasien yang sesak nafas saat berjalan 100 meter namun tidak sesak saat istirahat adalah?',
            vignette: null,
            choices: ['NYHA I', 'NYHA II', 'NYHA III', 'NYHA IV'],
            answer: 'NYHA III',
            explanation: 'NYHA III: gejala muncul pada aktivitas ringan sehari-hari (berjalan pendek, menaiki beberapa anak tangga). NYHA II: sesak pada aktivitas sedang. NYHA IV: sesak bahkan saat istirahat.',
          },
          {
            question: 'Obat yang menurunkan mortalitas jangka panjang pada HFrEF (EF <40%) adalah?',
            vignette: null,
            choices: ['Furosemid', 'Digoksin', 'ACE inhibitor', 'Amlodipin'],
            answer: 'ACE inhibitor',
            explanation: 'ACE inhibitor (mis. enalapril, ramipril) terbukti menurunkan mortalitas pada HFrEF melalui blokade sistem RAA. Beta-blocker dan MRA juga memiliki bukti kuat. Furosemid hanya untuk simptomatik.',
          },
          {
            question: 'Pasien dengan HFpEF: apa yang dimaksud?',
            vignette: null,
            choices: ['EF <40% dengan dilatasi ventrikel kiri', 'EF ≥50% dengan disfungsi diastolik', 'EF 40–49% dengan hipertrofi septum', 'EF normal dengan regurgitasi mitral'],
            answer: 'EF ≥50% dengan disfungsi diastolik',
            explanation: 'HFpEF (Heart Failure with preserved EF) adalah gagal jantung dengan EF ≥50%, di mana masalah utama adalah kekakuan ventrikel (disfungsi diastolik) bukan kelemahan sistolik.',
          },
          {
            question: 'Posisi tidur yang paling nyaman bagi pasien gagal jantung kiri dan mengapa?',
            vignette: 'Pasien 65 tahun dengan gagal jantung kronis mengeluh sesak nafas semakin berat saat berbaring datar (ortopnea) sejak 2 minggu.',
            choices: ['Posisi trendelenburg — meningkatkan aliran balik vena', 'Posisi supine penuh — meratakan distribusi cairan', 'Posisi semi-Fowler/duduk tegak — mengurangi preload vena pulmonalis', 'Posisi lateral kiri — mengurangi tekanan pada vena kava'],
            answer: 'Posisi semi-Fowler/duduk tegak — mengurangi preload vena pulmonalis',
            explanation: 'Posisi tegak atau semi-Fowler memungkinkan gravitasi mengurangi aliran balik vena ke paru (preload ↓), sehingga mengurangi kongesti paru dan sesak nafas. Inilah dasar ortopnea dan PND.',
          },
        ],
      },
    ],
  },
  {
    name: 'Pulmonologi',
    slug: 'dq-seed-pulmonologi',
    classification: 'primary',
    subtopics: [
      {
        name: 'Pneumonia',
        slug: 'dq-seed-pulmonologi-pneumonia',
        questions: [
          {
            question: 'Organisme penyebab CAP (community-acquired pneumonia) tersering pada dewasa imunokompeten?',
            vignette: null,
            choices: ['Mycobacterium tuberculosis', 'Streptococcus pneumoniae', 'Pseudomonas aeruginosa', 'Pneumocystis jirovecii'],
            answer: 'Streptococcus pneumoniae',
            explanation: 'S. pneumoniae adalah penyebab CAP tersering pada dewasa sehat. Pseudomonas aeruginosa lebih sering pada HAP atau pasien dengan bronkiektasis/cystic fibrosis. PCP khas pada imunosupresi berat (HIV CD4<200).',
          },
          {
            question: 'Pasien 30 tahun demam 3 hari, batuk produktif, dan foto thorax menunjukkan infiltrat lobar di paru kanan bawah. Diagnosis?',
            vignette: 'Pasien datang dengan demam 38,8°C, batuk produktif, dan sesak nafas ringan. Pemeriksaan fisik: redup saat perkusi di SIC kanan bawah, suara nafas bronkial, dan ronki basah.',
            choices: ['TB paru aktif', 'Pneumonia lobaris', 'Asma bronkial', 'PPOK eksaserbasi'],
            answer: 'Pneumonia lobaris',
            explanation: 'Pneumonia lobaris ditandai konsolidasi satu lobus utuh: demam akut, batuk produktif, temuan fisik (redup, bronkial, ronki) dan foto thorax konsolidasi lobar. S. pneumoniae adalah penyebab paling umum.',
          },
          {
            question: 'Kriteria CURB-65 digunakan untuk?',
            vignette: null,
            choices: ['Menentukan jenis kuman penyebab pneumonia', 'Memilih antibiotik empiris yang tepat', 'Menilai keparahan dan keputusan rawat inap pneumonia', 'Menyingkirkan diagnosis banding TB'],
            answer: 'Menilai keparahan dan keputusan rawat inap pneumonia',
            explanation: 'CURB-65 (Confusion, Uremia, Respiratory rate ≥30, BP rendah, Age ≥65): skor 0-1 rawat jalan, skor 2 pertimbangkan rawat inap, skor ≥3 rawat ICU. Digunakan untuk triase keparahan CAP.',
          },
          {
            question: 'Antibiotik lini pertama untuk CAP ringan-sedang pada pasien tanpa komorbid?',
            vignette: null,
            choices: ['Amoksisilin atau makrolid', 'Meropenem + vankomisin', 'Ciprofloksasin monoterapi', 'Metronidazol + ampisilin'],
            answer: 'Amoksisilin atau makrolid',
            explanation: 'Untuk CAP ringan tanpa komorbid, amoksisilin (menarget S. pneumoniae) atau makrolid (azithromisin/klaritromisin, menarget atypical) adalah pilihan pertama. Fluorokuinolon respirasi untuk kasus dengan komorbid.',
          },
          {
            question: 'Temuan foto thorax yang PALING khas untuk pneumonia aspirasi adalah?',
            vignette: null,
            choices: ['Infiltrat lobar paru kanan atas', 'Efusi pleura bilateral', 'Infiltrat atau konsolidasi di segmen posterior lobus bawah', 'Hiperinflasi dengan diafragma datar'],
            answer: 'Infiltrat atau konsolidasi di segmen posterior lobus bawah',
            explanation: 'Aspirasi saat posisi berbaring menuju segmen posterior (S6) lobus bawah atau segmen posterior lobus atas karena efek gravitasi. Kanan lebih sering karena bronkus utama kanan lebih vertikal.',
          },
        ],
      },
      {
        name: 'PPOK & Asma',
        slug: 'dq-seed-pulmonologi-ppok-asma',
        questions: [
          {
            question: 'Perbedaan utama obstruksi jalan napas pada asma versus PPOK adalah?',
            vignette: null,
            choices: [
              'Asma: obstruksi permanen; PPOK: obstruksi reversibel',
              'Asma: obstruksi reversibel penuh; PPOK: obstruksi tidak sepenuhnya reversibel',
              'Keduanya memiliki obstruksi ireversibel',
              'PPOK hanya menyerang pasien >70 tahun',
            ],
            answer: 'Asma: obstruksi reversibel penuh; PPOK: obstruksi tidak sepenuhnya reversibel',
            explanation: 'Asma ditandai obstruksi jalan napas yang reversibel (respons terhadap bronkodilator atau steroid). PPOK memiliki obstruksi persisten yang tidak sepenuhnya reversibel akibat kerusakan struktural paru.',
          },
          {
            question: 'Parameter spirometri yang digunakan untuk diagnosis PPOK adalah?',
            vignette: null,
            choices: ['FVC <80% prediksi', 'FEV1/FVC <0,70 post-bronkodilator', 'FEV1 <50% prediksi', 'PEFR <200 L/menit'],
            answer: 'FEV1/FVC <0,70 post-bronkodilator',
            explanation: 'Kriteria GOLD untuk PPOK: FEV1/FVC <0,70 setelah pemberian bronkodilator. Ini menunjukkan adanya obstruksi jalan napas yang tidak sepenuhnya reversibel.',
          },
          {
            question: 'Pasien PPOK eksaserbasi dengan sesak hebat dan SpO2 85%, terapi oksigen diberikan dengan target SpO2?',
            vignette: 'Pria 68 tahun perokok berat datang dengan sesak napas memberat sejak 2 hari, batuk produktif, dan demam ringan. SpO2 85% room air, pH 7,32, pCO2 58 mmHg.',
            choices: ['95–99%', '88–92%', '80–85%', '>99%'],
            answer: '88–92%',
            explanation: 'Pada PPOK dengan hipoksemia kronis, pusat napas bergantung pada hipoksia (hypoxic drive) bukan hiperkapnia. Oksigen berlebih dapat menyebabkan hipoventilasi dan retensi CO2. Target SpO2 88–92% adalah aman dan cukup.',
          },
          {
            question: 'Trigge asma tersering pada anak-anak adalah?',
            vignette: null,
            choices: ['Paparan dingin', 'Infeksi virus saluran napas atas', 'Merokok pasif', 'Olahraga intens'],
            answer: 'Infeksi virus saluran napas atas',
            explanation: 'Infeksi virus (rhinovirus, RSV) adalah trigger asma tersering pada anak, menyebabkan inflamasi saluran napas dan bronkospasme. Alergen dan olahraga lebih sering pada remaja/dewasa.',
          },
          {
            question: 'Obat controller (pengontrol) jangka panjang pada asma persisten ringan yang direkomendasikan adalah?',
            vignette: null,
            choices: ['SABA (salbutamol) sesuai kebutuhan', 'LABA monoterapi', 'ICS (inhalasi kortikosteroid) dosis rendah', 'Teofilin oral'],
            answer: 'ICS (inhalasi kortikosteroid) dosis rendah',
            explanation: 'ICS adalah terapi controller lini pertama untuk asma persisten (ringan, sedang, berat) karena efek antiinflamasi. SABA hanya sebagai reliever/rescue. LABA selalu dikombinasikan dengan ICS, tidak pernah monoterapi.',
          },
        ],
      },
    ],
  },

  // ── SPECIAL ──────────────────────────────────────────────────────────────
  {
    name: 'Radiologi Klinik',
    slug: 'dq-seed-radiologi',
    classification: 'special',
    subtopics: [
      {
        name: 'Foto Thorax',
        slug: 'dq-seed-radiologi-foto-thorax',
        questions: [
          {
            question: 'Gambaran foto thorax yang khas untuk edema paru akut adalah?',
            vignette: null,
            choices: [
              'Infiltrat lobar di paru kanan bawah',
              'Opasitas bilateral "bat-wing" / butterfly pattern di perihilar',
              'Hiperinflasi dengan diafragma datar',
              'Penebalan pleura bilateral',
            ],
            answer: 'Opasitas bilateral "bat-wing" / butterfly pattern di perihilar',
            explanation: 'Edema paru akut kardiogenik menghasilkan opasitas perihilar bilateral simetris berbentuk sayap kelelawar ("bat-wing"), disertai kardiomegali dan vaskular paru yang menonjol.',
          },
          {
            question: 'Pada tension pneumothorax, deviasi trakea mengarah ke?',
            vignette: 'Pasien 25 tahun pasca KLL dibawa dengan sesak mendadak, SpO2 80%. Pemeriksaan: hipersonor hemithorax kiri, vena leher distensi, trakea bergeser.',
            choices: ['Ipsilateral (sisi pneumothorax)', 'Kontralateral (sisi berlawanan)', 'Tidak ada deviasi', 'Ke bawah (kaudal)'],
            answer: 'Kontralateral (sisi berlawanan)',
            explanation: 'Tension pneumothorax: udara terkumpul terus di pleura tanpa bisa keluar → tekanan mendorong mediastinum ke sisi sehat (kontralateral). Ini adalah emergensi yang membutuhkan dekompresi segera.',
          },
          {
            question: 'Gambar menunjukkan opasitas homogen di hemithorax kiri dengan sudut kostofrenikus tumpul. Diagnosis yang paling mungkin?',
            vignette: 'Pasien 50 tahun dengan demam dan sesak. Foto thorax PA menunjukkan opasitas putih homogen mengisi 1/3 bawah hemithorax kiri, sudut kostofrenikus kiri tumpul. Hemithorax kanan normal.',
            choices: ['Pneumonia lobaris', 'Atelektasis masif', 'Efusi pleura', 'Massa paru'],
            answer: 'Efusi pleura',
            explanation: 'Efusi pleura ditandai opasitas homogen di basal paru dengan sudut kostofrenikus tumpul (blunting). Pada efusi masif, trakea dapat bergeser ke kontralateral. Perlu dibedakan dari atelektasis (trakea ipsilateral).',
          },
          {
            question: 'Tanda "air bronchogram" pada foto thorax menunjukkan?',
            vignette: null,
            choices: [
              'Udara di rongga pleura',
              'Bronkus berisi udara terlihat dalam area konsolidasi',
              'Atelektasis lobar',
              'Kavitas berisi udara dan cairan',
            ],
            answer: 'Bronkus berisi udara terlihat dalam area konsolidasi',
            explanation: 'Air bronchogram: percabangan bronkus yang berisi udara tampak hitam melawan latar konsolidasi paru yang putih. Khas untuk pneumonia lobar atau edema paru; tidak ada pada atelektasis obstruktif.',
          },
          {
            question: 'Foto thorax menunjukkan cincin berdinding tipis (thin-walled cyst) multipel di kedua paru. Diagnosis?',
            vignette: null,
            choices: ['Tuberkulosis miliaris', 'Pneumocystis jirovecii pneumonia', 'Lymphangioleiomyomatosis (LAM)', 'Histiositosis sel Langerhans'],
            answer: 'Lymphangioleiomyomatosis (LAM)',
            explanation: 'LAM: kista dinding tipis bilateral simetris di wanita usia reproduktif, sering dengan pneumothorax spontan berulang. Dibedakan dari Langerhans: kista LAM lebih bersih dan simetris, Langerhans lebih noduler/irregular.',
          },
        ],
      },
      {
        name: 'CT Scan Abdomen',
        slug: 'dq-seed-radiologi-ct-abdomen',
        questions: [
          {
            question: 'Gambaran CT scan abdomen yang khas untuk apendisitis akut adalah?',
            vignette: null,
            choices: [
              'Dilatasi usus halus dengan air-fluid level',
              'Appendiks >6mm dengan periappendiceal fat stranding',
              'Free air subdiafragma',
              'Penebalan dinding kolon sigmoid',
            ],
            answer: 'Appendiks >6mm dengan periappendiceal fat stranding',
            explanation: 'Apendisitis akut pada CT: appendiks berdiameter >6mm, dinding menebal dengan enhancement, periappendiceal fat stranding (inflamasi lemak sekitar), dan mungkin appendicolith. Akurasi CT >95%.',
          },
          {
            question: 'Pasien 45 tahun dengan nyeri kanan atas tiba-tiba, CT scan menunjukkan penebalan dinding kandung empedu dan batu empedu. Diagnosis?',
            vignette: 'Wanita 45 tahun, BB 80 kg, datang dengan nyeri kuadran kanan atas yang tiba-tiba, mual, dan demam ringan. Murphy sign positif. USG sebelumnya menunjukkan multiple batu empedu.',
            choices: ['Kolangitis', 'Kolesistitis akut', 'Pankreatitis akut', 'Abses hepar'],
            answer: 'Kolesistitis akut',
            explanation: 'Kolesistitis akut: penebalan dinding kandung empedu (>3mm), pericholecystic fluid, batu empedu, dan Murphy sign sonografi positif. CT berguna saat USG inkonklusif atau curiga komplikasi (perforasi, empiema).',
          },
          {
            question: 'Tanda "double duct sign" pada CT/MRCP menunjukkan?',
            vignette: null,
            choices: [
              'Dilatasi CBD dan duktus pankreatikus secara bersamaan',
              'Duplikasi kandung empedu kongenital',
              'Batu di CBD dan batu di kandung empedu',
              'Dilatasi ureter bilateral',
            ],
            answer: 'Dilatasi CBD dan duktus pankreatikus secara bersamaan',
            explanation: 'Double duct sign: dilatasi CBD (common bile duct) DAN duktus pankreatikus (Wirsung) secara bersamaan → sangat sugestif massa di caput pankreas (adenokarsinoma pankreas) yang menekan kedua saluran.',
          },
          {
            question: 'Fase CT scan yang paling optimal untuk mendeteksi massa hepar hipervaskular (HCC)?',
            vignette: null,
            choices: ['Fase non-kontras', 'Fase vena porta (porto-venous)', 'Fase arterial', 'Fase delayed (ekskretori)'],
            answer: 'Fase arterial',
            explanation: 'HCC mendapat suplai darah terutama dari arteri hepatika (bukan vena porta) → enhancement pada fase arterial (arterial hyperenhancement) diikuti washout pada fase vena porta. Pola ini khas HCC pada pasien sirosis.',
          },
          {
            question: 'CT scan menunjukkan "whirl sign" dan closed-loop obstruction pada ileum. Diagnosis paling mungkin?',
            vignette: null,
            choices: ['Ileus paralitik', 'Volvulus usus halus', 'Intususepsi', 'Kolitis iskemik'],
            answer: 'Volvulus usus halus',
            explanation: 'Whirl sign pada CT: mesentrium dan pembuluh darah berputar (swirl) akibat torsi — patognomonik untuk volvulus. Closed-loop obstruction (dua titik obstruksi) dengan whirl sign sangat spesifik untuk volvulus usus halus.',
          },
        ],
      },
    ],
  },
  {
    name: 'Anestesiologi',
    slug: 'dq-seed-anestesiologi',
    classification: 'special',
    subtopics: [
      {
        name: 'Preoperatif Assessment',
        slug: 'dq-seed-anestesiologi-preop',
        questions: [
          {
            question: 'Klasifikasi ASA (American Society of Anesthesiologists) seorang pasien 60 tahun dengan hipertensi terkontrol adalah?',
            vignette: null,
            choices: ['ASA I', 'ASA II', 'ASA III', 'ASA IV'],
            answer: 'ASA II',
            explanation: 'ASA II: pasien dengan penyakit sistemik ringan yang terkontrol (hipertensi terkontrol, DM terkontrol, obesitas BMI 30-40). ASA I: sehat. ASA III: penyakit sistemik berat (DM tidak terkontrol, CHF, CKD 3, EF 35-40%).',
          },
          {
            question: 'Mallampati class III pada pemeriksaan jalan napas mengindikasikan?',
            vignette: null,
            choices: [
              'Uvula, palatum molle, dan pilar tonsil terlihat jelas',
              'Hanya palatum durum yang terlihat',
              'Hanya palatum molle dan dasar uvula terlihat',
              'Palatum molle dan uvula tidak terlihat sama sekali',
            ],
            answer: 'Hanya palatum molle dan dasar uvula terlihat',
            explanation: 'Mallampati I: semua terlihat jelas. II: pilar tonsil tidak terlihat. III: hanya palatum molle dan dasar uvula. IV: hanya palatum durum. Mallampati III-IV mengindikasikan prediksi intubasi sulit.',
          },
          {
            question: 'Puasa preoperatif (NPO) untuk cairan jernih pada pasien dewasa elektif adalah minimal?',
            vignette: null,
            choices: ['1 jam', '2 jam', '4 jam', '6 jam'],
            answer: '2 jam',
            explanation: 'Panduan ASA: cairan jernih (air, jus tanpa ampas, teh tanpa susu) minimal 2 jam sebelum anestesi. Makanan ringan 6 jam, makanan berat 8 jam. Ini untuk meminimalisir risiko aspirasi (Mendelson syndrome).',
          },
          {
            question: 'Tanda DOPE pada neonatus dengan penurunan SpO2 pasca intubasi mengacu pada?',
            vignette: 'Neonatus 2 hari pasca laparotomi, terintubasi. Tiba-tiba SpO2 turun dari 98% ke 75% dalam 5 menit. Posisi tube sebelumnya benar.',
            choices: [
              'Dehidrasi, Obstruksi, Perforation, Embolism',
              'Displacement, Obstruction, Pneumothorax, Equipment failure',
              'Dislocation, Overventilation, Pressure drop, Edema',
              'Drug error, Oxygen failure, Pneumonia, Embolism',
            ],
            answer: 'Displacement, Obstruction, Pneumothorax, Equipment failure',
            explanation: 'DOPE: Displacement (tube bergeser/tercabut), Obstruction (tersumbat sekret/kinking), Pneumothorax (terutama tension), Equipment failure (gas supply, ventilator). Digunakan sebagai panduan troubleshooting deteriorasi mendadak pasien terintubasi.',
          },
          {
            question: 'Obat anestesi intravena yang menyebabkan bronkodilatasi sehingga AMAN digunakan pada pasien asma adalah?',
            vignette: null,
            choices: ['Propofol', 'Ketamin', 'Tiopental', 'Etomidat'],
            answer: 'Ketamin',
            explanation: 'Ketamin (disosiatif) merangsang pelepasan katekolamin → bronkodilatasi. Ini membuatnya pilihan induksi pada pasien asma atau status asmatikus yang memerlukan intubasi. Propofol juga relatif aman, tiopental dapat memicu bronkospasme.',
          },
        ],
      },
      {
        name: 'Analgesia & Sedasi',
        slug: 'dq-seed-anestesiologi-analgesia',
        questions: [
          {
            question: 'Langkah pertama pada WHO analgesic ladder untuk nyeri ringan (NRS 1-3) adalah?',
            vignette: null,
            choices: ['Opioid kuat (morfin, oksikodon)', 'Opioid lemah (kodein, tramadol)', 'Non-opioid (NSAID, parasetamol)', 'Adjuvan (gabapentin, antidepresan)'],
            answer: 'Non-opioid (NSAID, parasetamol)',
            explanation: 'WHO ladder: Step 1 (nyeri ringan) = non-opioid ± adjuvan; Step 2 (sedang) = opioid lemah ± non-opioid; Step 3 (berat) = opioid kuat ± non-opioid. Selalu mulai dari step paling bawah yang efektif.',
          },
          {
            question: 'Antidot yang diberikan pada overdosis opioid dengan depresi napas adalah?',
            vignette: 'Pasien ditemukan tidak sadar dengan napas lambat 4x/menit, pupil pinpoint bilateral, SpO2 82%. Terdapat bekas suntikan di lengan.',
            choices: ['Flumazenil', 'Nalokson', 'N-acetylsistein', 'Atropin'],
            answer: 'Nalokson',
            explanation: 'Nalokson adalah antagonis opioid kompetitif murni yang membalikkan depresi napas, sedasi, dan miosis akibat opioid. Durasi kerja nalokson (30-90 menit) lebih pendek dari kebanyakan opioid, sehingga perlu dosis ulang.',
          },
          {
            question: 'Benzodiazepin yang digunakan sebagai premedikasi anestesi untuk mengurangi kecemasan adalah?',
            vignette: null,
            choices: ['Diazepam', 'Midazolam', 'Lorazepam', 'Alprazolam'],
            answer: 'Midazolam',
            explanation: 'Midazolam paling sering digunakan sebagai premedikasi karena: onset cepat, durasi pendek, anterograde amnesia, dan dapat diberikan IV/IM/oral. Juga digunakan untuk sedasi prosedural di ICU dan endoskopi.',
          },
          {
            question: 'Komplikasi tersering anestesi spinal (subaraknoid) adalah?',
            vignette: null,
            choices: ['Hipertensi rebound', 'Hipotensi arteri', 'Henti napas mendadak', 'Retensi urin permanen'],
            answer: 'Hipotensi arteri',
            explanation: 'Blokade simpatis pada anestesi spinal menyebabkan vasodilatasi → hipotensi (komplikasi tersering, 30-50%). Diatasi dengan loading cairan preemptif, vasopressor (efedrin/fenilefrin), dan posisi. PDPH juga sering tapi lebih lambat.',
          },
          {
            question: 'Pasien ICU terintubasi memerlukan sedasi. Richmond Agitation-Sedation Scale (RASS) target yang direkomendasikan untuk sedasi ringan adalah?',
            vignette: null,
            choices: ['RASS -4 hingga -5 (tidak ada respons)', 'RASS -1 hingga -2 (mengantuk hingga sedasi ringan)', 'RASS 0 (waspada dan tenang)', 'RASS +1 hingga +2 (agitasi ringan)'],
            answer: 'RASS -1 hingga -2 (mengantuk hingga sedasi ringan)',
            explanation: 'Panduan SCCM merekomendasikan sedasi ringan (RASS -1 sampai -2) sebagai target pada pasien ICU terventilasi untuk meminimalisir hari ventilator, delirium, dan disfungsi kognitif. Sedasi dalam (RASS -4/-5) hanya pada indikasi khusus (ARDS berat, ICP tinggi).',
          },
        ],
      },
    ],
  },
]

async function createOrFindNode({ name, slug, parentId, layer, classification }) {
  const existing = await prisma.feature_nodes.findUnique({ where: { slug } })
  if (existing) return existing
  return prisma.feature_nodes.create({
    data: { name, slug, parent_id: parentId ?? null, layer, visibility: VISIBILITY, classification: classification ?? null },
  })
}

export async function seedDiagnosticNodes() {
  console.log('Seeding diagnostic V2 nodes and questions...')

  for (const topic of SEED_DATA) {
    const topicNode = await createOrFindNode({
      name: topic.name,
      slug: topic.slug,
      layer: 1,
      classification: topic.classification,
    })
    console.log(`  ✓ Topic: ${topic.name} (${topic.classification})`)

    for (const sub of topic.subtopics) {
      const subNode = await createOrFindNode({
        name: sub.name,
        slug: sub.slug,
        parentId: topicNode.id,
        layer: 2,
        classification: topic.classification,
      })
      console.log(`    ✓ Subtopic: ${sub.name}`)

      let inserted = 0
      for (const q of sub.questions) {
        const existingQ = await prisma.diagnostic_questions.findFirst({ where: { question: q.question } })
        if (existingQ) {
          const linked = await prisma.feature_node_records.findFirst({
            where: { node_id: subNode.id, record_type: RECORD_TYPE, record_id: existingQ.id },
          })
          if (linked) continue
        }

        const question = await prisma.diagnostic_questions.create({
          data: {
            question: q.question,
            vignette: q.vignette ?? null,
            answer: q.answer,
            answer_type: 'multiple_choice',
            choices: q.choices,
            explanation: q.explanation ?? null,
            quiz_id: null,
          },
        })

        await prisma.feature_node_records.create({
          data: { node_id: subNode.id, record_type: RECORD_TYPE, record_id: question.id },
        })

        inserted++
      }

      if (inserted > 0) {
        await prisma.node_statistics.upsert({
          where: { node_id_record_type: { node_id: subNode.id, record_type: RECORD_TYPE } },
          create: { node_id: subNode.id, record_type: RECORD_TYPE, total_count: inserted },
          update: { total_count: { increment: inserted } },
        })
        console.log(`      + ${inserted} question(s) seeded`)
      }
    }
  }

  console.log('Diagnostic V2 nodes seeding completed!')
}

seedDiagnosticNodes()
  .then(async () => {
    console.log('Done!')
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  })
