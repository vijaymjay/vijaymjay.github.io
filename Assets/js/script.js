
document.getElementsByClassName("tablinks")[0].className += " active";

document.getElementsByClassName("tabcontent")[1].style.display = "none";

function openCity(evt, cityName) {

  
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "flex";
  evt.currentTarget.className += " active";
}

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

const ratingStars = [...document.getElementsByClassName("rating__star")];

function executeRating(stars) {
  const starClassActive = "rating__star fas fa-star";
  const starClassInactive = "rating__star far fa-star";
  const starsLength = stars.length;
  let i;
  stars.map((star) => {
    star.onclick = () => {
      i = stars.indexOf(star);

      if (star.className === starClassInactive) {
        for (i; i >= 0; --i) stars[i].className = starClassActive;
      } else {
        for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
      }
    };
  });
}
executeRating(ratingStars);

function gotoCourseDetail(){
  document.location.href='coursedetail.html';
}

function gotoCourse(){
  document.location.href='course.html';
}

