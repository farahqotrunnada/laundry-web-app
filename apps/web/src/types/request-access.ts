export type RequestAccessStatus = 'Pending' | 'Accepted' | 'Rejected';

export type RequestAccess = {
  request_access_id: string;
  job_id: string;
  employee_id: string;
  reason: string;
  outlet_id: string;
  status: RequestAccessStatus;
};
