import React, { useState } from "react";
import axios from "axios";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const getTokenAsync = async (tokenEndpoint) => {
    try {
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": "0f9cd7ac7a9243868cf99a4a7cc1416c",
        },
      });
      const token = await response.text();
      return token;
    } catch (error) {
      console.error("Error in token request:", error);
      return null;
    }
  };

  const playAudioAsync = async (token, speechEndpoint) => {
    const headers = {
      "Content-Type": "application/ssml+xml",
      // "User-Agent": "SI-text-to-speech-api-finalproject",
      "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
      Authorization: `Bearer ${token}`,
    };
    const body = `
      <speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Male'
      name='en-US-ChristopherNeural'>
        ${text}
      </voice></speak>
    `;
    try {
      const response = await axios.post(speechEndpoint, body, {
        headers,
        responseType: "arraybuffer",
      });
      console.log("Audio Played");
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      audioContext.decodeAudioData(response.data, (buffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
      });
    } catch (error) {
      console.error("Error in textToSpeech:", error);
    }
  };

  const handlePlayAudio = async () => {
    const tokenEndpoint =
      "https://eastus.api.cognitive.microsoft.com/sts/v1.0/issuetoken";
    const speechEndpoint =
      "https://eastus.tts.speech.microsoft.com/cognitiveservices/v1";

    // Get the token
    const token = await getTokenAsync(tokenEndpoint);
    if (!token) {
      return;
    }
    console.log(token);

    await playAudioAsync(token, speechEndpoint);
  };

  return (
    <div>
      <h1>Text-to-Speech</h1>
      <textarea
        value={text}
        onChange={handleInputChange}
        rows="5"
        cols="50"
        placeholder="Enter your text here..."
      />
      <br />
      <button onClick={handlePlayAudio}>Play Audio</button>
    </div>
  );
};

export default TextToSpeech;
