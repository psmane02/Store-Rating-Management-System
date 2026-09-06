const bcrypt = require("bcryptjs");
const pool = require("../config/db");

// =====================================================
// VALIDATION FUNCTIONS
// =====================================================

function validateName(name) {
    if (!name || name.trim().length < 20) {
        return "Name must contain at least 20 characters.";
    }

    if (name.trim().length > 60) {
        return "Name cannot exceed 60 characters.";
    }

    return null;
}

function validateAddress(address) {
    if (!address || !address.trim()) {
        return "Address is required.";
    }

    if (address.trim().length > 400) {
        return "Address cannot exceed 400 characters.";
    }

    return null;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email.trim())) {
        return "Please enter a valid email address.";
    }

    return null;
}

function validatePassword(password) {
    const passwordRegex =
        /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!password || !passwordRegex.test(password)) {
        return (
            "Password must be 8-16 characters " +
            "with at least one uppercase letter " +
            "and one special character."
        );
    }

    return null;
}

// =====================================================
// ADMIN DASHBOARD
// =====================================================

async function getDashboard(req, res) {
    try {
        const [
            [userCount],
            [storeCount],
            [ratingCount]
        ] = await Promise.all([
            pool.query(
                "SELECT COUNT(*) AS total_users FROM users"
            ),

            pool.query(
                "SELECT COUNT(*) AS total_stores FROM stores"
            ),

            pool.query(
                "SELECT COUNT(*) AS total_ratings FROM ratings"
            )
        ]);

        res.json({
            success: true,

            data: {
                totalUsers: userCount[0].total_users,
                totalStores: storeCount[0].total_stores,
                totalRatings: ratingCount[0].total_ratings
            }
        });

    } catch (error) {
        console.error("Admin Dashboard Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard."
        });
    }
}

// =====================================================
// GET USERS
// =====================================================

async function getUsers(req, res) {
    try {
        const {
            name = "",
            email = "",
            address = "",
            role = "",
            sortBy = "name",
            order = "ASC"
        } = req.query;

        const sortColumns = {
            name: "u.name",
            email: "u.email",
            address: "u.address",
            role: "u.role",
            rating: "store_rating"
        };

        const sortColumn =
            sortColumns[sortBy] || "u.name";

        const sortOrder =
            order.toLowerCase() === "desc"
                ? "DESC"
                : "ASC";

        let query = `
            SELECT
                u.id,
                u.name,
                u.email,
                u.address,
                u.role,

                COALESCE(
                    ROUND(AVG(r.rating), 2),
                    0
                ) AS store_rating

            FROM users u

            LEFT JOIN stores s
                ON s.owner_id = u.id

            LEFT JOIN ratings r
                ON r.store_id = s.id

            WHERE 1 = 1
        `;

        const values = [];

        // Name filter
        if (name.trim()) {
            query += `
                AND LOWER(u.name)
                LIKE LOWER(?)
            `;

            values.push(`%${name.trim()}%`);
        }

        // Email filter
        if (email.trim()) {
            query += `
                AND LOWER(u.email)
                LIKE LOWER(?)
            `;

            values.push(`%${email.trim()}%`);
        }

        // Address filter
        if (address.trim()) {
            query += `
                AND LOWER(u.address)
                LIKE LOWER(?)
            `;

            values.push(`%${address.trim()}%`);
        }

        // Role filter
        if (role.trim()) {
            query += `
                AND u.role = ?
            `;

            values.push(role);
        }

        query += `
            GROUP BY
                u.id,
                u.name,
                u.email,
                u.address,
                u.role

            ORDER BY
                ${sortColumn}
                ${sortOrder}
        `;

        const [users] =
            await pool.query(query, values);

        res.json({
            success: true,

            data: users
        });

    } catch (error) {
        console.error("Get Users Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users."
        });
    }
}

// =====================================================
// CREATE USER
// =====================================================

