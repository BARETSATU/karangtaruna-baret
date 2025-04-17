// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// Referensi Firestore dan Authentication
const db = firebase.firestore();
const auth = firebase.auth();

const messagesContainer = document.getElementById("messages-container");

// Mendapatkan pesan secara real-time dari Firestore
db.collection("messages")
  .orderBy("timestamp")
  .onSnapshot((snapshot) => {
    messagesContainer.innerHTML = ""; 
    snapshot.forEach((doc) => {
      const message = doc.data();
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.textContent = `${message.sender}: ${message.text}`;
      messagesContainer.appendChild(messageElement);
    });
  });

const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const messageText = messageInput.value;
  
  if (auth.currentUser) {
    db.collection("messages").add({
      sender: auth.currentUser.displayName || auth.currentUser.email,
      text: messageText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    messageInput.value = ""; 
  } else {
    alert("Anda harus login untuk mengirim pesan!");
  }
});

const login = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      console.log("User logged in:", result.user.displayName);
    })
    .catch((error) => {
      console.error("Login error:", error);
    });
};

const logout = () => {
  auth.signOut()
    .then(() => {
      console.log("User logged out");
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
};

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User logged in:", user.displayName);
  } else {
    console.log("User logged out");
  }
});