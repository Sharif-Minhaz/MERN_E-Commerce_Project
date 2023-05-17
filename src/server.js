const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.info(`Server is running at http://localhost:${port}`);
})