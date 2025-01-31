// Corrected API endpoint paths based on the backend mapping

export const BASE_URL = 'http://192.168.29.107:8081/api';

export const listEmployees = 'employees/list';          // Fetches all employees
export const listArchiveEmployees = 'employees/archivelist'; // Fetches archived employees
export const getEmployeeById = 'employees/employees';   // Fixed: Correct endpoint for fetching by ID
export const addEmployee = 'employees/save';            // Adds a new employee
export const updateEmployee = 'employees/update';       // Updates an existing employee
export const deleteEmployee = 'employees/delete';       // Deletes an employee by ID
