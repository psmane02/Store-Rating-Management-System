require("dotenv").config();

const bcrypt = require("bcryptjs");

const pool = require("./config/db");


async function createAdmin() {

    try {

        const name = "System Administrator";

        const email = "prachi@gmail.com";

        const password = "Prachi@02";

        const address =
            "Roxiler Store Rating Management System, Pune, Maharashtra";


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const [existing] =
            await pool.query(
                "SELECT id FROM users WHERE email = ?",
                [email]
            );


        if (existing.length > 0) {

            await pool.query(
                `
                UPDATE users
                SET
                    name = ?,
                    password = ?,
                    address = ?,
                    role = 'ADMIN'
                WHERE email = ?
                `,
                [
                    name,
                    hashedPassword,
                    address,
                    email
                ]
            );

            console.log(
                "Admin account updated successfully."
            );

        } else {

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
                VALUES (?, ?, ?, ?, 'ADMIN')
                `,
                [
                    name,
                    email,
                    hashedPassword,
                    address
                ]
            );

            console.log(
                "Admin account created successfully."
            );

        }


        console.log("");
        console.log("Admin Login Details");
        console.log("-------------------");
        console.log("Email:", email);
        console.log("Password:", password);


    } catch (error) {

        console.error(
            "Create Admin Error:",
            error
        );

    } finally {

        await pool.end();

    }
}


createAdmin();