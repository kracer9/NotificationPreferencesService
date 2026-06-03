import express, { type ErrorRequestHandler } from "express";
import { DateTime } from "luxon";
import type EvaluateRequestDTO from "./dto/EvaluateRequestDTO.ts";
import type PostUserPreferencesDTO from "./dto/PostUserPreferencesDTO.ts";
import type PutNotificationPreferenceDTO from "./dto/PutNotificationPreferenceDTO.ts";
import UserService from "./services/UserService.ts";
import EvaluationService from "./services/Evaluation/EvaluationService.ts";
import NotFound from "./errors/NotFound.ts";

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    if (err instanceof NotFound) {
        res.status(404).json({ error: err.message });
    } else {
        next();
    }
};

const routes = express.Router();

routes.post("/users/:id/preferences", async (req, res) => {
    const userId = Number(req.params.id);
    const data: PostUserPreferencesDTO = req.body; // todo: validate
    const service = new UserService();
    const user = await service.postUserPreferences(userId, data);
    res.json(user.data);
});

routes.put("/users/:id/preferences/notification", async (req, res) => {
    const userId = Number(req.params.id);
    const data: PutNotificationPreferenceDTO = req.body; // todo: validate
    const service = new UserService();
    const preference = await service.putNotificationPreference(userId, data);
    // можно добавить в доменные сущности статусы для определения создана ли новая запись
    // или изменяется существующая, и выводить соответствующие http-коды (201, 200)
    res.json(preference.data);
});

routes.get("/users/:id/preferences", async (req, res) => {
    const userId = Number(req.params.id);
    const service = new UserService();
    const user = await service.getUserPreferences(userId);
    res.json(user.data);
});

routes.post("/evaluate", async (req, res) => {
    const data: EvaluateRequestDTO = {
        userId: Number(req.body.userId),
        region: req.body.region,
        type: req.body.type,
        channel: req.body.channel,
        datetime: DateTime.fromISO(req.body.datetime),
    };

    const service = new EvaluationService();
    const response = await service.evaluate(data);
    res.json(response);
});

routes.use(errorHandler);

export default routes;
