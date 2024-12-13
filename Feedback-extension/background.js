chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkLoginAndSend") {
      // Fetch auth token from the external website
      fetch("https://example.com/api/check-login", {
        credentials: "include", // Include cookies for authentication
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.loggedIn) {
            const authToken = data.authToken;
  
            // Send URL and auth token to the specified server
            fetch("https://your-server.com/api/receive-data", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({ url: message.url }),
            })
              .then((response) => response.json())
              .then((result) => {
                console.log("Data sent successfully:", result);
              })
              .catch((error) => console.error("Error sending data:", error));
          } else {
            console.warn("User not logged in.");
          }
        })
        .catch((error) => console.error("Error fetching auth token:", error));
    }
  });
  