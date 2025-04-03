export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Методът не е позволен.' });
  }
  
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Попълнете двете полета' });
  }
  
  const sheetId = '15DLbxrDI_28J5bc1_061xluxgL5UlU6d8qe-AI7yom0';
  const apiKey = 'AIzaSyDJZS2Zk5qc5rlANmr8twMatTPKKy1vrP0';
  // Тук задаваме диапазона от лист "Заявки"
  const range = 'Заявки!B8:C50';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ error: 'Грешка при достъп до Google Sheets.' });
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    // Преобразуваме входните данни в малки букви и премахваме излишните интервали
    const inputName = name.trim().toLowerCase();
    const inputEmail = email.trim().toLowerCase();
    
    // Търсим ред, където името съвпада
    const matchingRow = rows.find(row => row[0]?.trim().toLowerCase() === inputName);
    
    if (matchingRow) {
      // Ако името съвпада, проверяваме дали имейлът от същия ред съвпада
      if (matchingRow[1]?.trim().toLowerCase() === inputEmail) {
        return res.status(200).json({ message: 'вие се вписахте' });
      } else {
        return res.status(400).json({ error: 'Грешен имейл' });
      }
    } else {
      // Ако името не е намерено, може да проверим дали въведеният имейл съществува някъде
      const emailExists = rows.some(row => row[1]?.trim().toLowerCase() === inputEmail);
      if (emailExists) {
        return res.status(400).json({ error: 'Грешно име!' });
      } else {
        return res.status(400).json({ error: 'Грешна информация' });
      }
    }
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return res.status(500).json({ error: 'Вътрешна грешка.' });
  }
}
