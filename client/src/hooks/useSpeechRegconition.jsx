import { useEffect, useState } from "react";

let recognition = null;

if ("webkitSpeechRecognition" in window) {
  recognition = new window.webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";
}

const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      console.log("onresult event: ", transcript);
      setText(transcript);
      setIsListening(false);
      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error: ", event.error);
      setError(event.error);
      setIsListening(false);
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (!isListening) {
      setText("");
      setError(null);
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    console.log("text: ", text);
    setIsListening(false);
    recognition.stop();
  };

  return {
    text,
    isListening,
    error,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  };
};

export default useSpeechRecognition;
