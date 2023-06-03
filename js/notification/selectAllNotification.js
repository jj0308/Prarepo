window.onload = function () {
  let userId = localStorage.getItem("userId");

  if ("true" === localStorage.getItem("role")) {
    getNotificationAdmin();
  } else {
    getNotification();
  }
};
function getNotificationAdmin() {
  const url = `https://pra-api.onrender.com/notifications`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      appendNotificationsToTableAdmin(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getNotification() {
  const userId = localStorage.getItem("userId");
  const url = `https://pra-api.onrender.com/notifications/${userId}`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      appendNotificationsToTableAdmin(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function createNotificationRowAdmin(notification) {
  console.log(notification);
  const notificationTr = document.createElement("tr");
  const titleTd = document.createElement("td");
  const course = document.createElement("td");
  const descriptionTd = document.createElement("td");
  const dateCreatedTd = document.createElement("td");
  const endDateTd = document.createElement("td");
  const creatorTd = document.createElement("td");
  const optionsTd = document.createElement("td");
  const optionsWrapperDiv = document.createElement("div");

  titleTd.textContent = notification.name;

  course.textContent = notification.course.course_name;
  descriptionTd.textContent = notification.description;
  dateCreatedTd.textContent = formatDate(notification.date_created);
  endDateTd.textContent = formatDate(notification.date_expired);
  creatorTd.textContent = notification.user.full_name;

  optionsWrapperDiv.innerHTML = `
    <a id="btnEdit" href="/html/notification/editNotification.html?id=${notification._id}">
      <img src="/media/edit.png" alt="Edit"/>
    </a>
    <a id="btnDelete" href="#!" data-notification-id="${notification._id}">
      <img src="/media/delete.png" alt="Delete" />
    </a>
  `;

  optionsTd.appendChild(optionsWrapperDiv);

  notificationTr.appendChild(titleTd);
  notificationTr.appendChild(course);
  notificationTr.appendChild(descriptionTd);
  notificationTr.appendChild(dateCreatedTd);
  notificationTr.appendChild(endDateTd);
  notificationTr.appendChild(creatorTd);
  notificationTr.appendChild(optionsTd);

  

  return notificationTr;
}

function appendNotificationsToTableAdmin(notifications) {
  const table = document.querySelector(".container table");
  notifications.forEach((notification) => {
    const notificationRow = createNotificationRowAdmin(notification);
    table.appendChild(notificationRow);
    let deleteButtons = document.querySelectorAll("#btnDelete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", deleteNotification);
  });
  });
}
function formatDate(dateString) {
  let date = new Date(dateString);
  return (
    String(date.getDate()).padStart(2, "0") +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    date.getFullYear()
  );
}
function deleteNotification(event) {
  event.preventDefault();
  let notificationId;
  if (event.target.tagName === "IMG") {
    notificationId = event.target.parentElement.dataset.notificationId;
  } else {
    notificationId = event.target.dataset.notificationId;
  }

  fetch(`https://pra-api.onrender.com/notification/${notificationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.ok) {
        createModalDialog("Successfully deleted", true);
      } else {
        response.text()
        .then(message => {
          // Display the error message to the user
          createModalDialog(message)
        })      }
    })
    .catch((error) => {
      console.error("Error:", error);
      createModalDialog("An error occurred. Please try again later.");
    });
}
