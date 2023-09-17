import MovieModel from "../models/MovieModel.js";
import RatingModel from "../models/RatingModel.js";
class MovieRepository {
    async createMovie(movieData) {
        try {
            const newMovie = new MovieModel(movieData);
            return await newMovie.save();
        }
        catch (error) {
            throw error;
        }
    }
    async deleteMovie(id) {
        try {
            return await MovieModel.findByIdAndDelete(id);
        }
        catch (error) {
            throw error;
        }
    }
    async updateMovie(id, movieData) {
        try {
            return await MovieModel.findByIdAndUpdate(id, movieData, { new: true });
        }
        catch (error) {
            throw error;
        }
    }
    async getMovieByID(id) {
        try {
            return await MovieModel.findById(id);
        }
        catch (error) {
            throw error;
        }
    }
    async getAllMovies(query, page, limit, sortParams) {
        try {
            const skip = (page - 1) * limit;
            const countPromise = MovieModel.countDocuments(query);
            const dataPromise = MovieModel.find(query)
                .sort(sortParams)
                .skip(skip)
                .limit(limit);
            const [totalMovies, movies] = await Promise.all([
                countPromise,
                dataPromise,
            ]);
            return { totalMovies, movies };
        }
        catch (error) {
            throw error;
        }
    }
    async createRating(ratingData) {
        try {
            const newRating = new RatingModel(ratingData);
            return await newRating.save();
        }
        catch (error) {
            throw error;
        }
    }
}
export default new MovieRepository();
//# sourceMappingURL=MovieRepository.js.map