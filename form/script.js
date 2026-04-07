const responseBox = document.getElementById('response');

function getAuth() {
  const idInstance = document.getElementById('idInstance').value.trim();
  const apiTokenInstance = document.getElementById('apiTokenInstance').value.trim();

  if (!idInstance || !apiTokenInstance) {
    throw new Error('Заполните idInstance и ApiTokenInstance');
  }

  return { idInstance, apiTokenInstance };
}

async function apiRequest(method, body = null) {
  const { idInstance, apiTokenInstance } = getAuth();
  const url = `https://api.green-api.com/waInstance${idInstance}/${method}/${apiTokenInstance}`;

  const options = {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' }
  };

  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  const data = await res.json();
  responseBox.value = JSON.stringify(data, null, 2);
}

document.getElementById('getSettingsBtn').addEventListener('click', () => {
  apiRequest('getSettings').catch(err => responseBox.value = err.message);
});

document.getElementById('getStateInstanceBtn').addEventListener('click', () => {
  apiRequest('getStateInstance').catch(err => responseBox.value = err.message);
});

document.getElementById('sendMessageBtn').addEventListener('click', () => {
  const phone = document.getElementById('phoneNumber').value.trim();
  const message = document.getElementById('messageText').value.trim();

  if (!phone || !message) {
    responseBox.value = 'Введите номер телефона и текст сообщения';
    return;
  }

  apiRequest('sendMessage', {
    chatId: `${phone}@c.us`,
    message
  }).catch(err => responseBox.value = err.message);
});

document.getElementById('sendFileByUrlBtn').addEventListener('click', () => {
  const phone = document.getElementById('filePhoneNumber').value.trim();
  const urlFile = document.getElementById('fileUrl').value.trim();

  if (!phone || !urlFile) {
    responseBox.value = 'Введите номер телефона и ссылку на файл';
    return;
  }

  apiRequest('sendFileByUrl', {
    chatId: `${phone}@c.us`,
    urlFile,
    fileName: urlFile.split('/').pop() || 'file'
  }).catch(err => responseBox.value = err.message);
});
