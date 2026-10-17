export interface CinemaResponse {
    id: number;
    movieTitle: string;
    startsAt: string;
    seats?: number[];
}

export interface SeatResponse {
    id: number;
    
    row: number;
    column: number;

    movies?: number[];
}