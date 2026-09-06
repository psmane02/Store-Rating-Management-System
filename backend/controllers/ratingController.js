const pool = require("../config/db");


// =====================================================
// SUBMIT / MODIFY RATING
// =====================================================

async function submitRating(req, res) {

    try {

        // ---------------------------------------------
        // Get Store ID
        // ---------------------------------------------

        const storeId = Number(req.params.storeId);


        // ---------------------------------------------
        // Get Rating
        // ---------------------------------------------

        const rating = Number(req.body.rating);


        // ---------------------------------------------
        // Validate Store ID and Rating
        // ---------------------------------------------

        if (
            !Number.isInteger(storeId) ||
            storeId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid store ID."

            });
        }


        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {

            return res.status(400).json({

                success: false,

                message: "Rating must be between 1 and 5."

            });
        }


        // ---------------------------------------------
        // Check whether store exists
        // ---------------------------------------------

        const [stores] = await pool.query(

            `SELECT
                id,
                name

             FROM stores

             WHERE id = ?`,

            [storeId]

        );


        if (stores.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Store not found."

            });
        }


        // ---------------------------------------------
        // Insert or Modify Rating
        // ---------------------------------------------

        await pool.query(

            `INSERT INTO ratings
            (
                user_id,
                store_id,
                rating
            )

            VALUES (?, ?, ?)

            ON DUPLICATE KEY UPDATE
                rating = VALUES(rating),
                updated_at = CURRENT_TIMESTAMP`,

            [
                req.user.id,
                storeId,
                rating
            ]

        );


        // ---------------------------------------------
        // Get updated average rating
        // ---------------------------------------------

        const [[result]] = await pool.query(

            `SELECT
                COALESCE(
                    ROUND(
                        AVG(rating),
                        2
                    ),
                    0
                ) AS average_rating

             FROM ratings

             WHERE store_id = ?`,

            [storeId]

        );


        // ---------------------------------------------
        // Success Response
        // ---------------------------------------------

        res.json({

            success: true,

            message: "Rating submitted successfully.",

            data: {

                storeId: storeId,

                rating: rating,

                average_rating:
                    result.average_rating

            }

        });


    } catch (error) {

        console.error(
            "Submit Rating Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Could not submit rating."

        });
    }
}



// =====================================================
// GET USER'S RATING FOR A STORE
// =====================================================

async function getUserRating(req, res) {

    try {

        const storeId =
            Number(req.params.storeId);


        // ---------------------------------------------
        // Validate Store ID
        // ---------------------------------------------

        if (
            !Number.isInteger(storeId) ||
            storeId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid store ID."

            });
        }


        // ---------------------------------------------
        // Get User Rating
        // ---------------------------------------------

        const [ratings] = await pool.query(

            `SELECT
                r.id,
                r.store_id,
                r.rating,
                r.created_at,
                r.updated_at

             FROM ratings r

             WHERE r.store_id = ?
             AND r.user_id = ?

             LIMIT 1`,

            [
                storeId,
                req.user.id
            ]

        );


        // ---------------------------------------------
        // No Rating
        // ---------------------------------------------

        if (ratings.length === 0) {

            return res.json({

                success: true,

                data: null

            });
        }


        // ---------------------------------------------
        // Rating Found
        // ---------------------------------------------

        res.json({

            success: true,

            data: ratings[0]

        });


    } catch (error) {

        console.error(
            "Get User Rating Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Could not load your rating."

        });
    }
}



// =====================================================
// GET ALL RATINGS FOR A STORE
// Useful for Store Owner
// =====================================================

async function getStoreRatings(req, res) {

    try {

        const storeId =
            Number(req.params.storeId);


        // ---------------------------------------------
        // Validate Store ID
        // ---------------------------------------------

        if (
            !Number.isInteger(storeId) ||
            storeId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid store ID."

            });
        }


        // ---------------------------------------------
        // Check Store
        // ---------------------------------------------

        const [stores] = await pool.query(

            `SELECT
                id,
                name,
                address

             FROM stores

             WHERE id = ?`,

            [storeId]

        );


        if (stores.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Store not found."

            });
        }


        // ---------------------------------------------
        // Get Ratings
        // ---------------------------------------------

        const [ratings] = await pool.query(

            `SELECT
                r.id,
                r.rating,
                r.created_at,
                r.updated_at,

                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,
                u.address AS user_address

             FROM ratings r

             JOIN users u
             ON u.id = r.user_id

             WHERE r.store_id = ?

             ORDER BY
                r.updated_at DESC`,

            [storeId]

        );


        // ---------------------------------------------
        // Average Rating
        // ---------------------------------------------

        const [[average]] = await pool.query(

            `SELECT
                COALESCE(
                    ROUND(
                        AVG(rating),
                        2
                    ),
                    0
                ) AS average_rating

             FROM ratings

             WHERE store_id = ?`,

            [storeId]

        );


        // ---------------------------------------------
        // Response
        // ---------------------------------------------

        res.json({

            success: true,

            data: {

                store: stores[0],

                average_rating:
                    average.average_rating,

                ratings: ratings

            }

        });


    } catch (error) {

        console.error(
            "Get Store Ratings Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Could not load store ratings."

        });
    }
}



// =====================================================
// EXPORT FUNCTIONS
// =====================================================

module.exports = {

    submitRating,

    getUserRating,

    getStoreRatings

};