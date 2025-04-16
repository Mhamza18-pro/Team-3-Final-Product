// --- Shared course data ---
const availableCourses = [
  { crn: "12345", code: "CS1321", name: "Program Problem Solving", days: "MW", time: "9:00–10:15", prof: "Nguyen" },
  { crn: "23456", code: "MATH2202", name: "Calculus II", days: "TR", time: "1:00–2:15", prof: "Roberts" },
  { crn: "34567", code: "ENG1102", name: "English Composition II", days: "F", time: "10:00–12:00", prof: "Taylor" },
  { crn: "45678", code: "BIO1107", name: "Biology I", days: "MW", time: "2:00–3:15", prof: "Allen" },
];

// --- LocalStorage Utilities ---
const LS_KEY = "registeredCourses";

function loadRegisteredCourses() {
  const saved = localStorage.getItem(LS_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveRegisteredCourses(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// --- Register Page Logic ---
function renderCourseTable() {
  const courseList = document.getElementById("course-list");
  if (!courseList) return;

  courseList.innerHTML = availableCourses.map(course => `
    <tr>
      <td>${course.crn}</td>
      <td>${course.code} - ${course.name}</td>
      <td>${course.days}</td>
      <td>${course.time}</td>
      <td>${course.prof}</td>
      <td><input type="checkbox" name="register" value="${course.crn}" /></td>
    </tr>
  `).join("");
}

function renderScheduleTable() {
  const currentSchedule = document.getElementById("current-schedule");
  if (!currentSchedule) return;

  const registeredCourses = loadRegisteredCourses();
  currentSchedule.innerHTML = registeredCourses.map(course => `
    <tr>
      <td>${course.crn}</td>
      <td>${course.code} - ${course.name}</td>
      <td>${course.days}</td>
      <td>${course.time}</td>
      <td>${course.prof}</td>
      <td><input type="checkbox" name="drop" value="${course.crn}" /></td>
    </tr>
  `).join("");
}

// --- Schedule Page Logic ---
function renderScheduleFromStorage() {
  const tableBody = document.getElementById("schedule-table-body");
  if (!tableBody) return;

  const courses = loadRegisteredCourses();
  tableBody.innerHTML = courses.map(course => `
    <tr>
      <td>${course.crn}</td>
      <td>${course.code} - ${course.name}</td>
      <td>${course.days}</td>
      <td>${course.time}</td>
      <td>${course.prof}</td>
    </tr>
  `).join("");
}

// --- Form Event Handling ---
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const dropForm = document.getElementById("drop-form");
  const registerMsg = document.getElementById("register-message");

  // Registration page behavior
  renderCourseTable();
  renderScheduleTable();

  registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = Array.from(document.querySelectorAll('input[name="register"]:checked')).map(i => i.value);
    const allRegistered = loadRegisteredCourses();
    const newCourses = availableCourses.filter(
      c => selected.includes(c.crn) && !allRegistered.some(r => r.crn === c.crn)
    );
    const updated = [...allRegistered, ...newCourses];
    saveRegisteredCourses(updated);
    renderScheduleTable();
    registerMsg.textContent = "✅ Registration updated.";
  });

  dropForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const drops = Array.from(document.querySelectorAll('input[name="drop"]:checked')).map(i => i.value);
    let registered = loadRegisteredCourses();
    registered = registered.filter(c => !drops.includes(c.crn));
    saveRegisteredCourses(registered);
    renderScheduleTable();
    registerMsg.textContent = "🗑️ Dropped selected classes.";
  });

  // Schedule page behavior
  renderScheduleFromStorage();
});
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      const errorMsg = document.getElementById("login-error");

      if (username === "student1" && password === "password") {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "home.html";
      } else {
        errorMsg.textContent = "Invalid credentials. Try 'student1' / 'password'";
      }
    });
  }
});
function renderCurrentScheduleForHistory() {
  const tableBody = document.getElementById("history-current");
  if (!tableBody) return;

  const registered = loadRegisteredCourses();
  tableBody.innerHTML = registered.map(course => `
    <tr>
      <td>${course.crn}</td>
      <td>${course.code} - ${course.name}</td>
      <td>${course.days}</td>
      <td>${course.time}</td>
      <td>${course.prof}</td>
    </tr>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCurrentScheduleForHistory();
});
document.addEventListener("DOMContentLoaded", () => {
  const chatBtn = document.getElementById("chat-btn");
  const chatResponse = document.getElementById("chat-response");
  const apptForm = document.getElementById("appointment-form");
  const apptMsg = document.getElementById("appointment-msg");

  chatBtn?.addEventListener("click", () => {
    chatResponse.textContent = "😕 No advisors available right now. Please schedule an appointment below.";
  });

  apptForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    apptMsg.textContent = "✅ Your appointment request has been submitted!";
    apptForm.reset();
  });
});
function renderPaymentSummary() {
  const tableBody = document.getElementById("payment-course-list");
  const balance = document.getElementById("total-balance");
  const payButton = document.getElementById("pay-now");
  const payMsg = document.getElementById("payment-msg");

  if (!tableBody || !balance || !payButton) return;

  const registered = loadRegisteredCourses();
  const costPerCourse = 400;
  const total = registered.length * costPerCourse;

  tableBody.innerHTML = registered.map(course => `
    <tr>
      <td>${course.crn}</td>
      <td>${course.code} - ${course.name}</td>
      <td>${course.prof}</td>
      <td>$${costPerCourse.toFixed(2)}</td>
    </tr>
  `).join("");

  balance.textContent = `$${total.toFixed(2)}`;

  payButton.addEventListener("click", () => {
    payMsg.textContent = "✅ Payment successful! Thank you.";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPaymentSummary();
});

