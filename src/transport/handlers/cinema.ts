import type { CinemaResponse, SeatResponse } from "../dto/responses.js";
import type { CreateCinemaRequest, GetBookedByCinemaRequest } from "../dto/requests.js";
import type { ErrorResponse } from "../dto/errors.js";
import type { Request, Response } from "express";
import type { CinemaHandlerContract, SeatHandlerContract } from "../handlers/cinema.types.ts";
import type { CinemaServiceContract, CreateSeatInput, SeatServiceContract } from "../../services/cinema.types.ts";

export function createCinemaHandler(cinemaService: CinemaServiceContract): CinemaHandlerContract{
    async function getAllCinemas(
        req: Request,
        res: Response<CinemaResponse[] | ErrorResponse>
    ){
        const { take } = req.query
        if (!take) {
            return res.status(200).json(await cinemaService.getCinemas());
        }
        const takeNum = Number(take)

        if(!takeNum || !Number.isInteger(takeNum) || takeNum < 0) {
            res.status(400).json({
                message: "Query parameter 'take' is incorrect!"
            })
            return
        }
        const cinemas = await cinemaService.getCinemas(takeNum)
        res.status(200).json(cinemas)
    }

    async function getCinemaById(
        req: Request, 
        res: Response<CinemaResponse | ErrorResponse>
    ) {
        const cinemaId = Number(req.params.id);

        if (!Number.isInteger(cinemaId) || cinemaId <= 0) {
            return res.status(400).json({
                message: 'id must be a positive integer',
            });
        }

        const cinemas = await cinemaService.findCinema(cinemaId);

        if (!cinemas) {
            return res.status(404).json({
                message: 'Cinema not found',
            });
        }

        res.status(200).json(cinemas);
    }

    async function createCinema(
        req: Request<{}, {}, CreateCinemaRequest>, 
        res: Response<CinemaResponse | ErrorResponse>) {
        const { movieTitle, startsAt } = req.body;

        if (
            typeof movieTitle !== 'string' || !movieTitle.trim() ||
            typeof startsAt !== 'string'
        ) {
            return res.status(422).json({
                message: 'Invalid cinema data',
            });
        }

        try {
            const createdCinema = await cinemaService.createNewCinema({
                movieTitle,
                startsAt,
                seatMovies: []
            });

            if (!createdCinema) {
                return res.status(409).json({
                    message: 'Cinema already exists',
                });
            }

            const cinemaRes: CinemaResponse = {
                id: createdCinema.id,
                movieTitle: createdCinema.movieTitle,
                startsAt: createdCinema.startsAt
            };

            res.status(201).json(cinemaRes);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: 'Failed to create cinema',
            });
        }
    }
    return { getAllCinemas, getCinemaById, createCinema }
}


export function createSeatHandler(seatService: SeatServiceContract): SeatHandlerContract {
    async function getSeats(
        req: Request,
        res: Response<SeatResponse[] | ErrorResponse>
    ){
        const { take } = req.query
        if (!take) {
            return res.status(200).json(await seatService.getSeats());
        }
        const takeNum = Number(take)

        if(!takeNum || !Number.isInteger(takeNum) || takeNum < 0) {
            res.status(400).json({
                message: "Query parameter 'take' is incorrect!"
            })
            return
        }
        const seats = await seatService.getSeats(takeNum);
        res.status(200).json(seats)
    }

    async function bookSeatById(
        req: Request, 
        res: Response<SeatResponse | ErrorResponse>
    ) {
        const cinemaId = Number(req.params.id);
        const { seatId } = req.body;

        if (!Number.isInteger(seatId) || seatId <= 0) {
            return res.status(400).json({
                message: 'id must be a positive integer',
            });
        }

        const booked = await seatService.bookSeatById(cinemaId, seatId);

        if (!booked) {
            return res.status(404).json({
                message: 'Seat not found',
            });
        }

        res.status(200).json(booked);
    }

    async function getBookedByCinema(
        req: Request<{id: number}, {}, GetBookedByCinemaRequest>,
        res: Response<any | ErrorResponse>
    ) {
        const cinemaId = Number(req.params.id);

        if (!Number.isInteger(cinemaId) || cinemaId <= 0) {
            return res.status(400).json({
                message: 'id must be a positive integer',
            });
        }

        const booked = await seatService.getBookedByCinema(cinemaId);
        if (!booked) {
            return res.status(404).json({
                message: 'Seat not found',
            });
        }

        res.status(200).json({
            booked
        });
    }

    async function createSeat(
        req: Request<{}, {}, CreateSeatInput>, 
        res: Response<SeatResponse | ErrorResponse>) {
        const { row, column } = req.body;

        let rowNum = Number(row);
        let colNum = Number(column);

        let seat = {
            row: rowNum,
            column: colNum
        };

        try {
            const createdSeat = await seatService.createSeat(seat);

            if (!createdSeat) {
                return res.status(409).json({
                    message: 'Seat already exists',
                });
            }

            const seatRes: SeatResponse = {
                id: createdSeat.id,
                row: createdSeat.row,
                column: createdSeat.column
            };

            res.status(201).json(seatRes);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: 'Failed to create cinema',
            });
        }
    }
    return { getSeats, createSeat, getBookedByCinema, bookSeatById };
}
