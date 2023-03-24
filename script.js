// Initialize Firebase
const Config = {
  apiKey: "AIzaSyBPc2zQpBki-sUj5cCNKjkvDzAxFDWwDug",
  authDomain: "charles-7c310.firebaseapp.com",
  projectId: "charles-7c310",
  storageBucket: "charles-7c310.appspot.com",
  messagingSenderId: "193812047899",
  appId: "1:193812047899:web:f03707c2b8b06f3a2830be",
  measurementId: "G-PYZ8YZPLL0"
};

firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// Get a reference to the chat messages div
var chatMessages = document.getElementById("chat-messages");

// Get a reference to the chat input field
var chatInput = document.getElementById("chat-input");

// Get a reference to the send button
var sendButton = document.getElementById("send-button");

// Get a reference to the login button
var loginButton = document.getElementById("login-button");

// Get a reference to the logout button
var logoutButton = document.getElementById("logout-button");

// Get a reference to the history button
var historyButton = document.getElementById("history-button");

// Get a reference to the history modal
var historyModal = document.getElementById("history-modal");

// Get a reference to the history table body
var historyTableBody = document.getElementById("history-table-body");

// Get a reference to the delete history button
var deleteHistoryButton = document.getElementById("delete-history-button");

// Get a reference to the max chats allowed
var maxChats = 25;

// Get a reference to the user's chats
var userChats = [];

// Check if the user is logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    loginButton.style.display = "none";
    logoutButton.style.display = "block";
    historyButton.style.display = "block";

    // Load the user's chats
    loadChats();
  } else {
    // User is signed out
    loginButton.style.display = "block";
    logoutButton.style.display = "none";
    historyButton.style.display = "none";
  }
});

// Send a chat message
sendButton.onclick = function() {
  var message = chatInput.value.trim();
  if (message) {
    // Add the message to the chat messages div
    var chatMessage = document.createElement("div");
    chatMessage.classList.add("chat-message");
    chatMessage.classList.add("user-message");
    chatMessage.textContent = message;
    chatMessages.appendChild(chatMessage);

    // Clear the chat input field
    chatInput.value = "";

    // Add the message to the database
    addChat(message);
  }
};

// Log the user in with Google
loginButton.onclick = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // The user is signed in
  }).catch(function(error) {
    // An error occurred
    console.log(error);
  });
};

// Log the user out
logoutButton.onclick = function() {
  firebase.auth().signOut().then(function() {
    // The user is signed out
  }).catch(function(error) {
    // An error occurred
    console.log(error);
  });
};

// Open the chat history modal
historyButton.onclick = function() {
  historyModal.style.display = "block";
};

// Close the chat history modal
historyModal.onclick = function(event) {
  if (event.target == historyModal) {
    historyModal.style.display = "none";
  }
};

// Delete the chat history
deleteHistoryButton.onclick = function() {
  deleteChats();
};

// Load the user's chats from the database
function loadChats() {
  var userId = firebase.auth().currentUser.uid;
  var userChatsRef = firebase.database().ref('users/' + userId + '/chats').limitToLast(25);

  userChatsRef.on('child_added', function(snapshot) {
    var chatId = snapshot.key;
    var chatData = snapshot.val();

    // Load chat messages
    var chatMessagesRef = firebase.database().ref('chats/' + chatId + '/messages').limitToLast(100);

    chatMessagesRef.on('child_added', function(snapshot) {
      var messageData = snapshot.val();

      // Render chat message
      renderChatMessage(chatId, messageData);
    });

    // Store chat data for reference
    chatData.id = chatId;
    userChats[chatId] = chatData;

    // Render chat tab
    renderChatTab(chatId, chatData);
  });

  userChatsRef.on('child_removed', function(snapshot) {
    var chatId = snapshot.key;
    var chatData = snapshot.val();

    // Remove chat from local store
    delete userChats[chatId];

    // Remove chat tab
    removeChatTab(chatId);

    // Remove chat messages
    removeChatMessages(chatId);
  });
}

function renderChatMessage(chatId, messageData) {
  var messageEl = document.createElement('div');
  messageEl.classList.add('chat-message');
  messageEl.classList.add(messageData.sender == 'bot' ? 'bot' : 'user');
  messageEl.textContent = messageData.message;

  var chatMessagesEl = document.getElementById('chat-messages-' + chatId);
  chatMessagesEl.appendChild(messageEl);
}

