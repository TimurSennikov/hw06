import { Router } from 'express';
import type { CinemaHandlerContract } from '../handlers/cinema.types.ts';

export function createCinemaRouter(cinemaHandler: CinemaHandlerContract){
    const cinemasRouter = Router()
    
    cinemasRouter.get('/sessions', cinemaHandler.getAllCinemas);
    cinemasRouter.get('/sessions/:id', cinemaHandler.getCinemaById);
    cinemasRouter.post('/sessions/create', cinemaHandler.createCinema);

    return cinemasRouter
}