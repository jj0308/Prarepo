function handleRegister(event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  };

  for (const key in data) {
    if (!data[key]) {
      createModalDialog("Fill all data")
      return;
    }
  }

  const token = localStorage.getItem("token");

  fetch("https://pra-backend.onrender.com/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
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

document
  .getElementById("createLecturer")
  .addEventListener("submit", handleRegister);
