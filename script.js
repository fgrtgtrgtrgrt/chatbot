const chatForm = document.querySelector('.chatForm');
const chatQuestion = document.querySelector('.chatGPTQuestion');
const chatResponse = document.querySelector('.chatGPTResponse');
const chatLog = document.querySelector('.chatLog');
const chatList = document.querySelector('.chatList');
const footer = document.querySelector('.footer');
const dots = document.getElementById('dots');
const chatLimit = 25;

// Initialize localStorage
if (!localStorage.getItem('chats')) {
  localStorage.setItem('chats', JSON.stringify([]));
}

// Get chats from localStorage
let chats = JSON.parse(localStorage.getItem('chats'));

// Function to add chat to localStorage
function addChat(question, answer) {
  const newChat = {
    id: chats.length + 1,
    question: question,
    answer: answer,
    timestamp: new Date().toLocaleString(),
  };
  chats.push(newChat);
  // If number of chats exceed chatLimit, remove oldest chats
  if (chats.length > chatLimit) {
    chats.shift();
  }
  localStorage.setItem('chats', JSON.stringify(chats));
}

// Function to display chats
function displayChats() {
  chatList.innerHTML = '';
  chats.forEach(chat => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <div class="chatQuestion">${chat.question}</div>
      <div class="chatAnswer">${chat.answer}</div>
      <div class="chatTimestamp">${chat.timestamp}</div>
    `;
    chatList.appendChild(listItem);
  });
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Function to send chat question to API and receive response
async function sendQuery() {
  if (chatQuestion.value) {
    // Add chat to localStorage
    addChat(chatQuestion.value, '');
    // Display chat log
    chatLog.style.display = 'block';
    // Display loader dots
    dots.style.display = 'block';
    // Disable input field and send button
    chatQuestion.disabled = true;
    document.querySelector('.sendButton').style.opacity = '0.5';
    // Get response from API
    const response = await fetch('/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'question': chatQuestion.value
      })
    });
    const data = await response.json();
    // Add chat response to localStorage
    chats[chats.length - 1].answer = data.answer;
    localStorage.setItem('chats', JSON.stringify(chats));
    // Display chat response
    chatResponse.innerHTML = data.answer;
    // Hide loader dots
    dots.style.display = 'none';
    // Enable input field and send button
    chatQuestion.disabled = false;
    chatQuestion.value = '';
    document.querySelector('.sendButton').style.opacity = '1';
    chatQuestion.focus();
    // Scroll to bottom of chat log
    chatLog.scrollTop = chatLog.scrollHeight;
    // Display updated chat log
    displayChats();
  }
}

// Display initial chat log
displayChats();

// Add event listener to chat form
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  sendQuery();
});

// Add event listener to footer link
footer.querySelector('a').addEventListener('click', (event) => {
  event.preventDefault();
  window.open('https://medium.com/@pandaquests', '_blank');
});
