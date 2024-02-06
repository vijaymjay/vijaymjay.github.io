


// const starClassActive = "rating__star fas fa-star";
// const starClassInactive = "rating__star far fa-star";

// const allstars = document.querySelectorAll('.rating');

// function executeRating(allstars) {

// allstars.forEach((rating) => {
//   [...rating.children].forEach((star, i) => {
//     star.onclick = function () {
//       let currentstar = i + 1;
//       [...rating.children].forEach((star, j) => {
//           if (currentstar >= j + 1) {
//               star.innerHTML = starClassActive;
//           } else {
//               star.innerHTML = starClassInactive;
//           }
//       })
//     }
//   });
// });
// }

// executeRating(allstars);



function gotoCourseDetail(){
  document.location.href='coursedetail.html';
}

function gotoCourse(){
  document.location.href='course.html';
}



function closeLesson(){

  const mydivclass = document.querySelector('.lessonbodyleftouter');

  if(mydivclass.classList.contains('ld-focus-sidebar-collapsed')) {

   
    document.getElementById("ld-focus-sidebar").classList.remove("ld-focus-sidebar-collapsed");
  
}
else {
 
  document.getElementById("ld-focus-sidebar").classList.add("ld-focus-sidebar-collapsed");
 
}

 
 }





