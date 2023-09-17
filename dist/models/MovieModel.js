import mongoose from "mongoose";
const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    trailerLink: {
        type: String,
        required: true,
    },
    posterUrl: {
        type: String,
        required: true,
    },
    genres: {
        type: [String],
        required: true,
    },
});
const MovieModel = mongoose.model("Movie", MovieSchema);
export default MovieModel;
//# sourceMappingURL=MovieModel.js.map