import React, { useEffect, useState } from 'react'
import './EmployeeManagement.css'
import {
  CForm,
  CFormInput,
  CInputGroup,
  CFormFeedback,
  CButton,
  CModal,
  CModalHeader,
  CFormText,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CFormSelect,
  CHeader,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import bankNamesData from 'src/data/bankNames.json'
import employeeDesignations from 'src/data/employeeDesignation.json'
import emailValidator from 'email-validator'

import {
  employeeData,
  postEmployeeData,
  updateEmployeeData,
  deleteEmployeeData,
} from './employeeAPI'

const EmployeeManagement = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [employee, setEmployee] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [viewEmployee, setViewEmployee] = useState(null)
  const [editEmployeeMode, setEditEmployeeMode] = useState(false)
  const [employeeList, setEmployeeList] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [employeeToEdit, setEmployeeToEdit] = useState({
    empId: '',
    firstName: '',
    lastName: '',
    address: '',
    contactNumber: '',
    emailAddress: '',
    dateOfBirth: '',
    employmentStartDate: '',
    taxIdentificationNumber: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    bankBranch: '',
    employeeOfferLetterReleaseDate: '',
    employeeDesignation: '',
    joiningDate: '',
    ctc: '',
    hikeLetterDate: '',
    hikeCtc: '',
    hikeDesignation: '',
    hikeLetterEffectiveDate: '',
    projectName: '',
    cycleWorkingIn: '',
    relivingDate: '',
  })
  const [editErrors, setEditErrors] = useState({})
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null)
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    address: '',
    contactNumber: '',
    emailAddress: '',
    dateOfBirth: '',
    employmentStartDate: '',
    taxIdentificationNumber: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    bankBranch: '',
    employeeOfferLetterReleaseDate: '',
    employeeDesignation: '',
    joiningDate: '',
    ctc: '',
    hikeLetterDate: '',
    hikeCtc: '',
    hikeDesignation: '',
    hikeLetterEffectiveDate: '',
    projectName: '',
    cycleWorkingIn: '',
    relivingDate: '',
  })
  const [errors, setErrors] = useState({})
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const employeeResponse = await employeeData()
      console.log('API Response:', employeeResponse)
      if (employeeResponse.data && employeeResponse.data.length === 0) {
        setEmployee([]) // Set an empty array
        setError('No Employee Records Found.')
      } else {
        setEmployee(employeeResponse.data)
      }
      setEmployee(employeeResponse) // Set an empty array
      // setError('No Employee Records Found.')
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('No Data Found.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const handleSearch = () => {
      const trimmedQuery = searchQuery?.toLowerCase().trim()

      if (!trimmedQuery) {
        setFilteredData(employee) // Reset to full employee list when search is empty
        return
      }

      // const filtered = employee.filter((item) => {
      //   const firstNameMatch = item.firstName?.toLowerCase().includes(trimmedQuery);
      //   const contactNumberMatch = item.contactNumber?.toLowerCase().includes(trimmedQuery);
      //   const designationMatch = item.employeeDesignation?.toLowerCase().includes(trimmedQuery);
      //   const projectMatch = item.projectName?.toLowerCase().includes(trimmedQuery);

      //   return firstNameMatch || contactNumberMatch || designationMatch || projectMatch;
      // });

      const filtered = employee.filter((item) => {
        const firstNameMatch = item.firstName?.toLowerCase().startsWith(trimmedQuery)
        const LastNameMatch = item.lastName?.toLowerCase().startsWith(trimmedQuery)
        const contactNumberMatch = item.contactNumber?.toLowerCase().startsWith(trimmedQuery)
        const designationMatch = item.employeeDesignation?.toLowerCase().startsWith(trimmedQuery)
        // const projectMatch = item.projectName?.toLowerCase().startsWith(trimmedQuery);

        return firstNameMatch || contactNumberMatch || designationMatch || LastNameMatch
      })

      setFilteredData(filtered)
    }

    handleSearch()
  }, [searchQuery, employee])

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Validate the field
    // const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }))
  }
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'address':
      case 'taxIdentificationNumber':
      case 'bankName':
      case 'accountNumber':
      case 'routingNumber':
      case 'bankBranch':
      case 'employeeDesignation':
      case 'ctc':
        if (!value) return `${name} is required`
        return ''
      case 'contactNumber':
        if (!value) return 'Contact number is required'
        if (!/^\d{10}$/.test(value)) return 'Contact number must be 10 digits'
        return ''
      case 'emailAddress':
        if (!value) return 'Email address is required'
        if (!emailValidator.validate(value)) return 'Invalid email address'
        return ''
      case 'dateOfBirth':
      case 'employmentStartDate':
      case 'employeeOfferLetterReleaseDate':
      case 'joiningDate':
        return value ? '' : `${name.replace(/([A-Z])/g, ' $1')} is required`
        return ''
      default:
        return ''
    }
  }
  const editValidateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'address':
      case 'taxIdentificationNumber':
      case 'bankName':
      case 'accountNumber':
      case 'routingNumber':
      case 'bankBranch':
      case 'employeeDesignation':
      case 'ctc':
      case 'hikeDesignation':
      case 'projectName':
      case 'cycleWorkingIn':
        if (!value) return `${name.replace(/([A-Z])/g, ' $1')} is required`
        return ''

      case 'contactNumber':
        if (!value) return 'Contact number is required'
        if (!/^\d{10}$/.test(value)) return 'Contact number must be 10 digits'
        return ''

      case 'emailAddress':
        if (!value) return 'Email address is required'
        if (!emailValidator.validate(value)) return 'Invalid email address'
        return ''

      case 'dateOfBirth':
      case 'employmentStartDate':
      case 'employeeOfferLetterReleaseDate':
      case 'joiningDate':
      case 'hikeLetterDate':
      case 'hikeLetterEffectiveDate':
      case 'relivingDate':
        // Only validate if the field is not empty
        if (value) {
          // Perform the date validation logic or other specific checks if needed
          return '' // No error if valid
        }
        return '' // Skip validation if empty (not mandatory)

      case 'hikeCtc':
        if (value && (isNaN(value) || value <= 0)) return 'Hike CTC must be a positive number'
        return '' // If empty, no error

      default:
        return ''
    }
  }

  const columns = [
    {
      name: 'First Name',
      selector: (row) => row.firstName,
      width: '120px',
      cell: (row) => <div style={{ textAlign: 'center' }}>{row.firstName}</div>,
      headerStyle: { textAlign: 'center' },
    },
    {
      name: 'Last Name',
      selector: (row) => row.lastName,
      width: '120px',
      cell: (row) => <div style={{ textAlign: 'center' }}>{row.lastName}</div>,
      headerStyle: { textAlign: 'center' },
    },
    {
      name: 'Employment Designation',
      selector: (row) => row.employeeDesignation,
      width: '180px',
      cell: (row) => <div style={{ textAlign: 'center' }}>{row.employeeDesignation}</div>,
      headerStyle: { textAlign: 'center' },
    },
    {
      name: 'Email Address',
      selector: (row) => row.emailAddress,
      width: '220px',
      cell: (row) => <div style={{ textAlign: 'center' }}>{row.emailAddress}</div>,
      headerStyle: { textAlign: 'center' },
    },
    {
      name: 'Contact Number',
      selector: (row) => row.contactNumber,
      width: '110px',
      cell: (row) => <div style={{ textAlign: 'center' }}>{row.contactNumber}</div>,
      headerStyle: { textAlign: 'center' },
    },
    {
      name: 'CTC',
      selector: (row) => row.ctc,
      width: '80px',
      cell: (row) => <div style={{ textAlign: 'center' }}>{row.ctc}</div>,
      headerStyle: { textAlign: 'center' },
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            gap: '5px',
          }}
        >
          <CButton
            color="btn btn-primary btn-sm"
            onClick={() => setViewEmployee(row)}
            style={{ minWidth: '70px' }}
          >
            View
          </CButton>
          <CButton
            color="btn btn-warning"
            onClick={() => handleEditEmployee(row)}
            style={{ minWidth: '70px' }}
          >
            Edit
          </CButton>
          <CButton
            color="danger"
            onClick={() => handleEmployeeDelete(row.empId)}
            style={{ minWidth: '80px' }}
          >
            Delete
          </CButton>

          {/* Custom confirmation modal */}
          <ConfirmationModal
            isVisible={isModalVisible}
            message={
              <>
                <strong>Are you sure you want to delete this employee</strong> "{row.firstName}"?
              </>
            }
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </div>
      ),
      // width: '150px',
      headerStyle: { textAlign: 'center' },
    },
  ]

  const ConfirmationModal = ({ isVisible, message, onConfirm, onCancel }) => {
    return (
      <CModal visible={isVisible} onClose={onCancel}>
        <CHeader style={{ marginLeft: '200px' }}> !Alert</CHeader>
        <CModalBody style={{ textAlign: 'center' }}>{message}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onCancel}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={onConfirm}>
            Confirm
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }
  // Function to format the date to MM/dd/yyyy
  const formatDateToMMDDYYYY = (date) => {
    if (!date) return ''

    // Ensure date is in proper format
    const d = new Date(date)

    // Check if the date is valid
    if (isNaN(d.getTime())) return ''

    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const year = d.getFullYear().toString().slice(0, 4) // Ensure only 4-digit year

    return `${month}/${day}/${year}`
  }

  const handleAddEmployee = async () => {
    // Validate all fields before submission
    const allErrors = {}
    Object.keys(newEmployee).forEach((key) => {
      const error = validateField(key, newEmployee[key])
      if (error) allErrors[key] = error
    })

    // If there are validation errors, set them and stop submission
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      toast.error('Please fix the validation errors before submitting.', {
        position: 'top-right',
        autoClose: 3000,
      })
      return
    }

    try {
      // Prepare the payload with formatted date fields (formatted only for submission)
      const payload = {
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        address: newEmployee.address,
        contactNumber: newEmployee.contactNumber,
        emailAddress: newEmployee.emailAddress,
        dateOfBirth: formatDateToMMDDYYYY(newEmployee.dateOfBirth), // Format for submission
        employmentStartDate: formatDateToMMDDYYYY(newEmployee.employmentStartDate), // Format for submission
        taxIdentificationNumber: newEmployee.taxIdentificationNumber,
        bankName: newEmployee.bankName,
        accountNumber: newEmployee.accountNumber,
        routingNumber: newEmployee.routingNumber,
        bankBranch: newEmployee.bankBranch,
        employeeOfferLetterReleaseDate: formatDateToMMDDYYYY(
          newEmployee.employeeOfferLetterReleaseDate,
        ), // Format for submission
        employeeDesignation: newEmployee.employeeDesignation,
        joiningDate: formatDateToMMDDYYYY(newEmployee.joiningDate), // Format for submission
        ctc: newEmployee.ctc,
        hikeLetterDate: formatDateToMMDDYYYY(newEmployee.hikeLetterDate) || null,
        hikeCtc: newEmployee.hikeCtc || 'N/A',
        hikeDesignation: newEmployee.hikeDesignation || 'N/A',
        hikeLetterEffectiveDate: formatDateToMMDDYYYY(newEmployee.hikeLetterEffectiveDate) || null,
        projectName: newEmployee.projectName || 'N/A',
        cycleWorkingIn: newEmployee.cycleWorkingIn || 'N/A',
        relivingDate: formatDateToMMDDYYYY(newEmployee.relivingDate) || 'N/A',
      }

      // Post employee data to the server
      const response = await postEmployeeData(payload)
      console.log('API Response:', response)

      // Show success toast
      toast.success('Employee details added successfully!', {
        position: 'top-right',
        autoClose: 3000,
      })

      // Fetch updated employee data
      const updatedData = await fetchData()
      // console.log(typef(updatedData));

      // Ensure the response is in the expected format
      if (!updatedData || !updatedData.data) {
        console.error('Fetched data is not in the expected format or is undefined.')
        return
      }

      // Prepend the new employee to the list
      const newEmployeeData = [newEmployee, ...updatedData.data]

      // Update the employee list state with the new data
      setEmployeeList(newEmployeeData)
    } catch (error) {
      console.error('Error adding employee:', error)

      // Show error toast
      toast.error(error.message || 'Failed to add employee. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      // Reset form and close modal
      setNewEmployee({
        empId: '',
        firstName: '',
        lastName: '',
        address: '',
        contactNumber: '',
        emailAddress: '',
        dateOfBirth: '',
        employmentStartDate: '',
        taxIdentificationNumber: '',
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        bankBranch: '',
        employeeOfferLetterReleaseDate: '',
        employeeDesignation: '',
        joiningDate: '',
        ctc: '',
        hikeLetterDate: '',
        hikeCtc: '',
        hikeDesignation: '',
        hikeLetterEffectiveDate: '',
        projectName: '',
        cycleWorkingIn: '',
        relivingDate: '',
      })

      resetForm() // ✅ Call resetForm to clear fields & errors
      setModalVisible(false) // Close the modal
    }
  }

  //edit employee
  const handleEditEmployee = (employee) => {
    setEmployeeToEdit({
      ...employee,
      dateOfBirth: employee.dateOfBirth,
      employmentStartDate: employee.employmentStartDate,
      employeeOfferLetterReleaseDate: employee.employeeOfferLetterReleaseDate,
      joiningDate: employee.joiningDate,
      hikeLetterDate: employee.hikeLetterDate,
      hikeLetterEffectiveDate: employee.hikeLetterEffectiveDate,
      relivingDate: employee.relivingDate,
    })
    setEditEmployeeMode(true)
  }

  // const formatDateToMMDDYYYY = (date) => {
  //   if (!date) return ''; // Return an empty string if the date is falsy

  //   const d = new Date(date);
  //   const day = d.getDate().toString().padStart(2, '0');
  //   const month = (d.getMonth() + 1).toString().padStart(2, '0');
  //   const year = d.getFullYear();
  //   return `${month}/${day}/${year}`;
  // };
  const handleUpdateEmployee = async () => {
    console.log('Starting update process...')

    if (!employeeToEdit) {
      console.error('Employee data is missing!')
      return
    }

    // Validate all fields before submission
    const allErrors = {}
    Object.keys(employeeToEdit).forEach((key) => {
      const error = editValidateField(key, employeeToEdit[key])
      if (error) allErrors[key] = error
    })

    // If there are validation errors, set them and stop submission
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors) // Set validation errors to state
      toast.error('Please fix the validation errors before updating.', {
        position: 'top-right',
        autoClose: 3000,
      })
      return
    }

    console.log('Employee to edit:', employeeToEdit)

    try {
      // Prepare the updated employee data with formatted dates
      const updatedEmployee = {
        ...employeeToEdit,
        dateOfBirth: formatDateToMMDDYYYY(employeeToEdit.dateOfBirth),
        employmentStartDate: formatDateToMMDDYYYY(employeeToEdit.employmentStartDate),
        employeeOfferLetterReleaseDate: formatDateToMMDDYYYY(
          employeeToEdit.employeeOfferLetterReleaseDate,
        ),
        joiningDate: formatDateToMMDDYYYY(employeeToEdit.joiningDate),
        hikeLetterDate: formatDateToMMDDYYYY(employeeToEdit.hikeLetterDate),
        hikeLetterEffectiveDate: formatDateToMMDDYYYY(employeeToEdit.hikeLetterEffectiveDate),
        relivingDate: formatDateToMMDDYYYY(employeeToEdit.relivingDate),
      }

      console.log('Payload being sent:', updatedEmployee)

      // Call the update function with empId and updated employee data
      const response = await updateEmployeeData(employeeToEdit.empId, updatedEmployee)
      console.log('API Response:', response)

      toast.success('Employee details updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      })

      setEditEmployeeMode(false)
      fetchData() // Optionally fetch the updated list after the update
    } catch (error) {
      console.error('Error updating employee:', error)
      toast.error('An unexpected error occurred while updating employee.', {
        position: 'top-right',
        autoClose: 3000,
      })
    }
  }

  const handleEditCancel = () => {
    setEditEmployeeMode(false)

    setEmployeeToEdit({
      empId: '',
      firstName: '',
      lastName: '',
      address: '',
      contactNumber: '',
      emailAddress: '',
      dateOfBirth: '',
      employmentStartDate: '',
      taxIdentificationNumber: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      bankBranch: '',
      employeeOfferLetterReleaseDate: '',
      employeeDesignation: '',
      joiningDate: '',
      ctc: '',
      hikeLetterDate: '',
      hikeCtc: '',
      hikeDesignation: '',
      hikeLetterEffectiveDate: '',
      projectName: '',
      cycleWorkingIn: '',
      relivingDate: '',
    })
  }

  const handleEmployeeDelete = (empId) => {
    setEmployeeIdToDelete(empId) // Save the ID of the employee to delete
    setIsModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    if (!employeeIdToDelete) {
      console.error('No employee ID to delete.')
      alert('Error: Unable to delete. No employee ID provided.')
      return
    }
    toast.success('Employee deleted successfully!', {
      position: 'top-right',
      autoClose: 3000,
    })
    try {
      const result = await deleteEmployeeData(employeeIdToDelete) // Call delete API
      console.log('Employee deleted:', result)

      fetchData() // Refresh the list
    } catch (error) {
      console.error('Error deleting employee:', error)
      alert('Failed to delete the employee. Please try again.')
    }
    setIsModalVisible(false) // Close the modal
  }

  const handleCancelDelete = () => {
    setIsModalVisible(false)
    console.log('Employee deletion canceled')
  }

  const resetForm = () => {
    setNewEmployee({
      // empId: '',
      firstName: '',
      lastName: '',
      address: '',
      contactNumber: '',
      emailAddress: '',
      dateOfBirth: '',
      employmentStartDate: '',
      taxIdentificationNumber: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      bankBranch: '',
      employeeOfferLetterReleaseDate: '',
      employeeDesignation: '',
      joiningDate: '',
      ctc: '',
      hikeLetterDate: '',
      hikeCtc: '',
      hikeDesignation: '',
      hikeLetterEffectiveDate: '',
      projectName: '',
      cycleWorkingIn: '',
      relivingDate: '',
    })

    // Optionally clear validation errors
    setErrors({})
  }
  // const handleDateChange = (e) => {
  //   const value = e.target.value;
  //   setNewEmployee({ ...newEmployee, dateOfBirth: value });
  //   // const error = validateField("dateOfBirth", value);
  //   setErrors((prev) => ({ ...prev, dateOfBirth: error }));
  // };
  return (
    <div style={{ overflow: 'hidden' }}>
      <ToastContainer />
      <div>
        <CForm className="d-flex justify-content-between mb-3">
          <CInputGroup className="mb-3" style={{ marginRight: '20px', width: '400px' }}>
            <CForm className="d-flex justify-content-between mb-3">
              <CInputGroup>
                <div style={{ position: 'relative', width: '100%' }}>
                  <CIcon
                    icon={cilSearch}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#aaa',
                    }}
                  />
                  <CFormInput
                    type="text"
                    placeholder="Search by Name or Designation.."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      height: '40px',
                      paddingLeft: '35px', // Add padding to make space for the icon
                    }}
                  />
                  <CIcon
                    icon={cilSearch}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#aaa',
                    }}
                  />
                </div>
              </CInputGroup>
            </CForm>
          </CInputGroup>
          <CButton
            color="danger text-white"
            style={{ height: '40px', minWidth: '180px' }}
            onClick={() => setModalVisible(true)}
          >
            + Add New Employee
          </CButton>
        </CForm>
      </div>
      <div>
        {viewEmployee && (
          <CModal visible={true} onClose={() => setViewEmployee(null)}>
            <CModalHeader>
              <CModalTitle style={{ textAlign: 'center', width: '100%' }}>
                Employee Details
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <p>
                <strong>Employee Id : </strong> {viewEmployee.empId}
              </p>
              <p>
                <strong>First Name : </strong> {viewEmployee.firstName}
              </p>
              <p>
                <strong>Last Name : </strong> {viewEmployee.lastName}
              </p>
              <p>
                <strong>Address : </strong> {viewEmployee.address}
              </p>

              <p>
                <strong>Contact Number : </strong> {viewEmployee.contactNumber}
              </p>
              <p>
                <strong>Email Address : </strong> {viewEmployee.emailAddress}
              </p>
              <p>
                <strong>Date of Birth : </strong> {viewEmployee.dateOfBirth}
              </p>
              <p>
                <strong>Employment Start Date : </strong> {viewEmployee.employmentStartDate}
              </p>

              <p>
                <strong>Tax Identification Number :</strong> {viewEmployee.taxIdentificationNumber}
              </p>
              <p>
                <strong>Bank Name :</strong> {viewEmployee.bankName}
              </p>
              <p>
                <strong>Account Number : </strong> {viewEmployee.accountNumber}
              </p>
              <p>
                <strong>Routing Number : </strong> {viewEmployee.routingNumber}
              </p>
              <p>
                <strong>Bank Branch : </strong> {viewEmployee.bankBranch}
              </p>
              <p>
                <strong>Employee Offer Letter Release Date : </strong>{' '}
                {viewEmployee.employeeOfferLetterReleaseDate}
              </p>
              <p>
                <strong>Employee Designation : </strong> {viewEmployee.employeeDesignation}
              </p>
              <p>
                <strong>Joining Date : </strong> {viewEmployee.joiningDate}
              </p>
              <p>
                <strong>CTC : </strong> {viewEmployee.ctc}
              </p>
              <p>
                <strong>Hike Letter Date : </strong> {viewEmployee.hikeLetterDate}
              </p>
              <p>
                <strong>Hike CTC : </strong> {viewEmployee.hikeCtc}
              </p>
              <p>
                <strong>Hike Designation : </strong> {viewEmployee.hikeDesignation}
              </p>
              <p>
                <strong>Hike Letter Effective Date : </strong>{' '}
                {viewEmployee.hikeLetterEffectiveDate}
              </p>
              <p>
                <strong>Project Name : </strong> {viewEmployee.projectName}
              </p>
              <p>
                <strong>Cycle Working In : </strong> {viewEmployee.cycleWorkingIn}
              </p>
              <p>
                <strong>Relieving Date : </strong> {viewEmployee.relivingDate}
              </p>
            </CModalBody>
            <CModalFooter></CModalFooter>
          </CModal>
        )}

        <CModal
          visible={modalVisible}
          onClose={() => {
            resetForm()
            setModalVisible(false)
          }}
        >
          <CModalHeader>
            <CModalTitle style={{ textAlign: 'center', width: '100%' }}>
              Add New Employee
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              {/* First Name */}
              <CRow className="mb-4">
                <CCol md={6}>
                  <h6>
                    First Name <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="text"
                    placeholder="First Name"
                    value={newEmployee.firstName || ''}
                    onChange={(e) => handleChange(e)}
                    name="firstName"
                  />
                  {errors.firstName && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.firstName}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <h6>
                    Last Name <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="text"
                    placeholder="Last Name"
                    value={newEmployee.lastName || ''}
                    onChange={(e) => handleChange(e)}
                    name="lastName"
                  />
                  {errors.lastName && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.lastName}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <h6>
                    Address <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="text"
                    placeholder="Address"
                    value={newEmployee.address || ''}
                    onChange={(e) => handleChange(e)}
                    name="address"
                  />
                  {errors.address && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.address}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <h6>
                    Contact Number <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="text"
                    placeholder="Contact Number"
                    value={newEmployee.contactNumber || ''}
                    onChange={(e) => handleChange(e)}
                    name="contactNumber"
                  />
                  {errors.contactNumber && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.contactNumber}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <h6>
                    Email Address <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="email"
                    placeholder="Email Address"
                    value={newEmployee.emailAddress || ''}
                    onChange={(e) => handleChange(e)}
                    name="emailAddress"
                  />
                  {errors.emailAddress && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.emailAddress}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <h6>
                    Date of Birth <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <input
                    type="date"
                    className="form-control"
                    value={newEmployee.dateOfBirth}
                    onChange={(e) => handleChange(e)}
                    name="dateOfBirth"
                  />
                  {errors.dateOfBirth && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.dateOfBirth}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <h6>
                    Employment Start Date <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <div className="date-picker-container">
                    <input
                      type="date"
                      className="form-control"
                      value={newEmployee.employmentStartDate}
                      onChange={(e) => handleChange(e)}
                      name="employmentStartDate"
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <h6>
                    Tax Identification Number <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <input
                    type="text"
                    className="form-control"
                    value={newEmployee.taxIdentificationNumber || ''}
                    onChange={(e) => handleChange(e)}
                    name="taxIdentificationNumber"
                  />
                  {errors.taxIdentificationNumber && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>
                      {errors.taxIdentificationNumber}
                    </div>
                  )}
                </CCol>

                <CCol md={6} className="dropdown-container">
                  <h6>
                    Bank Name <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <div className="custom-dropdown">
                    <select
                      className={`form-control dropdown-select ${errors.bankName ? 'is-invalid' : ''}`}
                      value={newEmployee.bankName || ''}
                      onChange={(e) => handleChange(e)}
                      name="bankName"
                      onFocus={() => setIsDropdownOpen(true)} // Opens dropdown
                      onBlur={() => setIsDropdownOpen(false)} // Closes dropdown
                    >
                      <option value="">Select Bank</option>
                      {Object.values(bankNamesData).map((bank, index) => (
                        <option key={index} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                    {/* Dynamic dropdown arrow */}
                    <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
                  </div>
                  {errors.bankName && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.bankName}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <h6>
                    Account Number <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <input
                    type="text"
                    className="form-control"
                    value={newEmployee.accountNumber || ''}
                    onChange={(e) => handleChange(e)}
                    name="accountNumber"
                  />
                  {errors.accountNumber && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.accountNumber}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <h6>
                    Routing Number <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <input
                    type="text"
                    className="form-control"
                    value={newEmployee.routingNumber || ''}
                    onChange={(e) => handleChange(e)}
                    name="routingNumber"
                  />
                  {errors.routingNumber && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.routingNumber}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <h6>
                    Bank Branch <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <input
                    type="text"
                    className="form-control"
                    value={newEmployee.bankBranch || ''}
                    onChange={(e) => handleChange(e)}
                    name="bankBranch"
                  />
                  {errors.bankBranch && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.bankBranch}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <h6>
                    Offer Letter Release Date <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <div className="date-picker-container">
                    <input
                      type="date"
                      className="form-control"
                      value={newEmployee.employeeOfferLetterReleaseDate}
                      onChange={(e) => handleChange(e)}
                      name="employeeOfferLetterReleaseDate"
                    />
                    {errors.employeeOfferLetterReleaseDate && (
                      <div style={{ color: 'red', fontSize: '0.9em' }}>
                        {errors.employeeOfferLetterReleaseDate}
                      </div>
                    )}
                  </div>
                </CCol>

                <CCol md={6} className="dropdown-container">
                  <h6>
                    Employee Designation <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <div className="custom-dropdown">
                    <select
                      className={`form-control dropdown-select ${errors.employeeDesignation ? 'is-invalid' : ''}`}
                      value={newEmployee.employeeDesignation || ''}
                      onChange={(e) => handleChange(e)}
                      name="employeeDesignation"
                      onFocus={() => setIsDropdownOpen(true)} // Opens dropdown
                      onBlur={() => setIsDropdownOpen(false)} // Closes dropdown
                    >
                      <option value="">Select Employee Designation</option>
                      {employeeDesignations.SoftwareDesignations.map((category, index) => (
                        <optgroup key={index} label={category.category}>
                          {category.positions.map((position, idx) => (
                            <option key={idx} value={position.title}>
                              {position.title}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {/* Dynamic arrow */}
                    <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
                  </div>
                  {errors.employeeDesignation && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>
                      {errors.employeeDesignation}
                    </div>
                  )}
                </CCol>

                <CCol md={6}>
                  <h6>
                    Joining Date <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <div className="date-picker-container">
                    <input
                      type="date"
                      className="form-control"
                      value={newEmployee.joiningDate}
                      onChange={(e) => handleChange(e)}
                      name="joiningDate"
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <h6>
                    CTC <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <input
                    type="number"
                    className="form-control"
                    value={newEmployee.ctc || ''}
                    onChange={(e) => handleChange(e)}
                    name="ctc"
                  />
                  {errors.ctc && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.ctc}</div>
                  )}
                </CCol>

                {/* <CCol md={6}>
  <h6>
    Hike Letter Date <span style={{ color: "red" }}>*</span>
  </h6>
  <div className="date-picker-container">
    <input
      type="date"
      className="form-control"
      value={newEmployee.hikeLetterDate}
      onChange={(e) => handleChange(e)}
      name="hikeLetterDate"
    />
    {errors.hikeLetterDate && (
      <div style={{ color: "red", fontSize: "0.9em" }}>{errors.hikeLetterDate}</div>
    )}
  </div>
</CCol>

<CCol md={6}>
  <h6>
    Hike CTC <span style={{ color: "red" }}>*</span>
  </h6>
  <input
    type="text"
    className="form-control"
    value={newEmployee.hikeCtc}
    onChange={(e) => handleChange(e)}
    name="hikeCtc"
  />
  {errors.hikeCtc && (
    <div style={{ color: "red", fontSize: "0.9em" }}>{errors.hikeCtc}</div>
  )}
</CCol>

<CCol md={6}>
  <h6>
    Hike Designation <span style={{ color: "red" }}>*</span>
  </h6>
  <input
    type="text"
    className="form-control"
    value={newEmployee.hikeDesignation}
    onChange={(e) => handleChange(e)}
    name="hikeDesignation"
  />
  {errors.hikeDesignation && (
    <div style={{ color: "red", fontSize: "0.9em" }}>{errors.hikeDesignation}</div>
  )}
</CCol>

<CCol md={6}>
  <h6>
    Hike Letter Effective Date <span style={{ color: "red" }}>*</span>
  </h6>
  <div className="date-picker-container">
    <input
      type="date"
      className="form-control"
      value={newEmployee.hikeLetterEffectiveDate}
      onChange={(e) => handleChange(e)}
      name="hikeLetterEffectiveDate"
    />
  </div>
</CCol>

<CCol md={6}>
  <h6>
    Project Name <span style={{ color: "red" }}>*</span>
  </h6>
  <input
    type="text"
    className="form-control"
    value={newEmployee.projectName || ""}
    onChange={(e) => handleChange(e)}
    name="projectName"
  />
  {errors.projectName && (
    <div style={{ color: "red", fontSize: "0.9em" }}>{errors.projectName}</div>
  )}
</CCol>
</CRow>
<CRow className="mb-4">
<CCol md={6}>
  <h6>
    Reliving Date <span style={{ color: "red" }}>*</span>
  </h6>
  <div className="date-picker-container">
    <input
      type="date"
      className="form-control"
      value={newEmployee.relivingDate}
      onChange={(e) =>
        setNewEmployee({ ...newEmployee, relivingDate: e.target.value })}
    /> */}
                {/*     
  </div> */}
                {/* </CCol> */}
              </CRow>
            </CForm>
          </CModalBody>

          <CModalFooter>
            <CButton color="primary" onClick={handleAddEmployee}>
              Save
            </CButton>
            <CButton color="warning" onClick={resetForm}>
              Reset
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal visible={editEmployeeMode} onClose={() => setEditEmployeeMode(false)}>
          <CModalHeader>
            <CModalTitle style={{ textAlign: 'center', width: '100%' }}>Edit Employee</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CRow className="mb-4">
                <CCol md={6}>
                  <h6>
                    First Name<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={employeeToEdit.firstName}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, firstName: value })

                      // Validate the field immediately as user types
                      const error = editValidateField('firstName', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        firstName: error,
                      }))
                    }}
                    invalid={!!errors.firstName} // Show invalid state if there's an error
                    disabled
                  />
                  {errors.firstName && (
                    <CFormFeedback invalid>{errors.firstName}</CFormFeedback> // Show error message
                  )}
                </CCol>
                <CCol md={6}>
                  <h6>
                    Last Name<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={employeeToEdit.lastName}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, lastName: value })

                      // Validate the field immediately as user types
                      const error = editValidateField('lastName', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        lastName: error,
                      }))
                    }}
                    invalid={!!errors.lastName} // Show invalid state if there's an error
                    disabled
                  />
                  {errors.lastName && (
                    <CFormFeedback invalid>{errors.lastName}</CFormFeedback> // Show error message
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-4">
                <CCol md={6}>
                  <h6>
                    Address<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={employeeToEdit.address}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, address: value })

                      // Validate the field immediately as user types
                      const error = editValidateField('address', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        address: error,
                      }))
                    }}
                    invalid={!!errors.address} // Show invalid state if there's an error
                  />
                  {errors.address && (
                    <CFormFeedback invalid>{errors.address}</CFormFeedback> // Show error message
                  )}
                </CCol>

                <CCol md={6}>
                  <h6>
                    Contact Number<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="text"
                    name="contactNumber"
                    placeholder="Contact Number"
                    value={employeeToEdit.contactNumber}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, contactNumber: value })

                      // Validate the field immediately as user types
                      const error = editValidateField('contactNumber', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        contactNumber: error,
                      }))
                    }}
                    invalid={!!errors.contactNumber} // Show invalid state if there's an error
                  />
                  {errors.contactNumber && (
                    <CFormFeedback invalid>{errors.contactNumber}</CFormFeedback> // Show error message
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-4">
                <CCol md={6}>
                  <h6>
                    Email Address<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="email"
                    name="emailAddress"
                    placeholder="Email Address"
                    value={employeeToEdit.emailAddress}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, emailAddress: value })

                      // Validate the field immediately as user types
                      const error = editValidateField('emailAddress', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        emailAddress: error,
                      }))
                    }}
                    invalid={!!errors.emailAddress} // Show invalid state if there's an error
                  />
                  {errors.emailAddress && (
                    <CFormFeedback invalid>{errors.emailAddress}</CFormFeedback> // Show error message
                  )}
                </CCol>

                <CCol md={6}>
                  <h6>
                    Date of Birth<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`} // Apply invalid class
                    value={
                      employeeToEdit.dateOfBirth
                        ? new Date(employeeToEdit.dateOfBirth).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, dateOfBirth: value })

                      // Validate the field immediately as user types
                      const error = editValidateField('dateOfBirth', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        dateOfBirth: error,
                      }))
                    }}
                    disabled
                  />
                  {errors.dateOfBirth && (
                    <div className="invalid-feedback">{errors.dateOfBirth}</div> // Show error message
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-4">
                {/* Employment Start Date */}
                <CCol md={6}>
                  <h6>
                    Employment Start Date<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <input
                    type="date"
                    name="employmentStartDate"
                    className={`form-control ${errors.employmentStartDate ? 'is-invalid' : ''}`}
                    value={
                      employeeToEdit.employmentStartDate
                        ? new Date(employeeToEdit.employmentStartDate).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, employmentStartDate: value })

                      // Validate the field immediately as user types
                      const error = editValidateField('employmentStartDate', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        employmentStartDate: error,
                      }))
                    }}
                    disabled
                  />
                  {errors.employmentStartDate && (
                    <div className="invalid-feedback">{errors.employmentStartDate}</div>
                  )}
                </CCol>

                {/* Tax Identification Number */}
                <CCol md={6}>
                  <h6>
                    Tax Identification Number<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="text"
                    name="taxIdentificationNumber"
                    placeholder="Tax Identification Number"
                    value={employeeToEdit.taxIdentificationNumber}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, taxIdentificationNumber: value })

                      // Validate the field immediately as user types
                      const error = editValidateField('taxIdentificationNumber', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        taxIdentificationNumber: error,
                      }))
                    }}
                    invalid={!!errors.taxIdentificationNumber}
                    disabled
                  />
                  {errors.taxIdentificationNumber && (
                    <CFormFeedback invalid>{errors.taxIdentificationNumber}</CFormFeedback>
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-4">
                {/* Bank Name Dropdown */}
                <CCol md={6} className="dropdown-container">
                  <h6>
                    Bank Name <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <div className="custom-dropdown">
                    <select
                      className={`form-control dropdown-select ${errors.bankName ? 'is-invalid' : ''}`}
                      value={employeeToEdit.bankName || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        setEmployeeToEdit({ ...employeeToEdit, bankName: value })

                        // Validate the field immediately when selected
                        const error = editValidateField('bankName', value)
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          bankName: error,
                        }))
                      }}
                      name="bankName"
                      onFocus={() => setIsDropdownOpen(true)} // Opens dropdown
                      onBlur={() => setIsDropdownOpen(false)} // Closes dropdown
                    >
                      <option value="">Select Bank</option>
                      {Object.values(bankNamesData).map((bank, index) => (
                        <option key={index} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                    {/* Dynamic arrow */}
                    <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
                  </div>
                  {errors.bankName && <div className="invalid-feedback">{errors.bankName}</div>}
                </CCol>

                {/* </CRow> */}

                {/* Account Number */}
                <CCol md={6}>
                  <h6>
                    Account Number<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="text"
                    name="accountNumber"
                    placeholder="Account Number"
                    value={employeeToEdit.accountNumber}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, accountNumber: value })

                      // Validate the field immediately as user types
                      const error = editValidateField('accountNumber', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        accountNumber: error,
                      }))
                    }}
                    invalid={!!errors.accountNumber}
                  />
                  {errors.accountNumber && (
                    <CFormFeedback invalid>{errors.accountNumber}</CFormFeedback>
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-4">
                {/* Routing Number */}
                <CCol md={6}>
                  <h6>
                    Routing Number<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="text"
                    name="routingNumber"
                    placeholder="Routing Number"
                    value={employeeToEdit.routingNumber}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, routingNumber: value })

                      // Validate the field immediately as user types
                      const error = editValidateField('routingNumber', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        routingNumber: error,
                      }))
                    }}
                    invalid={!!errors.routingNumber}
                  />
                  {errors.routingNumber && (
                    <CFormFeedback invalid>{errors.routingNumber}</CFormFeedback>
                  )}
                </CCol>

                {/* Bank Branch */}
                <CCol md={6}>
                  <h6>
                    Bank Branch<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="text"
                    name="bankBranch"
                    placeholder="Bank Branch"
                    value={employeeToEdit.bankBranch}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, bankBranch: value })

                      // Validate the field immediately as user types
                      const error = editValidateField('bankBranch', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        bankBranch: error,
                      }))
                    }}
                    invalid={!!errors.bankBranch}
                  />
                  {errors.bankBranch && <CFormFeedback invalid>{errors.bankBranch}</CFormFeedback>}
                </CCol>
              </CRow>

              <CRow className="mb-4">
                {/* Employee Offer Letter Release Date */}
                <CCol md={6}>
                  <h6>
                    Offer Letter Release Date<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <input
                    type="date"
                    name="employeeOfferLetterReleaseDate"
                    className={`form-control ${errors.employeeOfferLetterReleaseDate ? 'is-invalid' : ''}`}
                    value={
                      employeeToEdit.employeeOfferLetterReleaseDate
                        ? new Date(employeeToEdit.employeeOfferLetterReleaseDate)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({
                        ...employeeToEdit,
                        employeeOfferLetterReleaseDate: value,
                      })

                      // Validate the field immediately as user types
                      const error = editValidateField('employeeOfferLetterReleaseDate', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        employeeOfferLetterReleaseDate: error,
                      }))
                    }}
                    disabled
                  />
                  {errors.employeeOfferLetterReleaseDate && (
                    <div className="invalid-feedback">{errors.employeeOfferLetterReleaseDate}</div>
                  )}
                </CCol>

                {/* Employee Designation */}
                <CCol md={6} className="dropdown-container">
                  <h6>
                    Employee Designation <span style={{ color: 'red' }}>*</span>
                  </h6>
                  <div className="custom-dropdown">
                    <select
                      className={`form-control dropdown-select ${errors.employeeDesignation ? 'is-invalid' : ''}`}
                      value={employeeToEdit.employeeDesignation || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        setEmployeeToEdit({ ...employeeToEdit, employeeDesignation: value })

                        // Validate the field immediately when selected
                        const error = editValidateField('employeeDesignation', value)
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          employeeDesignation: error,
                        }))
                      }}
                      name="employeeDesignation"
                    >
                      <option value="">Select Employee Designation</option>
                      {employeeDesignations.SoftwareDesignations.map((category, index) => (
                        <optgroup key={index} label={category.category}>
                          {category.positions.map((position, idx) => (
                            <option key={idx} value={position.title}>
                              {position.title}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {/* Arrow icon (rotates dynamically when dropdown is focused) */}
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  {errors.employeeDesignation && (
                    <div className="invalid-feedback">{errors.employeeDesignation}</div>
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-4">
                {/* Joining Date */}
                <CCol md={6}>
                  <h6>
                    Joining Date<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <input
                    type="date"
                    name="joiningDate"
                    className={`form-control ${errors.joiningDate ? 'is-invalid' : ''}`}
                    value={
                      employeeToEdit.joiningDate
                        ? new Date(employeeToEdit.joiningDate).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, joiningDate: value })

                      // Validate the field immediately as user types
                      const error = editValidateField('joiningDate', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        joiningDate: error,
                      }))
                    }}
                    disabled
                  />
                  {errors.joiningDate && (
                    <div className="invalid-feedback">{errors.joiningDate}</div>
                  )}
                </CCol>

                {/* CTC */}
                <CCol md={6}>
                  <h6>
                    CTC<span style={{ color: 'red' }}>*</span>
                  </h6>
                  <CFormInput
                    type="number"
                    name="ctc"
                    placeholder="CTC"
                    value={employeeToEdit.ctc}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, ctc: value })

                      // Validate the field immediately as user types
                      const error = editValidateField('ctc', value)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        ctc: error,
                      }))
                    }}
                    invalid={!!errors.ctc}
                  />
                  {errors.ctc && <CFormFeedback invalid>{errors.ctc}</CFormFeedback>}
                </CCol>
              </CRow>

              <CRow className="mb-4">
                {/* Hike Letter Date */}
                <CCol md={6}>
                  <h6>Hike Letter Date</h6>
                  <input
                    type="date"
                    name="hikeLetterDate"
                    className={`form-control ${errors.hikeLetterDate ? 'is-invalid' : ''}`}
                    value={
                      employeeToEdit.hikeLetterDate
                        ? new Date(employeeToEdit.hikeLetterDate).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, hikeLetterDate: value })

                      // Validate only if the field has a value
                      const error = value ? editValidateField('hikeLetterDate', value) : ''
                      setErrors((prevErrors) => ({ ...prevErrors, hikeLetterDate: error }))
                    }}
                  />
                  {errors.hikeLetterDate && (
                    <div className="invalid-feedback">{errors.hikeLetterDate}</div>
                  )}
                </CCol>

                {/* Hike CTC */}
                <CCol md={6}>
                  <h6>Hike CTC</h6>
                  <CFormInput
                    type="text"
                    name="hikeCtc"
                    placeholder="Hike CTC"
                    value={employeeToEdit.hikeCtc}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, hikeCtc: value })

                      // Validate only if the field has a value
                      const error = value ? editValidateField('hikeCtc', value) : ''
                      setErrors((prevErrors) => ({ ...prevErrors, hikeCtc: error }))
                    }}
                    invalid={!!errors.hikeCtc}
                  />
                  {errors.hikeCtc && <CFormFeedback invalid>{errors.hikeCtc}</CFormFeedback>}
                </CCol>
              </CRow>

              <CRow className="mb-4">
                {/* Hike Designation */}
                <CCol md={6} className="dropdown-container">
                  <h6>Hike Designation</h6>
                  <div className="custom-dropdown">
                    <select
                      className={`form-control dropdown-select ${errors.hikeDesignation ? 'is-invalid' : ''}`}
                      value={employeeToEdit.hikeDesignation || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        setEmployeeToEdit({ ...employeeToEdit, hikeDesignation: value })

                        // Validate only if the field has a value
                        const error = value ? editValidateField('hikeDesignation', value) : ''
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          hikeDesignation: error,
                        }))
                      }}
                      onFocus={() => setIsDropdownOpen(true)} // Opens dropdown
                      onBlur={() => setIsDropdownOpen(false)} // Closes dropdown
                      name="hikeDesignation"
                    >
                      <option value="">Select Hike Designation</option>
                      {employeeDesignations.SoftwareDesignations.map((category, index) => (
                        <optgroup key={index} label={category.category}>
                          {category.positions.map((position, idx) => (
                            <option key={idx} value={position.title}>
                              {position.title}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {/* Dynamic arrow */}
                    <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
                  </div>
                  {errors.hikeDesignation && (
                    <div className="invalid-feedback">{errors.hikeDesignation}</div>
                  )}
                </CCol>

                {/* Hike Letter Effective Date */}
                <CCol md={6}>
                  <h6>Hike Letter Effective Date</h6>
                  <input
                    type="date"
                    name="hikeLetterEffectiveDate"
                    className={`form-control ${errors.hikeLetterEffectiveDate ? 'is-invalid' : ''}`}
                    value={
                      employeeToEdit.hikeLetterEffectiveDate
                        ? new Date(employeeToEdit.hikeLetterEffectiveDate)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, hikeLetterEffectiveDate: value })

                      // Validate only if the field has a value
                      const error = value ? editValidateField('hikeLetterEffectiveDate', value) : ''
                      setErrors((prevErrors) => ({ ...prevErrors, hikeLetterEffectiveDate: error }))
                    }}
                  />
                  {errors.hikeLetterEffectiveDate && (
                    <div className="invalid-feedback">{errors.hikeLetterEffectiveDate}</div>
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-4">
                {/* Project Name */}
                <CCol md={6}>
                  <h6>Project Name</h6>
                  <CFormInput
                    type="text"
                    name="projectName"
                    placeholder="Project Name"
                    value={employeeToEdit.projectName}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, projectName: value })

                      // Validate only if the field has a value
                      const error = value ? editValidateField('projectName', value) : ''
                      setErrors((prevErrors) => ({ ...prevErrors, projectName: error }))
                    }}
                    invalid={!!errors.projectName}
                  />
                  {errors.projectName && (
                    <CFormFeedback invalid>{errors.projectName}</CFormFeedback>
                  )}
                </CCol>

                {/* Cycle Working In */}
                <CCol md={6}>
                  <h6>Cycle Working In</h6>
                  <CFormInput
                    type="text"
                    name="cycleWorkingIn"
                    placeholder="Cycle Working In"
                    value={employeeToEdit.cycleWorkingIn}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, cycleWorkingIn: value })

                      // Validate only if the field has a value
                      const error = value ? editValidateField('cycleWorkingIn', value) : ''
                      setErrors((prevErrors) => ({ ...prevErrors, cycleWorkingIn: error }))
                    }}
                    invalid={!!errors.cycleWorkingIn}
                  />
                  {errors.cycleWorkingIn && (
                    <CFormFeedback invalid>{errors.cycleWorkingIn}</CFormFeedback>
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-4">
                {/* Relieving Date */}
                <CCol md={6}>
                  <h6>Relieving Date</h6>
                  <input
                    type="date"
                    name="relievingDate"
                    className={`form-control ${errors.relievingDate ? 'is-invalid' : ''}`}
                    value={
                      employeeToEdit.relievingDate
                        ? new Date(employeeToEdit.relievingDate).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployeeToEdit({ ...employeeToEdit, relievingDate: value })

                      // Validate only if the field has a value
                      const error = value ? editValidateField('relievingDate', value) : ''
                      setErrors((prevErrors) => ({ ...prevErrors, relievingDate: error }))
                    }}
                  />
                  {errors.relievingDate && (
                    <div className="invalid-feedback">{errors.relievingDate}</div>
                  )}
                </CCol>
              </CRow>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={handleUpdateEmployee}>
              Update
            </CButton>
            <CButton color="secondary" onClick={() => setEditEmployeeMode(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              height: '300px',
              fontSize: '1.5rem',
            }}
          >
            Loading...
          </div>
        ) : error ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              height: '300px',
              fontSize: '1.5rem',
            }}
          >
            {error}
          </div>
        ) : (
          <div>
            {searchQuery.trim() && filteredData.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  height: '300px',
                  fontSize: '1.5rem',
                }}
              >
                No data found
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                highlightOnHover
                pointerOnHover
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default EmployeeManagement
