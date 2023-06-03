window.onload = function () {
  let url = new URL(window.location.href);
  let params = new URLSearchParams(url.search);
  let userId = params.get("id");

  fetch(`https://pra-api.onrender.com/lecturer/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("firstName").value = data.first_name;
      document.getElementById("lastName").value = data.last_name;
      document.getElementById("email").value = data.email;
   
    })
    .catch((error) => {
      console.error("Error:", error);
      console.log("An error occurred. Please try again later.");
    });

  // Attach event listener to the form
  document
    .getElementById("editLecturer")
    .addEventListener("submit", handleEditLecturer);
};

function handleEditLecturer(event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
 
  let url = new URL(window.location.href);
  let params = new URLSearchParams(url.search);
  let userId = params.get("id");
  const data = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password
  };
  console.log(data);

  if (!data.first_name|| !data.last_name || !data.email) {
        createModalDialog("Fill all data");
        return;
  }

  fetch(`https://pra-api.onrender.com/lecturer/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      console.log(response);
      if (response.ok) {
        createModalDialog("Successfully updated", true);
      } else {
        response.text()
        .then(message => {
          // Display the error message to the user
          createModalDialog(message)
        })      
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      createModalDialog("An error occurred. Please try again later.");
    });
}