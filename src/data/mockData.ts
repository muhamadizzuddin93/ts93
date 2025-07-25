import { 
  User, 
  Project, 
  Task, 
  TimesheetEntry, 
  PublicHoliday, 
  OvertimeRequest,
  LeaveRequest,
  ITTicket,
  HourVariance,
  TaskVariance,
  Badge,
  Achievement,
  Leaderboard,
  OvertimeEntry
} from '../types';

const mockBadges: Badge[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Submitted timesheet before 9 AM for 5 consecutive days',
    icon: '🌅',
    earnedAt: '2024-01-15T08:30:00Z',
    category: 'consistency'
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintained 30-day timesheet submission streak',
    icon: '🔥',
    earnedAt: '2024-01-20T17:00:00Z',
    category: 'consistency'
  },
  {
    id: 'task-crusher',
    name: 'Task Crusher',
    description: 'Completed 50 tasks this month',
    icon: '💪',
    earnedAt: '2024-01-25T16:45:00Z',
    category: 'productivity'
  },
  {
    id: 'quality-champion',
    name: 'Quality Champion',
    description: 'Zero timesheet rejections for 3 months',
    icon: '⭐',
    earnedAt: '2024-01-10T14:20:00Z',
    category: 'quality'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'employee',
    department: 'Engineering',
    location: 'location_a',
    hodId: '2',
    annualLeaveBalance: 14,
    medicalLeaveBalance: 10,
    unpaidLeaveBalance: 0,
    timeOffBalance: 5,
    totalPoints: 2450,
    level: 8,
    badges: mockBadges,
    streak: 15,
    lastActivityDate: '2024-01-30T17:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'manager',
    department: 'Engineering',
    location: 'location_a',
    annualLeaveBalance: 18,
    medicalLeaveBalance: 12,
    unpaidLeaveBalance: 0,
    timeOffBalance: 7,
    totalPoints: 3200,
    level: 12,
    badges: [mockBadges[0], mockBadges[3]],
    streak: 22,
    lastActivityDate: '2024-01-30T18:30:00Z'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    role: 'hr',
    department: 'Human Resources',
    location: 'location_a',
    annualLeaveBalance: 16,
    medicalLeaveBalance: 11,
    unpaidLeaveBalance: 0,
    timeOffBalance: 6,
    totalPoints: 1800,
    level: 6,
    badges: [mockBadges[1]],
    streak: 8,
    lastActivityDate: '2024-01-29T16:45:00Z'
  },
  {
    id: '4',
    name: 'Lisa Wong',
    email: 'lisa.wong@company.com',
    role: 'finance',
    department: 'Finance',
    location: 'location_b',
    annualLeaveBalance: 15,
    medicalLeaveBalance: 10,
    unpaidLeaveBalance: 0,
    timeOffBalance: 5,
    totalPoints: 2100,
    level: 7,
    badges: [mockBadges[0], mockBadges[2]],
    streak: 12,
    lastActivityDate: '2024-01-30T17:15:00Z'
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david.lee@company.com',
    role: 'management',
    department: 'Executive',
    location: 'location_a',
    annualLeaveBalance: 20,
    medicalLeaveBalance: 15,
    unpaidLeaveBalance: 0,
    timeOffBalance: 10,
    totalPoints: 4500,
    level: 18,
    badges: mockBadges,
    streak: 45,
    lastActivityDate: '2024-01-30T19:00:00Z'
  },
  {
    id: '6',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@company.com',
    role: 'it_admin',
    department: 'IT',
    location: 'location_a',
    annualLeaveBalance: 16,
    medicalLeaveBalance: 12,
    unpaidLeaveBalance: 0,
    timeOffBalance: 6,
    totalPoints: 2800,
    level: 10,
    badges: [mockBadges[1], mockBadges[3]],
    streak: 28,
    lastActivityDate: '2024-01-30T18:00:00Z'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    department: 'Engineering',
    status: 'active',
    startDate: '2024-01-01',
    createdBy: '6',
    assignedUsers: ['1', '2'],
    isBillable: true
  },
  {
    id: '2',
    name: 'Mobile App Development',
    department: 'Engineering',
    status: 'active',
    startDate: '2024-02-01',
    createdBy: '6',
    assignedUsers: ['1'],
    isBillable: true
  },
  {
    id: '3',
    name: 'HR System Upgrade',
    department: 'Human Resources',
    status: 'active',
    startDate: '2024-01-15',
    createdBy: '6',
    assignedUsers: ['3'],
    isBillable: false
  },
  {
    id: '4',
    name: 'Financial Reporting Tool',
    department: 'Finance',
    status: 'active',
    startDate: '2024-03-01',
    createdBy: '6',
    assignedUsers: ['4'],
    isBillable: true
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    projectId: '1',
    name: 'UI Design',
    description: 'Design new user interface components',
    estimatedHours: 40,
    isBillable: true,
    taskType: 'project',
    createdBy: '6',
    assignedBy: '2',
    dueDate: '2024-02-15',
    priority: 'high',
    status: 'in_progress',
    assignedTo: ['1']
  },
  {
    id: '2',
    projectId: '1',
    name: 'Frontend Development',
    description: 'Implement responsive frontend',
    estimatedHours: 80,
    isBillable: true,
    taskType: 'project',
    createdBy: '6',
    assignedBy: '2',
    dueDate: '2024-03-01',
    priority: 'medium',
    status: 'not_started',
    assignedTo: ['1']
  },
  {
    id: '3',
    projectId: '2',
    name: 'API Integration',
    description: 'Integrate with backend APIs',
    estimatedHours: 60,
    isBillable: true,
    taskType: 'project',
    createdBy: '6',
    assignedBy: '2',
    dueDate: '2024-02-28',
    priority: 'urgent',
    status: 'in_progress',
    assignedTo: ['1']
  },
  {
    id: '4',
    projectId: '3',
    name: 'Database Migration',
    description: 'Migrate existing HR data',
    estimatedHours: 30,
    isBillable: false,
    taskType: 'project',
    createdBy: '6',
    assignedBy: '3',
    dueDate: '2024-02-20',
    priority: 'medium',
    status: 'completed',
    assignedTo: ['3']
  },
  // Leave tasks
  {
    id: 'leave-1',
    projectId: 'leave-project',
    name: 'Annual Leave',
    description: 'Annual leave time off',
    isBillable: false,
    taskType: 'annual_leave',
    createdBy: '6'
  },
  {
    id: 'leave-2',
    projectId: 'leave-project',
    name: 'Medical Leave',
    description: 'Medical leave time off',
    isBillable: false,
    taskType: 'medical_leave',
    createdBy: '6'
  },
  {
    id: 'leave-3',
    projectId: 'leave-project',
    name: 'Unpaid Leave',
    description: 'Unpaid leave time off',
    isBillable: false,
    taskType: 'unpaid_leave',
    createdBy: '6'
  },
  {
    id: 'leave-4',
    projectId: 'leave-project',
    name: 'Time Off',
    description: 'General time off',
    isBillable: false,
    taskType: 'time_off',
    createdBy: '6'
  }
];

