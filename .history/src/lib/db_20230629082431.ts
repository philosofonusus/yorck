import { drizzle } from "drizzle-orm/node-postgres";
import mysql from "mysql2/promise";
import { env } from "../env.mjs";

const pool = new mysql.createPool({
    
