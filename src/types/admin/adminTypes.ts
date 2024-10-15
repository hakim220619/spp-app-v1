// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type UsersType = {
  company_id: number
  uid: string
  nik: string
  nta: string
  member_id: string
  fullName: string
  password: string
  date: string
  address: string
  phone_number: string
  state: string
  image: string
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
