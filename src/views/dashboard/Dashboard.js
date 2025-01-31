import React from 'react'
import classNames from 'classnames'

import { CButton, CButtonGroup, CCardBody, CCol, CProgress, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'

const Dashboard = () => {
  const progressExample = []

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  return (
    <>
      <WidgetsDropdown className="mb-4" />

      <CCardBody>
        <CRow>
          <CCol sm={5}>
            <h4 id="traffic" className="card-title mb-0">
              Attendance Rate
            </h4>
            <div className="small text-body-secondary">September - December 2024</div>
          </CCol>
          <CCol sm={7} className="d-none d-md-block">
            {/* <CButton color="primary" className="float-end">
              <CIcon icon={cilCloudDownload} />
            </CButton>
            <CButtonGroup className="float-end me-3">
              {['Day', 'Month', 'Year'].map((value) => (
                <CButton
                  color="outline-secondary"
                  key={value}
                  className="mx-0"
                  active={value === 'Month'}
                >
                  {value}
                </CButton>
              ))}
            </CButtonGroup> */}
          </CCol>
        </CRow>
        <MainChart />
      </CCardBody>

      <CRow
        xs={{ cols: 1, gutter: 4 }}
        sm={{ cols: 2 }}
        lg={{ cols: 4 }}
        xl={{ cols: 5 }}
        className="mb-2 text-center"
      >
        {progressExample.map((item, index, items) => (
          <CCol
            className={classNames({
              'd-none d-xl-block': index + 1 === items.length,
            })}
            key={index}
          >
            <div className="text-body-secondary">{item.title}</div>
            <div className="fw-semibold text-truncate">
              {item.value} ({item.percent}%)
            </div>
            <CProgress thin className="mt-2" color={item.color} value={item.percent} />
          </CCol>
        ))}
      </CRow>
    </>
  )
}

export default Dashboard
