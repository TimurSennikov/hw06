import { Cinema, Seat } from "../domain/cinemas/entity.js";
import type { SeatRepositoryContract } from "../domain/cinemas/repository.ts";
import type { CreateSeatInput, SeatServiceContract } from "./cinema.types.ts";

export function createSeatService(seatRepository: SeatRepositoryContract): SeatServiceContract {
    async function getSeats(take?: number): Promise<any> {
        return seatRepository.getAllSeats(take) as Promise<any>;
    }

    async function createSeat(data: CreateSeatInput): Promise<Seat | null> {
        let { row, column } = data;

        let seat = {
            row,
            column
        };

        return await seatRepository.createSeat(seat);
    }

    async function getBookedByCinema(cinema_id: number): Promise<Seat[] | null> {
        return seatRepository.getBookedByCinema(cinema_id);
    }

    async function bookSeatById(cinema_id: number, seat_id: number): Promise<Seat | null> {
        return seatRepository.bookSeatById(cinema_id, seat_id);
    }

    return { getSeats, createSeat, bookSeatById, getBookedByCinema };
}