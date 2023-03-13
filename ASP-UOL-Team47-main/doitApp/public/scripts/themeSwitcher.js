/**
 * Function to switch the background color of body 
 * element when theme toggle icon is clicked. 
 * use window.localstorage() to store and check for current theme
 * Code is a modified example from https://www.w3schools.com
 */
const changeTheme = () => {
   const element = document.body;
   element.classList.toggle('theme');
}