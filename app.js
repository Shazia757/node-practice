import { readFile } from "fs";

readFile("notes.txt", { encoding: "utf-8" }, (error, data) => {
    if (error) { console.log(error) } else {
        console.log(data)

    }
})
