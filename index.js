
const searchParams = new URLSearchParams(window.location.search);
const searchName = searchParams.get('name');
const user_id = searchParams.get('user_id');

const baseURL = "http://localhost:3000";
let recipeURL = `${baseURL}/recipes`;
let userURL = `${baseURL}/users/`;




// Logic so we can still have the back-end controller return all recipes if we want

if (searchName) {
  recipeURL = `${recipeURL}?name=${searchName}`;
} else {
  recipeURL = `${recipeURL}?sample=9`;
}


const $section1 = document.querySelector('.section-1');
const $section2 = document.querySelector('.section-2');
const $section3 = document.querySelector('.section-3');

if (user_id) {
  userURL = `${userURL}/${user_id}`;
  fetch(userURL)
    .then(parseJSON)
    .then(displayLogOut);
} else {
  fetch(userURL)
    .then(parseJSON)
    .then(displayLogIn);
}


fetch(recipeURL)
    .then(parseJSON)
    .then(displayPage);
  

function parseJSON(response) {
  return response.json();
}

function displayPage(recipes) {
  recipes
    .map(recipeToElement)
    .forEach(showRecipes);
  
  if (searchName) {
    document.getElementById('ingredients_input').placeholder = searchName;
  }
  return recipes;
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

// What is this?

window.scroll({
  top: 100,
  left: 100,
  behavior: 'smooth'
});

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
  $submit.value = 'Submit';

  $form.append(addUserOptions($select, users), $submit);
    
  $section1.append($form);
  return users;
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

function displayLogOut(user) {
  const $p = document.createElement('p');
  $p.innerHTML = `Logged in as <a href=user.html?user_id=${user.id}>${user.user_name}</a> <br> <a href='index.html'>Log Out</a>`;

  $section1.append($p);

  return user;
}