// Add leave project
mockProjects.push({
  id: 'leave-project',
  name: 'Leave Management',
  department: 'HR',
  status: 'active',
  startDate: '2024-01-01',
  createdBy: '6',
  assignedUsers: mockUsers.map(u => u.id),
  isBillable: false
});

export const mockTimesheetEntries: TimesheetEntry[] = [
  {
    id: '1',
    userId: '1',
    date: '2024-01-15',
    projectId: '1',
    taskId: '1',
    hoursWorked: 8,
    description: 'Worked on wireframes and mockups',
    status: 'approved',
    isOvertime: false,
    submittedAt: '2024-01-15T17:00:00Z',
    approvedAt: '2024-01-16T09:00:00Z',
    approvedBy: '2',
    isBillable: true,
    taskType: 'project'
  },
  {
    id: '2',
    userId: '1',
    date: '2024-01-16',
    projectId: '1',
    taskId: '2',
    hoursWorked: 10,
    description: 'Frontend development with overtime',
    status: 'approved',
    isOvertime: true,
    overtimeHours: 2,
    submittedAt: '2024-01-16T19:00:00Z',
    approvedAt: '2024-01-17T09:00:00Z',
    approvedBy: '2',
    isBillable: true,
    taskType: 'project'
  },
  {
    id: '3',
    userId: '1',
    date: '2024-01-13', // Saturday
    projectId: '1',
    taskId: '1',
    hoursWorked: 6,
    description: 'Weekend work on urgent UI fixes',
    status: 'approved',
    isOvertime: true,
    overtimeHours: 6,
    submittedAt: '2024-01-13T18:00:00Z',
    approvedAt: '2024-01-14T09:00:00Z',
    approvedBy: '2',
    isBillable: true,
    taskType: 'project',
    isWeekend: true,
    autoOvertimeReason: 'Weekend work - all hours counted as overtime'
  },
  {
    id: '4',
    userId: '1',
    date: '2024-01-01', // New Year's Day (Holiday)
    projectId: '2',
    taskId: '3',
    hoursWorked: 4,
    description: 'Emergency API fixes during holiday',
    status: 'approved',
    isOvertime: true,
    overtimeHours: 4,
    submittedAt: '2024-01-01T20:00:00Z',
    approvedAt: '2024-01-02T09:00:00Z',
    approvedBy: '2',
    isBillable: true,
    taskType: 'project',
    isHoliday: true,
    autoOvertimeReason: 'Public holiday work - all hours counted as overtime'
  }
];

