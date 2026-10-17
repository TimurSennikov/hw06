import type { Cinema, Seat } from "../domain/cinemas/entity.js"
import type { SeatRepositoryContract } from "../domain/cinemas/repository.js"
import type { CreateSeatInput } from "../services/cinema.types.js";
import { isStructuredError } from "@prisma/orm-postgres/utils";

type Database = typeof import("../prisma/db.js").db;

export function createSeatRepository(db: Database): SeatRepositoryContract {
    async function getAllSeats(take?: number): Promise<Seat[]> {
        const query = db.orm.public.Seat.orderBy((seat) => {
            return seat.row.asc();
        });

        if(!take){
            return query.all();
        }

        return query.limit(take).all();
    }

    async function createSeat(seat: CreateSeatInput): Promise<Seat | null> {
        return new Promise((res, rej) => {
            try {
                return db.orm.public.Seat.create({
                    row: seat.row,
                    column: seat.column
                });
            } catch (error) {
                if (error instanceof Error && "sqlState" in error) {
                    if (error.sqlState === "23505") {
                        return rej("SEAT ALREADY EXIST");
                    }

                    if (isStructuredError(error) && error.code === "ORM.RELATION_ROW_MISSING") {
                        return rej("SEAT NOT FOUND");
                    }
                }
            }
        });
    }

    async function getBookedByCinema(cinema_id: number): Promise<Seat[]> {
        let seats = await db.orm.public.Seat.where((s) => {
            return s.seatMovies.some((ms) => {
                return ms.movieSessionId.eq(cinema_id);
            })
        }).all();

        return seats;
    }

    async function bookSeatById(cinema_id: number, seat_id: number): Promise<Seat | null> {
        let seat = await db.orm.public.Seat.where({ id: seat_id }).first();
        let cinema = await db.orm.public.MovieSession.where({ id: cinema_id }).first();

        if(!seat || !cinema) {
            return null;
        }

        let seatBooking = await db.orm.public.SeatMovie.where({ seatId: seat.id, movieSessionId: cinema.id }).update({
            booked: true
        });

        return seat;
    }

    return { getAllSeats, createSeat,  getBookedByCinema, bookSeatById};
}