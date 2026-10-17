export interface Cinema {
    id: number,

    movieTitle: string,
    startsAt: string,

    seatMovies: {
        movieSessionId: number,
        seatId: number,
        booked: boolean
    }[]
};

export interface Seat {
    id: number,

    row: number,
    column: number,

    seatMovies?: number[]
};