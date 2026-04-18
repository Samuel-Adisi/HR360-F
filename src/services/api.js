import axios from "axios";

// UI/UX mode: fully disconnect from the backend.
// We keep the API surface (axios instance) so the screens render,
// but all requests are answered with deterministic mock responses.
const BACKEND_ENABLED = false;

const normalizeUrl = (url) =>
  String(url || "").replace(/^https?:\/\/[^/]+/, "");

const mockJsonResponse = (config, { data, status = 200 } = {}) => ({
  data,
  status,
  statusText: "OK",
  headers: {},
  config,
  request: {},
});

const MOCK_USER = {
  username: "Samuel",
  full_name: "Demo User",
  role: "employee",
  /** Shown on dashboard when set; omit or null to use initials */
  avatar:
    "https://ui-avatars.com/api/?name=Demo+User&size=128&background=0f766e&color=fff",
};

const MOCK_DEPARTMENTS = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Marketing" },
  { id: 3, name: "Design" },
  { id: 4, name: "Finance" },
  { id: 5, name: "HR" },
];

const MOCK_EMPLOYEES = [
  {
    id: 1,
    employee_id: "EMP001",
    first_name: "Sarah",
    last_name: "Mitchell",
    full_name: "Sarah Mitchell",
    email: "sarah.mitchell@email.com",
    phone: "+1 555 0101",
    department_name: "Engineering",
    department: { name: "Engineering" },
    position: "Senior React Native Developer",
    designation: "Senior React Native Developer",
    employment_type: "full_time",
    hire_date: "2024-01-15",
    date_joined: "2024-01-15",
    is_active: true,
    active: true,
    status: "Active",
    photo: "",
    profile_picture: "",
    avatar: "",
  },
  {
    id: 2,
    employee_id: "EMP002",
    first_name: "James",
    last_name: "Rodriguez",
    full_name: "James Rodriguez",
    email: "james.rodriguez@email.com",
    phone: "+1 555 0202",
    department_name: "Marketing",
    department: { name: "Marketing" },
    position: "Product Marketing Manager",
    designation: "Product Marketing Manager",
    employment_type: "full_time",
    hire_date: "2023-06-01",
    date_joined: "2023-06-01",
    is_active: true,
    active: true,
    status: "Active",
    photo: "",
    profile_picture: "",
    avatar: "",
  },
  {
    id: 3,
    employee_id: "EMP003",
    first_name: "Priya",
    last_name: "Sharma",
    full_name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+1 555 0303",
    department_name: "Finance",
    department: { name: "Finance" },
    position: "Financial Analyst",
    designation: "Financial Analyst",
    employment_type: "full_time",
    hire_date: "2022-09-10",
    date_joined: "2022-09-10",
    is_active: false,
    active: false,
    status: "Inactive",
    photo: "",
    profile_picture: "",
    avatar: "",
  },
];

