import { connection } from "../database.js";
import { v4 as uuid } from "uuid";

async function createShortUrl(req, res) {
    const userId = res.locals.user.id;
    const url = req.body.url;

    try {
        const shortenUrl = {
            shortUrl: uuid().split("-")[0],
        };
        await connection.query(
            `INSERT INTO urls("userId","shortUrl", url, "visitCount")
            VALUES ($1,$2,$3,$4)    
        `,
            [userId, shortenUrl.shortUrl, url, 10]
        );

        return res.status(201).send({ ...shortenUrl });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function getUrls(req, res) {
    const { shortUrl } = req.params;

    try {
        const result = await connection.query(
            `
            SELECT * FROM urls
                WHERE "shortUrl"=$1
        `,
            [shortUrl]
        );

        if (result.rowCount === 0) {
            return res.sendStatus(404);
        }

        const responseObject = {
            ...result.rows[0],
        };
        console.log(result.rows);
        return res.status(200).send(responseObject);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function deleteUrl(req, res) {
    const { id } = req.params;
    const user = res.locals.user;

    try {
        const result = await connection.query(
            `
            SELECT * FROM urls
                WHERE id=$1
            `,
            [id]
        );

        if (!result.rowCount || result.rows[0].userId !== user.id) {
            return res.sendStatus(401);
        }

        await connection.query(
            `
            DELETE FROM urls WHERE id=$1
        `,
            [id]
        );
        return res.sendStatus(204);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export { createShortUrl, getUrls, deleteUrl };
