import { Router } from "express";
import urlSchema from "../schemas/urlSchema.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import {
    createShortUrl,
    getUrls,
    deleteUrl,
} from "../controllers/urlController.js";

const urlsRouter = Router();

urlsRouter.post(
    "/urls/shorten",
    validateSchemaMiddleware(urlSchema),
    validateTokenMiddleware,
    createShortUrl
);
urlsRouter.get("/urls/:shortUrl", getUrls);
urlsRouter.delete("/urls/:id", validateTokenMiddleware, deleteUrl);

export default urlsRouter;
