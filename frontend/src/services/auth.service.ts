import axios from "axios";

const API_URL = "/api/auth/";

// Create a separate axios instance for auth endpoints (no interceptors)
const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

class AuthService {
    login(username: string, password: string) {
        console.log("🔐 Attempting login for:", username);
        return authAxios
            .post("signin", {
                username,
                password
            })
            .then(response => {
                console.log("✅ Login successful, response:", response.data);
                // store only necessary user info (no token)
                const userInfo = {
                    userId: response.data.userId,
                    username: response.data.username,
                    roles: response.data.roles,
                };
                localStorage.setItem("user", JSON.stringify(userInfo));
                return userInfo;
            })
            .catch(error => {
                console.error("❌ Login failed:", error.response?.status, error.response?.data);
                throw error;
            });
    }

    logout() {
        console.log("🔓 Logging out");
        const logoutPromise = authAxios.post("logout").catch(() => { });
        localStorage.removeItem("user");
        return logoutPromise;
    }

    register(username: string, email: string, password: string, role: string[]) {
        console.log("📝 Attempting signup for:", username, "with role:", role);
        return authAxios.post("signup", {
            username,
            email,
            password,
            role
        })
            .then(response => {
                console.log("✅ Signup successful");
                return response;
            })
            .catch(error => {
                console.error("❌ Signup failed:", error.response?.status, error.response?.data);
                throw error;
            });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);
        return null;
    }
}

const authService = new AuthService();

// ensure axios sends cookies for session-based auth
axios.defaults.withCredentials = true;

// remove interceptors - no JWT token

export default authService;
