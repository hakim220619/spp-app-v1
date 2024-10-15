/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: number) => {
  if (role === 150) return '/ms/admin'
  else if (role === 170) return 'ms/dashboard/admin'
  else if (role === 160) return 'ms/dashboard/siswa'
  else if (role === 200) return 'ms/dashboard/admin'
  else if (role === 210) return 'ms/dashboard/admin'
  else return '/ms/siswa'
}

export default getHomeRoute
