// const { initMain } = require("./main")

import { initMain } from "./main.js"
import { initHeader } from "./header.js "
import { eventBindings } from "./eventBindings.js"

window.onload = async () => {
    await initHeader();
    await initMain();
    eventBindings();
}