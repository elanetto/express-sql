import express from "express";
import cors from "cors";
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  database: 'sql7756924',
  user: 'sql7756924',
  password: 'nyKKdCJZGZ',
  port: 3306,
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

// app.get("/user/:id", (req, res) => {
//     console.log(req.params.id);
//     res.send(req.params.id);
// });

app.listen(3000, () => {
    console.log("Server started");
})

app.get("/query", (req,res) => {
    res.send(req.query);
})

// app.get("/user/id/:id", (req, res) => {
//     res.send(req.params.id);
// })

// // Jonas 
// app.get("/user/:id", async (req, res) => {
//     const userId = req.params.id;
//     const [result] = await connection.query(`SELECT * FROM user WHERE id . ${userId}`);
//     res.json(result);
// });

// Ludvig
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

const query = "url.com?query=hello"
const param = "url.com/param"