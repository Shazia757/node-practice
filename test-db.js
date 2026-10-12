import pool from "./db.js";
try {
    const result = await pool.query("SELECT NOW() AS current_time")
    console.log(result.rows[0].current_time)
}
catch (error) {
    console.error(error)
}
finally {
    await pool.end()
}