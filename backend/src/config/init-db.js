import fs from 'fs';
import path from 'path';
import dbConnection from './db.js';

const schemaPath = path.resolve('../backend/migrations.sql');
const sql = fs.readFileSync(schemaPath, 'utf8');

const queries = sql 
    .split(';')
    .map(query => query.trim())
    .filter(query => query.length > 0)

    for (const query of queries) {
        await dbConnection.execute(query);
    }

console.log('Banco inicializado com sucesso');
process.exit(0);
