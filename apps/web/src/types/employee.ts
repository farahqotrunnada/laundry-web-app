export type EmployeeRole = 'Driver' | 'OutletAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker' | 'Employee';

export type EmployeeForm = {
  user_id: string;
  fullname: string;
  email: string;
  role: EmployeeRole;
};
