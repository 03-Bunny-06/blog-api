const env = require('dotenv');
env.config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const adminRouter = require("./routes/adminRoutes");
const userRouter = require("./routes/userRoutes");

const connectDb = require("./config/db")
connectDb();

const file = fs.readFileSync("openapi.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());
app.use('/admin', adminRouter);
app.use('/user', userRouter);

app.use((req, res) => {
  res.status(404).json({
    error: "Bad route (or) No route found"
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Server is running on port 3005: ")
})