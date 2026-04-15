// Generate a unique session ID for the user
const sessionId = Math.random().toString(36).substring(2, 15);

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

async function sendMessage() {
    const inputElement = document.getElementById("user-input");
    const message = inputElement.value.trim();
    if (!message) return;

    // Clear input
    inputElement.value = "";
    inputElement.disabled = true;
    document.getElementById("send-btn").disabled = true;

    // Append user message
    appendMessage(message, "user-message");
    
    // Show typing indicator
    const chatBox = document.getElementById("chat-box");
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.id = "typing-indicator";
    typingIndicator.innerText = "Manas-Yantra is contemplating...";
    chatBox.appendChild(typingIndicator);
    typingIndicator.style.display = "block";
    scrollToBottom();

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                session_id: sessionId
            })
        });

        const data = await response.json();
        
        // Remove typing
        typingIndicator.remove();
        
        // Append AI response
        appendMessage(data.response, "ai-message");
        
    } catch (error) {
        typingIndicator.remove();
        appendMessage("System failure.", "ai-message");
        console.error(error);
    } finally {
        inputElement.disabled = false;
        document.getElementById("send-btn").disabled = false;
        inputElement.focus();
        scrollToBottom();
    }
}

function appendMessage(text, className) {
    const chatBox = document.getElementById("chat-box");
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${className}`;
    
    // Simple text-to-HTML conversion preserving newlines
    const p = document.createElement("p");
    p.textContent = text;
    // Safely transform line breaks
    p.innerHTML = p.innerHTML.replace(/\n/g, "<br>");
    
    msgDiv.appendChild(p);
    chatBox.appendChild(msgDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}
