
const searchParams = new URLSearchParams(window.location.search);
const searchName = searchParams.get('name');
let user_id = searchParams.get('user_id');

if (user_id == 'null') { user_id = null; }

const baseURL = "http://localhost:3000";
let recipeURL = `${baseURL}/recipes`;
let userURL = `${baseURL}/users`;

if (searchName) { recipeURL = `${recipeURL}?name=${searchName}`; } else { recipeURL = `${recipeURL}?sample=9`; }
if (user_id) { userURL = `${userURL}/${user_id}`; }

const $header = document.querySelector('header');
const $section1 = document.querySelector('.section-1');
const $section2 = document.querySelector('.section-2');
const $section3 = document.querySelector('.section-3');

fetch(userURL)
.then(parseJSON)
.then(displayUserNav);

fetch(recipeURL)
.then(parseJSON)
.then(displayPage);


function parseJSON(response) {
  return response.json();
}

function displayUserNav(userResponse) {
  if (user_id) {
    displayLogOut(userResponse);
  } else {
    displayLogIn(userResponse);
  }
  displayProfileLink();
}

function displayPage(recipes) {
  displayFilterByName();
  
  recipes
    .map(recipeToElement)
    .forEach(showRecipes);
  
  addSearchPlaceholder();

  return recipes;
}

function displayProfileLink() {
  const $a = document.createElement('a');
  $a.href = `user.html?user_id=${user_id}`;
  $a.textContent = 'Go to Profile';

  const $div = document.querySelector('div.nav-bar');

  if (user_id) {
    $div.append($a);
  }
}

function displayFilterByName() {
  const $filterForm = document.querySelector('.form');
  $filterForm.innerHTML = `  
      <label for='ingredients_input' id='ingredients_header'>Let's Begin! Search Recipes below:</label>
      <input type='text' id='ingredients_input' name='name'>
      <input type="hidden" name='user_id' value=${user_id}>
      <input type="submit" id='submit' value="Submit">
    `;
}

// Render filtered or sampled recipes

    
function recipeToElement(recipe) {
  const $h3 = document.createElement('h3');
  $h3.innerHTML  = `<a href ='show.html?recipe_id=${recipe.id}&user_id=${user_id}'>${recipe.name}</a>`;

  const $r_image = document.createElement('img');
  $r_image.src = recipe.image;
  $r_image.onclick = function() {
    window.location.href = `show.html?recipe_id=${recipe.id}&user_id=${user_id}`;
  };

  return createRecipeCard($h3, $r_image);
}

function createRecipeCard($h3, $r_image) {
  const $recipeCard = document.createElement('div');
  
  $recipeCard.className = 'cards';
  $recipeCard.append($h3, $r_image);

  return $recipeCard;
}

function showRecipes($recipeCard) {
  $section3.append($recipeCard);
}

function addSearchPlaceholder() {
  const $ingredient_input = document.getElementById('ingredients_input');
  if (searchName) {
     $ingredient_input.placeholder = searchName;

     $ingredient_input.onclick = function() {
       $ingredient_input.placeholder = '';
     };
  }
}

// What is this?

// window.scroll({
//   top: 100,
//   left: 100,
//   behavior: 'smooth'
// });

// User controls in header


function displayLogIn(users) {
  const $form = document.createElement('form');
  $form.innerHTML = `
    <form class='login_form' id='login'>
      <label for='login_input'>Username:</label>
    </form>`;

  const $select = document.createElement('select');
  $select.name = 'user_id';
  const $submit = document.createElement('input');

  $submit.type = 'submit';
  $submit.value = 'Login';

  $form.append(addUserOptions($select, users), $submit);

  const $user_nav = document.getElementById('user-nav');
    
  $user_nav.append($form);
  return users;
}

function displayLogOut(user) {
  const $li1 = document.createElement('li');
  const $li2 = document.createElement('li');

  $li1.textContent = `Logged in as ${user.user_name}`;
  $li2.innerHTML = `<a href='index.html'>Log Out</a>`;

  const $user_nav = document.getElementById('user-nav');
  const $ul = document.createElement('ul');
  $ul.append($li1, $li2);
  $user_nav.append($ul);

  return user;
}

function addUserOptions($select, users) {
  $userOptions = users.map(userToOption);
  $userOptions.forEach($userOption => $select.append($userOption));

  return $select;
}

function userToOption(user) {
  const $option = document.createElement('option');
  $option.innerText = user.user_name;
  $option.value = user.id;
  return $option;
}
