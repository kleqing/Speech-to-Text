const uploadButton = document.getElementById("uploadButton");
const recordButton = document.getElementById("recordButton");
const logoutButton = document.getElementById("logoutButton");
const audioFileInput = document.getElementById("audioFile");
const transcriptElement = document.getElementById("transcript");
const statusElement = document.getElementById("status");
const subtitleElement = document.getElementById("pageSubtitle");
const authGate = document.getElementById("authGate");
const appSection = document.getElementById("appSection");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const API_BASE_URL = window.localStorage.getItem("apiBaseUrl") || "http://localhost:3000";

let mediaRecorder = null;
let recordedChunks = [];
let recordingStream = null;
let isRecording = false;
let recognition = null;
let isListening = false;
let finalTranscript = "";

const setStatus = (message) => {
    statusElement.textContent = message;
};

const setTranscript = (message) => {
    transcriptElement.textContent = message || "(Empty transcript)";
};

const setBusy = (busy) => {
    uploadButton.disabled = busy;
    if (!isRecording && !isListening) {
        recordButton.disabled = busy;
    }
};

const showLoginState = () => {
    authGate.classList.remove("hidden");
    appSection.classList.add("hidden");
    if (subtitleElement) {
        subtitleElement.textContent = "Login is required before using upload or microphone transcription.";
    }
};

const showAppState = () => {
    authGate.classList.add("hidden");
    appSection.classList.remove("hidden");
    if (subtitleElement) {
        subtitleElement.textContent = "Upload an audio file, or use your microphone for real-time transcription.";
    }
};

if (!window.localStorage.getItem("accessToken")) {
    showLoginState();
} else {
    showAppState();
}

const getAuthHeader = () => {
    const accessToken = window.localStorage.getItem("accessToken");
    const tokenType = window.localStorage.getItem("tokenType") || "Bearer";

    if (!accessToken) {
        return null;
    }

    return `${tokenType} ${accessToken}`;
};

const transcribeAudio = async (file, endpoint) => {
    if (!file) {
        setStatus("Please provide an audio file.");
        return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    const authHeader = getAuthHeader();
    if (!authHeader) {
        showLoginState();
        setStatus("Please login first.");
        return;
    }

    setBusy(true);
    setStatus("Sending audio for transcription...");

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                Authorization: authHeader,
            },
            body: formData,
        });

        const contentType = response.headers.get("content-type") || "";
        const rawBody = await response.text();

        let data = {};
        if (contentType.includes("application/json") && rawBody) {
            try {
                data = JSON.parse(rawBody);
            } catch (_error) {
                data = {};
            }
        }

        const looksLikeHtml = rawBody.trimStart().toLowerCase().startsWith("<!doctype") ||
            rawBody.trimStart().toLowerCase().startsWith("<html");

        if (!response.ok) {
            if (response.status === 401) {
                window.localStorage.removeItem("accessToken");
                window.localStorage.removeItem("tokenType");
                showLoginState();
                setStatus("Session expired. Please login again.");
                return;
            }

            if (looksLikeHtml) {
                setStatus("API returned HTML instead of JSON. Check that frontend is calling the Node server origin.");
                return;
            }

            setStatus(data.error || rawBody || "Transcription failed.");
            return;
        }

        if (looksLikeHtml) {
            setStatus("API returned HTML instead of JSON. Check that frontend is calling the Node server origin.");
            return;
        }

        setTranscript(data.transcript || "");
        setStatus("Done.");
    } catch (error) {
        setStatus(error.message || "Unexpected error.");
    } finally {
        setBusy(false);
    }
};

uploadButton.addEventListener("click", () => {
    audioFileInput.click();
});

audioFileInput.addEventListener("change", async (event) => {
    const [selectedFile] = event.target.files;
    if (!selectedFile) {
        return;
    }

    await transcribeAudio(selectedFile, `${API_BASE_URL}/api/stt/file`);
    audioFileInput.value = "";
});

logoutButton.addEventListener("click", () => {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("tokenType");
    window.location.href = "./index.html";
});

const stopRecording = () => {
    if (!mediaRecorder || !isRecording) {
        return;
    }

    mediaRecorder.stop();
    isRecording = false;
    recordButton.classList.remove("btn-danger");
    recordButton.textContent = "Start Recording";
    setStatus("Recording stopped. Processing audio...");
};

const createSpeechRecognition = () => {
    if (!SpeechRecognition) {
        return null;
    }

    const instance = new SpeechRecognition();
    instance.lang = "vi-VN";
    instance.continuous = true;
    instance.interimResults = true;

    instance.addEventListener("result", (event) => {
        let interimText = "";

        for (let index = event.resultIndex; index < event.results.length; index += 1) {
            const result = event.results[index];
            const text = result[0].transcript.trim();

            if (result.isFinal) {
                finalTranscript = `${finalTranscript} ${text}`.trim();
            } else {
                interimText = `${interimText} ${text}`.trim();
            }
        }

        setTranscript(`${finalTranscript} ${interimText}`.trim());
        setStatus("Listening in real-time...");
    });

    instance.addEventListener("error", (event) => {
        setStatus(`Microphone error: ${event.error}`);
    });

    instance.addEventListener("end", () => {
        if (isListening) {
            instance.start();
            return;
        }

        recordButton.classList.remove("btn-danger");
        recordButton.textContent = "Start Recording";
        setStatus("Stopped listening.");
    });

    return instance;
};

const startRealtimeListening = () => {
    if (!recognition) {
        recognition = createSpeechRecognition();
    }

    if (!recognition) {
        return false;
    }

    finalTranscript = "";
    setTranscript("");
    isListening = true;
    recognition.start();

    recordButton.classList.add("btn-danger");
    recordButton.textContent = "Stop Recording";
    setStatus("Listening in real-time...");

    return true;
};

const stopRealtimeListening = () => {
    if (!recognition || !isListening) {
        return;
    }

    isListening = false;
    recognition.stop();
};

recordButton.addEventListener("click", async () => {
    if (SpeechRecognition) {
        if (isListening) {
            stopRealtimeListening();
            return;
        }

        startRealtimeListening();
        return;
    }

    if (isRecording) {
        stopRecording();
        return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("Microphone capture is not supported in this browser.");
        return;
    }

    try {
        recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(recordingStream);

        mediaRecorder.addEventListener("dataavailable", (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        });

        mediaRecorder.addEventListener("stop", async () => {
            const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType || "audio/webm" });
            const extension = blob.type.includes("ogg") ? "ogg" : "webm";
            const file = new File([blob], `mic-recording.${extension}`, {
                type: blob.type || "audio/webm",
            });

            if (recordingStream) {
                recordingStream.getTracks().forEach((track) => track.stop());
                recordingStream = null;
            }

            await transcribeAudio(file, `${API_BASE_URL}/api/stt/mic`);
        });

        mediaRecorder.start();
        isRecording = true;
        recordButton.classList.add("btn-danger");
        recordButton.textContent = "Stop Recording";
        setStatus("Recording... click again to stop.");
    } catch (error) {
        setStatus(error.message || "Unable to access microphone.");
    }
});


