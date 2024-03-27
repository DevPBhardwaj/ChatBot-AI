import { useState } from "react";
import "./App.css";

function App() {
  // State variables
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Function to handle sending messages
  const chat = async (e, message) => {
    e.preventDefault();

    // Do not send empty messages
    if (!message) return;

    // Show typing indicator and scroll to bottom
    setIsTyping(true);
    window.scrollTo(0, 1e10);

    // Add user message to chat history
    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    // Clear input field
    setMessage("");

    // Send message to server and handle response
    fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chats,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Add bot response to chat history and hide typing indicator
        msgs.push(data.output);
        setChats(msgs);
        setIsTyping(false);
        window.scrollTo(0, 1e10);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Render the chat interface
  return (
    <main>
      {/* Main title */}
      <h1>GRAPH-AI</h1>

      {/* Display chat messages */}
      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
      </section>

      {/* Display typing indicator */}
      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
        </p>
      </div>

      {/* Input form for sending messages */}
      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="How can i help with your graphic design today ..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default App;
