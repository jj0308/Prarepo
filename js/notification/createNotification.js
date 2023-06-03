window.onload = async function() {
  const role = localStorage.getItem("role") === "true";
  const userId = localStorage.getItem("userId");

  if (role) {
    const courses = await getCourses();
    populateCourseDropdown(courses);
  } else {
    const courses = await getCourses(userId);
    populateCourseDropdown(courses);
  }
};

async function getCourses(userId = null) {
  try {
    const url = userId
      ? `https://pra-api.onrender.com/courses/${userId}`
      : "https://pra-api.onrender.com/courses";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await response.json();

    const courses = data.map((item) => ({
      _id: item._id,
      name: item.name,
    }));

    return courses;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

function populateCourseDropdown(courses) {
  const courseSelect = document.getElementById("course");

  // Clear existing options
  courseSelect.innerHTML = "";

  // Create a default option with "Select a course" text
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a course";
  courseSelect.appendChild(defaultOption);

  if (courses.length > 0) {
    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course._id;
      option.textContent = course.name;
      courseSelect.appendChild(option);
    });
  } else {
    console.log("No courses available. Please create courses first.");
  }
}

async function handleCreateNotification(event) {
  event.preventDefault();

  const titleofNotification = document.getElementById("titleofNotification").value;
  const endDate = new Date(document.getElementById("endDate").value).toLocaleDateString('en-US');

  const courseSelect = document.getElementById("course");
  const selectedCourseId = courseSelect.value;
  const description = document.getElementById("description").value;

  const data = {
    name: titleofNotification,
    description: description,
    date_expired: endDate,
    user_id: localStorage.getItem("userId"),
    course_id: selectedCourseId,
  };

  for (const key in data) {
    if (!data[key] || data.date_expired == "Invalid Date") {
      createModalDialog("Fill all data")
      return;
    }
  }


  fetch("https://pra-api.onrender.com/notification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        createModalDialog("Successfully created", true);
      } else {
        response.text()
        .then(message => {
          // Display the error message to the user
          createModalDialog(message)
        })
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      createModalDialog("An error occurred. Please try again later.");
      
    });
}

document.getElementById("createNotification").addEventListener("submit", handleCreateNotification);
