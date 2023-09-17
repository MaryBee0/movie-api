import MovieService from "../services/MovieService.js";
import ApiError from "../utils/ApiError.js";
import AuthService from "../services/AuthService.js";
class MovieController {
    async create(req, res, next) {
        var _a;
        try {
            const { title, releaseDate, trailerLink, genres } = req.body;
            const poster = (_a = req.files) === null || _a === void 0 ? void 0 : _a.posterUrl;
            let posterImg = "no-image.jpg";
            if (poster) {
                posterImg = await MovieService.save(poster);
            }
            const newMovie = {
                title,
                releaseDate,
                trailerLink,
                posterUrl: posterImg,
                genres,
            };
            const savedMovie = await MovieService.createMovie(newMovie);
            res.status(201).json(savedMovie);
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        var _a;
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 15;
            const sortBy = req.query.sortBy || "releaseDate";
            const sortOrder = req.query.sortOrder || "desc";
            const filtersQuery = req.query.filters;
            let filters = {};
            if (filtersQuery) {
                try {
                    filters = JSON.parse(decodeURIComponent(filtersQuery));
                }
                catch (error) {
                    next(ApiError.BadRequestError("Invalid filters JSON."));
                }
            }
            console.log(filters);
            const movies = await MovieService.getAllMovies(page, limit, sortBy, sortOrder, filters);
            for (let i = 0; i < movies.movies.length; i++) {
                const fullImageUrl = `${req.protocol}://${req.get("host")}/${(_a = movies.movies[i]) === null || _a === void 0 ? void 0 : _a.posterUrl}`;
                movies.movies[i].posterUrl = fullImageUrl;
            }
            res.status(200).json(movies);
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const movie = await MovieService.getMovieById(id);
            if (!movie) {
                throw ApiError.NotFoundError(`Movie not found for ${id}.`);
            }
            res.status(200).json(movie);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        var _a;
        try {
            const { id } = req.params;
            const { title, releaseDate, trailerLink, genres } = req.body;
            const poster = (_a = req.files) === null || _a === void 0 ? void 0 : _a.posterUrl;
            let posterImg = "no-image.jpg";
            const movieData = {
                title,
                releaseDate,
                trailerLink,
                posterUrl: posterImg,
                genres,
            };
            let existingMovie = await MovieService.updateMovie(id, movieData);
            if (!existingMovie) {
                throw ApiError.NotFoundError(`Movie not found for ${id}.`);
            }
            if (existingMovie) {
                if (existingMovie.posterUrl &&
                    existingMovie.posterUrl !== "no-image.jpg") {
                    await MovieService.deleteMovie(existingMovie.posterUrl);
                }
                if (poster) {
                    posterImg = await MovieService.save(poster);
                }
                existingMovie.title = title || existingMovie.title;
                existingMovie.releaseDate = releaseDate || existingMovie.releaseDate;
                existingMovie.trailerLink = trailerLink || existingMovie.trailerLink;
                existingMovie.posterUrl = posterImg || existingMovie.posterUrl;
                existingMovie.genres = genres || existingMovie.genres;
                const updatedMovie = await existingMovie.save();
                res.status(200).json(updatedMovie);
            }
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            if (!AuthService.isAdmin(req.user)) {
                throw ApiError.UnauthorizedError("Not authorized.");
            }
            const deletedMovie = await MovieService.deleteMovie(id);
            if (!deletedMovie) {
                throw ApiError.NotFoundError(`Movie not found for ${id}.`);
            }
            res.status(200).json(deletedMovie);
        }
        catch (error) {
            next(error);
        }
    }
    async createRating(req, res, next) {
        try {
            const { movieId, userId, rating, comment } = req.body;
            const newRating = {
                movie: movieId,
                user: userId,
                rating,
                comment,
            };
            const savedRating = await MovieService.createRating(newRating);
            res.status(201).json(savedRating);
        }
        catch (error) {
            next(error);
        }
    }
}
export default new MovieController();
//# sourceMappingURL=MovieController.js.map