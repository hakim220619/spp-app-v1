import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import axiosConfig from './configs/axiosConfig'

// Function to fetch permissions based on schoolId
async function fetchRolePermissions(schoolId: string): Promise<{ [key: string]: number[] }> {
  try {
    const response = await axiosConfig.get(`/rolePermissions?school_id=${schoolId}`)
    if (response.status !== 200) {
      throw new Error('Failed to fetch role permissions')
    }
    
    return response.data
  } catch (error) {
    console.error('Error fetching role permissions:', error)
    throw error
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ambil cookie userData
  const userDataCookie = request.cookies.get('userData')

  // Jika cookie userData tidak ada, redirect ke halaman 404 atau login
  if (!userDataCookie) {
    console.error('userData cookie not found, redirecting to 404')

    return NextResponse.redirect(new URL('/404', request.url)) // Redirect jika cookie tidak ada
  }

  // Parse cookie userData
  let userData
  try {
    userData = JSON.parse(userDataCookie.value)
  } catch (error) {
    console.error('Failed to parse userData cookie, redirecting to 500', error)

    return NextResponse.redirect(new URL('/500', request.url)) // Redirect jika gagal parse cookie
  }

  const userRole = userData.role
  const schoolId = userData.school_id

  // Logika untuk memverifikasi role
  console.log(`User Role: ${userRole}, School ID: ${schoolId}`)

  try {
    // Fetch role permissions dari API berdasarkan schoolId
    const rolePermissions = await fetchRolePermissions(schoolId)

    // Cek apakah ada izin untuk path yang diminta
    const matchingPermission = Object.keys(rolePermissions).find(path => {
      const normalizedPath = path.replace(':uid*', '[uid*]') // Menormalisasi path dengan wildcard

      return pathname.startsWith(normalizedPath)
    })

    if (!matchingPermission) {
      console.error('No matching permissions for this path, redirecting to 403')

      return NextResponse.redirect(new URL('/403', request.url)) // Redirect jika tidak ada izin untuk path ini
    }

    // Cek apakah userRole memiliki izin untuk mengakses path ini
    const allowedRoles = rolePermissions[matchingPermission]
    if (!allowedRoles.includes(userRole)) {
      console.error(`User role ${userRole} does not have permission, redirecting to 403`)

      return NextResponse.redirect(new URL('/403', request.url)) // Redirect jika role tidak punya izin
    }
  } catch (error) {
    console.error('Error fetching role permissions, redirecting to 500', error)

    return NextResponse.redirect(new URL('/500', request.url)) // Redirect jika gagal fetch izin dari API
  }

  // Lanjutkan request jika semuanya valid
  return NextResponse.next()
}

// Matcher statis untuk route yang akan diproses oleh middleware
export const config = {
  matcher: [
    '/ms/:path*', // Match semua URL /ms/*
    '/ms/setting/aplikasi/'
  ]
}
