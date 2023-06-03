// Fetch and populate the lecturer dropdown list
function populateLecturers() {
  fetch("https://pra-api.onrender.com/lecturers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const lecturerDropdown = document.getElementById("lecturer");
      
      // Clear the lecturer dropdown options
      lecturerDropdown.innerHTML = "";
      
      // Create an empty default option
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Select a lecturer";
      lecturerDropdown.appendChild(defaultOption);
      
      // Populate the dropdown with lecturer options
      data.forEach((lecturer) => {
        const option = document.createElement("option");
        option.value = lecturer._id;
        option.textContent = lecturer.first_name + " " + lecturer.last_name;
        lecturerDropdown.appendChild(option);
      });
    })
    .catch((err) => console.log(err));
}

window.onload = function () {
  const lecturerDropdown = document.getElementById("lecturer");
  
  // Clear the lecturer dropdown
  lecturerDropdown.innerHTML = "";


  populateLecturers();
  
  const createCourseForm = document.getElementById("createCourse");
  createCourseForm.addEventListener("submit", function (event) {
    if (lecturerDropdown.value === "") {
      event.preventDefault();
    }
  });

};
async function handleCreateCourse(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const lecturer = document.getElementById("lecturer").value;

  

  const data = {
    name: name,
    user_id: lecturer,
  };

  for (const key in data) {
    if (!data[key]) {
      createModalDialog("Fill all data")
      return;
    }
  }


  fetch(`https://pra-api.onrender.com/course`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      console.log(response);
      if (response.ok) {
        createModalDialog("Successfully created", true);
      } else {
        response.text()
        .then(message => {
          // Display the error message to the user
          createModalDialog(message)
        })      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      createModalDialog("An error occurred. Please try again later.");
    });
}

async function getLecturers() {
  try {
    const response = await fetch("https://pra-api.onrender.com/lecturers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await response.json();

    let lecturers = data.map((item) => ({
      _id: item._id,
      full_name: item.first_name + " " + item.last_name,
    }));

    return lecturers;
  } catch (error) {
    console.error("Error:", error);
  }
}
document
  .getElementById("createCourse")
  .addEventListener("submit", handleCreateCourse);
