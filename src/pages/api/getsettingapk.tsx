import type { NextApiRequest, NextApiResponse } from 'next/types'
import mysql from 'mysql2/promise'

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env

// Function to create connection to MySQL database
async function createConnection() {
  return await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connection = await createConnection()
    console.log(req.query.school_id)

    // Misalnya mengambil client-key dari tabel aplikasi
    const [rows] = (await connection.execute('SELECT * FROM aplikasi WHERE school_id = ?', [
      req.query.school_id
    ])) as any

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Client key not found' })
    }

    const data = rows[0]

    res.status(200).json({ data })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