async function createUser(req, res) {
    try {
        const {
            name,
            email,
            address,
            password,
            role
        } = req.body;

        // -------------------------------
        // Name Validation
        // -------------------------------

        let error = validateName(name);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        // -------------------------------
        // Address Validation
        // -------------------------------

        error = validateAddress(address);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        // -------------------------------
        // Email Validation
        // -------------------------------

        error = validateEmail(email);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        // -------------------------------
        // Password Validation
        // -------------------------------

        error = validatePassword(password);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        // -------------------------------
        // Role Validation
        // -------------------------------

        const allowedRoles = [
            "ADMIN",
            "USER",
            "OWNER"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role."
            });
        }

        // -------------------------------
        // Check Existing Email
        // -------------------------------

        const [existing] =
            await pool.query(
                "SELECT id FROM users WHERE email = ?",
                [email.trim()]
            );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered."
            });
        }

        // -------------------------------
        // Hash Password
        // -------------------------------

        const hashedPassword =
            await bcrypt.hash(password, 10);

        // -------------------------------
        // Insert User
        // -------------------------------

        const [result] =
            await pool.query(
                `
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    address,
                    role
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    name.trim(),
                    email.trim(),
                    hashedPassword,
                    address.trim(),
                    role
                ]
            );

        // -------------------------------
        // Success Response
        // -------------------------------

        res.status(201).json({
            success: true,

            message: "User created successfully.",

            user: {
                id: result.insertId,
                name: name.trim(),
                email: email.trim(),
                address: address.trim(),
                role: role
            }
        });

    } catch (error) {
        console.error("Create User Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create user."
        });
    }
}

// =====================================================
// GET USER DETAILS
// =====================================================

async function getUserDetails(req, res) {
    try {
        const userId = req.params.id;

        const [users] =
            await pool.query(
                `
                SELECT
                    u.id,
                    u.name,
                    u.email,
                    u.address,
                    u.role,
                    u.created_at,

                    COALESCE(
                        ROUND(AVG(r.rating), 2),
                        0
                    ) AS store_rating

                FROM users u

                LEFT JOIN stores s
                    ON s.owner_id = u.id

                LEFT JOIN ratings r
                    ON r.store_id = s.id

                WHERE u.id = ?

                GROUP BY
                    u.id,
                    u.name,
                    u.email,
                    u.address,
                    u.role,
                    u.created_at
                `,
                [userId]
            );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            data: users[0]
        });

    } catch (error) {
        console.error(
            "Get User Details Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch user details."
        });
    }
}

// =====================================================
// GET STORES
// =====================================================

async function getStores(req, res) {
    try {
        const {
            name = "",
            email = "",
            address = "",
            sortBy = "name",
            order = "ASC"
        } = req.query;

        const sortColumns = {
            name: "s.name",
            email: "s.email",
            address: "s.address",
            rating: "overall_rating"
        };

        const sortColumn =
            sortColumns[sortBy] || "s.name";

        const sortOrder =
            order.toLowerCase() === "desc"
                ? "DESC"
                : "ASC";

        let query = `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,

                COALESCE(
                    ROUND(AVG(r.rating), 2),
                    0
                ) AS average_rating

            FROM stores s

            LEFT JOIN ratings r
                ON r.store_id = s.id

            WHERE 1 = 1
        `;

        const values = [];

        // Name filter
        if (name.trim()) {
            query += `
                AND LOWER(s.name)
                LIKE LOWER(?)
            `;

            values.push(`%${name.trim()}%`);
        }

        // Email filter
        if (email.trim()) {
            query += `
                AND LOWER(s.email)
                LIKE LOWER(?)
            `;

            values.push(`%${email.trim()}%`);
        }

        // Address filter
        if (address.trim()) {
            query += `
                AND LOWER(s.address)
                LIKE LOWER(?)
            `;

            values.push(`%${address.trim()}%`);
        }

        query += `
            GROUP BY
                s.id,
                s.name,
                s.email,
                s.address

            ORDER BY
                ${sortColumn}
                ${sortOrder}
        `;

        const [stores] =
            await pool.query(query, values);

        res.json({
            success: true,

            data: stores
        });

    } catch (error) {
        console.error(
            "Get Stores Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch stores."
        });
    }
}

// =====================================================
// CREATE STORE
// =====================================================

async function createStore(req, res) {
    try {
        const {
            name,
            email,
            address,
            owner_id
        } = req.body;

        // -------------------------------
        // Name Validation
        // -------------------------------

        let error = validateName(name);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        // -------------------------------
        // Email Validation
        // -------------------------------

        error = validateEmail(email);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        // -------------------------------
        // Address Validation
        // -------------------------------

        error = validateAddress(address);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        // -------------------------------
        // Check Store Owner
        // -------------------------------

        if (owner_id) {

            const [owners] =
                await pool.query(
                    `
                    SELECT
                        id,
                        email,
                        role

                    FROM users

                    WHERE id = ?
                    `,
                    [owner_id]
                );

            if (
                owners.length === 0 ||
                owners[0].role !== "OWNER"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Selected user is not a Store Owner."
                });
            }
        }

        // -------------------------------
        // Insert Store
        // -------------------------------

        const [result] =
            await pool.query(
                `
                INSERT INTO stores
                (
                    name,
                    email,
                    address,
                    owner_id
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    name.trim(),
                    email.trim(),
                    address.trim(),
                    owner_id || null
                ]
            );

        // -------------------------------
        // Success Response
        // -------------------------------

        res.status(201).json({
            success: true,

            message:
                "Store created successfully.",

            store: {
                id: result.insertId,
                name: name.trim(),
                email: email.trim(),
                address: address.trim(),
                owner_id: owner_id || null
            }
        });

    } catch (error) {
        console.error(
            "Create Store Error:",
            error
        );

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message:
                    "This Store Owner already has a store."
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create store."
        });
    }
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getDashboard,
    getUsers,
    createUser,
    getUserDetails,
    getStores,
    createStore
};