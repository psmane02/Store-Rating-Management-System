const pool = require("../config/db");


// =====================================================
// GET ALL STORES - NORMAL USER
// =====================================================

async function getStores(req, res) {
    try {

        const search = req.query.search || "";
        const sortBy = req.query.sortBy || "name";
        const order = req.query.order === "DESC"
            ? "DESC"
            : "ASC";


        // ---------------------------------------------
        // Allowed sorting fields
        // ---------------------------------------------

        const sortFields = {
            name: "s.name",
            address: "s.address",
            rating: "average_rating"
        };


        const sortColumn =
            sortFields[sortBy] || "s.name";


        // ---------------------------------------------
        // Search
        // ---------------------------------------------

        const searchValue = `%${search}%`;


        // ---------------------------------------------
        // Get stores
        // ---------------------------------------------

        const [stores] = await pool.query(

            `SELECT
                s.id,
                s.name,
                s.email,
                s.address,

                COALESCE(
                    (
                        SELECT ROUND(AVG(r.rating), 2)
                        FROM ratings r
                        WHERE r.store_id = s.id
                    ),
                    0
                ) AS average_rating,

                (
                    SELECT r2.rating
                    FROM ratings r2
                    WHERE r2.store_id = s.id
                    AND r2.user_id = ?
                    LIMIT 1
                ) AS user_rating

            FROM stores s

            WHERE
                s.name LIKE ?
                OR s.address LIKE ?

            ORDER BY ${sortColumn} ${order}`,

            [
                req.user.id,
                searchValue,
                searchValue
            ]
        );


        // ---------------------------------------------
        // Success response
        // ---------------------------------------------

        res.json({

            success: true,

            count: stores.length,

            data: stores

        });


    } catch (error) {

        console.error(
            "Get Stores Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Could not load stores."

        });
    }
}



// =====================================================
// OWNER DASHBOARD
// =====================================================

async function ownerDashboard(req, res) {

    try {

        // ---------------------------------------------
        // Find store owned by logged-in owner
        // ---------------------------------------------

        const [stores] =
            await pool.query(

                `SELECT
                    id,
                    name,
                    email,
                    address

                 FROM stores

                 WHERE owner_id = ?`,

                [req.user.id]
            );


        // ---------------------------------------------
        // Owner has no store
        // ---------------------------------------------

        if (!stores.length) {

            return res.json({

                success: true,

                data: {

                    store: null,

                    averageRating: 0,

                    ratings: []

                }

            });
        }


        // ---------------------------------------------
        // Get owner's store
        // ---------------------------------------------

        const store =
            stores[0];


        // ---------------------------------------------
        // Calculate average rating
        // ---------------------------------------------

        const [[average]] =
            await pool.query(

                `SELECT
                    COALESCE(
                        ROUND(
                            AVG(rating),
                            2
                        ),
                        0
                    ) AS averageRating

                 FROM ratings

                 WHERE store_id = ?`,

                [store.id]
            );


        // ---------------------------------------------
        // Get users who rated the store
        // ---------------------------------------------

        const [ratings] =
            await pool.query(

                `SELECT
                    u.id AS user_id,
                    u.name,
                    u.email,
                    u.address,
                    r.rating,
                    r.updated_at

                 FROM ratings r

                 JOIN users u
                 ON u.id = r.user_id

                 WHERE r.store_id = ?

                 ORDER BY
                    r.updated_at DESC`,

                [store.id]
            );


        // ---------------------------------------------
        // Send response
        // ---------------------------------------------

        res.json({

            success: true,

            data: {

                store: store,

                averageRating:
                    average.averageRating,

                ratings: ratings

            }

        });


    } catch (error) {

        console.error(
            "Owner Dashboard Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Could not load owner dashboard."

        });
    }
}



// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getStores,

    ownerDashboard

};