function renderChatTab(chatId, chatData) {
  var chatTabEl = document.createElement('div');
  chatTabEl.classList.add('chat-tab');
  chatTabEl.id = 'chat-tab-' + chatId;

  var chatTabIconEl = document.createElement('div');
  chatTabIconEl.classList.add('chat-tab-icon');
  chatTabIconEl.style.backgroundImage = 'url(' + chatData.icon + ')';

  var chatTabNameEl = document.createElement('div');
  chatTabNameEl.classList.add('chat-tab-name');
  chatTabNameEl.textContent = chatData.name;

  var chatTabUnreadEl = document.createElement('div');
  chatTabUnreadEl.classList.add('chat-tab-unread');

  chatTabEl.appendChild(chatTabIconEl);
  chatTabEl.appendChild(chatTabNameEl);
  chatTabEl.appendChild(chatTabUnreadEl);

  var chatsEl = document.getElementById('chats');
  chatsEl.appendChild(chatTabEl);

  chatTabEl.addEventListener('click', function() {
    switchChat(chatId);
  });
}

function removeChatTab(chatId) {
  var chatTabEl = document.getElementById('chat-tab-' + chatId);
  chatTabEl.remove();
}

function removeChatMessages(chatId) {
  var chatMessagesEl = document.getElementById('chat-messages-' + chatId);
  chatMessagesEl.innerHTML = '';
}

function switchChat(chatId) {
  // Update active chat
  activeChatId = chatId;

  // Mark chat as read
  userChats[chatId].unread = 0;
  var chatTabUnreadEl = document.getElementById('chat-tab-' + chatId).querySelector('.chat-tab-unread');
  chatTabUnreadEl.textContent = '';

  // Show chat messages
  var chatMessagesEl = document.getElementById('chat-messages');
  chatMessagesEl.innerHTML = '';

    var chatMessagesRef = firebase.database().ref('chats/' + userId);
  chatMessagesRef.limitToLast(25).on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var message = childSnapshot.val().message;
      var sender = childSnapshot.val().sender;
      var time = childSnapshot.val().time;
      displayChatMessage(message, sender, time);
    });
  });
}

function displayChatMessage(message, sender, time) {
  var chatbox = document.getElementById('chatbox');

  var messageWrapper = document.createElement('div');
  messageWrapper.classList.add('message-wrapper');
  if (sender === 'Charles') {
    messageWrapper.classList.add('charles');
  } else {
    messageWrapper.classList.add('user');
  }

  var messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.textContent = message;

  var messageInfo = document.createElement('div');
  messageInfo.classList.add('message-info');
  messageInfo.textContent = sender + ' @ ' + time;

  messageWrapper.appendChild(messageContent);
  messageWrapper.appendChild(messageInfo);
  chatbox.appendChild(messageWrapper);

  chatbox.scrollTop = chatbox.scrollHeight;
}

function saveChatMessage(message, sender) {
  var userId = firebase.auth().currentUser.uid;
  var chatMessageRef = firebase.database().ref('chats/' + userId).push();
  var timestamp = new Date().toLocaleTimeString();
  chatMessageRef.set({
    message: message,
    sender: sender,
    time: timestamp
  });
}

document.getElementById('message-form').addEventListener('submit', function(e) {
  e.preventDefault();
  var messageInput = document.getElementById('message-input');
  var message = messageInput.value.trim();
  if (message !== '') {
    saveChatMessage(message, 'User');
    messageInput.value = '';
    messageInput.focus();
    getResponse(message);
  }
});

function getResponse(input) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/get-response');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      saveChatMessage(response.output, 'Charles');
      displayChatMessage(response.output, 'Charles', new Date().toLocaleTimeString());
    } else {
      console.log('Request failed.  Returned status of ' + xhr.status);
    }
  };
  xhr.send(JSON.stringify({
    input: input
  }));
}

function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      document.getElementById('sign-in').style.display = 'none';
      document.getElementById('sign-out').style.display = 'block';
      document.getElementById('chat').style.display = 'block';
      loadChats();
    } else {
      document.getElementById('sign-in').style.display = 'block';
      document.getElementById('sign-out').style.display = 'none';
      document.getElementById('chat').style.display = 'none';
    }
  });

  document.getElementById('sign-in').addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });

  document.getElementById('sign-out').addEventListener('click', function() {
    firebase.auth().signOut();
  });
}

window.onload = function() {
  initApp();
};


 
