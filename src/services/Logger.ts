import pino from "pino";
import config from "../configs/config";

const options = {
    enabled: config.app.logs.enabled,
};
const dest = pino.destination({
    dest: './logs/app.log',
    mkdir: true,
});
const logger = pino(options, dest);

export default logger;
