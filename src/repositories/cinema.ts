import type { Cinema } from "../domain/cinemas/entity.js"
import type { CinemaRepositoryContract } from "../domain/cinemas/repository.js"
import type { CreateCinemaInput } from "../services/cinema.types.js";
import { isStructuredError } from "@prisma/orm-postgres/utils";

type Database = typeof import("../prisma/db.js").db;

export function createCinemaRepository(db: Database): CinemaRepositoryContract {
    async function getAllCinemas(take?: number): Promise<Cinema[]> {
        const query = db.orm.public.MovieSession.orderBy((session) => {
            return session.id.asc();
        }).include("seatMovies");

        if(!take){
            return query.all();
        }

        return query.limit(take).all();
    }

    async function createCinema(cinema: CreateCinemaInput): Promise<Cinema | null> {
        return new Promise(async (res, rej) => {
            try {
                const { ...fields } = cinema

                const allSeats = await db.orm.public.Seat.all();

                return db.orm.public.MovieSession.create({
                    movieTitle: cinema.movieTitle,
                    startsAt: cinema.startsAt,

                    seatMovies: (sm) => {
                        return sm.create(allSeats.map(seat => ({
                            seatId: seat.id
                        })));
                    }
                });
            } catch (error) {
                if (error instanceof Error && "sqlState" in error) {
                    if (error.sqlState === "23505") {
                        return rej("CINEMA ALREADY EXIST");
                    }

                    if (isStructuredError(error) && error.code === "ORM.RELATION_ROW_MISSING") {
                        return rej("CINEMA NOT FOUND");
                    }
                }
            }
        });
    }

    async function findCinemaById(id: number) {
        return db.orm.public.MovieSession.where({ id }).include("seatMovies").first();
    }

    async function findCinemaByTitle(name: string) {
        return db.orm.public.MovieSession.where({ movieTitle: name }).include("seatMovies").first();
    }

    return { getAllCinemas, createCinema, findCinemaById, findCinemaByTitle};
}