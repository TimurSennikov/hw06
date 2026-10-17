import { Router } from 'express';
import type { CinemaHandlerContract, SeatHandlerContract } from '../handlers/cinema.types.ts';

export function createSeatRouter(seatHandler: SeatHandlerContract){
    const seatsRouter = Router()
    
    seatsRouter.get('/', seatHandler.getSeats);
    seatsRouter.post('/sessions/:id/book', seatHandler.bookSeatById);
    seatsRouter.get('/sessions/:id/seats', seatHandler.getBookedByCinema);

    return seatsRouter
}