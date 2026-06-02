import "reflect-metadata";
import app from "./app.ts";
import config from "./configs/config.ts";

app.listen(config.app.port, () => {
    console.log(`Server is running on port ${config.app.port}`);
});
