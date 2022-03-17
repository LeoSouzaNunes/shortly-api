import bcrypt from "bcrypt";
import { connection } from "../database.js";

export async function createUser(req, res) {
    const user = req.body;

    try {
        const existingUsers = await connection.query(
            "SELECT * FROM users WHERE email=$1",
            [user.email]
        );
        if (existingUsers.rowCount > 0) {
            return res.sendStatus(409);
        }

        const passwordHash = bcrypt.hashSync(user.password, 10);

        await connection.query(
            `
      INSERT INTO 
        users(name, email, password) 
      VALUES ($1, $2, $3)
    `,
            [user.name, user.email, passwordHash]
        );

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function getUser(req, res) {
    const { user } = res.locals;

    try {
        res.send(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function getUserById(req, res) {
    try {
        const { id } = req.params;

        const user = await connection.query(
            `
      SELECT id, name FROM users WHERE id=${id}
      `
        );
        if (user.rowCount === 0) {
            return res.sendStatus(404);
        }

        const urls = await connection.query(`
      SELECT * FROM urls WHERE "userId"=${id}`);

        const visitCount = await connection.query(
            ` SELECT SUM("visitCount") FROM urls WHERE "userId"=${id}`
        );

        res.status(200).send({
            ...user.rows[0],
            visitCount: visitCount.rows[0].sum,
            shortenedUrls: [...urls.rows],
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
