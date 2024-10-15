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

  const { total_amount, dataUsers, dataPayment, school_id } = req.body

  try {
    // Create connection to MySQL database
    const connection = await createConnection()

    // Query to get the Midtrans configuration from the database
    const [rows] = (await connection.execute('SELECT serverKey, is_production FROM aplikasi WHERE school_id = ?', [
      school_id
    ])) as any

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Configuration not found' })
    }

    const midtransConfig = rows[0]

    // Convert is_production to boolean explicitly
    const snap = new midtransClient.Snap({
      isProduction: midtransConfig.is_production === 'true', // Convert to boolean
      serverKey: midtransConfig.serverKey // Use server key from DB
    })

    const orderId = 'SPP-' + Math.floor(100000 + Math.random() * 900000)
    const itemDetails = dataPayment.map((payment: any) => ({
      id: `ITEM-${payment.id}`, // Membuat ID item unik berdasarkan id payment
      price: payment.total_payment, // Menggunakan amount sebagai harga item
      quantity: 1, // Karena setiap item adalah untuk satu bulan, quantity adalah 1
      name: `Bulan ${payment.month} ${payment.years}` // Nama item sesuai dengan bulan dan tahun pembayaran
    }))

    const transactionDetails = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total_amount // Total pembayaran
      },
      customer_details: {
        first_name: dataUsers.full_name, // Sesuaikan dengan data pengguna
        email: dataUsers.email,
        phone: dataUsers.phone
      },
      item_details: itemDetails
    }

    // Create transaction
    const transaction = await snap.createTransaction(transactionDetails)

    res.status(200).json({
      transactionToken: transaction.token,
      transactionUrl: transaction.redirect_url,
      orderId: orderId
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
