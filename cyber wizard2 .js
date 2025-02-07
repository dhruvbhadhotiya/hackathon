// Define the API endpoint (Make sure your API key is valid)
const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash";

// ⚠️ WARNING: Exposing API keys in the frontend is NOT secure.
const apiKey = "AIzaSyCP7PyAifq6f531Yb3X6pgRhFNBl7eMBX4"; // Obfuscate it if necessary (see below)

// Chat functionality
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-message");

// Add a message to the chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? "user" : "bot"}`;

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";

    if (!isUser) {
        const icon = document.createElement("i");
        icon.className = "fas fa-brain";
        messageContent.appendChild(icon);
    }

    const text = document.createElement("p");
    text.textContent = message;
    messageContent.appendChild(text);

    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get AI response from Google API
async function getAIResponse(input) {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}` // Directly exposing API keys is risky
    };

    const requestBody = {
        contents: [{
            parts: [{ text: input }]
        }]
    };

    try {
        const response = await fetch(`${apiUrl}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging

        if (!data.results || data.results.length === 0) {
            throw new Error("No results returned from API");
        }

        return data.results[0].content;
    } catch (error) {
        console.error("Fetch error:", error);
        return "Hi, This is Olivia";
    }
}

// Handle sending messages
function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = "";

        // Simulate AI thinking with a slight delay
        setTimeout(async () => {
            const response = await getAIResponse(message);
            addMessage(response);
        }, 1000);
    }
}

// Event listeners
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});
