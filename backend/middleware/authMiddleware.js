const jwt = require("jsonwebtoken");


// Check whether user is logged in
function authenticate(req, res, next) {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required"
            });
        }


        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;


        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        req.user = decoded;

        next();


    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }
}



// Check user's role
function authorize(...roles) {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated"
            });
        }


        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "Access denied"
            });

        }


        next();
    };
}


module.exports = {
    authenticate,
    authorize
};