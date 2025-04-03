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
  const range = 'Заявки!B8:C50'; // Диапазон: имена в колона B, имейли в колона C
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ error: 'Грешка при достъп до Google Sheets.' });
    }

    const data = await response.json();
    const rows = data.values || [];

    // Преобразуваме входните данни до малки букви и премахваме излишните интервали
    const inputName = name.trim().toLowerCase();
    const inputEmail = email.trim().toLowerCase();

    // Търсим ред, където името (колона B) съвпада с въведения inputName
    const matchingRow = rows.find(row => row[0]?.trim().toLowerCase() === inputName);

    if (matchingRow) {
      // Ако сме намерили ред с името, проверяваме дали имейлът (колона C) от същия ред съвпада
      if (matchingRow[1]?.trim().toLowerCase() === inputEmail) {
        return res.status(200).json({ message: 'вие се вписахте' });
      } else {
        return res.status(400).json({ error: 'Грешен имейл' });
      }
    } else {
      // Ако не сме намерили ред с даденото име
      return res.status(400).json({ error: 'Грешно име!' });
    }
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return res.status(500).json({ error: 'Вътрешна грешка.' });
  }
}
