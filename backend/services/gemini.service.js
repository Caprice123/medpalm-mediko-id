import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  /**
   * Generate fill-in-the-blank questions from text content
   * @param {string} content - The text content to generate questions from
   * @param {number} questionCount - Number of questions to generate (default: 10)
   * @returns {Promise<Array>} Array of generated questions
   */
  async generateQuestionsFromText(content, questionCount = 10) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
Kamu adalah seorang dosen medis yang ahli dalam membuat soal latihan untuk mahasiswa kedokteran.

Tugas: Buatlah ${questionCount} soal fill-in-the-blank berkualitas tinggi berdasarkan materi berikut.

Materi:
${content}

Format Output (JSON):
[
  {
    "question": "Pertanyaan dengan ____ sebagai tempat kosong yang harus diisi",
    "answer": "jawaban yang benar",
    "explanation": "Penjelasan lengkap mengapa ini jawaban yang benar"
  }
]

Aturan:
1. Setiap pertanyaan harus menggunakan TEPAT SATU ____ (empat underscore) sebagai tempat kosong
2. Fokus pada konsep medis penting dari materi
3. Jawaban harus SATU KATA atau FRASA PENDEK (maksimal 3 kata)
4. Penjelasan harus jelas dan edukatif (2-3 kalimat)
5. Gunakan bahasa Indonesia yang formal dan medis
6. Pastikan pertanyaan bervariasi dan mencakup berbagai aspek materi
7. Output harus berupa valid JSON array

Hasilkan HANYA JSON array tanpa teks tambahan apapun.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const questions = JSON.parse(cleanedText);

      // Validate and clean questions
      return questions.map((q, index) => ({
        question: q.question || '',
        answer: q.answer || '',
        explanation: q.explanation || '',
        order: index
      }));
    } catch (error) {
      console.error('Error generating questions from text:', error);
      throw new Error('Failed to generate questions: ' + error.message);
    }
  }

  /**
   * Generate fill-in-the-blank questions from PDF file
   * This method uploads the PDF to Gemini and analyzes both text and images
   * @param {string} pdfFilePath - Path to the PDF file
   * @param {number} questionCount - Number of questions to generate
   * @returns {Promise<Array>} Array of generated questions
   */
  async generateQuestionsFromPDF(pdfFilePath, questionCount = 10) {
    try {
      // Check file size (max 20MB for inline PDFs)
      const stats = fs.statSync(pdfFilePath);
      const fileSizeMB = stats.size / (1024 * 1024);

      console.log(`Processing PDF: ${pdfFilePath} - Size: ${fileSizeMB.toFixed(2)} MB`);

      if (fileSizeMB > 20) {
        throw new Error(`PDF too large: ${fileSizeMB.toFixed(2)} MB (max 20 MB for inline data)`);
      }

      // Read PDF file and convert to base64
      const pdfBuffer = fs.readFileSync(pdfFilePath);
      const pdfBase64 = pdfBuffer.toString('base64');

      console.log('PDF converted to base64, generating questions...');

      // Generate questions using inline PDF data
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `
Kamu adalah seorang dosen medis yang ahli dalam membuat soal latihan untuk mahasiswa kedokteran.

Tugas: Analisis PDF materi medis yang diberikan (termasuk teks dan gambar/diagram jika ada), lalu buatlah ${questionCount} soal fill-in-the-blank berkualitas tinggi.

Format Output (JSON):
[
  {
    "question": "Pertanyaan dengan ____ sebagai tempat kosong yang harus diisi",
    "answer": "jawaban yang benar",
    "explanation": "Penjelasan lengkap mengapa ini jawaban yang benar"
  }
]

Aturan:
1. Setiap pertanyaan harus menggunakan TEPAT SATU ____ (empat underscore) sebagai tempat kosong
2. Fokus pada konsep medis penting dari materi
3. Jika ada diagram/gambar, buat pertanyaan yang relevan dengan visualisasi tersebut
4. Jawaban harus SATU KATA atau FRASA PENDEK (maksimal 3 kata)
5. Penjelasan harus jelas dan edukatif (2-3 kalimat)
6. Gunakan bahasa Indonesia yang formal dan medis
7. Pastikan pertanyaan bervariasi dan mencakup berbagai aspek materi
8. Output harus berupa valid JSON array

Hasilkan HANYA JSON array tanpa teks tambahan apapun.
`;

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: pdfBase64,
          },
        },
        { text: prompt },
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const questions = JSON.parse(cleanedText);

      console.log(`Successfully generated ${questions.length} questions from PDF`);

      // Validate and clean questions
      return questions.map((q, index) => ({
        question: q.question || '',
        answer: q.answer || '',
        explanation: q.explanation || '',
        order: index
      }));
    } catch (error) {
      console.error('Error generating questions from PDF:', error);
      throw new Error('Failed to generate questions from PDF: ' + error.message);
    }
  }

  /**
   * Validate a question format
   * @param {Object} question - Question object to validate
   * @returns {boolean} True if valid
   */
  validateQuestion(question) {
    if (!question.question || !question.answer || !question.explanation) {
      return false;
    }

    // Check if question has exactly one ____
    const blankCount = (question.question.match(/____/g) || []).length;
    if (blankCount !== 1) {
      return false;
    }

    return true;
  }

  /**
   * Generate flashcards from text content
   * @param {string} content - The text content to generate flashcards from
   * @param {number} cardCount - Number of flashcards to generate (default: 10)
   * @returns {Promise<Array>} Array of generated flashcards
   */
  async generateFlashcardsFromText(content, cardCount = 10) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
