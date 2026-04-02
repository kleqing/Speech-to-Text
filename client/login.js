const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginStatus = document.getElementById("loginStatus");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const API_BASE_URL = window.localStorage.getItem("apiBaseUrl") || "http://localhost:3000";

const setStatus = (message) => {
    loginStatus.textContent = message;
};

if (window.localStorage.getItem("accessToken")) {
    // Ẩn form ngay lập tức để tránh flash button Login trước khi redirect
    loginForm.style.display = "none";
    loginStatus.textContent = "Redirecting...";
    window.location.replace("./index.html");
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        setStatus("Please enter username and password.");
        return;
    }

    loginButton.disabled = true;
    setStatus("Logging in...");

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const rawBody = await response.text();
        let data = {};

        try {
            data = rawBody ? JSON.parse(rawBody) : {};
        } catch (_error) {
            data = {};
        }

        if (!response.ok) {
            setStatus(data.error || "Login failed.");
            return;
        }

        if (!data.accessToken) {
            setStatus("Login response is missing access token.");
            return;
        }

        window.localStorage.setItem("accessToken", data.accessToken);
        window.localStorage.setItem("tokenType", data.tokenType || "Bearer");
        window.location.href = "./index.html";
    } catch (error) {
        setStatus(error.message || "Unexpected login error.");
    } finally {
        loginButton.disabled = false;
    }
});

