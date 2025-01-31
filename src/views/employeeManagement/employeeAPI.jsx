import axios from 'axios'
import { React } from 'react'
import {
  BASE_URL,
  listEmployees,
  listArchiveEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from '../../APIs/EmployeeApi/baseUrl'

export const employeeData = async (employee) => {
  try {
    const response = await axios.get(`${BASE_URL}/${listEmployees}`)
    console.log('Full API Response:', response)
    return response.data // Adjust this based on the API response structure
  } catch (error) {
    console.error('Error fetching employee data:', error)
    if (error.response) {
      console.error('Response Error Details:', error.response)
    }
    throw error
  }
}

export const archiveEmployeeData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/${listArchiveEmployees}`)
    console.log(response.data.data)
    return response.data.data
  } catch (error) {
    console.error('Error fetching Archived Employee data:', error.message)
    if (error.response) {
      console.error('Error Response data:', error.response.data)
      console.error('Error Response Status:', error.response.status)
    }
    throw error
  }
}

export const postEmployeeData = async (employeeData) => {
  console.log('Sending Data to API:', employeeData)
  try {
    console.log('try')
    const response = await axios.post(`${BASE_URL}/${addEmployee}`, employeeData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log(response)
    return response.data
  } catch (error) {
    console.error('Error response:', error.response)
    alert(
      `Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`,
    )
    throw error
  }
}

export const updateEmployeeData = async (empId, employeeData) => {
  try {
    // The URL now includes empId as part of the path
    const response = await axios.put(`${BASE_URL}/${updateEmployee}/${empId}`, employeeData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Employee updated Successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Error updating employee:', error)
    if (error.response) {
      console.error('Response Error Details:', error.response)
    }
    throw error
  }
}

export const deleteEmployeeData = async (empId) => {
  try {
    console.log('Deleting Employee with ID:', empId)
    const response = await axios.delete(`${BASE_URL}/${deleteEmployee}/${empId}`)

    console.log('Deleted Employee Successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Error deleting data:', error)
    throw error
  }
}
