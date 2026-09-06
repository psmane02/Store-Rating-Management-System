import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminDashboard() {
    const navigate = useNavigate();

    const [activePage, setActivePage] = useState("dashboard");

    const [dashboard, setDashboard] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0
    });

    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [owners, setOwners] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [userFilters, setUserFilters] = useState({
        name: "",
        email: "",
        address: "",
        role: "",
        sortBy: "name",
        order: "ASC"
    });

    const [storeFilters, setStoreFilters] = useState({
        name: "",
        email: "",
        address: "",
        sortBy: "name",
        order: "ASC"
    });

    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER"
    });

    const [storeForm, setStoreForm] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    /* =====================================================
       LOAD DASHBOARD
       ===================================================== */

    const loadDashboard = async () => {
        try {
            const response = await API.get("/admin/dashboard");

            const data = response.data?.data || {};

            setDashboard({
                totalUsers: data.totalUsers ?? data.users ?? 0,
                totalStores: data.totalStores ?? data.stores ?? 0,
                totalRatings: data.totalRatings ?? data.ratings ?? 0
            });

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard."
            );
        }
    };

    /* =====================================================
       LOAD USERS
       ===================================================== */

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/admin/users", {
                params: userFilters
            });

            const data = response.data?.data;

            setUsers(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load users."
            );

            setUsers([]);

        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       LOAD STORES
       ===================================================== */

    const loadStores = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/admin/stores", {
                params: storeFilters
            });

            const data = response.data?.data;

            setStores(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load stores."
            );

            setStores([]);

        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       LOAD OWNERS
       ===================================================== */

    const loadOwners = async () => {
        try {
            const response = await API.get("/admin/users", {
                params: {
                    role: "OWNER"
                }
            });

            const data = response.data?.data;

            setOwners(
                Array.isArray(data) ? data : []
            );

        } catch (err) {
            console.error(err);
            setOwners([]);
        }
    };

    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    useEffect(() => {
        loadDashboard();
        loadOwners();
    }, []);

    /* =====================================================
       PAGE CHANGE
       ===================================================== */

    useEffect(() => {
        if (activePage === "users") {
            loadUsers();
        }

        if (activePage === "stores") {
            loadStores();
        }
    }, [activePage]);

    /* =====================================================
       NAVIGATION
       ===================================================== */

    const changePage = (page) => {
        setActivePage(page);
        setError("");
        setSuccess("");
    };

    /* =====================================================
       USER FORM
       ===================================================== */

    const handleUserChange = (e) => {
        setUserForm({
            ...userForm,
            [e.target.name]: e.target.value
        });

        setError("");
        setSuccess("");
    };

    const validateUser = () => {

        if (
            userForm.name.trim().length < 20 ||
            userForm.name.trim().length > 60
        ) {
            return "Name must be between 20 and 60 characters.";
        }

        if (!userForm.email.trim()) {
            return "Email is required.";
        }

        if (!userForm.address.trim()) {
            return "Address is required.";
        }

        if (userForm.address.trim().length > 400) {
            return "Address must not exceed 400 characters.";
        }

        const passwordPattern =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordPattern.test(userForm.password)) {
            return "Password must be 8-16 characters with uppercase and special character.";
        }

        return "";
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validateUser();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {

            await API.post("/admin/users", {
                name: userForm.name.trim(),
                email: userForm.email.trim(),
                password: userForm.password,
                address: userForm.address.trim(),
                role: userForm.role
            });

            setSuccess("User created successfully.");

            setUserForm({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "USER"
            });

            await loadDashboard();
            await loadOwners();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to create user."
            );
        }
    };

    /* =====================================================
       STORE FORM
       ===================================================== */

    const handleStoreChange = (e) => {
        setStoreForm({
            ...storeForm,
            [e.target.name]: e.target.value
        });

        setError("");
        setSuccess("");
    };

    const handleAddStore = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (storeForm.name.trim().length < 1) {
            setError("Store name is required.");
            return;
        }

        if (storeForm.name.trim().length > 60) {
            setError("Store name must not exceed 60 characters.");
            return;
        }

        if (!storeForm.email.trim()) {
            setError("Store email is required.");
            return;
        }

        if (!storeForm.address.trim()) {
            setError("Store address is required.");
            return;
        }

        try {

            await API.post("/admin/stores", {
                name: storeForm.name.trim(),
                email: storeForm.email.trim(),
                address: storeForm.address.trim(),
                owner_id: storeForm.owner_id
                    ? Number(storeForm.owner_id)
                    : null
            });

            setSuccess("Store created successfully.");

            setStoreForm({
                name: "",
                email: "",
                address: "",
                owner_id: ""
            });

            await loadDashboard();
            await loadStores();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to create store."
            );
        }
    };

    /* =====================================================
       LOGOUT
       ===================================================== */

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    /* =====================================================
       FILTERS
       ===================================================== */

    const handleUserFilterChange = (e) => {
        setUserFilters({
            ...userFilters,
            [e.target.name]: e.target.value
        });
    };

    const handleStoreFilterChange = (e) => {
        setStoreFilters({
            ...storeFilters,
            [e.target.name]: e.target.value
        });
    };

    const clearUserFilters = () => {
        const filters = {
            name: "",
            email: "",
            address: "",
            role: "",
            sortBy: "name",
            order: "ASC"
        };

        setUserFilters(filters);

        setTimeout(() => {
            loadUsers();
        }, 0);
    };

    const clearStoreFilters = () => {
        const filters = {
            name: "",
            email: "",
            address: "",
            sortBy: "name",
            order: "ASC"
        };

        setStoreFilters(filters);

        setTimeout(() => {
            loadStores();
        }, 0);
    };

    /* =====================================================
       RENDER
       ===================================================== */

    return (
        <div className="app-layout">

            {/* =================================================
                SIDEBAR
               ================================================= */}

            <aside className="sidebar">

                <div className="sidebar-logo">

                    <div className="logo-icon">
                        ⭐
                    </div>

                    <h2>Roxiler</h2>

                    <p>
                        Store Rating System
                    </p>

                </div>

                <div className="sidebar-menu">

                    <button
                        className={
                            activePage === "dashboard"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() =>
                            changePage("dashboard")
                        }
                    >
                        <span className="menu-icon">
                            📊
                        </span>

                        <span className="menu-text">
                            Dashboard
                        </span>
                    </button>

                    <button
                        className={
                            activePage === "users"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() =>
                            changePage("users")
                        }
                    >
                        <span className="menu-icon">
                            👥
                        </span>

                        <span className="menu-text">
                            Users
                        </span>
                    </button>

                    <button
                        className={
                            activePage === "stores"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() =>
                            changePage("stores")
                        }
                    >
                        <span className="menu-icon">
                            🏪
                        </span>

                        <span className="menu-text">
                            Stores
                        </span>
                    </button>

                    <button
                        className={
                            activePage === "add-user"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() =>
                            changePage("add-user")
                        }
                    >
                        <span className="menu-icon">
                            ➕
                        </span>

                        <span className="menu-text">
                            Add User
                        </span>
                    </button>

                    <button
                        className={
                            activePage === "add-store"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() =>
                            changePage("add-store")
                        }
                    >
                        <span className="menu-icon">
                            🏪
                        </span>

                        <span className="menu-text">
                            Add Store
                        </span>
                    </button>

                    <button
                        className="menu-item"
                        onClick={() =>
                            navigate("/change-password")
                        }
                    >
                        <span className="menu-icon">
                            🔑
                        </span>

                        <span className="menu-text">
                            Change Password
                        </span>
                    </button>

                    <button
                        className="menu-item logout-menu-item"
                        onClick={handleLogout}
                    >
                        <span className="menu-icon">
                            🚪
                        </span>

                        <span className="menu-text">
                            Logout
                        </span>
                    </button>

                </div>

            </aside>

            {/* =================================================
                MAIN CONTENT
               ================================================= */}

            <main className="main-content">

                {/* TOP NAVBAR */}

                <div className="top-navbar">

                    <div className="navbar-title">

                        <strong>
                            Admin Panel
                        </strong>

                        <div className="navbar-subtitle">
                            Store Rating Management System
                        </div>

                    </div>

                    <div className="user-info">

                        <div className="user-avatar">
                            A
                        </div>

                        <div className="user-details">

                            <strong>
                                Administrator
                            </strong>

                            <div className="user-role">
                                ADMIN
                            </div>

                        </div>

                    </div>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                {/* SUCCESS */}

                {success && (
                    <div className="success-message">
                        ✅ {success}
                    </div>
                )}

                {/* =================================================
                    DASHBOARD
                   ================================================= */}

                {activePage === "dashboard" && (

                    <>

                        <div className="page-header">

                            <div className="page-header-content">

                                <h1>
                                    Dashboard
                                </h1>

                                <p>
                                    Welcome back, Administrator!
                                </p>

                            </div>

                        </div>

                        <div className="stats-grid">

                            {/* USERS */}

                            <div className="stat-card users-stat-card">

                                <div className="stat-content">

                                    <h3>
                                        TOTAL USERS
                                    </h3>

                                    <div className="number">
                                        {dashboard.totalUsers}
                                    </div>

                                    <span className="stat-label">
                                        Registered users
                                    </span>

                                </div>

                                <div className="stat-icon">
                                    👥
                                </div>

                            </div>

                            {/* STORES */}

                            <div className="stat-card stores-stat-card">

                                <div className="stat-content">

                                    <h3>
                                        TOTAL STORES
                                    </h3>

                                    <div className="number">
                                        {dashboard.totalStores}
                                    </div>

                                    <span className="stat-label">
                                        Registered stores
                                    </span>

                                </div>

                                <div className="stat-icon">
                                    🏪
                                </div>

                            </div>

                            {/* RATINGS */}

                            <div className="stat-card ratings-stat-card">

                                <div className="stat-content">

                                    <h3>
                                        TOTAL RATINGS
                                    </h3>

                                    <div className="number">
                                        {dashboard.totalRatings}
                                    </div>

                                    <span className="stat-label">
                                        Customer ratings
                                    </span>

                                </div>

                                <div className="stat-icon">
                                    ⭐
                                </div>

                            </div>

                        </div>

                        {/* QUICK ACTIONS */}

                        <div className="card quick-actions-card">

                            <div className="card-heading">

                                <div>
                                    <h2>
                                        Quick Actions
                                    </h2>

                                    <p>
                                        Manage your system quickly
                                    </p>
                                </div>

                            </div>

                            <div className="quick-actions">

                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        changePage("add-user")
                                    }
                                >
                                    ➕ Add User
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={() =>
                                        changePage("add-store")
                                    }
                                >
                                    🏪 Add Store
                                </button>

                                <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        changePage("users")
                                    }
                                >
                                    👥 View Users
                                </button>

                                <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        changePage("stores")
                                    }
                                >
                                    🏪 View Stores
                                </button>

                            </div>

                        </div>

                    </>

                )}

                {/* =================================================
                    USERS
                   ================================================= */}

                {activePage === "users" && (

                    <>

                        <div className="page-header">

                            <div className="page-header-content">

                                <h1>
                                    Users
                                </h1>

                                <p>
                                    Manage all registered users
                                </p>

                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    changePage("add-user")
                                }
                            >
                                ➕ Add User
                            </button>

                        </div>

                        {/* FILTER */}

                        <div className="filter-bar">

                            <div className="filter-field">

                                <label>
                                    Name
                                </label>

                                <input
                                    className="filter-input"
                                    name="name"
                                    placeholder="Search by name"
                                    value={userFilters.name}
                                    onChange={handleUserFilterChange}
                                />

                            </div>

                            <div className="filter-field">

                                <label>
                                    Email
                                </label>

                                <input
                                    className="filter-input"
                                    name="email"
                                    placeholder="Search by email"
                                    value={userFilters.email}
                                    onChange={handleUserFilterChange}
                                />

                            </div>

                            <div className="filter-field">

                                <label>
                                    Address
                                </label>

                                <input
                                    className="filter-input"
                                    name="address"
                                    placeholder="Search by address"
                                    value={userFilters.address}
                                    onChange={handleUserFilterChange}
                                />

                            </div>

                            <div className="filter-field">

                                <label>
                                    Role
                                </label>

                                <select
                                    className="filter-select"
                                    name="role"
                                    value={userFilters.role}
                                    onChange={handleUserFilterChange}
                                >
                                    <option value="">
                                        All Roles
                                    </option>

                                    <option value="ADMIN">
                                        Admin
                                    </option>

                                    <option value="USER">
                                        User
                                    </option>

                                    <option value="OWNER">
                                        Owner
                                    </option>

                                </select>

                            </div>

                            <div className="filter-field">

                                <label>
                                    Sort By
                                </label>

                                <select
                                    className="filter-select"
                                    name="sortBy"
                                    value={userFilters.sortBy}
                                    onChange={handleUserFilterChange}
                                >
                                    <option value="name">
                                        Name
                                    </option>

                                    <option value="email">
                                        Email
                                    </option>

                                    <option value="address">
                                        Address
                                    </option>

                                    <option value="role">
                                        Role
                                    </option>

                                    <option value="rating">
                                        Rating
                                    </option>

                                </select>

                            </div>

                            <div className="filter-field">

                                <label>
                                    Order
                                </label>

                                <select
                                    className="filter-select"
                                    name="order"
                                    value={userFilters.order}
                                    onChange={handleUserFilterChange}
                                >
                                    <option value="ASC">
                                        Ascending ↑
                                    </option>

                                    <option value="DESC">
                                        Descending ↓
                                    </option>

                                </select>

                            </div>

                            <div className="filter-buttons">

                                <button
                                    className="btn btn-primary"
                                    onClick={loadUsers}
                                >
                                    🔍 Search
                                </button>

                                <button
                                    className="btn btn-secondary"
                                    onClick={clearUserFilters}
                                >
                                    Clear
                                </button>

                            </div>

                        </div>

                        {/* USERS TABLE */}

                        <div className="table-container">

                            <div className="table-header">

                                <div>
                                    <h2>
                                        Users List
                                    </h2>

                                    <p>
                                        All registered users
                                    </p>
                                </div>

                                <span className="table-count">
                                    {users.length} Users
                                </span>

                            </div>

                            {loading ? (

                                <div className="loading">
                                    <div className="spinner"></div>
                                    <span>
                                        Loading users...
                                    </span>
                                </div>

                            ) : users.length === 0 ? (

                                <div className="empty-state">

                                    <div className="empty-icon">
                                        👥
                                    </div>

                                    <h3>
                                        No Users Found
                                    </h3>

                                    <p>
                                        There are no users matching your search.
                                    </p>

                                </div>

                            ) : (

                                <div className="table-wrapper">

                                    <table className="data-table">

                                        <thead>

                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Address</th>
                                                <th>Role</th>
                                                <th>Store Rating</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {users.map((user) => (

                                                <tr key={user.id}>

                                                    <td>
                                                        <div className="table-user">

                                                            <div className="table-user-avatar">
                                                                {user.name
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase()}
                                                            </div>

                                                            <strong>
                                                                {user.name}
                                                            </strong>

                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span className="email-text">
                                                            {user.email}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="address-text">
                                                            {user.address}
                                                        </span>
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                `badge badge-${user.role.toLowerCase()}`
                                                            }
                                                        >
                                                            {user.role}
                                                        </span>

                                                    </td>

                                                    <td>

                                                        {user.role === "OWNER"
                                                            ? (
                                                                <span className="rating-value">
                                                                    ⭐{" "}
                                                                    {user.store_rating ??
                                                                        "0"}
                                                                </span>
                                                            )
                                                            : (
                                                                <span className="no-rating">
                                                                    —
                                                                </span>
                                                            )}

                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </>

                )}

                {/* =================================================
                    STORES
                   ================================================= */}

                {activePage === "stores" && (

                    <>

                        <div className="page-header">

                            <div className="page-header-content">

                                <h1>
                                    Stores
                                </h1>

                                <p>
                                    Manage registered stores
                                </p>

                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    changePage("add-store")
                                }
                            >
                                🏪 Add Store
                            </button>

                        </div>

                        {/* FILTER */}

                        <div className="filter-bar">

                            <div className="filter-field">

                                <label>
                                    Store Name
                                </label>

                                <input
                                    className="filter-input"
                                    name="name"
                                    placeholder="Search store name"
                                    value={storeFilters.name}
                                    onChange={handleStoreFilterChange}
                                />

                            </div>

                            <div className="filter-field">

                                <label>
                                    Email
                                </label>

                                <input
                                    className="filter-input"
                                    name="email"
                                    placeholder="Search by email"
                                    value={storeFilters.email}
                                    onChange={handleStoreFilterChange}
                                />

                            </div>

                            <div className="filter-field">

                                <label>
                                    Address
                                </label>

                                <input
                                    className="filter-input"
                                    name="address"
                                    placeholder="Search by address"
                                    value={storeFilters.address}
                                    onChange={handleStoreFilterChange}
                                />

                            </div>

                            <div className="filter-field">

                                <label>
                                    Sort By
                                </label>

                                <select
                                    className="filter-select"
                                    name="sortBy"
                                    value={storeFilters.sortBy}
                                    onChange={handleStoreFilterChange}
                                >
                                    <option value="name">
                                        Name
                                    </option>

                                    <option value="email">
                                        Email
                                    </option>

                                    <option value="address">
                                        Address
                                    </option>

                                    <option value="rating">
                                        Rating
                                    </option>

                                </select>

                            </div>

                            <div className="filter-field">

                                <label>
                                    Order
                                </label>

                                <select
                                    className="filter-select"
                                    name="order"
                                    value={storeFilters.order}
                                    onChange={handleStoreFilterChange}
                                >
                                    <option value="ASC">
                                        Ascending ↑
                                    </option>

                                    <option value="DESC">
                                        Descending ↓
                                    </option>

                                </select>

                            </div>

                            <div className="filter-buttons">

                                <button
                                    className="btn btn-primary"
                                    onClick={loadStores}
                                >
                                    🔍 Search
                                </button>

                                <button
                                    className="btn btn-secondary"
                                    onClick={clearStoreFilters}
                                >
                                    Clear
                                </button>

                            </div>

                        </div>

                        {/* STORES TABLE */}

                        <div className="table-container">

                            <div className="table-header">

                                <div>
                                    <h2>
                                        Stores List
                                    </h2>

                                    <p>
                                        All registered stores
                                    </p>
                                </div>

                                <span className="table-count">
                                    {stores.length} Stores
                                </span>

                            </div>

                            {loading ? (

                                <div className="loading">

                                    <div className="spinner"></div>

                                    <span>
                                        Loading stores...
                                    </span>

                                </div>

                            ) : stores.length === 0 ? (

                                <div className="empty-state">

                                    <div className="empty-icon">
                                        🏪
                                    </div>

                                    <h3>
                                        No Stores Found
                                    </h3>

                                    <p>
                                        There are no stores matching your search.
                                    </p>

                                </div>

                            ) : (

                                <div className="table-wrapper">

                                    <table className="data-table">

                                        <thead>

                                            <tr>
                                                <th>Store Name</th>
                                                <th>Email</th>
                                                <th>Address</th>
                                                <th>Rating</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {stores.map((store) => (

                                                <tr key={store.id}>

                                                    <td>

                                                        <div className="table-user">

                                                            <div className="store-avatar">
                                                                🏪
                                                            </div>

                                                            <strong>
                                                                {store.name}
                                                            </strong>

                                                        </div>

                                                    </td>

                                                    <td>
                                                        <span className="email-text">
                                                            {store.email}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="address-text">
                                                            {store.address}
                                                        </span>
                                                    </td>

                                                    <td>

                                                        <span className="rating-value">
                                                            ⭐{" "}
                                                            {store.average_rating ??
                                                                store.rating ??
                                                                "0"}
                                                        </span>

                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </>

                )}

                {/* =================================================
                    ADD USER
                   ================================================= */}

                {activePage === "add-user" && (

                    <>

                        <div className="page-header">

                            <div className="page-header-content">

                                <h1>
                                    Add New User
                                </h1>

                                <p>
                                    Create a new system account
                                </p>

                            </div>

                        </div>

                        <div className="card form-card">

                            <div className="form-card-header">

                                <div className="form-header-icon">
                                    👤
                                </div>

                                <div>
                                    <h2>
                                        User Information
                                    </h2>

                                    <p>
                                        Enter the details for the new user.
                                    </p>
                                </div>

                            </div>

                            <form
                                onSubmit={handleAddUser}
                                className="admin-form"
                            >

                                <div className="form-grid">

                                    {/* NAME */}

                                    <div className="form-group full-width">

                                        <label>
                                            Full Name
                                        </label>

                                        <input
                                            name="name"
                                            placeholder="Enter full name (20–60 characters)"
                                            value={userForm.name}
                                            onChange={handleUserChange}
                                            minLength="20"
                                            maxLength="60"
                                            required
                                        />

                                        <small>
                                            Name must contain 20–60 characters.
                                        </small>

                                    </div>

                                    {/* EMAIL */}

                                    <div className="form-group">

                                        <label>
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter email address"
                                            value={userForm.email}
                                            onChange={handleUserChange}
                                            required
                                        />

                                    </div>

                                    {/* ROLE */}

                                    <div className="form-group">

                                        <label>
                                            Role
                                        </label>

                                        <select
                                            name="role"
                                            value={userForm.role}
                                            onChange={handleUserChange}
                                        >

                                            <option value="USER">
                                                Normal User
                                            </option>

                                            <option value="OWNER">
                                                Store Owner
                                            </option>

                                            <option value="ADMIN">
                                                Administrator
                                            </option>

                                        </select>

                                    </div>

                                    {/* ADDRESS */}

                                    <div className="form-group full-width">

                                        <label>
                                            Address
                                        </label>

                                        <textarea
                                            name="address"
                                            placeholder="Enter complete address"
                                            value={userForm.address}
                                            onChange={handleUserChange}
                                            maxLength="400"
                                            rows="4"
                                            required
                                        />

                                        <small>
                                            Maximum 400 characters.
                                        </small>

                                    </div>

                                    {/* PASSWORD */}

                                    <div className="form-group full-width">

                                        <label>
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Enter secure password"
                                            value={userForm.password}
                                            onChange={handleUserChange}
                                            required
                                        />

                                        <small>
                                            8–16 characters, uppercase + special character.
                                        </small>

                                    </div>

                                </div>

                                <div className="form-actions">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        ✨ Create User
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            changePage("dashboard")
                                        }
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    </>

                )}

                {/* =================================================
                    ADD STORE
                   ================================================= */}

                {activePage === "add-store" && (

                    <>

                        <div className="page-header">

                            <div className="page-header-content">

                                <h1>
                                    Add New Store
                                </h1>

                                <p>
                                    Register a new store
                                </p>

                            </div>

                        </div>

                        <div className="card form-card">

                            <div className="form-card-header">

                                <div className="form-header-icon">
                                    🏪
                                </div>

                                <div>
                                    <h2>
                                        Store Information
                                    </h2>

                                    <p>
                                        Enter the details for the new store.
                                    </p>
                                </div>

                            </div>

                            <form
                                onSubmit={handleAddStore}
                                className="admin-form"
                            >

                                <div className="form-grid">

                                    {/* STORE NAME */}

                                    <div className="form-group">

                                        <label>
                                            Store Name
                                        </label>

                                        <input
                                            name="name"
                                            placeholder="Enter store name"
                                            value={storeForm.name}
                                            onChange={handleStoreChange}
                                            maxLength="60"
                                            required
                                        />

                                        <small>
                                            Maximum 60 characters.
                                        </small>

                                    </div>

                                    {/* STORE EMAIL */}

                                    <div className="form-group">

                                        <label>
                                            Store Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter store email"
                                            value={storeForm.email}
                                            onChange={handleStoreChange}
                                            required
                                        />

                                    </div>

                                    {/* ADDRESS */}

                                    <div className="form-group full-width">

                                        <label>
                                            Store Address
                                        </label>

                                        <textarea
                                            name="address"
                                            placeholder="Enter complete store address"
                                            value={storeForm.address}
                                            onChange={handleStoreChange}
                                            maxLength="400"
                                            rows="4"
                                            required
                                        />

                                        <small>
                                            Maximum 400 characters.
                                        </small>

                                    </div>

                                    {/* OWNER */}

                                    <div className="form-group full-width">

                                        <label>
                                            Assign Store Owner
                                        </label>

                                        <select
                                            name="owner_id"
                                            value={storeForm.owner_id}
                                            onChange={handleStoreChange}
                                        >

                                            <option value="">
                                                No Owner
                                            </option>

                                            {owners.map((owner) => (

                                                <option
                                                    key={owner.id}
                                                    value={owner.id}
                                                >
                                                    {owner.name} — {owner.email}
                                                </option>

                                            ))}

                                        </select>

                                        <small>
                                            You can assign an existing OWNER account.
                                        </small>

                                    </div>

                                </div>

                                <div className="form-actions">

                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                    >
                                        🏪 Create Store
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            changePage("dashboard")
                                        }
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    </>

                )}

            </main>

        </div>
    );
}

export default AdminDashboard;