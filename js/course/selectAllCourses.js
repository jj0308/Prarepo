let userId = localStorage.getItem("userId");

if ("true" === localStorage.getItem("role")) {
  const courseTable = document.getElementById("courseTable");
  const tableHeaderRow = courseTable.querySelector("tr");
  const optionsHeader = document.createElement("th");
  optionsHeader.textContent = "Options";
  tableHeaderRow.appendChild(optionsHeader);  
  addCreateCourseLink();

  getCoursesAdmin();
} else {
  getCourses();
}

function createCourseRow(course) {
  const courseTr = document.createElement("tr");
  const courseNameTd = document.createElement("td");
  const courseLecturerTd = document.createElement("td");

  courseNameTd.textContent = course.name;
  courseLecturerTd.textContent = course.user.full_name;

  courseTr.appendChild(courseNameTd);
  courseTr.appendChild(courseLecturerTd);

  return courseTr;
}
function appendCoursesToTable(courses) {
  const table = document.querySelector(".container table");

  courses.forEach((course) => {
    const courseRow = createCourseRow(course);
    table.appendChild(courseRow);
  });
}

function getCourses() {
  const url = `https://pra-api.onrender.com/courses/${userId}`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const table = document.querySelector(".container table");

      if (data.length > 0) {
        data.forEach((course) => {
          console.log(course)
          const courseRow = createCourseRow(course);
          table.appendChild(courseRow);
        });
      } else {
        const noCoursesMsg = document.createElement("p");
        noCoursesMsg.textContent = "No courses available.";
        document.querySelector(".container").appendChild(noCoursesMsg);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}


function createCourseRowAdmin(course) {
  const courseTr = document.createElement("tr");
  const courseNameTd = document.createElement("td");
  const courseLecturerTd = document.createElement("td");
  const courseOptionsTd = document.createElement("td");
  const optionsWrapperDiv = document.createElement("div");

  courseNameTd.textContent = course.name;
  if (course.user && course.user.full_name != undefined) {
    courseLecturerTd.textContent = course.user.full_name;
  } else {
    courseLecturerTd.textContent = "Currently unassigned";
  }

  if (localStorage.getItem("role") === "true") {
    optionsWrapperDiv.innerHTML = `
      <a id="btnEdit" href="/html/course/editCourse.html?id=${course._id}">
        <img src="/media/edit.png" alt=""/>
      </a>
      <a id="btnDelete" href="#!" data-course-id="${course._id}">
        <img src="/media/delete.png" alt="Delete" />
      </a>
    `;
  }

  courseOptionsTd.appendChild(optionsWrapperDiv);

  courseTr.appendChild(courseNameTd);
  courseTr.appendChild(courseLecturerTd);
  courseTr.appendChild(courseOptionsTd);

  return courseTr;
}

function addCreateCourseLink() {
  const titleWrapper = document.getElementById("titleWrapper");
  const createCourseLink = document.createElement("a");
  createCourseLink.id = "createCourse";
  createCourseLink.href = "/html/course/createCourse.html";
  createCourseLink.textContent = "Create Course";
  titleWrapper.appendChild(createCourseLink);
}

function appendCoursesToTableAdmin(courses) {
  const table = document.querySelector(".container table");
  courses.forEach((course) => {
    const courseRow = createCourseRowAdmin(course);
    table.appendChild(courseRow);
  });
}
function getCoursesAdmin() {
  const isAdmin = localStorage.getItem("role") === "true";

  if (isAdmin) {
    const url = "https://pra-api.onrender.com/courses";
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        appendCoursesToTableAdmin(data);
        addDeleteEventListeners();
      });
  } else {
    getCourses();
  }
}

function addDeleteEventListeners() {
  const deleteButtons = document.querySelectorAll("#btnDelete");
  deleteButtons.forEach((button) => {
    const courseId = button.getAttribute("data-course-id");
    button.addEventListener("click", () => {
      deleteCourse(courseId);
    });
  });
}

function deleteCourse(courseId) {
  const url = `https://pra-api.onrender.com/course/${courseId}`;
  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.ok) {
createModalDialog("Successfully deleted", true)} 
else {
  createModalDialog(response.text);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      createModalDialog("An error occurred. Please try again later.");
    });
}
