import type { CinemaRepositoryContract } from "../domain/cinemas/repository.ts";
import type { CreateCinemaInput, CinemaServiceContract } from "./cinema.types.ts";

export function createCinemaService(cinemaRepository: CinemaRepositoryContract): CinemaServiceContract {
    function getCinemas(take?: number): Promise<any> {
        return cinemaRepository.getAllCinemas(take) as Promise<any>;
    }

    function findCinema(id: number) {
        return cinemaRepository.findCinemaById(id)
    }

    async function createNewCinema(data: CreateCinemaInput) {
        let { movieTitle, startsAt } = data;

        if(await cinemaRepository.findCinemaByTitle(movieTitle)) {
            return null;
        }

        let cinema = {
            movieTitle: movieTitle,
            startsAt: startsAt,

            seatMovies: []
        };

        return await cinemaRepository.createCinema(cinema);
    }

    return { getCinemas, findCinema, createNewCinema};
}