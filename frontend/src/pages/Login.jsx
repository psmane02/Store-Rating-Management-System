import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await API.post("/auth/login", formData);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            const role = response.data.user.role;

            if (role === "ADMIN") {
                navigate("/admin");
            } else if (role === "USER") {
                navigate("/user");
            } else if (role === "OWNER") {
                navigate("/owner");
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please check your email and password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                {/* Logo */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "20px"
                    }}
                >
                    <div
                        style={{
                            width: "70px",
                            height: "70px",
                            margin: "0 auto 15px",
                            borderRadius: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                                "linear-gradient(135deg, #4f46e5, #7c3aed)",
                            fontSize: "35px",
                            boxShadow:
                                "0 10px 25px rgba(79,70,229,0.3)"
                        }}
                    >
                        ⭐
                    </div>

                    <h1>Roxiler</h1>

                    <h2>
                        Store Rating System
                    </h2>

                    <p className="subtitle">
                        Login to continue
                    </p>
                </div>


                {/* Error */}
                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}


                {/* Login Form */}
                <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <label htmlFor="email">
                        Email Address
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />


                    {/* Password */}
                    <label htmlFor="password">
                        Password
                    </label>

                    <div
                        style={{
                            position: "relative"
                        }}
                    >
                        <input
                            id="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                                paddingRight: "55px"
                            }}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            style={{
                                position: "absolute",
                                right: "8px",
                                top: "50%",
                                transform:
                                    "translateY(-50%)",
                                border: "none",
                                background: "transparent",
                                fontSize: "18px"
                            }}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>


                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "⏳ Logging in..."
                            : "🔐 Login"}
                    </button>

                </form>


                {/* Signup */}
                <p className="signup-link">
                    Don't have an account?{" "}
                    <Link to="/signup">
                        Create Account
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;