// Ganti pake API Key lu yang asli ya bre!
const API_KEY = 'AIzaSyDTwqkIeLlh_nTIYkZSaYrVWLZ6AXCjigg';

async function cekModel() {
  console.log('Lagi nanya ke Google model apa aja yang bisa dipake...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    
    if (data.models) {
      console.log('\n✅ INI DAFTAR MODEL YANG BISA LU PAKE:');
      // Kita filter yang support buat generateContent (teks)
      const generateTextModels = data.models
        .filter(m => m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name.replace('models/', '')); // Biar gampang dibaca
      
      console.log(generateTextModels);
      console.log('\n👉 Pilih salah satu yang ada tulisan "gemini-1.5" nya ya!');
    } else {
      console.log('Error dapet data:', data);
    }
  } catch (err) {
    console.error('Waduh error fetching:', err);
  }
}

cekModel();