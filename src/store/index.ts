// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import Admin from 'src/store/apps/admin/index'
import Affiliate from 'src/store/apps/affiliate/index'
import siswa from 'src/store/apps/siswa/index'
import kelas from 'src/store/apps/kelas/index'
import Jurusan from 'src/store/apps/jurusan/index'
import Bulan from 'src/store/apps/bulan/index'
import Sekolah from 'src/store/apps/sekolah/index'
import Aplikasi from 'src/store/apps/aplikasi/index'
import ListPaymentDashboardByMonth from 'src/store/apps/dashboard/listPayment/month/index'
import ListPaymentDashboardByMonthAdmin from 'src/store/apps/pembayaran/admin/listPayment/index'
import PembayaranByMonth from 'src/store/apps/pembayaran/bulanan/index'
import PembayaranByFree from 'src/store/apps/pembayaran/bebas/index'
import Unit from 'src/store/apps/unit/index'
import SettingPembayaran from 'src/store/apps/setting/pembayaran/index'
import ListPaymentReportAdmin from 'src/store/apps/laporan/index'
import ListPaymentReportAdminFree from 'src/store/apps/laporan/free'
import ListPaymentTunggakan from 'src/store/apps/tunggakan/index'
import Permission from 'src/store/apps/permission/index'
import TemplateMessage from 'src/store/apps/templateMessage/index'
import Ppdb from 'src/store/apps/ppdb/index'
import SettingPembayaranDetail from 'src/store/apps/setting/pembayaran/detail/index'

export const store = configureStore({
  reducer: {
    Admin,
    Affiliate,
    siswa,
    kelas,
    Jurusan,
    Bulan,
    Sekolah,
    Aplikasi,
    ListPaymentDashboardByMonth,
    PembayaranByMonth,
    PembayaranByFree,
    SettingPembayaran,
    Unit,
    SettingPembayaranDetail,
    ListPaymentReportAdmin,
    ListPaymentReportAdminFree,
    ListPaymentTunggakan,
    Permission,
    TemplateMessage,
    Ppdb,
    ListPaymentDashboardByMonthAdmin
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
