import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.get("/post", async (req, res) => {
  const todos = await prisma.post.findMany();
  res.json(todos);
});

app.post("/post", async (req, res) => {
    const { link } = req.body;

  const todo = await prisma.post.create({
    data: {
      link
    },
  });

  return res.json(todo);
});

app.delete("/post/:id", async (req, res) => {
  const id = req.params.id;
  await prisma.post.delete({
    where: { id },
  });

  return res.send({ status: "ok" });
});

app.get("/", async (req, res) => {
  res.send(
    `
  <h1>Todo REST API</h1>
  <h2>Available Routes</h2>
  <pre>
    GET, POST /todos
    GET, PUT, DELETE /todos/:id
  </pre>
  `.trim(),
  );
});

app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
