// --- Shared course data ---
const availableCourses = [
  {
    crn: "12345",
    code: "CS1321",
    name: "Program Problem Solving",
    days: "MW",
    time: "9:00–10:15",
    prof: "Nguyen",
    structure: "In-Person",
    max: 30,
    seats: 0,
    prereq: "None",
    description: "Covers the basics of algorithms, logic, and programming."
  },
  {
    crn: "21212",
    code: "MATH1190",
    name: "Calculus I",
    days: "TR",
    time: "11:00–12:15",
    prof: "Wells",
    structure: "In-Person",
    max: 20,
    seats: 0,
    prereq: "Precalculus",
    description: "Introduction to limits, derivatives, and integrals."
  },
  {
    crn: "23456",
    code: "MATH2202",
    name: "Calculus II",
    days: "TR",
    time: "1:00–2:15",
    prof: "Roberts",
    structure: "Hybrid",
    max: 25,
    seats: 0,
    prereq: "Calculus I",
    description: "Continuation of Calculus I, including integrals and series."
  },
  {
    crn: "34567",
    code: "ENG1102",
    name: "English Composition II",
    days: "F",
    time: "10:00–12:00",
    prof: "Taylor",
    structure: "Online",
    max: 40,
    seats: 0,
    prereq: "English Composition I",
    description: "Survey of contemporary literary movements and authors."
  },
  {
    crn: "45678",
    code: "BIO1107",
    name: "Biology I",
    days: "MW",
    time: "2:00–3:15",
    prof: "Allen",
    structure: "In-Person",
    max: 28,
    seats: 0,
    prereq: "None",
    description: "Introduction to cellular biology and the scientific method."
  }
];

// --- Utilities ---
const LS_KEY = "registeredCourses";

function loadRegisteredCourses() {
  const saved = localStorage.getItem(LS_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveRegisteredCourses(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function hasCompletedCourse(code) {
  const completedCourses = ["ENGL1101", "MATH1113", "DANC1107"]; // history.html mock
  return completedCourses.includes(code);
}

// --- Render Functions ---
function renderCourseTable() {
  const courseList = document.getElementById("course-list");
  if (!courseList) return;

  courseList.innerHTML = availableCourses.map(course => {
    const seatsFilled = course.seats ?? 0;
    const seatsText = `${seatsFilled}/${course.max}`;
    return `
      <tr>
        <td>${course.crn}</td>
        <td>${course.code} - ${course.name}</td>
        <td>${course.description}</td>
        <td>${course.prof}</td>
        <td>${course.structure}</td>
        <td>${seatsText}</td>
        <td>${course.days}</td>
        <td>${course.time}</td>
        <td>${course.prereq}</td>
        <td><input type="checkbox" name="register" value="${course.crn}" /></td>
      </tr>
    `;
  }).join("");
}

function renderScheduleTable() {
  const currentSchedule = document.getElementById("current-schedule");
  if (!currentSchedule) return;

  const registeredCourses = loadRegisteredCourses();
  currentSchedule.innerHTML = registeredCourses.map(course => `
    <tr>
      <td>${course.crn}</td>
      <td>${course.code} - ${course.name}</td>
      <td>${course.description}</td>
      <td>${course.prof}</td>
      <td>${course.structure}</td>
      <td>${course.max}</td>
      <td>${course.days}</td>
      <td>${course.time}</td>
      <td>${course.prereq}</td>
      <td><input type="checkbox" name="drop" value="${course.crn}" /></td>
    </tr>
  `).join("");
}

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

// --- Events ---
document.addEventListener("DOMContentLoaded", () => {
  renderCourseTable();
  renderScheduleTable();

  const registerForm = document.getElementById("register-form");
  const dropForm = document.getElementById("drop-form");
  const registerMsg = document.getElementById("register-message");

  registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = Array.from(document.querySelectorAll('input[name="register"]:checked')).map(i => i.value);
    const allRegistered = loadRegisteredCourses();
    const newCourses = [];
    let errorShown = false;
  
    for (const course of availableCourses) {
      if (!selected.includes(course.crn)) continue;
      if (allRegistered.some(r => r.crn === course.crn)) continue;
  
      if (course.code === "MATH2202" && !hasCompletedCourse("MATH1190")) {
        registerMsg.textContent = "❌ You must complete Calculus I before registering for Calculus II.";
        errorShown = true;
        continue;
      }
  
      if ((course.seats ?? 0) >= course.max) {
        registerMsg.textContent = `❌ ${course.code} is full.`;
        errorShown = true;
        continue;
      }
  
      course.seats++;
      newCourses.push(course);
    }
  
    const updated = [...allRegistered, ...newCourses];
    saveRegisteredCourses(updated);
    renderScheduleTable();
    renderCourseTable();
  
    if (!errorShown && newCourses.length > 0) {
      registerMsg.textContent = "✅ Registration updated.";
    }
  });
  
  dropForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const drops = Array.from(document.querySelectorAll('input[name="drop"]:checked')).map(i => i.value);
    let registered = loadRegisteredCourses();
    registered = registered.filter(c => !drops.includes(c.crn));

    for (const crn of drops) {
      const course = availableCourses.find(c => c.crn === crn);
      if (course && course.seats > 0) {
        course.seats--;
      }
    }

    saveRegisteredCourses(registered);
    renderScheduleTable();
    renderCourseTable();
    registerMsg.textContent = "🗑️ Dropped selected classes.";
  });

  renderScheduleFromStorage();
  renderCurrentScheduleForHistory();
  renderPaymentSummary();

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

  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  });

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
