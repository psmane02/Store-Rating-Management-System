function RatingStars({
    rating = 0,
    onChange,
    readonly = false
}) {

    const currentRating = Number(rating) || 0;


    const handleClick = (value) => {

        if (readonly) {
            return;
        }

        if (onChange) {
            onChange(value);
        }
    };


    return (
        <div
            className="rating-stars"
            style={{
                display: "flex",
                alignItems: "center",
                gap: "3px"
            }}
        >

            {[1, 2, 3, 4, 5].map((star) => (

                <button
                    key={star}
                    type="button"
                    onClick={() => handleClick(star)}
                    disabled={readonly}
                    title={
                        readonly
                            ? `${currentRating} out of 5`
                            : `Give ${star} star`
                    }
                    aria-label={`Rate ${star} out of 5`}
                    style={{
                        border: "none",
                        background: "transparent",
                        padding: "2px",
                        fontSize: "25px",
                        cursor: readonly
                            ? "default"
                            : "pointer",
                        opacity:
                            star <= currentRating
                                ? 1
                                : 0.3
                    }}
                >
                    ⭐
                </button>

            ))}

        </div>
    );
}


export default RatingStars;