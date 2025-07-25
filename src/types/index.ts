export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager' | 'hr' | 'finance' | 'management' | 'it_admin';
  department: string;
  location: 'location_a' | 'location_b';
  managerId?: string;
  hodId?: string;
  annualLeaveBalance: number;
  medicalLeaveBalance: number;
  unpaidLeaveBalance: number;
  timeOffBalance: number;
  // Gamification fields
  totalPoints: number;
  level: number;
  badges: Badge[];
  streak: number;
  lastActivityDate?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'productivity' | 'consistency' | 'quality' | 'collaboration' | 'milestone';
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'task_completed' | 'streak_milestone' | 'overtime_hero' | 'early_bird' | 'quality_work' | 'team_player';
  title: string;
  description: string;
  points: number;
  earnedAt: string;
}

export interface Leaderboard {
  userId: string;
  userName: string;
  department: string;
  totalPoints: number;
  level: number;
  rank: number;
  weeklyPoints: number;
  monthlyPoints: number;
}

export interface Project {
  id: string;
  name: string;
  department: string;
  status: 'active' | 'completed' | 'on_hold';
  startDate: string;
  endDate?: string;
  createdBy: string;
  assignedUsers: string[];
  isBillable: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  estimatedHours?: number;
  isBillable: boolean;
  taskType: 'project' | 'annual_leave' | 'medical_leave' | 'unpaid_leave' | 'time_off';
  createdBy: string;
  assignedBy?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  assignedTo?: string[];
}

export interface TimesheetEntry {
  id: string;
  userId: string;
  date: string;
  projectId: string;
  taskId: string;
  hoursWorked: number;
  description: string;
  status: 'draft' | 'submitted' | 'approved';
  isOvertime: boolean;
  overtimeHours?: number;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  isBillable: boolean;
  taskType: 'project' | 'annual_leave' | 'medical_leave' | 'unpaid_leave' | 'time_off';
  isHoliday?: boolean;
  isWeekend?: boolean;
  autoOvertimeReason?: string;
}

export interface PublicHoliday {
  id: string;
  name: string;
  date: string;
  location: 'location_a' | 'location_b' | 'both';
  recurring: boolean;
}

export interface OvertimeRequest {
  id: string;
  userId: string;
  period: string; // Format: "2024-H1" or "2024-H2"
  periodType: 'first_half' | 'second_half';
  year: number;
  totalOvertimeHours: number;
  status: 'pending' | 'approved_hod' | 'approved_finance' | 'approved_management' | 'rejected';
  submittedAt: string;
  hodApprovedAt?: string;
  hodApprovedBy?: string;
  financeApprovedAt?: string;
  financeApprovedBy?: string;
  managementApprovedAt?: string;
  managementApprovedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  attachments?: OvertimeAttachment[];
  overtimeEntries: OvertimeEntry[];
}

export interface OvertimeEntry {
  id: string;
  date: string;
  projectName: string;
  taskName: string;
  hours: number;
  description: string;
  reason: 'weekend' | 'holiday' | 'excess_hours';
}

interface OvertimeAttachment {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  fileUrl: string;
  uploadedAt: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  leaveType: 'annual_leave' | 'medical_leave' | 'unpaid_leave' | 'time_off';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved_hod' | 'approved_hr' | 'rejected';
  submittedAt: string;
  hodApprovedAt?: string;
  hodApprovedBy?: string;
  hrApprovedAt?: string;
  hrApprovedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  attachments?: LeaveAttachment[];
}

interface LeaveAttachment {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  fileUrl: string;
  uploadedAt: string;
}

export interface ITTicket {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: 'hardware' | 'software' | 'network' | 'access' | 'other';
  submittedAt: string;
  assignedTo?: string;
  resolvedAt?: string;
  attachments?: ITTicketAttachment[];
}

interface ITTicketAttachment {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'document';
  fileUrl: string;
  uploadedAt: string;
}

export interface Statistics {
  expectedHours: number;
  actualHours: number;
  overtimeHours: number;
  efficiency: number;
  completedTasks: number;
  activeProjects: number;
  billableHours: number;
  nonBillableHours: number;
  leaveHours: number;
}

export interface HourVariance {
  userId: string;
  userName: string;
  department: string;
  expectedHours: number;
  actualHours: number;
  variance: number;
  variancePercentage: number;
  month: string;
}

export interface TaskVariance {
  taskId: string;
  taskName: string;
  projectName: string;
  estimatedHours: number;
  actualHours: number;
  variance: number;
  variancePercentage: number;
  assignedUsers: string[];
}

export interface BatchUpdate {
  id: string;
  userId: string;
  date: string;
  timeSlot: 'morning' | 'afternoon' | 'full_day';
  projectId: string;
  taskId: string;
  description: string;
  createdAt: string;
}