Kamu adalah seorang dosen medis yang ahli dalam membuat flashcard untuk mahasiswa kedokteran.

Tugas: Buatlah ${cardCount} flashcard berkualitas tinggi berdasarkan materi berikut.

Materi:
${content}

Format Output (JSON):
[
  {
    "front": "Pertanyaan atau istilah medis",
    "back": "Jawaban singkat"
  }
]

Aturan:
1. Front card: Tulis pertanyaan singkat ATAU istilah medis penting
2. Back card: Tulis jawaban SINGKAT (1-5 kata atau frase pendek)
3. Fokus pada konsep medis penting dari materi
4. Jawaban harus RINGKAS dan TO THE POINT (bukan kalimat panjang)
5. Contoh jawaban yang baik: "4 ruang", "Atrium dan Ventrikel", "Miokardium", "O2 dan CO2"
6. HINDARI jawaban panjang atau penjelasan detail
7. Gunakan bahasa Indonesia yang formal dan medis
8. Pastikan flashcard bervariasi dan mencakup berbagai aspek materi
9. Output harus berupa valid JSON array

Hasilkan HANYA JSON array tanpa teks tambahan apapun.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const flashcards = JSON.parse(cleanedText);

      // Validate and clean flashcards
      return flashcards.map((card, index) => ({
        front: card.front || '',
        back: card.back || '',
        order: index
      }));
    } catch (error) {
      console.error('Error generating flashcards from text:', error);
      throw new Error('Failed to generate flashcards: ' + error.message);
    }
  }

  /**
   * Generate flashcards from PDF file
   * @param {string} pdfFilePath - Path to the PDF file
   * @param {number} cardCount - Number of flashcards to generate
   * @returns {Promise<Array>} Array of generated flashcards
   */
  async generateFlashcardsFromPDF(pdfFilePath, cardCount = 10) {
    try {
      // Check file size (max 20MB for inline PDFs)
      const stats = fs.statSync(pdfFilePath);
      const fileSizeMB = stats.size / (1024 * 1024);

      console.log(`Processing PDF for flashcards: ${pdfFilePath} - Size: ${fileSizeMB.toFixed(2)} MB`);

      if (fileSizeMB > 20) {
        throw new Error(`PDF too large: ${fileSizeMB.toFixed(2)} MB (max 20 MB for inline data)`);
      }

      // Read PDF file and convert to base64
      const pdfBuffer = fs.readFileSync(pdfFilePath);
      const pdfBase64 = pdfBuffer.toString('base64');

      console.log('PDF converted to base64, generating flashcards...');

      // Generate flashcards using inline PDF data
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `
Kamu adalah seorang dosen medis yang ahli dalam membuat flashcard untuk mahasiswa kedokteran.

Tugas: Analisis PDF materi medis yang diberikan (termasuk teks dan gambar/diagram jika ada), lalu buatlah ${cardCount} flashcard berkualitas tinggi.

Format Output (JSON):
[
  {
    "front": "Pertanyaan atau istilah medis",
    "back": "Jawaban singkat"
  }
]

Aturan:
1. Front card: Tulis pertanyaan singkat ATAU istilah medis penting
2. Back card: Tulis jawaban SINGKAT (1-5 kata atau frase pendek)
3. Fokus pada konsep medis penting dari materi
4. Jika ada diagram/gambar, buat flashcard yang relevan dengan visualisasi tersebut
5. Jawaban harus RINGKAS dan TO THE POINT (bukan kalimat panjang)
6. Contoh jawaban yang baik: "4 ruang", "Atrium dan Ventrikel", "Miokardium", "O2 dan CO2"
7. HINDARI jawaban panjang atau penjelasan detail
8. Gunakan bahasa Indonesia yang formal dan medis
9. Pastikan flashcard bervariasi dan mencakup berbagai aspek materi
10. Output harus berupa valid JSON array

Hasilkan HANYA JSON array tanpa teks tambahan apapun.
`;

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: pdfBase64,
          },
        },
        { text: prompt },
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const flashcards = JSON.parse(cleanedText);

      console.log(`Successfully generated ${flashcards.length} flashcards from PDF`);

      // Validate and clean flashcards
      return flashcards.map((card, index) => ({
        front: card.front || '',
        back: card.back || '',
        order: index
      }));
    } catch (error) {
      console.error('Error generating flashcards from PDF:', error);
      throw new Error('Failed to generate flashcards from PDF: ' + error.message);
    }
  }

  /**
   * Validate a flashcard format
   * @param {Object} flashcard - Flashcard object to validate
   * @returns {boolean} True if valid
   */
  validateFlashcard(flashcard) {
    if (!flashcard.front || !flashcard.back) {
      return false;
    }

    return true;
  }

  /**
   * Generate anatomy questions from image
   * Uses gemini-2.0-flash (vision model) to analyze anatomical images
   * @param {string} imageFilePath - Path to the image file
   * @param {number} questionCount - Number of questions to generate (default: 5)
   * @returns {Promise<Array>} Array of generated questions with answers and explanations
   */
  async generateAnatomyQuestionsFromImage(imageFilePath, questionCount = 5) {
    try {
      // Check file size (max 20MB for inline images)
      const stats = fs.statSync(imageFilePath);
      const fileSizeMB = stats.size / (1024 * 1024);

      console.log(`Processing image: ${imageFilePath} - Size: ${fileSizeMB.toFixed(2)} MB`);

      if (fileSizeMB > 20) {
        throw new Error(`Image too large: ${fileSizeMB.toFixed(2)} MB (max 20 MB for inline data)`);
      }

      // Read image file and convert to base64
      const imageBuffer = fs.readFileSync(imageFilePath);
      const imageBase64 = imageBuffer.toString('base64');

      // Detect mime type from file extension
      const ext = path.extname(imageFilePath).toLowerCase();
      const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png'
      };
      const mimeType = mimeTypes[ext] || 'image/jpeg';

      console.log('Image converted to base64, generating anatomy questions...');

      // Generate questions using inline image data
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `
Kamu adalah seorang dosen anatomi medis yang ahli dalam membuat soal berdasarkan gambar anatomi.

Tugas: Analisis gambar anatomi yang diberikan, lalu buatlah ${questionCount} soal berkualitas tinggi berdasarkan struktur yang terlihat dalam gambar.

Format Output (JSON):
[
  {
    "question": "Pertanyaan yang mengarah pada struktur spesifik dalam gambar",
    "answer": "Nama struktur/organ yang benar",
    "explanation": "Penjelasan lengkap tentang struktur tersebut, fungsinya, dan mengapa ini jawaban yang benar"
  }
]

Aturan:
1. Identifikasi semua struktur anatomi yang jelas terlihat dalam gambar
2. Buat pertanyaan yang SPESIFIK dan mengacu pada lokasi/posisi dalam gambar
3. Contoh pertanyaan bagus: "Struktur berbentuk kerucut di bagian tengah gambar adalah?", "Organ yang ditunjukkan oleh panah di sebelah kiri adalah?"
4. Jawaban harus NAMA STRUKTUR yang SPESIFIK dan BENAR secara medis
5. Jawaban maksimal 3-4 kata (nama struktur/organ)
6. Penjelasan harus mencakup:
   - Identifikasi struktur
   - Lokasi anatomis
   - Fungsi utama
   - Ciri khas yang terlihat dalam gambar
7. Gunakan bahasa Indonesia yang formal dan medis
8. Pastikan pertanyaan bervariasi (jangan hanya menanyakan nama, tapi juga fungsi, lokasi relatif, dll)
9. Output harus berupa valid JSON array
10. Fokus pada struktur yang JELAS TERLIHAT dan dapat DIIDENTIFIKASI dari gambar

Hasilkan HANYA JSON array tanpa teks tambahan apapun.
`;

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBase64,
          },
        },
        { text: prompt },
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const questions = JSON.parse(cleanedText);

      console.log(`Successfully generated ${questions.length} anatomy questions from image`);

      // Validate and clean questions
      return questions.map((q, index) => ({
        question: q.question || '',
        answer: q.answer || '',
        explanation: q.explanation || '',
        order: index
      }));
    } catch (error) {
      console.error('Error generating anatomy questions from image:', error);
      throw new Error('Failed to generate anatomy questions from image: ' + error.message);
    }
  }

  /**
   * Validate an anatomy question format
   * @param {Object} question - Question object to validate
   * @returns {boolean} True if valid
   */
  validateAnatomyQuestion(question) {
    if (!question.question || !question.answer || !question.explanation) {
      return false;
    }

    return true;
  }
}

export default new GeminiService();
