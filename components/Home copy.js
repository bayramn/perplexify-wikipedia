/*global chrome*/
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../src/context";
import SpinnerIcon from "../assets/spinner.svg";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    // Load the API key from chrome.storage.local on mount
    localStorage.getItem("apiKey", (result) => {
      if (result.apiKey) {
        setApiKey(result.apiKey);
      }
    });
  }, []);

  const saveApiKey = () => {
    localStorage.setItem({ apiKey }, () => {
      alert("API key saved!");
    });
  };

  return (
    <div className="home">
      <h2>Configure API Key</h2>
      <p>Enter your Perplexity API key:</p>
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        placeholder="Enter API Key"
      />
      <button
        onClick={saveApiKey}
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        Save API Key
      </button>
    </div>
  );
};

export default Home;
