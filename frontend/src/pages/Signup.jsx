import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
        setSuccess("");
    };

    const validateForm = () => {

        // Name validation
        if (formData.name.trim().length < 20) {
            return "Name must be at least 20 characters.";
        }

        if (formData.name.trim().length > 60) {
            return "Name must not exceed 60 characters.";
        }

        // Address validation
        if (!formData.address.trim()) {
            return "Address is required.";
        }

        if (formData.address.trim().length > 400) {
            return "Address must not exceed 400 characters.";
        }

        // Email validation
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(formData.email)) {
            return "Please enter a valid email address.";
        }

        // Password validation
        const passwordPattern =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordPattern.test(formData.password)) {
            return "Password must be 8-16 characters and contain at least one uppercase letter and one special character.";
        }

        // Confirm password
        if (
            formData.password !==
            formData.confirmPassword
        ) {
            return "Passwords do not match.";
        }

        return "";
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {

            await API.post("/auth/signup", {
                name: formData.name.trim(),
                email: formData.email.trim(),
                address: formData.address.trim(),
                password: formData.password
            });

            setSuccess(
                "Account created successfully! Redirecting to login..."
            );

            setFormData({
                name: "",
                email: "",
                address: "",
                password: "",
                confirmPassword: ""
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Signup failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-container">

            <div
                className="auth-card"
                style={{
                    maxWidth: "520px"
                }}
            >

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
                            fontSize: "34px",
                            boxShadow:
                                "0 10px 25px rgba(79,70,229,0.3)"
                        }}
                    >
                        ⭐
                    </div>

                    <h1>Roxiler</h1>

                    <h2>
                        Create Your Account
                    </h2>

                    <p className="subtitle">
                        Join the Store Rating System
                    </p>

                </div>


                {/* Error */}
                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}


                {/* Success */}
                {success && (
                    <div className="success-message">
                        ✅ {success}
                    </div>
                )}


                {/* Signup Form */}
                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <label htmlFor="name">
                        Full Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        minLength="20"
                        maxLength="60"
                        required
                    />

                    <small
                        style={{
                            color: "#6b7280",
                            marginTop: "5px"
                        }}
                    >
                        20–60 characters
                    </small>


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


                    {/* Address */}
                    <label htmlFor="address">
                        Address
                    </label>

                    <textarea
                        id="address"
                        name="address"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={handleChange}
                        maxLength="400"
                        rows="3"
                        required
                        style={{
                            resize: "vertical"
                        }}
                    />

                    <small
                        style={{
                            color: "#6b7280",
                            marginTop: "5px"
                        }}
                    >
                        Maximum 400 characters
                    </small>


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
                            placeholder="Create a password"
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
                                setShowPassword(
                                    !showPassword
                                )
                            }
                            style={{
                                position: "absolute",
                                right: "8px",
                                top: "50%",
                                transform:
                                    "translateY(-50%)",
                                border: "none",
                                background:
                                    "transparent",
                                fontSize: "18px"
                            }}
                        >
                            {showPassword
                                ? "🙈"
                                : "👁️"}
                        </button>

                    </div>


                    <small
                        style={{
                            color: "#6b7280",
                            marginTop: "5px"
                        }}
                    >
                        8–16 characters, 1 uppercase
                        letter and 1 special character
                    </small>


                    {/* Confirm Password */}
                    <label htmlFor="confirmPassword">
                        Confirm Password
                    </label>

                    <div
                        style={{
                            position: "relative"
                        }}
                    >

                        <input
                            id="confirmPassword"
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={
                                formData.confirmPassword
                            }
                            onChange={handleChange}
                            required
                            style={{
                                paddingRight: "55px"
                            }}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                            style={{
                                position: "absolute",
                                right: "8px",
                                top: "50%",
                                transform:
                                    "translateY(-50%)",
                                border: "none",
                                background:
                                    "transparent",
                                fontSize: "18px"
                            }}
                        >
                            {showConfirmPassword
                                ? "🙈"
                                : "👁️"}
                        </button>

                    </div>


                    {/* Create Account */}
                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "⏳ Creating Account..."
                            : "✨ Create Account"}
                    </button>

                </form>


                {/* Login Link */}
                <p className="signup-link">

                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Signup;