const env = require('dotenv');
env.config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

const openApiSpec = require("./openapi.json");

app.use("/api-docs/", swaggerUi.serve, swaggerUi.setup(openApiSpec));

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