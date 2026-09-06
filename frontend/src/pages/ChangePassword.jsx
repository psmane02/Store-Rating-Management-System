import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ChangePassword() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
        setSuccess("");
    };

    // ==========================================
    // TOGGLE PASSWORD
    // ==========================================

    const togglePassword = (field) => {

        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field]
        });
    };

    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // Confirm password
        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {
            setError(
                "New password and confirm password do not match."
            );
            return;
        }

        // Password validation
        const passwordPattern =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordPattern.test(formData.newPassword)) {

            setError(
                "Password must be 8-16 characters and contain at least one uppercase letter and one special character."
            );

            return;
        }

        // Same password check
        if (
            formData.currentPassword ===
            formData.newPassword
        ) {
            setError(
                "New password must be different from current password."
            );
            return;
        }

        try {

            setLoading(true);

            const response = await API.put(
                "/auth/change-password",
                {
                    currentPassword:
                        formData.currentPassword,

                    newPassword:
                        formData.newPassword
                }
            );

            setSuccess(
                response.data?.message ||
                "Password changed successfully!"
            );

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {

            console.error(
                "Change Password Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to change password."
            );

        } finally {

            setLoading(false);
        }
    };

    // ==========================================
    // GO BACK
    // ==========================================

    const handleBack = () => {

        const userData =
            localStorage.getItem("user");

        if (!userData) {
            navigate("/login");
            return;
        }

        try {

            const user =
                JSON.parse(userData);

            if (user.role === "ADMIN") {
                navigate("/admin");

            } else if (user.role === "USER") {
                navigate("/user");

            } else if (user.role === "OWNER") {
                navigate("/owner");

            } else {
                navigate("/login");
            }

        } catch (error) {

            navigate("/login");
        }
    };

    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="change-password-page">

            <div className="change-password-card">

                {/* HEADER */}

                <div className="password-header">

                    <div className="password-icon">
                        🔐
                    </div>

                    <div>
                        <h1>Change Password</h1>

                        <p>
                            Keep your account secure by
                            updating your password
                        </p>
                    </div>

                </div>

                {/* SECURITY INFO */}

                <div className="security-info">

                    <span className="security-icon">
                        🛡️
                    </span>

                    <div>
                        <strong>
                            Password Security
                        </strong>

                        <p>
                            Use a strong password that you
                            don't use on other websites.
                        </p>
                    </div>

                </div>

                {/* ERROR */}

                {error && (

                    <div className="password-error">

                        <span>❌</span>

                        <span>{error}</span>

                    </div>
                )}

                {/* SUCCESS */}

                {success && (

                    <div className="password-success">

                        <span>✅</span>

                        <span>{success}</span>

                    </div>
                )}

                {/* FORM */}

                <form
                    className="password-form"
                    onSubmit={handleSubmit}
                >

                    {/* CURRENT PASSWORD */}

                    <div className="password-field">

                        <label>
                            Current Password
                        </label>

                        <div className="password-input-wrapper">

                            <span className="input-icon">
                                🔑
                            </span>

                            <input
                                type={
                                    showPassword.current
                                        ? "text"
                                        : "password"
                                }
                                name="currentPassword"
                                placeholder="Enter your current password"
                                value={
                                    formData.currentPassword
                                }
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    togglePassword("current")
                                }
                            >
                                {showPassword.current
                                    ? "🙈"
                                    : "👁️"}
                            </button>

                        </div>

                    </div>

                    {/* NEW PASSWORD */}

                    <div className="password-field">

                        <label>
                            New Password
                        </label>

                        <div className="password-input-wrapper">

                            <span className="input-icon">
                                🔒
                            </span>

                            <input
                                type={
                                    showPassword.new
                                        ? "text"
                                        : "password"
                                }
                                name="newPassword"
                                placeholder="Enter your new password"
                                value={
                                    formData.newPassword
                                }
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    togglePassword("new")
                                }
                            >
                                {showPassword.new
                                    ? "🙈"
                                    : "👁️"}
                            </button>

                        </div>

                        <div className="password-requirements">

                            <strong>
                                Password must contain:
                            </strong>

                            <span>
                                ✓ 8-16 characters
                            </span>

                            <span>
                                ✓ At least one uppercase letter
                            </span>

                            <span>
                                ✓ At least one special character
                            </span>

                        </div>

                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div className="password-field">

                        <label>
                            Confirm New Password
                        </label>

                        <div className="password-input-wrapper">

                            <span className="input-icon">
                                🔐
                            </span>

                            <input
                                type={
                                    showPassword.confirm
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                placeholder="Confirm your new password"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    togglePassword("confirm")
                                }
                            >
                                {showPassword.confirm
                                    ? "🙈"
                                    : "👁️"}
                            </button>

                        </div>

                    </div>

                    {/* BUTTONS */}

                    <button
                        type="submit"
                        className="change-password-button"
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Changing Password...
                            </>
                        ) : (
                            <>
                                🔐 Change Password
                            </>
                        )}

                    </button>

                    <button
                        type="button"
                        className="back-dashboard-button"
                        onClick={handleBack}
                    >
                        ← Back to Dashboard
                    </button>

                </form>

                {/* FOOTER */}

                <div className="password-footer">

                    <span>🛡️</span>

                    <span>
                        Your password is securely encrypted.
                    </span>

                </div>

            </div>

        </div>
    );
}

export default ChangePassword;