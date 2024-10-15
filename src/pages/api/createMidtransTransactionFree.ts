import type { NextApiRequest, NextApiResponse } from 'next/types'

// @ts-ignore: midtrans-client has no type definitions
import midtransClient from 'midtrans-client'
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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { total_amount, dataPayment, school_id } = req.body

  if (!school_id) {
    return res.status(400).json({ message: 'School ID is required' })
  }

  try {
    // Create connection to MySQL database
    const connection = await createConnection()

    // Query to get the Midtrans configuration from the database based on school_id
    const [rows] = (await connection.execute('SELECT serverKey, is_production FROM aplikasi WHERE school_id = ?', [
      school_id
    ])) as any

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Configuration not found for the given school ID' })
    }

    const midtransConfig = rows[0]

    // Initialize Snap with the values from the database
    const snap = new midtransClient.Snap({
      isProduction: midtransConfig.is_production === 'true', // Convert to boolean
      serverKey: midtransConfig.serverKey // Use server key from DB
    })

    const orderId = 'SPP-' + Math.floor(100000 + Math.random() * 900000)
    const itemDetails = [
      {
        id: `ITEM-${dataPayment.id}`, // Membuat ID item unik berdasarkan id payment
        price: total_amount, // Menggunakan amount sebagai harga item
        quantity: 1, // Karena setiap item adalah untuk satu bulan, quantity adalah 1
        name: dataPayment.sp_name // Nama item sesuai dengan bulan dan tahun pembayaran
      }
    ]

    const transactionDetails = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total_amount // Total pembayaran
      },
      customer_details: {
        first_name: dataPayment.full_name, // Sesuaikan dengan data pengguna
        email: dataPayment.email,
        phone: dataPayment.phone
      },
      item_details: itemDetails
    }

    try {
      const transaction = await snap.createTransaction(transactionDetails)

      res.status(200).json({
        transactionToken: transaction.token,
        transactionUrl: transaction.redirect_url,
        orderId: orderId
      })
    } catch (error: any) {
      console.error('Midtrans error:', error)
      res.status(500).json({ error: error.message })
    }
  } catch (error: any) {
    console.error('Database or Midtrans error:', error)
    res.status(500).json({ error: error.message })
  }
}
