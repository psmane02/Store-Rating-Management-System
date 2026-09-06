import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function UserDashboard() {

    const navigate = useNavigate();

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("ASC");

    const [ratingValues, setRatingValues] = useState({});
    const [submitting, setSubmitting] = useState({});

    const [user, setUser] = useState({
        name: "User",
        email: ""
    });

    // =====================================================
    // GET USER
    // =====================================================

    useEffect(() => {

        const userData = localStorage.getItem("user");

        if (userData) {

            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error("User data error:", error);
            }

        }

    }, []);

    // =====================================================
    // LOAD STORES
    // =====================================================

    const loadStores = async (
        searchValue = search,
        sortField = sortBy,
        sortOrder = order
    ) => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get("/stores", {
                params: {
                    search: searchValue,
                    sortBy: sortField,
                    order: sortOrder
                }
            });

            setStores(
                Array.isArray(response.data?.data)
                    ? response.data.data
                    : []
            );

        } catch (error) {

            console.error("Load Stores Error:", error);

            setStores([]);

            setError(
                error.response?.data?.message ||
                "Unable to load stores."
            );

        } finally {

            setLoading(false);

        }

    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadStores();

    }, []);

    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = () => {

        loadStores(
            search,
            sortBy,
            order
        );

    };

    // =====================================================
    // SORT
    // =====================================================

    const handleSort = (field) => {

        let newOrder = "ASC";

        if (sortBy === field) {

            newOrder =
                order === "ASC"
                    ? "DESC"
                    : "ASC";

        }

        setSortBy(field);
        setOrder(newOrder);

        loadStores(
            search,
            field,
            newOrder
        );

    };

    // =====================================================
    // RATING CHANGE
    // =====================================================

    const handleRatingChange = (
        storeId,
        value
    ) => {

        setRatingValues({
            ...ratingValues,
            [storeId]: value
        });

        setError("");

    };

    // =====================================================
    // SUBMIT RATING
    // =====================================================

    const handleRatingSubmit = async (store) => {

        const rating =
            Number(ratingValues[store.id]);

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {

            setError(
                "Please select a rating between 1 and 5."
            );

            return;
        }

        try {

            setSubmitting({
                ...submitting,
                [store.id]: true
            });

            setError("");

            await API.put(
                `/ratings/${store.id}`,
                {
                    rating: rating
                }
            );

            await loadStores(
                search,
                sortBy,
                order
            );

            setRatingValues({
                ...ratingValues,
                [store.id]: ""
            });

        } catch (error) {

            console.error(
                "Rating Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to submit rating."
            );

        } finally {

            setSubmitting({
                ...submitting,
                [store.id]: false
            });

        }

    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    // =====================================================
    // GET EXISTING RATING
    // =====================================================

    const getUserRating = (store) => {

        if (
            store.user_rating !== null &&
            store.user_rating !== undefined
        ) {
            return store.user_rating;
        }

        return "";

    };

    // =====================================================
    // SORT ARROW
    // =====================================================

    const sortArrow = (field) => {

        if (sortBy !== field) {
            return "";
        }

        return order === "ASC"
            ? " ↑"
            : " ↓";

    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="professional-loading">

                <div className="loading-spinner"></div>

                <h3>
                    Loading Dashboard
                </h3>

                <p>
                    Please wait...
                </p>

            </div>

        );

    }

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="professional-user-layout">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="professional-sidebar">

                {/* BRAND */}

                <div className="professional-brand">

                    <div className="professional-brand-icon">
                        ⭐
                    </div>

                    <div>
                        <h2>Roxiler</h2>
                        <span>Store Rating System</span>
                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="professional-nav">

                    <button
                        className="professional-nav-item active"
                        onClick={() =>
                            navigate("/user")
                        }
                    >

                        <span>📊</span>

                        <span>
                            Dashboard
                        </span>

                    </button>


                    <button
                        className="professional-nav-item"
                        onClick={() =>
                            navigate("/user/stores")
                        }
                    >

                        <span>🏪</span>

                        <span>
                            Browse Stores
                        </span>

                    </button>

                </nav>


                {/* BOTTOM MENU */}

                <div className="professional-sidebar-bottom">

                    <button
                        className="professional-nav-item"
                        onClick={() =>
                            navigate(
                                "/change-password"
                            )
                        }
                    >

                        <span>🔐</span>

                        <span>
                            Change Password
                        </span>

                    </button>


                    <button
                        className="professional-logout"
                        onClick={handleLogout}
                    >

                        <span>🚪</span>

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="professional-user-main">


                {/* =================================================
                    TOP HEADER
                ================================================= */}

                <header className="professional-header">

                    <div>

                        <div className="header-label">
                            USER DASHBOARD
                        </div>

                        <h1>
                            Welcome back, {user.name}! 👋
                        </h1>

                        <p>
                            Discover stores and share your experience.
                        </p>

                    </div>


                    {/* PROFILE */}

                    <div className="professional-profile">

                        <div className="professional-avatar">

                            {user.name
                                ? user.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}

                        </div>

                        <div>

                            <strong>
                                {user.name}
                            </strong>

                            <span>
                                Normal User
                            </span>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="professional-error">

                        <span>⚠️</span>

                        {error}

                    </div>

                )}


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <section className="professional-stats">

                    {/* STORES */}

                    <div className="professional-stat-card">

                        <div>

                            <span className="stat-label">
                                AVAILABLE STORES
                            </span>

                            <h2>
                                {stores.length}
                            </h2>

                            <p>
                                Stores available to rate
                            </p>

                        </div>

                        <div className="professional-stat-icon">
                            🏪
                        </div>

                    </div>


                    {/* RATED */}

                    <div className="professional-stat-card">

                        <div>

                            <span className="stat-label">
                                MY RATINGS
                            </span>

                            <h2>
                                {
                                    stores.filter(
                                        (store) =>
                                            store.user_rating !== null &&
                                            store.user_rating !== undefined
                                    ).length
                                }
                            </h2>

                            <p>
                                Stores you have rated
                            </p>

                        </div>

                        <div className="professional-stat-icon">
                            ⭐
                        </div>

                    </div>


                    {/* ROLE */}

                    <div className="professional-stat-card">

                        <div>

                            <span className="stat-label">
                                ACCOUNT TYPE
                            </span>

                            <h2 className="role-text">
                                USER
                            </h2>

                            <p>
                                Normal user account
                            </p>

                        </div>

                        <div className="professional-stat-icon">
                            👤
                        </div>

                    </div>

                </section>


                {/* =================================================
                    SEARCH CARD
                ================================================= */}

                <section className="professional-search-card">

                    <div className="search-heading">

                        <div className="search-icon">
                            🔍
                        </div>

                        <div>

                            <h2>
                                Find a Store
                            </h2>

                            <p>
                                Search by store name or address
                            </p>

                        </div>

                    </div>


                    <div className="professional-search-row">

                        <input
                            type="text"
                            placeholder="Search store name or address..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                        />

                        <button
                            className="professional-search-button"
                            onClick={handleSearch}
                        >
                            🔍 Search
                        </button>

                    </div>

                </section>


                {/* =================================================
                    STORE SECTION
                ================================================= */}

                <section className="professional-store-section">


                    {/* SECTION HEADER */}

                    <div className="professional-section-header">

                        <div>

                            <span className="section-label">
                                STORES
                            </span>

                            <h2>
                                Available Stores
                            </h2>

                            <p>
                                Browse stores and rate your experience.
                            </p>

                        </div>


                        <div className="store-count">

                            <strong>
                                {stores.length}
                            </strong>

                            <span>
                                Stores
                            </span>

                        </div>

                    </div>


                    {/* TABLE */}

                    <div className="professional-table-card">

                        <div className="professional-table-wrapper">

                            <table className="professional-table">

                                <thead>

                                    <tr>

                                        <th>

                                            <button
                                                className="professional-sort-button"
                                                onClick={() =>
                                                    handleSort("name")
                                                }
                                            >
                                                Store Name
                                                {sortArrow("name")}
                                            </button>

                                        </th>

                                        <th>
                                            Address
                                        </th>

                                        <th>

                                            <button
                                                className="professional-sort-button"
                                                onClick={() =>
                                                    handleSort("rating")
                                                }
                                            >
                                                Overall Rating
                                                {sortArrow("rating")}
                                            </button>

                                        </th>

                                        <th>
                                            Your Rating
                                        </th>

                                        <th>
                                            Rate Store
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {stores.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="professional-empty"
                                            >

                                                <div>
                                                    🏪
                                                </div>

                                                <strong>
                                                    No Stores Found
                                                </strong>

                                                <p>
                                                    Try searching with
                                                    another store name
                                                    or address.
                                                </p>

                                            </td>

                                        </tr>

                                    ) : (

                                        stores.map((store) => {

                                            const existingRating =
                                                getUserRating(store);

                                            const selectedRating =
                                                ratingValues[store.id] ??
                                                existingRating;

                                            return (

                                                <tr
                                                    key={store.id}
                                                >

                                                    {/* STORE */}

                                                    <td>

                                                        <div className="store-name-cell">

                                                            <div className="store-mini-icon">
                                                                🏪
                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {store.name}
                                                                </strong>

                                                                <span>
                                                                    Store
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* ADDRESS */}

                                                    <td>

                                                        <div className="address-cell">

                                                            📍 {store.address}

                                                        </div>

                                                    </td>


                                                    {/* OVERALL RATING */}

                                                    <td>

                                                        <div className="overall-rating">

                                                            <span className="rating-star">
                                                                ⭐
                                                            </span>

                                                            <strong>
                                                                {
                                                                    Number(
                                                                        store.average_rating
                                                                    ).toFixed(1)
                                                                }
                                                            </strong>

                                                            <span>
                                                                / 5
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* YOUR RATING */}

                                                    <td>

                                                        {existingRating ? (

                                                            <div className="my-rating">

                                                                <span>
                                                                    ⭐
                                                                </span>

                                                                <strong>
                                                                    {existingRating}
                                                                </strong>

                                                                <span>
                                                                    / 5
                                                                </span>

                                                            </div>

                                                        ) : (

                                                            <span className="not-rated">
                                                                Not Rated
                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* RATE */}

                                                    <td>

                                                        <div className="rating-action-professional">

                                                            <select
                                                                value={
                                                                    selectedRating ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleRatingChange(
                                                                        store.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                            >

                                                                <option value="">
                                                                    Select
                                                                </option>

                                                                <option value="1">
                                                                    1 ⭐
                                                                </option>

                                                                <option value="2">
                                                                    2 ⭐
                                                                </option>

                                                                <option value="3">
                                                                    3 ⭐
                                                                </option>

                                                                <option value="4">
                                                                    4 ⭐
                                                                </option>

                                                                <option value="5">
                                                                    5 ⭐
                                                                </option>

                                                            </select>


                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRatingSubmit(
                                                                        store
                                                                    )
                                                                }
                                                                disabled={
                                                                    submitting[
                                                                        store.id
                                                                    ]
                                                                }
                                                            >

                                                                {submitting[
                                                                    store.id
                                                                ]
                                                                    ? "Saving..."
                                                                    : existingRating
                                                                    ? "Modify"
                                                                    : "Submit"}

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            );

                                        })

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    INFORMATION CARD
                ================================================= */}

                <section className="professional-info-card">

                    <div className="info-icon">
                        💡
                    </div>

                    <div>

                        <h3>
                            How rating works
                        </h3>

                        <p>
                            Select a rating from 1 to 5 stars and
                            click Submit. You can modify your rating
                            anytime by selecting a new rating.
                        </p>

                    </div>

                </section>


                {/* FOOTER */}

                <footer className="professional-footer">

                    <span>
                        © 2026 Roxiler Store Rating System
                    </span>

                    <span>
                        User Dashboard
                    </span>

                </footer>

            </main>

        </div>

    );

}

export default UserDashboard;