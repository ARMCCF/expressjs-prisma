import { PrismaClient } from "@prisma/client";
import express from "express";
import redis from "./lib/cache";
import { json } from "body-parser";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

const cacheKey = "posts:all"

app.get("/post", async (req, res) => {
  try{
    
    const cachedlinks = await redis.get(cacheKey);

    if(cachedlinks){
      return res.json(JSON.parse(cachedlinks))
    }

  const posts = await prisma.post.findMany();
    await redis.set(cacheKey, JSON.stringify(posts));


  return res.json(posts);
} catch (e){
  res.json({ error: e })
}  
});

app.post("/post", async (req, res) => {
    const { link } = req.body;
    
  try{
  const todo = await prisma.post.create({
    data: {
      link
    },
  });

  redis.del(cacheKey);

  return res.json(todo);
}catch (e){
  res.json({ error: e })
}  
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