export const mockPublicHolidays: PublicHoliday[] = [
  {
    id: '1',
    name: 'New Year\'s Day',
    date: '2024-01-01',
    location: 'both',
    recurring: true
  },
  {
    id: '2',
    name: 'Independence Day (Location A)',
    date: '2024-07-04',
    location: 'location_a',
    recurring: true
  },
  {
    id: '3',
    name: 'National Day (Location B)',
    date: '2024-08-09',
    location: 'location_b',
    recurring: true
  },
  {
    id: '4',
    name: 'Christmas Day',
    date: '2024-12-25',
    location: 'both',
    recurring: true
  }
];

const mockOvertimeEntries: OvertimeEntry[] = [
  {
    id: '1',
    date: '2024-01-16',
    projectName: 'Website Redesign',
    taskName: 'Frontend Development',
    hours: 2,
    description: 'Frontend development with overtime',
    reason: 'excess_hours'
  },
  {
    id: '2',
    date: '2024-01-13',
    projectName: 'Website Redesign',
    taskName: 'UI Design',
    hours: 6,
    description: 'Weekend work on urgent UI fixes',
    reason: 'weekend'
  },
  {
    id: '3',
    date: '2024-01-01',
    projectName: 'Mobile App Development',
    taskName: 'API Integration',
    hours: 4,
    description: 'Emergency API fixes during holiday',
    reason: 'holiday'
  }
];

export const mockOvertimeRequests: OvertimeRequest[] = [
  {
    id: '1',
    userId: '1',
    period: '2024-H1',
    periodType: 'first_half',
    year: 2024,
    totalOvertimeHours: 16,
    status: 'approved_hod',
    submittedAt: '2024-07-01T10:00:00Z',
    hodApprovedAt: '2024-07-02T14:30:00Z',
    hodApprovedBy: '2',
    attachments: [
      {
        id: 'att-1',
        fileName: 'attendance_report_h1_2024.pdf',
        fileType: 'pdf',
        fileUrl: '/uploads/attendance_h1_2024.pdf',
        uploadedAt: '2024-07-01T10:00:00Z'
      }
    ],
    overtimeEntries: mockOvertimeEntries
  },
  {
    id: '2',
    userId: '1',
    period: '2024-H2',
    periodType: 'second_half',
    year: 2024,
    totalOvertimeHours: 12,
    status: 'pending',
    submittedAt: '2025-01-01T10:00:00Z',
    overtimeEntries: [
      {
        id: '4',
        date: '2024-08-15',
        projectName: 'Mobile App Development',
        taskName: 'API Integration',
        hours: 3,
        description: 'Extra work on API optimization',
        reason: 'excess_hours'
      },
      {
        id: '5',
        date: '2024-09-22',
        projectName: 'Website Redesign',
        taskName: 'Frontend Development',
        hours: 5,
        description: 'Weekend deployment work',
        reason: 'weekend'
      }
    ]
  }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    userId: '1',
    leaveType: 'annual_leave',
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    totalDays: 3,
    reason: 'Family vacation',
    status: 'approved_hod',
    submittedAt: '2024-03-01T10:00:00Z',
    hodApprovedAt: '2024-03-02T14:30:00Z',
    hodApprovedBy: '2'
  },
  {
    id: '2',
    userId: '1',
    leaveType: 'medical_leave',
    startDate: '2024-04-10',
    endDate: '2024-04-10',
    totalDays: 1,
    reason: 'Medical appointment',
    status: 'pending',
    submittedAt: '2024-04-05T10:00:00Z',
    attachments: [
      {
        id: 'leave-att-1',
        fileName: 'medical_certificate.pdf',
        fileType: 'pdf',
        fileUrl: '/uploads/medical_cert.pdf',
        uploadedAt: '2024-04-05T10:00:00Z'
      }
    ]
  }
];

