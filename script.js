document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const notification = document.getElementById('notification');
  
  // Проверка дали и двете полета са попълнени
  if (!name || !email) {
    notification.textContent = 'Попълнете двете полета';
    return;
  }
  
  try {
    const response = await fetch('/api/checkLogin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      notification.style.color = 'green';
      notification.textContent = result.message;  // "вие се вписахте"
    } else {
      notification.style.color = 'red';
      notification.textContent = result.error;
    }
  } catch (error) {
    console.error('Error:', error);
    notification.style.color = 'red';
    notification.textContent = 'Възникна грешка при изпращането.';
  }
});