const mockAdapter = async (config) => {
  const method = String(config?.method || "get").toLowerCase();
  const url = normalizeUrl(config?.url);

  // Auth
  if (method === "post" && url === "/api/login") {
    return mockJsonResponse(config, {
      data: {
        access_token: "mock_access_token",
        refresh_token: "mock_refresh_token",
        user: MOCK_USER,
        role: "employee",
        message: "Login successful",
      },
      status: 200,
    });
  }

  if (method === "post" && url === "/api/register") {
    return mockJsonResponse(config, { data: { message: "Account created" } });
  }

  // Face auth
  if (
    method === "get" &&
    (url === "/api/face/status" || url === "/api/face/status/")
  ) {
    return mockJsonResponse(config, {
      data: { has_face_auth: false },
      status: 200,
    });
  }

  if (
    method === "post" &&
    (url === "/api/face/register" || url === "/api/face/register/")
  ) {
    return mockJsonResponse(config, {
      data: { message: "Face registered" },
      status: 201,
    });
  }

  if (
    method === "delete" &&
    (url === "/api/face/delete" || url === "/api/face/delete/")
  ) {
    return mockJsonResponse(config, {
      data: { message: "Face deleted" },
      status: 200,
    });
  }

  if (
    method === "post" &&
    (url === "/api/face/login" || url === "/api/face/login/")
  ) {
    return mockJsonResponse(config, {
      data: {
        access_token: "mock_access_token",
        refresh_token: "mock_refresh_token",
        user: MOCK_USER,
        message: "Face login successful",
      },
      status: 200,
    });
  }

  // Employees
  if (method === "get" && url.startsWith("/api/employees/")) {
    // Detail endpoint: `/api/employees/{id}`
    const idMatch = url.match(/\/api\/employees\/(\d+)(\/|$)/);
    if (idMatch) {
      const id = Number(idMatch[1]);
      const emp = MOCK_EMPLOYEES.find((e) => e.id === id) || MOCK_EMPLOYEES[0];
      return mockJsonResponse(config, { data: emp, status: 200 });
    }

    // List endpoint: `/api/employees/` (+ query params in URL)
    // Important: do NOT treat sub-resources (e.g. `/department/`) as list.
    if (
      url === "/api/employees/" ||
      url === "/api/employees" ||
      url.startsWith("/api/employees/?")
    ) {
      return mockJsonResponse(config, {
        data: {
          results: MOCK_EMPLOYEES,
          next: null,
          count: MOCK_EMPLOYEES.length,
        },
      });
    }
  }

  if (
    method === "get" &&
    (url === "/api/employees/department/" ||
      url === "/api/employees/department")
  ) {
    return mockJsonResponse(config, { data: MOCK_DEPARTMENTS, status: 200 });
  }

  if (
    method === "get" &&
    (url === "/api/employees/statistics/" ||
      url === "/api/employees/statistics")
  ) {
    return mockJsonResponse(config, {
      data: { total_employees: MOCK_EMPLOYEES.length, active: 2, in_active: 1 },
      status: 200,
    });
  }

  // Projects
  if (method === "get" && url.startsWith("/api/projects/")) {
    // Detail endpoint: `/api/projects/{id}/`
    const idMatch = url.match(/\/api\/projects\/(\d+)(\/|$|\?)/);
    if (idMatch) {
      const id = Number(idMatch[1]);
      return mockJsonResponse(config, {
        data: {
          id,
          name: `Project ${id}`,
          client_name: "Acme Corp",
          status: "Active",
          progress: 55,
          deadline: "2025-12-01",
          category: "Engineering",
          start_date: "2025-01-10",
        },
        status: 200,
      });
    }

    // List endpoint: `/api/projects/` (+ query params)
    return mockJsonResponse(config, {
      data: [
        {
          id: 1,
          name: "Project A",
          client_name: "Acme Corp",
          status: "Active",
          progress: 42,
          deadline: "2025-12-01",
          category: "Engineering",
          start_date: "2025-01-10",
        },
        {
          id: 2,
          name: "Project B",
          client_name: "Globex",
          status: "On Hold",
          progress: 18,
          deadline: "2025-10-15",
          category: "Marketing",
          start_date: "2025-03-01",
        },
      ],
      status: 200,
    });
  }

  if (
    method === "post" &&
    (url === "/api/projects/" || url === "/api/projects")
  ) {
    return mockJsonResponse(config, {
      data: { message: "Project created" },
      status: 201,
    });
  }

  if (method === "put" && url.startsWith("/api/projects/")) {
    return mockJsonResponse(config, {
      data: { message: "Project updated" },
      status: 200,
    });
  }

  if (method === "delete" && url.startsWith("/api/projects/")) {
    return mockJsonResponse(config, {
      data: { message: "Project deleted" },
      status: 200,
    });
  }

  // Fallback: succeed with an empty response so screens can render.
  return mockJsonResponse(config, { data: {}, status: 200 });
};

const apiConfig = {
  baseURL: "http://localhost:8000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

if (!BACKEND_ENABLED) {
  apiConfig.adapter = mockAdapter;
}

const api = axios.create(apiConfig);

export default api;
