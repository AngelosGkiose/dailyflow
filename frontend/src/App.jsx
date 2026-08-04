import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    async function loadApiMessage() {
      try {
        const response = await fetch("http://127.0.0.1:8000/");

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        setMessage(error.message);
      }
    }

    loadApiMessage();
  }, []);

  return (
    <main>
      <h1>DailyFlow</h1>
      <p>{message}</p>
    </main>
  );
}

export default App;