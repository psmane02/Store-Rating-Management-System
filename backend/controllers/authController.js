const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");


// ===============================
// Validation Functions
// ===============================

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

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return "Please enter a valid email address.";
    }

    return null;
}


function validatePassword(password) {

    const passwordRegex =
        /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(password)) {

        return (
            "Password must be 8-16 characters " +
            "and contain at least one uppercase " +
            "letter and one special character."
        );
    }

    return null;
}


// ===============================
// SIGNUP
// ===============================

async function signup(req, res) {

    try {

        const {
            name,
            email,
            address,
            password
        } = req.body;


        // Validation
        let error;


        error = validateName(name);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }


        error = validateAddress(address);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }


        error = validateEmail(email);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }


        error = validatePassword(password);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }


        // Check existing email
        const [existingUsers] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );


        if (existingUsers.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });

        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Insert user
        const [result] = await pool.query(
            `
            INSERT INTO users
            (name, email, password, address, role)
            VALUES (?, ?, ?, ?, 'USER')
            `,
            [
                name.trim(),
                email.trim(),
                hashedPassword,
                address.trim()
            ]
        );


        res.status(201).json({

            success: true,

            message: "User registered successfully.",

            user: {
                id: result.insertId,
                name: name.trim(),
                email: email.trim(),
                address: address.trim(),
                role: "USER"
            }

        });


    } catch (error) {

        console.error("Signup Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during signup."
        });

    }
}



// ===============================
// LOGIN
// ===============================

async function login(req, res) {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });

        }


        // Find user
        const [users] = await pool.query(
            `
            SELECT
                id,
                name,
                email,
                password,
                address,
                role
            FROM users
            WHERE email = ?
            `,
            [email.trim()]
        );


        if (users.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }


        const user = users[0];


        // Check password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }


        // Create JWT
        const token = jwt.sign(

            {
                id: user.id,
                email: user.email,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        res.json({

            success: true,

            message: "Login successful.",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }

        });


    } catch (error) {

        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login."
        });

    }
}



// ===============================
// CHANGE PASSWORD
// ===============================

async function changePassword(req, res) {

    try {

        const userId = req.user.id;

        const {
            currentPassword,
            newPassword
        } = req.body;


        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required."
            });

        }


        const passwordError =
            validatePassword(newPassword);


        if (passwordError) {

            return res.status(400).json({
                success: false,
                message: passwordError
            });

        }


        // Get current password
        const [users] = await pool.query(
            "SELECT password FROM users WHERE id = ?",
            [userId]
        );


        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }


        const passwordMatch =
            await bcrypt.compare(
                currentPassword,
                users[0].password
            );


        if (!passwordMatch) {

            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });

        }


        const hashedPassword =
            await bcrypt.hash(newPassword, 10);


        await pool.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, userId]
        );


        res.json({

            success: true,

            message: "Password changed successfully."

        });


    } catch (error) {

        console.error(
            "Change Password Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error."
        });

    }
}



// ===============================
// GET CURRENT USER
// ===============================

async function getMe(req, res) {

    try {

        const [users] = await pool.query(
            `
            SELECT
                id,
                name,
                email,
                address,
                role,
                created_at
            FROM users
            WHERE id = ?
            `,
            [req.user.id]
        );


        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }


        res.json({

            success: true,

            user: users[0]

        });


    } catch (error) {

        console.error("Get Me Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });

    }
}


module.exports = {
    signup,
    login,
    changePassword,
    getMe
};