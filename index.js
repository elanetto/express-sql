import express from "express";
import cors from "cors";
import mysql from 'mysql2/promise';

const port = process.env.PORT || 3000;
console.log(port);

const connection = await mysql.createConnection({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

const app = express();

let count = 0;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    count++;
    console.log(count);
    next();
});

app.get("/", async (req, res) => {
    const [result, fields] = await connection.query("SELECT * FROM user");
    res.send(result);
});

app.listen(3000, () => {
    console.log("Server started");
})

app.get("/query", (req,res) => {
    res.send(req.query);
})

app.get("/user/:id", async (req, res) => {
    const id = Number(req.params.id);
    if(!isNaN(id)) {
        try {
            const [result] = await connection.execute(
                "SELECT * FROM user WHERE id = ?", 
                [id]
            );
            if (result.length) {
                res.json(result);
                } else {
                    res.status(404).json({ message: "User not found" });
            }    
        } catch (error) {
            res.status(500).send("something went wrong");
            }
    } else { 
        res.status(400).json({ message: "Id is not a valid number" });
    }
});

app.post("/post", async (req, res) => {
    const { id, title, content } = req.body;
    
    const [result] = await connection.query(`
        INSERT INTO post(title, content, user_id)
        VALUES('${title}', '${content}', ${id})
        `);
    res.json(result);
});

app.get("/post", async (req, res) => {
    const [result] = await connection.query(`
        SELECT * FROM post
    `);
    res.json(result);
});

app.get('/test', async (req, res) => {
    const [result] = await connection.query("SELECT * FROM test");
    res.json(result);
});

app.get('/test/:id', async (req, res) => {
    const {id} = req.params;
    const [result] = await connection.query("SELECT * FROM test WHERE id=" + id);
    res.json(result);
})

app.post('/test', async (req, res) => {
    const {content} = req.body;
    const [result] = await connection.query("INSERT INTO test(content) VALUES('"+content+"')");
    res.json(result);
});

// http://localhost:3000/test?sort=content&sortOrder=ASC
// http://localhost:3000/test?sort=id&sortOrder=DESC

app.get("/test", async (req, res) => {
    const allowedSortColumns = ["id", "content"]; // Define allowed columns
    const allowedSortOrders = ["ASC", "DESC"]; // Define allowed sort orders

    const sort = allowedSortColumns.includes(req.query.sort) ? req.query.sort : "id";
    const sortOrder = allowedSortOrders.includes(req.query.sortOrder) ? req.query.sortOrder : "ASC";

    try {
        const [result] = await connection.query(`
            SELECT * FROM test ORDER BY ${sort} ${sortOrder}
        `);
        res.json(result);
    } catch (error) {
        res.status(500).send("An error occurred while fetching data.");
        console.error(error);
    }
});
// ...this does not work?

// 16th of jan: Create a blog

app.get('/comment', async (req, res) => {
    // add code to grab comments here?
});




app.get("/post/:id", async (req, res) => {
    const id = Number(req.params.id);
    const [post] = await connection.query(`
        SELECT * FROM post WHERE id=${id}
    `);

    const [comments] = await connection.query(`
    SELECT comment.content, user.name
    FROM comment
    JOIN user on comment.user_id = user.id
    WHERE comment.post_id=${id}
    `);

    res.json({post, comments});
});

const query = "url.com?query=hello"
const param = "url.com/param"