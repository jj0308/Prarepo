// function deleteCourse(event) {
//   event.preventDefault();
//   let courseId;
//   if (event.target.tagName === "IMG") {
//     courseId = event.target.parentElement.dataset.courseId;
//   } else {
//     courseId = event.target.dataset.courseId;
//   }

//   fetch(`https://pra-api.onrender.com/course/${courseId}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "x-access-token": localStorage.getItem("token"),
//     },
//   })
//     .then((response) => {
//       if (response.ok) {
//         alert("Course deleted successfully.");
//         location.reload();
//       } else {
//         alert("Failed to delete course. Please try again.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       alert("An error occurred. Please try again later.");
//     });
// }
