import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  const data = localStorage.getItem('userData')
  const getDataLocal = data ? JSON.parse(data) : null // Handle null case
  const role = getDataLocal?.role // Optional chaining for safety

  if (role === 150) {
    return [
      {
        title: 'Dashboards',
        icon: 'ion:home-outline',
        path: 'admin/cb/approval'
      },
      {
        title: 'Master Data',
        icon: 'tabler:users',
        badgeColor: 'error',
        children: [
          { title: 'Admin', path: '/ms/admin' },
          { title: 'Siswa', path: '/ms/siswa' },
          { title: 'Sekolah', path: '/ms/sekolah' },
          { title: 'Aplikasi', path: '/ms/aplikasi' },
          { title: 'Affiliate', path: '/ms/affiliate' },
          { title: 'Permission', path: '/ms/permission' }
        ]
      },
      {
        title: 'Setting',
        icon: 'tabler:settings-cog',
        badgeColor: 'error',
        children: [{ title: 'Aplikasi', path: '/ms/setting/aplikasi' }]
      }
    ]
  } else if (role === 160) {
    return [
      {
        title: 'Dashboards',
        icon: 'ion:home-outline',
        badgeColor: 'error',
        path: '/ms/dashboard/siswa'
      }
    ]
  } else if (role === 170) {
    return [
      {
        title: 'Dashboards',
        icon: 'ion:home-outline',
        subject: 'ms-ds-admin',
        path: '/ms/dashboard/admin'
      },
      {
        title: 'Broadcast',
        icon: 'ion:logo-whatsapp',
        path: '/ms/broadcast/whatsapp'
      },
      {
        title: 'PPDB',
        icon: 'tabler:registered',
        badgeColor: 'error',
        children: [{ title: 'Daftar Siswa', path: '/ms/ppdb' }]
      },
      {
        title: 'Master Data',
        icon: 'tabler:users',
        badgeColor: 'error',
        children: [
          { title: 'Admin', path: '/ms/admin' },
          { title: 'Siswa', path: '/ms/siswa', subject: 'ms-siswa' },
          { title: 'Kelas', path: '/ms/kelas' },
          { title: 'Jurusan', path: '/ms/jurusan' },
          { title: 'Bulan', path: '/ms/bulan' },
          { title: 'Unit', path: '/ms/unit' }
        ]
      },
      {
        title: 'Tunggakan',
        icon: 'tabler:bell-dollar',
        path: '/ms/tunggakan'
      },
      {
        title: 'Pembayaran',
        icon: 'ion:wallet-outline',
        path: '/ms/pembayaran/admin'
      },
      {
        title: 'Setting Pembayaran',
        icon: 'ion:wallet',
        path: '/ms/setting/pembayaran'
      },
      {
        title: 'Laporan',
        icon: 'tabler:report-search',
        path: '/ms/laporan'
      },
      {
        title: 'Setting',
        icon: 'tabler:settings-cog',
        badgeColor: 'error',
        children: [
          { title: 'Aplikasi', path: '/ms/setting/aplikasi' },
          { title: 'Template Pesan', path: '/ms/templateMessage' }
        ]
      }
    ]
  } else if (role === 200) {
    return [
      {
        title: 'Dashboards',
        icon: 'ion:home-outline',
        subject: 'ms-ds-admin',
        path: '/ms/dashboard/admin'
      },
      {
        title: 'Broadcast',
        icon: 'ion:logo-whatsapp',
        path: '/ms/broadcast/whatsapp'
      },
      {
        title: 'Master Data',
        icon: 'tabler:users',
        badgeColor: 'error',
        children: [
          { title: 'Siswa', path: '/ms/siswa', subject: 'ms-siswa' },
          { title: 'Kelas', path: '/ms/kelas' },
          { title: 'Jurusan', path: '/ms/jurusan' },
          { title: 'Bulan', path: '/ms/bulan' },
          { title: 'Unit', path: '/ms/unit' }
        ]
      },
      {
        title: 'Tunggakan',
        icon: 'tabler:bell-dollar',
        path: '/ms/tunggakan'
      },
      {
        title: 'Pembayaran',
        icon: 'ion:wallet-outline',
        path: '/ms/pembayaran/admin'
      },
      {
        title: 'Setting Pembayaran',
        icon: 'ion:wallet',
        path: '/ms/setting/pembayaran'
      },
      {
        title: 'Laporan',
        icon: 'tabler:report-search',
        path: '/ms/laporan'
      }
    ]
  } else if (role === 210) {
    return [
      {
        title: 'Dashboards',
        icon: 'ion:home-outline',
        subject: 'ms-ds-admin',
        path: '/ms/dashboard/admin'
      },
      {
        title: 'Tunggakan',
        icon: 'tabler:bell-dollar',
        path: '/ms/tunggakan'
      },
      {
        title: 'Pembayaran',
        icon: 'ion:wallet-outline',
        path: '/ms/pembayaran/admin'
      }
    ]
  } else {
    return [
      {
        title: 'Admin',
        icon: 'tabler:users',
        badgeColor: 'error',
        children: [{ title: 'Data Admin', path: '/ms/admin' }]
      }
    ]
  }
}

export default navigation
