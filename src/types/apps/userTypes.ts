// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type UsersType = {
  uid: any
  id: number
  role: string
  email: string
  status: string
  nik: string
  address: string
  company: string
  state: string
  phone_number: string
  fullName: string
  date: string
  currentPlan: string
  avatarColor?: ThemeColor
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}
