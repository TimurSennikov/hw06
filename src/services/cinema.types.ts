import { Cinema, Seat } from "../domain/cinemas/entity";

/*
model MovieSession{
  id Int  @id @default(autoincrement())
  movieTitle String
  startsAt String
  seats SeatMovie[] @relation()
}
*/

export type CreateCinemaInput = Omit<Cinema, "id">;
export type CreateSeatInput = Omit<Seat, "id">;

export interface CinemaServiceContract {
    getCinemas: (take?: number) => Promise<Cinema[]>,
    findCinema: (id: number) => Promise<Cinema | null>
    createNewCinema: (product: CreateCinemaInput) => Promise<Cinema | null>,
};

export interface SeatServiceContract {
    getSeats: (take?: number) => Promise<Seat[]>,
    createSeat: (seat: CreateSeatInput) => Promise<Seat | null>
    getBookedByCinema: (cinema_id: number) => Promise<Seat[] | null>,
    bookSeatById: (cinema_id: number, seat_id: number) => Promise<Seat | null>
};