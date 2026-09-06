import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import RatingStars from "../components/RatingStars";

function OwnerDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [ratings, setRatings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/stores/owner-dashboard");

            const data = response.data?.data;

            setStore(data?.store || null);
            setAverageRating(Number(data?.averageRating) || 0);
            setRatings(Array.isArray(data?.ratings) ? data.ratings : []);
        } catch (err) {
            console.error("Owner Dashboard Error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load owner dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="app-layout">

            {/* ================= SIDEBAR ================= */}
            <aside className="sidebar">

                <div className="sidebar-logo">
                    <div style={{ fontSize: "38px" }}>⭐</div>

                    <h2>Roxiler</h2>

                    <p>Store Rating System</p>
                </div>

                <div className="sidebar-menu">

                    <button
                        className="active"
                        onClick={() => navigate("/owner")}
                    >
                        📊 Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/change-password")}
                    >
                        🔑 Change Password
                    </button>

                    <button onClick={logout}>
                        🚪 Logout
                    </button>

                </div>
            </aside>


            {/* ================= MAIN CONTENT ================= */}
            <main className="main-content">

                {/* TOP NAVBAR */}
                <div className="top-navbar">

                    <div>
                        <strong>Owner Dashboard</strong>

                        <div
                            style={{
                                fontSize: "13px",
                                color: "#6b7280",
                                marginTop: "3px"
                            }}
                        >
                            Manage your store and customer ratings
                        </div>
                    </div>


                    <div className="user-info">

                        <div className="user-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || "O"}
                        </div>

                        <div>
                            <strong>
                                {user?.name || "Store Owner"}
                            </strong>

                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#6b7280"
                                }}
                            >
                                STORE OWNER
                            </div>
                        </div>

                    </div>

                </div>


                {/* PAGE HEADER */}
                <div className="page-header">

                    <div>
                        <h1>
                            Welcome back! 👋
                        </h1>

                        <p>
                            Monitor your store performance and customer feedback.
                        </p>
                    </div>

                </div>


                {/* ERROR */}
                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}


                {/* LOADING */}
                {loading && (
                    <div className="card loading">
                        ⏳ Loading dashboard...
                    </div>
                )}


                {/* ================= NO STORE ================= */}
                {!loading && !store && (

                    <div className="card empty-state">

                        <div
                            style={{
                                fontSize: "55px",
                                marginBottom: "15px"
                            }}
                        >
                            🏪
                        </div>

                        <h2>
                            No Store Assigned
                        </h2>

                        <p>
                            You currently do not have a store assigned
                            to your owner account.
                        </p>

                    </div>
                )}


                {/* ================= STORE DATA ================= */}
                {!loading && store && (
                    <>
                        {/* ================= STAT CARDS ================= */}
                        <div className="stats-grid">

                            {/* STORE */}
                            <div className="stat-card">

                                <div>
                                    <h3>
                                        MY STORE
                                    </h3>

                                    <div
                                        style={{
                                            fontSize: "19px",
                                            fontWeight: "800",
                                            marginTop: "10px"
                                        }}
                                    >
                                        {store.name}
                                    </div>
                                </div>

                                <div className="stat-icon">
                                    🏪
                                </div>

                            </div>


                            {/* AVERAGE RATING */}
                            <div className="stat-card">

                                <div>
                                    <h3>
                                        AVERAGE RATING
                                    </h3>

                                    <div className="number">
                                        {averageRating.toFixed(1)}
                                    </div>

                                    <div
                                        style={{
                                            marginTop: "4px",
                                            fontSize: "13px",
                                            color: "#6b7280"
                                        }}
                                    >
                                        out of 5
                                    </div>
                                </div>

                                <div className="stat-icon">
                                    ⭐
                                </div>

                            </div>


                            {/* TOTAL RATINGS */}
                            <div className="stat-card">

                                <div>
                                    <h3>
                                        TOTAL RATINGS
                                    </h3>

                                    <div className="number">
                                        {ratings.length}
                                    </div>
                                </div>

                                <div className="stat-icon">
                                    👥
                                </div>

                            </div>

                        </div>


                        {/* ================= STORE INFORMATION ================= */}
                        <div className="card">

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "20px",
                                    flexWrap: "wrap",
                                    marginBottom: "20px"
                                }}
                            >
                                <div>
                                    <h2 style={{ marginBottom: "6px" }}>
                                        🏪 Store Information
                                    </h2>

                                    <p
                                        style={{
                                            color: "#6b7280",
                                            margin: 0
                                        }}
                                    >
                                        Details of your assigned store
                                    </p>
                                </div>

                                <span className="badge badge-owner">
                                    OWNER
                                </span>
                            </div>


                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap: "18px"
                                }}
                            >

                                <div
                                    style={{
                                        padding: "18px",
                                        background: "#f8fafc",
                                        borderRadius: "12px"
                                    }}
                                >
                                    <small
                                        style={{
                                            color: "#6b7280"
                                        }}
                                    >
                                        STORE NAME
                                    </small>

                                    <h3
                                        style={{
                                            marginTop: "8px"
                                        }}
                                    >
                                        {store.name}
                                    </h3>
                                </div>


                                <div
                                    style={{
                                        padding: "18px",
                                        background: "#f8fafc",
                                        borderRadius: "12px"
                                    }}
                                >
                                    <small
                                        style={{
                                            color: "#6b7280"
                                        }}
                                    >
                                        EMAIL
                                    </small>

                                    <h3
                                        style={{
                                            marginTop: "8px",
                                            fontSize: "16px",
                                            wordBreak: "break-word"
                                        }}
                                    >
                                        📧 {store.email}
                                    </h3>
                                </div>


                                <div
                                    style={{
                                        padding: "18px",
                                        background: "#f8fafc",
                                        borderRadius: "12px"
                                    }}
                                >
                                    <small
                                        style={{
                                            color: "#6b7280"
                                        }}
                                    >
                                        ADDRESS
                                    </small>

                                    <h3
                                        style={{
                                            marginTop: "8px",
                                            fontSize: "16px",
                                            lineHeight: "1.5"
                                        }}
                                    >
                                        📍 {store.address}
                                    </h3>
                                </div>

                            </div>

                        </div>


                        {/* ================= RATING SUMMARY ================= */}
                        <div className="card">

                            <h2>
                                ⭐ Rating Summary
                            </h2>

                            <p
                                style={{
                                    color: "#6b7280",
                                    marginBottom: "20px"
                                }}
                            >
                                See how customers are rating your store.
                            </p>


                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "18px",
                                    padding: "20px",
                                    background: "#f8fafc",
                                    borderRadius: "14px",
                                    flexWrap: "wrap"
                                }}
                            >

                                <div
                                    style={{
                                        fontSize: "48px",
                                        fontWeight: "800"
                                    }}
                                >
                                    {averageRating.toFixed(1)}
                                </div>

                                <div>

                                    <RatingStars
                                        rating={averageRating}
                                        readonly={true}
                                    />

                                    <div
                                        style={{
                                            color: "#6b7280",
                                            fontSize: "14px",
                                            marginTop: "5px"
                                        }}
                                    >
                                        Based on {ratings.length} customer
                                        {ratings.length !== 1 ? "s" : ""}
                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* ================= CUSTOMER RATINGS ================= */}
                        <div className="card">

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "20px",
                                    flexWrap: "wrap",
                                    gap: "10px"
                                }}
                            >

                                <div>
                                    <h2>
                                        👥 Customer Ratings
                                    </h2>

                                    <p
                                        style={{
                                            color: "#6b7280",
                                            marginTop: "5px"
                                        }}
                                    >
                                        Ratings submitted by your customers.
                                    </p>
                                </div>

                                <span className="badge">
                                    {ratings.length} Rating
                                    {ratings.length !== 1 ? "s" : ""}
                                </span>

                            </div>


                            {ratings.length === 0 ? (

                                <div
                                    className="empty-state"
                                    style={{
                                        padding: "35px 20px"
                                    }}
                                >

                                    <div
                                        style={{
                                            fontSize: "45px"
                                        }}
                                    >
                                        ⭐
                                    </div>

                                    <h3>
                                        No Ratings Yet
                                    </h3>

                                    <p>
                                        Your customers have not submitted
                                        any ratings yet.
                                    </p>

                                </div>

                            ) : (

                                <div className="table-container">

                                    <table className="data-table">

                                        <thead>
                                            <tr>
                                                <th>
                                                    CUSTOMER
                                                </th>

                                                <th>
                                                    EMAIL
                                                </th>

                                                <th>
                                                    ADDRESS
                                                </th>

                                                <th>
                                                    RATING
                                                </th>

                                                <th>
                                                    DATE
                                                </th>
                                            </tr>
                                        </thead>


                                        <tbody>

                                            {ratings.map((rating) => (

                                                <tr key={rating.user_id}>

                                                    <td>
                                                        <strong>
                                                            {rating.name}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {rating.email}
                                                    </td>

                                                    <td>
                                                        {rating.address}
                                                    </td>

                                                    <td>

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "8px"
                                                            }}
                                                        >

                                                            <RatingStars
                                                                rating={
                                                                    Number(
                                                                        rating.rating
                                                                    )
                                                                }
                                                                readonly={true}
                                                            />

                                                            <strong>
                                                                {rating.rating}/5
                                                            </strong>

                                                        </div>

                                                    </td>

                                                    <td>
                                                        {rating.updated_at
                                                            ? new Date(
                                                                  rating.updated_at
                                                              ).toLocaleDateString()
                                                            : "-"}
                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>


                        {/* ================= QUICK ACTIONS ================= */}
                        <div className="card">

                            <h2>
                                ⚡ Quick Actions
                            </h2>

                            <p
                                style={{
                                    color: "#6b7280",
                                    marginBottom: "20px"
                                }}
                            >
                                Manage your account quickly.
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate("/change-password")
                                }
                            >
                                🔑 Change Password
                            </button>

                        </div>

                    </>
                )}

            </main>
        </div>
    );
}

export default OwnerDashboard;