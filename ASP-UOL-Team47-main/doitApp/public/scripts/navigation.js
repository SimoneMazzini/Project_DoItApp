function setActive(navID) {
  var listOfId = [
    "home-nav",
    "leaderboard-nav",
    "about-nav",
    "account-nav",
  ];
  for (var i = 0; i < listOfId.length; i++) {
    if (listOfId[i] === navID) {
      document.getElementById(listOfId[i]).className = "active-link";
    } else {
      document.getElementById(listOfId[i]).className = "disable-active-link";
    }
  }
}
const toggelBtn= document.getElementById('toggleBtn');
const navLink=document.getElementsByClassName('nav-link');
toggelBtn.addEventListener('click', () =>{
    for(let i=0; i< navLink.length; i++)
    {
        navLink[i].classList.toggle('active');
    }
})


