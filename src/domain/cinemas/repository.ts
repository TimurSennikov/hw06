import type { CreateCinemaInput, CreateSeatInput } from "../../services/cinema.types.js";
import type { Cinema } from "./entity.ts";
import type { Seat } from "./entity.ts";

export interface CinemaRepositoryContract {
    getAllCinemas: (take?: number, categoryId?: number) => Promise<Cinema[]>;
    createCinema: (cinema: CreateCinemaInput) => Promise<Cinema | null>;
    findCinemaById: (id: number) => Promise<Cinema | null>;
    findCinemaByTitle: (title: string) => Promise<Cinema | null>;
}

export interface SeatRepositoryContract {
    getAllSeats: (take?: number, categoryId?: number) => Promise<Seat[]>;
    createSeat: (seat: CreateSeatInput) => Promise<Seat | null>;
    getBookedByCinema: (cinema_id: number) => Promise<Seat[] | null>;
    bookSeatById: (cinema_id: number, seat_id: number) => Promise<Seat | null>;
}