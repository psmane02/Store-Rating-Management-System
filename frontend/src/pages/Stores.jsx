import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import RatingStars from "../components/RatingStars";


function Stores() {

    const navigate = useNavigate();


    // =====================================================
    // STATES
    // =====================================================

    const [stores, setStores] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const [search, setSearch] = useState("");

    const [sortBy, setSortBy] = useState("name");

    const [order, setOrder] = useState("ASC");


    // Stores rating selected by user
    const [ratingValues, setRatingValues] = useState({});


    // Rating submitting state
    const [submitting, setSubmitting] = useState({});


    // Logged-in user
    const [user, setUser] = useState({
        name: "User",
        email: ""
    });



    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    useEffect(() => {

        const userData =
            localStorage.getItem("user");


        if (userData) {

            try {

                setUser(
                    JSON.parse(userData)
                );

            } catch (error) {

                console.error(
                    "User data error:",
                    error
                );

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

            setSuccess("");


            const response =
                await API.get("/stores", {

                    params: {

                        search: searchValue,

                        sortBy: sortField,

                        order: sortOrder

                    }

                });


            const storeData =
                response.data?.data;


            if (Array.isArray(storeData)) {

                setStores(storeData);

            } else {

                setStores([]);

            }


        } catch (error) {

            console.error(
                "Load Stores Error:",
                error
            );


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
    // LOAD STORES WHEN PAGE OPENS
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
    // CLEAR SEARCH
    // =====================================================

    const handleClearSearch = () => {

        setSearch("");

        loadStores(
            "",
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
    // STAR RATING CHANGE
    // =====================================================

    const handleRatingChange = (
        storeId,
        rating
    ) => {

        setRatingValues({

            ...ratingValues,

            [storeId]: rating

        });


        setError("");

        setSuccess("");

    };



    // =====================================================
    // GET EXISTING USER RATING
    // =====================================================

    const getUserRating = (store) => {

        if (
            store.user_rating !== null &&
            store.user_rating !== undefined
        ) {

            return Number(
                store.user_rating
            );

        }


        return 0;

    };



    // =====================================================
    // SUBMIT / MODIFY RATING
    // =====================================================

    const handleRatingSubmit = async (
        store
    ) => {

        const rating =
            Number(
                ratingValues[store.id]
            );


        // ---------------------------------------------
        // Validation
        // ---------------------------------------------

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {

            setError(
                "Please select a rating from 1 to 5 stars."
            );

            setSuccess("");

            return;

        }



        try {

            setSubmitting({

                ...submitting,

                [store.id]: true

            });


            setError("");

            setSuccess("");


            // -----------------------------------------
            // Send rating to backend
            // -----------------------------------------

            await API.put(
                `/ratings/${store.id}`,
                {
                    rating: rating
                }
            );


            // -----------------------------------------
            // Success message
            // -----------------------------------------

            setSuccess(
                `Rating ${rating} ⭐ submitted successfully for ${store.name}.`
            );


            // -----------------------------------------
            // Reload stores
            // -----------------------------------------

            await loadStores(
                search,
                sortBy,
                order
            );


            // -----------------------------------------
            // Keep selected rating
            // -----------------------------------------

            setRatingValues({

                ...ratingValues,

                [store.id]: rating

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


            setSuccess("");

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
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (

            <div className="dashboard-loading">

                <h2>
                    Loading Stores...
                </h2>

                <p>
                    Please wait...
                </p>

            </div>

        );

    }



    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="user-layout">


            {/* =================================================
                SIDEBAR
            ================================================== */}

            <aside className="user-sidebar">


                {/* Brand */}

                <div className="brand">

                    <div className="brand-icon">
                        🛡️
                    </div>


                    <div>

                        <h2>
                            Roxiler
                        </h2>

                        <span>
                            User Panel
                        </span>

                    </div>

                </div>



                {/* Navigation */}

                <nav>

                    <button
                        type="button"
                        className="nav-item"
                        onClick={() =>
                            navigate("/user")
                        }
                    >
                        🏠 Dashboard
                    </button>


                    <button
                        type="button"
                        className="nav-item active"
                        onClick={() =>
                            navigate("/user/stores")
                        }
                    >
                        🏪 Stores
                    </button>

                </nav>



                {/* Sidebar Bottom */}

                <div className="sidebar-bottom">

                    <button
                        type="button"
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/change-password"
                            )
                        }
                    >
                        🔐 Change Password
                    </button>


                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>

                </div>

            </aside>



            {/* =================================================
                MAIN
            ================================================== */}

            <main className="user-main">


                {/* =================================================
                    HEADER
                ================================================== */}

                <header className="user-header">

                    <div>

                        <h1>
                            Available Stores 🏪
                        </h1>

                        <p>
                            Search and rate your favourite stores
                        </p>

                    </div>



                    {/* User Profile */}

                    <div className="user-profile">

                        <div className="profile-avatar">

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

                            <small>
                                Normal User
                            </small>

                        </div>

                    </div>

                </header>



                {/* =================================================
                    ERROR MESSAGE
                ================================================== */}

                {error && (

                    <div className="error-message">

                        ❌ {error}

                    </div>

                )}



                {/* =================================================
                    SUCCESS MESSAGE
                ================================================== */}

                {success && (

                    <div
                        className="success-message"
                        style={{
                            padding: "12px",
                            marginBottom: "15px",
                            borderRadius: "6px"
                        }}
                    >

                        ✅ {success}

                    </div>

                )}



                {/* =================================================
                    SEARCH
                ================================================== */}

                <section className="user-search-section">

                    <div className="search-group">


                        <input
                            type="text"
                            placeholder="Search by store name or address..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {

                                if (
                                    e.key === "Enter"
                                ) {

                                    handleSearch();

                                }

                            }}
                        />


                        <button
                            type="button"
                            onClick={handleSearch}
                        >
                            🔍 Search
                        </button>


                        {search && (

                            <button
                                type="button"
                                onClick={
                                    handleClearSearch
                                }
                            >
                                ✖ Clear
                            </button>

                        )}

                    </div>

                </section>



                {/* =================================================
                    STORES
                ================================================== */}

                <section className="stores-section">


                    <div className="section-title">

                        <div>

                            <h2>
                                All Stores
                            </h2>

                            <p>
                                {stores.length} stores available
                            </p>

                        </div>

                    </div>



                    {/* =================================================
                        TABLE
                    ================================================== */}

                    <div className="table-card">

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>


                                        {/* Store Name */}

                                        <th>

                                            <button
                                                type="button"
                                                className="sort-button"
                                                onClick={() =>
                                                    handleSort(
                                                        "name"
                                                    )
                                                }
                                            >

                                                Store Name

                                                {
                                                    sortArrow(
                                                        "name"
                                                    )
                                                }

                                            </button>

                                        </th>



                                        {/* Address */}

                                        <th>
                                            Address
                                        </th>



                                        {/* Overall Rating */}

                                        <th>

                                            <button
                                                type="button"
                                                className="sort-button"
                                                onClick={() =>
                                                    handleSort(
                                                        "rating"
                                                    )
                                                }
                                            >

                                                Overall Rating

                                                {
                                                    sortArrow(
                                                        "rating"
                                                    )
                                                }

                                            </button>

                                        </th>



                                        {/* Your Rating */}

                                        <th>
                                            Your Rating
                                        </th>



                                        {/* Action */}

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>



                                <tbody>


                                    {/* No Stores */}

                                    {stores.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                style={{
                                                    textAlign:
                                                        "center",
                                                    padding:
                                                        "40px"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "40px"
                                                    }}
                                                >
                                                    🏪
                                                </div>

                                                <h3>
                                                    No stores found
                                                </h3>

                                                <p>
                                                    Try another
                                                    search.
                                                </p>

                                            </td>

                                        </tr>

                                    ) : (


                                        /* Stores */

                                        stores.map(
                                            (store) => {

                                                const existingRating =
                                                    getUserRating(
                                                        store
                                                    );


                                                const selectedRating =
                                                    ratingValues[
                                                        store.id
                                                    ] ??
                                                    existingRating;


                                                return (

                                                    <tr
                                                        key={
                                                            store.id
                                                        }
                                                    >


                                                        {/* Store Name */}

                                                        <td>

                                                            <strong>
                                                                {
                                                                    store.name
                                                                }
                                                            </strong>

                                                        </td>



                                                        {/* Address */}

                                                        <td>
                                                            {
                                                                store.address
                                                            }
                                                        </td>



                                                        {/* Overall Rating */}

                                                        <td>

                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    gap:
                                                                        "8px"
                                                                }}
                                                            >

                                                                <RatingStars
                                                                    rating={
                                                                        Number(
                                                                            store.average_rating
                                                                        ) ||
                                                                        0
                                                                    }
                                                                    readonly={
                                                                        true
                                                                    }
                                                                />

                                                                <span>
                                                                    {
                                                                        store.average_rating ??
                                                                        0
                                                                    }
                                                                </span>

                                                            </div>

                                                        </td>



                                                        {/* Your Rating */}

                                                        <td>

                                                            {existingRating >
                                                            0 ? (

                                                                <div>

                                                                    <RatingStars
                                                                        rating={
                                                                            existingRating
                                                                        }
                                                                        readonly={
                                                                            true
                                                                        }
                                                                    />

                                                                    <small>
                                                                        Your rating:
                                                                        {" "}
                                                                        {
                                                                            existingRating
                                                                        }{" "}
                                                                        / 5
                                                                    </small>

                                                                </div>

                                                            ) : (

                                                                <span className="no-rating">
                                                                    Not Rated
                                                                </span>

                                                            )}

                                                        </td>



                                                        {/* Action */}

                                                        <td>

                                                            <div
                                                                className="rating-action"
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    flexDirection:
                                                                        "column",
                                                                    gap:
                                                                        "8px"
                                                                }}
                                                            >


                                                                {/* CLICKABLE STARS */}

                                                                <RatingStars
                                                                    rating={
                                                                        selectedRating
                                                                    }
                                                                    onChange={(
                                                                        value
                                                                    ) =>
                                                                        handleRatingChange(
                                                                            store.id,
                                                                            value
                                                                        )
                                                                    }
                                                                />


                                                                {/* Selected Rating */}

                                                                {selectedRating >
                                                                    0 && (

                                                                        <span
                                                                            style={{
                                                                                fontSize:
                                                                                    "13px"
                                                                            }}
                                                                        >

                                                                            Selected:
                                                                            {" "}
                                                                            {
                                                                                selectedRating
                                                                            }{" "}
                                                                            ⭐

                                                                        </span>

                                                                    )}



                                                                {/* Submit / Modify */}

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

                                                                    {
                                                                        submitting[
                                                                            store.id
                                                                        ]
                                                                            ? "Saving..."
                                                                            : existingRating
                                                                                ? "Modify Rating"
                                                                                : "Submit Rating"
                                                                    }

                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </section>

            </main>

        </div>

    );
}


export default Stores;