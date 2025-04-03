export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Методът не е позволен.' });
    }
    
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Попълнете двете полета' });
    }
    
    // Заменете с вашите реални данни:
    const sheetId = '15DLbxrDI_28J5bc1_061xluxgL5UlU6d8qe-AI7yom0';
    const apiKey = 'AIzaSyDJZS2Zk5qc5rlANmr8twMatTPKKy1vrP0';
    // Използваме диапазона от лист "Заявки" за имената и имейлите:
    const range = 'Заявки!B8:C50';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(500).json({ error: 'Грешка при достъп до Google Sheets.' });
      }
      
      const data = await response.json();
      
      const validNames = data.values.map(row => row[0]?.trim()).filter(Boolean);
      const validEmails = data.values.map(row => row[1]?.trim()).filter(Boolean);
      
      // Проверяваме дали въведеното име и имейл съществуват в съответните диапазони
      const isValidName = validNames.includes(name);
      const isValidEmail = validEmails.includes(email);
      
      if (isValidName && isValidEmail) {
        return res.status(200).json({ message: 'вие се вписахте' });
      } else if (!isValidName && isValidEmail) {
        return res.status(400).json({ error: 'Грешно име!' });
      } else if (isValidName && !isValidEmail) {
        return res.status(400).json({ error: 'Грешен имейл' });
      } else {
        return res.status(400).json({ error: 'Грешна информация' });
      }
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
      return res.status(500).json({ error: 'Вътрешна грешка.' });
    }
  }
  