import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilDollar,
  cilCalendar,
  cilCalendarCheck,
  cilChart,
  cilNewspaper, 
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },

  {
    component: CNavItem,
    name: 'Employee Management',
    to: '/EmployeeManagement',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Payrun',
    to: '/Payrun',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Leave & Attendance',
    to: '/Leave_Attendance',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Approvals',
    to: '/Approvals',
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tax & Forms',
    to: '/Tax_Forms',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Reports',
    to: '/Reports',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
]

export default _nav
