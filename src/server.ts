import express from "express"
import { createCinemaRepository } from "./repositories/cinema.js"
import { createCinemaService } from "./services/cinema.js"
import { createCinemaHandler, createSeatHandler } from "./transport/handlers/cinema.js"
import { createCinemaRouter } from "./transport/routers/cinema.js"
import { db } from "./prisma/db.js";
import { createSeatRepository } from "./repositories/seat.js"
import { createSeatService } from "./services/seat.js"
import { createSeatRouter } from "./transport/routers/seat.js"

const PORT = 8000
const HOST = "localhost"

const app = express()

const cinemaRepository = createCinemaRepository(db);
const cinemaService = createCinemaService(cinemaRepository);
const cinemaHandler = createCinemaHandler(cinemaService);
const cinemaRouter = createCinemaRouter(cinemaHandler);


const seatRepository = createSeatRepository(db);
const seatService = createSeatService(seatRepository);
const seatHandler = createSeatHandler(seatService);
const seatsRouter = createSeatRouter(seatHandler);

app.use(express.json());
app.use("/", cinemaRouter);
app.use("/", seatsRouter);

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})

// DTO (Data Transfer Object)