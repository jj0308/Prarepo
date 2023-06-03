let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
window.notificationId = params.get("id");

window.onload = async function () {
  console.log(notificationId);
  const response = await fetch(`https://pra-api.onrender.com/notification/${window.notificationId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
  });

  const data = await response.json();
  document.getElementById("titleofNotification").value = data.name;
  document.getElementById("endDate").value = new Date(data.date_expired).toISOString().split('T')[0]
  ;
  document.getElementById("description").value = data.description;

  const role = localStorage.getItem("role") === "true";
  const userId = localStorage.getItem("userId");

  if (role) {
    const courses = await getCourses();
    populateCourseDropdown(courses, data.course_id);
  } else {
    const userCourses = await getCourses(userId);
    populateCourseDropdown(userCourses, data.course_id);
  }

  document.getElementById("createNotification").addEventListener("submit", (event) =>
    handleEditNotification(event, window.notificationId)
  );
};

function populateCourseDropdown(courses, selectedCourseId) {
  const courseSelect = document.getElementById("course");

  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course._id;
    option.textContent = course.name;
    if (course._id === selectedCourseId) {
      option.selected = true;
    }
    courseSelect.appendChild(option);
  });
}
async function handleEditNotification(event, notificationId) {
  event.preventDefault();

  const title = document.getElementById("titleofNotification").value;
  const endDate = new Date(document.getElementById("endDate").value).toLocaleDateString('en-US');
  const description = document.getElementById("description").value;
  const courseId = document.getElementById("course").value;

  const role = localStorage.getItem("role") === "true";
  const userId = localStorage.getItem("userId");

  let courses;
  if (role) {
    courses = await getCourses();
  } else {
    courses = await getCourses(userId);
  }

  const courseObj = courses.find((c) => c._id === courseId);


  const data = {
    name: title,
    description: description,
    course_id: courseObj._id,
    date_expired: endDate,
  };
  
  for (const key in data) {
    if (!data[key]) {
      createModalDialog("Fill all data")
      return;
    }
  }
  if (data.date_expired == "Invalid Date") {
    createModalDialog("Invalid date");
    return;
  }

  try {
    const response = await fetch(
      `https://pra-api.onrender.com/notification/${notificationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      createModalDialog("Successfully updated", true);
    } else {
      response.text()
      .then(message => {
        // Display the error message to the user
        createModalDialog(message)
      })    }
  } catch (error) {
    console.error("Error:", error);
    createModalDialog("An error occurred. Please try again later.");
  }
}
async function getCourses(userId = null) {
  try {
    let url = "https://pra-api.onrender.com/courses";
    if (userId) {
      url = `https://pra-api.onrender.com/courses/${userId}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching courses");
    }

    const data = await response.json();

    let courses = data.map((item) => ({
      _id: item._id,
      name: item.name,
    }));

    return courses;
  } catch (error) {
    console.error("Error:", error);
  }
}
