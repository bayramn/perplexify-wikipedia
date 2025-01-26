/*global chrome*/
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../src/context";
import SpinnerIcon from "../assets/spinner.svg";

const Home = () => {
  const [apiKey, setApiKey] = useState("");
  const [localApiKey, setLocalApiKey] = useState("");
  const [message, setMessage] = useState(null); // For success/error messages

  // Load the API key from chrome.storage.local on mount
  useEffect(() => {
    chrome.storage.local.get("apiKey", (result) => {
      if (result.apiKey) {
        console.log("apiKey already exists: ", result.apiKey);
        setLocalApiKey(result.apiKey);
      }
    });
  }, []);

  const saveApiKey = () => {
    if (!apiKey) {
      setAlert("error", "API key cannot be empty!");

      return;
    }
    chrome.storage.local.set({ apiKey }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error saving API key:",
          chrome.runtime.lastError.message
        );
        setAlert("error", "Error saving API key!");
      } else {
        console.log("API key saved:", apiKey);
        setLocalApiKey(apiKey);
        setAlert("success", "API key saved successfully!");
      }
    });
  };

  const removeApiKey = () => {
    chrome.storage.local.remove("apiKey", () => {
      setApiKey("");
      setLocalApiKey("");
      setAlert("success", "API key removed successfully!");
    });
  };

  const clearMessage = () => setMessage(null);

  const setAlert = (type, message) => {
    setMessage({ type: type, text: message });

    setTimeout(() => {
      clearMessage();
    }, 2000);
  };

  return (
    <div className="home">
      {/* Success/Error Message */}
      {message && (
        <div
          style={{
            position: "absolute",
            top: "1em",
            marginTop: "16px",
            padding: "5px",
            border: `1px solid ${
              message.type === "success" ? "#4CAF50" : "#f44336"
            }`,
            backgroundColor: message.type === "success" ? "#dff0d8" : "#f8d7da",
            color: message.type === "success" ? "#3c763d" : "#721c24",
            borderRadius: "4px",
          }}
          onClick={clearMessage}
        >
          {message.text}
        </div>
      )}
      <h2>Configure API Key</h2>
      {!localApiKey ? (
        <p>Enter your Perplexity API key:</p>
      ) : (
        <p>Your API key:</p>
      )}

      {/* Input Field */}
      {!localApiKey ? (
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
          placeholder="Enter API Key"
        />
      ) : (
        <b>{localApiKey.slice(0, 20)}...</b>
      )}

      {/* Save Button */}
      {!localApiKey && (
        <button
          onClick={saveApiKey}
          style={{
            padding: "5px 10px",
            marginRight: "8px",
            backgroundColor: apiKey ? "#4CAF50" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: apiKey ? "pointer" : "not-allowed",
          }}
          // disabled={!apiKey}
        >
          Save API Key
        </button>
      )}

      {/* Remove Button */}
      {localApiKey && (
        <button
          onClick={removeApiKey}
          style={{
            padding: "5px 10px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Remove API Key
        </button>
      )}
      <div>
        <p
          onClick={() => {
            chrome.runtime.sendMessage({
              action: "openTab",
              url: `https://www.perplexity.ai/settings/api`,
            });
          }}
          style={{
            marginTop: "10em",
            textDecoration: "underline",
            color: "blue",
            cursor: "pointer",
          }}
        >
          Get your API key
        </p>
      </div>
    </div>
  );
};

export default Home;