export const mockITTickets: ITTicket[] = [
  {
    id: '1',
    userId: '1',
    title: 'Computer running slow',
    description: 'My computer has been running very slowly for the past few days. It takes a long time to open applications.',
    priority: 'medium',
    status: 'in_progress',
    category: 'hardware',
    submittedAt: '2024-01-15T10:00:00Z',
    assignedTo: '6'
  },
  {
    id: '2',
    userId: '1',
    title: 'Cannot access shared drive',
    description: 'I am unable to access the shared network drive. Getting permission denied error.',
    priority: 'high',
    status: 'open',
    category: 'network',
    submittedAt: '2024-01-16T14:30:00Z'
  }
];

export const mockHourVariances: HourVariance[] = [
  {
    userId: '1',
    userName: 'John Smith',
    department: 'Engineering',
    expectedHours: 160,
    actualHours: 142.5,
    variance: -17.5,
    variancePercentage: -10.9,
    month: '2024-01'
  },
  {
    userId: '2',
    userName: 'Sarah Johnson',
    department: 'Engineering',
    expectedHours: 160,
    actualHours: 165,
    variance: 5,
    variancePercentage: 3.1,
    month: '2024-01'
  }
];

export const mockTaskVariances: TaskVariance[] = [
  {
    taskId: '1',
    taskName: 'UI Design',
    projectName: 'Website Redesign',
    estimatedHours: 40,
    actualHours: 45,
    variance: 5,
    variancePercentage: 12.5,
    assignedUsers: ['1']
  },
  {
    taskId: '2',
    taskName: 'Frontend Development',
    projectName: 'Website Redesign',
    estimatedHours: 80,
    actualHours: 72,
    variance: -8,
    variancePercentage: -10,
    assignedUsers: ['1']
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    userId: '1',
    type: 'task_completed',
    title: 'Task Master!',
    description: 'Completed 10 tasks this week',
    points: 100,
    earnedAt: '2024-01-20T16:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    type: 'streak_milestone',
    title: 'Consistency King!',
    description: 'Maintained 15-day submission streak',
    points: 150,
    earnedAt: '2024-01-25T17:30:00Z'
  },
  {
    id: '3',
    userId: '1',
    type: 'early_bird',
    title: 'Early Bird!',
    description: 'Submitted timesheet before 9 AM',
    points: 25,
    earnedAt: '2024-01-30T08:45:00Z'
  }
];

export const mockLeaderboard: Leaderboard[] = [
  {
    userId: '5',
    userName: 'David Lee',
    department: 'Executive',
    totalPoints: 4500,
    level: 18,
    rank: 1,
    weeklyPoints: 320,
    monthlyPoints: 1200
  },
  {
    userId: '2',
    userName: 'Sarah Johnson',
    department: 'Engineering',
    totalPoints: 3200,
    level: 12,
    rank: 2,
    weeklyPoints: 280,
    monthlyPoints: 950
  },
  {
    userId: '6',
    userName: 'Alex Rodriguez',
    department: 'IT',
    totalPoints: 2800,
    level: 10,
    rank: 3,
    weeklyPoints: 250,
    monthlyPoints: 800
  },
  {
    userId: '1',
    userName: 'John Smith',
    department: 'Engineering',
    totalPoints: 2450,
    level: 8,
    rank: 4,
    weeklyPoints: 180,
    monthlyPoints: 650
  },
  {
    userId: '4',
    userName: 'Lisa Wong',
    department: 'Finance',
    totalPoints: 2100,
    level: 7,
    rank: 5,
    weeklyPoints: 160,
    monthlyPoints: 580
  },
  {
    userId: '3',
    userName: 'Mike Chen',
    department: 'Human Resources',
    totalPoints: 1800,
    level: 6,
    rank: 6,
    weeklyPoints: 140,
    monthlyPoints: 520
  }
];

export const currentUser: User = mockUsers[0]; // Default to employee for demo