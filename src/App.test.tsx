import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import '@testing-library/jest-dom';

describe('HRMS Dashboard', () => {
  it('renders the dashboard metrics and initial state', () => {
    render(<App />);
    
    // Check for main title
    expect(screen.getByText(/HRMS Dashboard/i)).toBeInTheDocument();

    // Check for metrics cards
    expect(screen.getByText(/Total Employees/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Projects/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Positions/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending Leave Requests/i)).toBeInTheDocument();

    // Check for action buttons
    expect(screen.getByRole('button', { name: /Add Employee/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Request Leave/i })).toBeInTheDocument();
  });

  it('allows adding a new employee and updates metrics and list', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Get initial total employees count
    const initialTotalText = screen.getByText(/Total Employees/i).closest('div')?.querySelector('.text-2xl, .text-3xl, [class*="text-"]')?.textContent || '0';
    const initialCount = parseInt(initialTotalText, 10) || 0;

    // Click Add Employee button
    const addBtn = screen.getByRole('button', { name: /Add Employee/i });
    await user.click(addBtn);

    // Verify modal is open
    expect(screen.getByRole('heading', { name: /Add New Employee/i })).toBeInTheDocument();

    // Fill out form
    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const deptSelect = screen.getByLabelText(/Department/i);
    const roleInput = screen.getByLabelText(/Role/i);
    const statusSelect = screen.getByLabelText(/Status/i);

    await user.type(nameInput, 'Jane Doe');
    await user.type(emailInput, 'jane.doe@example.com');
    await user.selectOptions(deptSelect, 'Engineering');
    await user.type(roleInput, 'Frontend Engineer');
    await user.selectOptions(statusSelect, 'Active');

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /^Add$/i });
    await user.click(submitBtn);

    // Verify modal is closed
    expect(screen.queryByRole('heading', { name: /Add New Employee/i })).not.toBeInTheDocument();

    // Verify employee is added to the table
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();

    // Verify metric updated
    const updatedTotalText = screen.getByText(/Total Employees/i).closest('div')?.querySelector('.text-2xl, .text-3xl, [class*="text-"]')?.textContent || '0';
    const updatedCount = parseInt(updatedTotalText, 10);
    expect(updatedCount).toBe(initialCount + 1);

    // Verify recent activity added
    expect(screen.getByText(/Added employee Jane Doe/i)).toBeInTheDocument();
  });

  it('allows requesting leave and updates leave metrics and activities', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Get initial pending leave requests count
    const initialLeaveText = screen.getByText(/Pending Leave Requests/i).closest('div')?.querySelector('.text-2xl, .text-3xl, [class*="text-"]')?.textContent || '0';
    const initialLeaveCount = parseInt(initialLeaveText, 10) || 0;

    // Click Request Leave button
    const requestBtn = screen.getByRole('button', { name: /Request Leave/i });
    await user.click(requestBtn);

    // Verify modal is open
    expect(screen.getByRole('heading', { name: /Request Leave/i })).toBeInTheDocument();

    // Fill out form
    const employeeSelect = screen.getByLabelText(/Employee/i);
    const typeSelect = screen.getByLabelText(/Leave Type/i);
    const startDateInput = screen.getByLabelText(/Start Date/i);
    const endDateInput = screen.getByLabelText(/End Date/i);
    const reasonInput = screen.getByLabelText(/Reason/i);

    // Select first available employee option
    const options = employeeSelect.getElementsByTagName('option');
    if (options.length > 1) {
      await user.selectOptions(employeeSelect, options[1]?.value || '');
    }
    await user.selectOptions(typeSelect, 'Annual');
    fireEvent.change(startDateInput, { target: { value: '2025-06-01' } });
    fireEvent.change(endDateInput, { target: { value: '2025-06-10' } });
    await user.type(reasonInput, 'Summer vacation');

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Submit Request/i });
    await user.click(submitBtn);

    // Verify modal is closed
    expect(screen.queryByRole('heading', { name: /Request Leave/i })).not.toBeInTheDocument();

    // Verify metric updated
    const updatedLeaveText = screen.getByText(/Pending Leave Requests/i).closest('div')?.querySelector('.text-2xl, .text-3xl, [class*="text-"]')?.textContent || '0';
    const updatedLeaveCount = parseInt(updatedLeaveText, 10);
    expect(updatedLeaveCount).toBe(initialLeaveCount + 1);

    // Verify recent activity added
    expect(screen.getByText(/Requested Annual leave/i)).toBeInTheDocument();
  });

  it('allows filtering employees by search query', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByPlaceholderText(/Search/i);
    await user.type(searchInput, 'NonExistentEmployeeNameXYZ');
    expect(screen.queryByText('NonExistentEmployeeNameXYZ')).not.toBeInTheDocument();
    
    await user.clear(searchInput);
  });
});