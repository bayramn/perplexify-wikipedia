/*global chrome*/

(async () => {
  console.log("Content script is running!");
  // In content.js
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "test") {
      console.log("Test message received:", message.content);
    }
  });
  // Wait for the page to load fully
  // document.addEventListener("DOMContentLoaded", () => {
  const navBar = document.querySelector(
    "#p-associated-pages .vector-menu-content-list"
  );
  console.log("navBar exists");

  if (navBar) {
    // Create a new list item for "Re-generate with Perplexity"
    const regenerateTab = document.createElement("li");
    regenerateTab.id = "ca-regenerate";
    regenerateTab.className = "vector-tab-noicon mw-list-item";

    // Create the link element
    const regenerateLink = document.createElement("a");
    regenerateLink.href = "#";
    regenerateLink.title = "Re-generate this article with Perplexity";
    regenerateLink.innerHTML = "<span>  Re-generate with Perplexity  </span>";
    regenerateLink.innerHTML = `
    <span> Re-generate with Perplexity</span>
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48" style="vertical-align: middle; margin-right: 4px;">
    <linearGradient id="f1cRcgrFgpE5Wk07TriTIa_kzJWN5jCDzpq_gr1" x1="10.586" x2="36.054" y1="1.61" y2="44.121" gradientUnits="userSpaceOnUse">
      <stop offset=".002" stop-color="#9c55d4"></stop>
      <stop offset=".003" stop-color="#20808d"></stop>
      <stop offset=".373" stop-color="#218f9b"></stop>
      <stop offset="1" stop-color="#22b1bc"></stop>
    </linearGradient>
    <path fill="url(#f1cRcgrFgpE5Wk07TriTIa_kzJWN5jCDzpq_gr1)" fill-rule="evenodd" d="M11.469,4l11.39,10.494v-0.002V4.024h2.217v10.517L36.518,4v11.965h4.697v17.258h-4.683v10.654L25.077,33.813v10.18h-2.217V33.979L11.482,44V33.224H6.785V15.965h4.685V4z M21.188,18.155H9.002v12.878h2.477v-4.062L21.188,18.155z M13.699,27.943v11.17l9.16-8.068V19.623L13.699,27.943z M25.141,30.938V19.612l9.163,8.321v5.291h0.012v5.775L25.141,30.938z M36.532,31.033h2.466V18.155H26.903l9.629,8.725V31.033z M34.301,15.965V9.038l-7.519,6.927H34.301z M21.205,15.965h-7.519V9.038L21.205,15.965z" clip-rule="evenodd"></path>
  </svg>
`;
    // Apply styling to the link
    regenerateLink.style.color = "rgb(31, 128, 141)"; // Text color
    //regenerateLink.style.border = "2px solid rgb(31, 128, 141)"; // Border
    regenerateLink.style.borderRadius = "4px"; // Rounded corners
    //regenerateLink.style.padding = "4px"; // Padding inside the button
    //regenerateLink.style.paddingVertical = "4px"; // Padding inside the button
    regenerateLink.style.marginLeft = "8px"; // Space from other nav items
    regenerateLink.style.textDecoration = "none"; // Remove underline
    regenerateLink.style.display = "inline-block"; // Inline block for proper spacing
    //regenerateLink.style.backgroundColor = "rgba(31, 128, 141, 0.1)"; // Light background
    regenerateLink.style.cursor = "pointer"; // Pointer cursor for hover
    // Get the current article title
    // Get the current article title using the correct selector
    const titleElement = document.querySelector("#firstHeading > span");
    const articleTitle = titleElement
      ? titleElement.innerText
      : "Untitled Article";
    console.log("articleTitle: ", articleTitle);
    // Add click event listener to the link
    // regenerateLink.addEventListener("click", async (event) => {
    //   event.preventDefault();

    //   // Send message to background script to handle the Perplexity API call
    //   chrome.runtime.sendMessage(
    //     {
    //       action: "regenerate",
    //       payload: {
    //         messages: [
    //           {
    //             content: `generate wikipedia article-like for ${articleTitle}`,
    //             role: "user",
    //           },
    //         ],
    //         model: "llama-3.1-sonar-small-128k-online",
    //       },
    //     },
    //     (response) => {
    //       if (response.success) {
    //         console.log(response.data);
    //         // Inject the regenerated content into the Wikipedia page
    //         injectContent(response.data);
    //         alert("Article re-generated with Perplexity!");
    //       } else {
    //         alert("Failed to re-generate the article. Please try again.");
    //       }
    //     }
    //   );
    //   const contentContainer = document.querySelector("#mw-content-text");
    //   if (contentContainer) {
    //     contentContainer.innerHTML = `<div class="perplexity-container">
    //       <h2>Re-generated Article</h2>
    //       <div id="stream-content">Loading...</div>
    //     </div>`;
    //   }
    // });

    // Add click event listener to start the API call
    regenerateLink.addEventListener("click", async (event) => {
      event.preventDefault();

      const titleElement = document.querySelector("#firstHeading > span");
      const articleTitle = titleElement
        ? titleElement.innerText
        : "Untitled Article";

      const apiPayload = {
        messages: [
          {
            content: `generate unbiased wikipedia-like article for ${articleTitle}, try not use wikipedia as a source.`,
            role: "user",
          },
        ],
        model: "sonar",
        stream: true,
      };
      try {
        const apiKey = await getApiKey();

        const contentContainer = document.querySelector("#mw-content-text");
        if (contentContainer && apiKey) {
          // <h2>Re-generated Article</h2>
          contentContainer.innerHTML = `<div class="perplexity-container">
          <div id="stream-content">Loading...</div>
        </div>`;
        }

        const streamContainer = document.getElementById("stream-content");
        if (!streamContainer) {
          console.error("Stream container not found");
          return;
        }

        let fullContent = ""; // Initialize full content
        let buffer = ""; // Initialize buffer for incomplete chunks
        let isFinalChunk = false; // Track if it's the last chunk

        if (apiKey) {
          const response = await fetch(
            "https://api.perplexity.ai/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`, // Replace with your Perplexity API key
              },
              body: JSON.stringify(apiPayload),
            }
          );

          if (!response.body)
            throw new Error("No response body available for streaming.");

          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              isFinalChunk = true;
            }
            const chunk = decoder.decode(value, { stream: true });
            //console.log("Raw chunk:", chunk);

            // Process the chunk and update full content and buffer
            const result = await processChunkWithBuffer(
              chunk,
              buffer,
              fullContent
            );
            // console.log("Processed chunk: ", result);
            fullContent = result.fullContent; // Accumulate the content
            buffer = result.buffer; // Update the buffer

            // Update the UI incrementally
            if (fullContent) {
              //streamContainer.innerHTML = fullContent.replace(/\n/g, "<br>");
              //console.log(result.fullContent.citations);
              injectContentStream(
                fullContent.choices[0].message.content,
                result.fullContent.citations,
                isFinalChunk
              );
              // fullContent = "";
            }
            if (isFinalChunk) break;
          }
        } else {
          console.log("apiKey not ");

          streamContainer.innerHTML =
            "<br><strong>Please enter API key on extension popup.</strong>";
        }
        //streamContainer.innerHTML += "<br><strong>Streaming Complete.</strong>";
      } catch (error) {
        console.error("Error fetching streaming data:", error);
        //streamContainer.innerHTML = `<strong>Error:</strong> ${error.message}`;
        alert(error.message);
      }
    });

    regenerateTab.appendChild(regenerateLink);
    navBar.appendChild(regenerateTab);
  }
  function processChunkWithBuffer(chunk, buffer, fullContent) {
    // Add the new chunk to the buffer
    buffer += chunk;

    // Split the buffer into potential JSON objects
    const lines = buffer.split("\n");

    // Reset the buffer (it will be refilled with unparsed data)
    buffer = "";

    lines.forEach((line) => {
      // Skip empty lines or lines without "data:"
      if (line.trim() === "" || !line.startsWith("data:")) return;

      // Remove the `data: ` prefix
      const cleanedLine = line.replace(/^data:\s*/, "").trim();

      // Check if the line ends with a closing curly brace
      if (!cleanedLine.endsWith("}")) {
        // Incomplete JSON, add back to buffer
        buffer += line + "\n";
        return;
      }

      try {
        // Parse the cleaned line as JSON
        const data = JSON.parse(cleanedLine);
        //console.log("Parsed chunk: ", data);
        //fullContent = data.choices[0].message.content;
        fullContent = data;
        // Append `message.content` if it exists
        // if (
        //   data.choices &&
        //   data.choices[0].message &&
        //   data.choices[0].message.content
        // ) {
        //   fullContent += data.choices[0].message.content;
        // }
      } catch (error) {
        console.error("Error parsing JSON object:", error, cleanedLine);
      }
    });

    // Return the accumulated content and the updated buffer
    return { fullContent, buffer };
  }

  function injectContentStream(chunk, citations, isFinalChunk) {
    // Find the main content section of the Wikipedia page
    const contentContainer = document.querySelector("#mw-content-text");

    if (!contentContainer) {
      console.error(
        "Could not find content container to inject the regenerated article."
      );
      return;
    }

    // Ensure the container has the Perplexity styling and structure on the first call
    //if (!contentContainer.querySelector(".perplexity-container")) {
    const style = `
        <style>
          .re-generate-article {
            color: rgb(31, 128, 141);
          }
          .perplexity-container {
            background-color: rgba(31, 128, 141, 0.05); /* Light version of border color */
            border: 2px solid rgb(31, 128, 141); /* Defined border color */
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
          }
          strong, .perplexity-container h2, .perplexity-container h3, .perplexity-container h4 {
            color: rgb(31, 128, 141); /* Matching color for headings */
          }
          .perplexity-container a {
            color: rgb(31, 128, 141); /* Matching color for links */
            text-decoration: none;
          }
          .perplexity-container a:hover {
            text-decoration: underline;
          }
        </style>
      `;
    // <h2>Re-generated Article</h2>
    contentContainer.innerHTML = `
        ${style}
        <div class="perplexity-container">
          <div id="stream-content"></div>
          <div id="references-section"></div>
        </div>
      `;
    // }

    // Get the streaming content container
    const streamContent = document.getElementById("stream-content");

    // Format the chunk content
    const formattedChunk = chunk
      // Handle bold text (**text** -> <strong>text</strong>)
      .replace(/\*\*(.+?)\*\*/g, "<br><strong>$1</strong><br>")
      //.replace(/(^|\s|\n)\*\*(.+?)\*\*(\s|\n|$)/g, "$1<strong>$2</strong>$3")
      // Handle italics (_text_ -> <em>text</em>)
      .replace(/_(.*?)_/g, "<em>$1</em>")
      // Handle emphasized text (*text* -> <em>text</em>)
      // .replace(/(?<!\*)\*(?!\s)(.*?)(?<!\s)\*(?!\*)/g, "<em>$1</em>")
      .replace(/(?<!\*)\*(?!\s)(.*?)(?<!\s)\*(?!\*)/g, "<i>$1</i>")
      // Handle headings (### text -> <h3>text</h3>, ## text -> <h2>, etc.)
      .replace(/^#### (.*?)$/gm, "<h4>$1</h4>")
      .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
      .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
      .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
      // Handle lists (- item -> <li>item</li>)
      .replace(/^- (.*?)$/gm, "<li>$1</li>")
      // Wrap consecutive list items in <ul>
      .replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>");

    // Append the formatted chunk to the streaming content
    streamContent.innerHTML = formattedChunk;

    // If it's the final chunk, add citations
    // console.log(
    //   "isFinalChunk: ",
    //   isFinalChunk,
    //   "citations.length: ",
    //   citations.length
    // );
    if (isFinalChunk && citations.length > 0) {
      console.log("citation");
      const referencesSection = document.getElementById("references-section");
      let referencesHTML = "<h3>References</h3><ul>";
      citations.forEach((citation) => {
        referencesHTML += `<li><a href="${citation}" target="_blank">${citation}</a></li>`;
      });
      referencesHTML += "</ul>";
      referencesSection.innerHTML = referencesHTML;
    }
  }
  // Function to get the API key from the background script
  function getApiKey() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: "getApiKey" }, (response) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.apiKey);
        }
      });
    });
  }
  // // Function to fetch the API key
  // const getApiKey = async () => {

  //   chrome.storage.local.get("apiKey", (result) => {
  //     if (!result.apiKey) {
  //       alert(
  //         "API key is missing. Please configure API key in the extension popup."
  //       );
  //       return false;
  //     } else {
  //       return result.apiKey;
  //     }
  //   });
  // };

  // });
})();
