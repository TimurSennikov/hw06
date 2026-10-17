export interface CreateCinemaRequest {
    movieTitle: string;
    startsAt: string;
}

export interface CreateSeatRequest {
    row: number,
    column: number;
}

export interface GetBookedByCinemaRequest {
    cinemaId: number;
}