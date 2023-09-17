import mongoose from "mongoose";
const RatingSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
    },
});
const RatingModel = mongoose.model("Rating", RatingSchema);
export default RatingModel;
//# sourceMappingURL=RatingModel.js.map