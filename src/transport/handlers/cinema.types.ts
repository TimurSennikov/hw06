import type { Request, Response } from "express"
import type { CinemaResponse, SeatResponse } from "../dto/responses.js";
import type { CreateCinemaRequest, GetBookedByCinemaRequest } from "../dto/requests.js";
import type { ErrorResponse } from "../dto/errors.js";
import { CreateSeatInput } from "../../services/cinema.types.js";

export interface CinemaHandlerContract {
    getAllCinemas: (
        req: Request, 
        res: Response<CinemaResponse[] | ErrorResponse>
    ) => void;
    getCinemaById: (
        req: Request,
        res: Response<CinemaResponse | ErrorResponse>
    ) => void;
    createCinema: (
        req: Request<{}, {}, CreateCinemaRequest>,
        res: Response<CinemaResponse | ErrorResponse>
    ) => void;
}

export interface SeatHandlerContract {
    getSeats: (
        req: Request, 
        res: Response<SeatResponse[] | ErrorResponse>
    ) => void;
    createSeat: (
        req: Request<{}, {}, CreateSeatInput>,
        res: Response<SeatResponse | ErrorResponse>
    ) => void;
    getBookedByCinema: (
        req: Request<{id: number}, {}, GetBookedByCinemaRequest>,
        res: Response<SeatResponse[] | ErrorResponse>
    ) => void;
    bookSeatById: (
        req: Request,
        res: Response<SeatResponse | ErrorResponse>
    ) => void;
}