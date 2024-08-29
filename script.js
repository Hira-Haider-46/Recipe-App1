const searchBtn = document.getElementById('search-btn');
const resultContainer = document.getElementById('result-container');
const recipeContainer = document.getElementById('recipe-container');
const searchContainer = document.getElementById('search-container');
const result = document.getElementById('result');
const recipeText = document.getElementById('recipe-text');
const showRecipeBtn = document.getElementById('show-recipe');
const backToSearchBtn = document.getElementById('back-to-search');
const backToResultBtn = document.getElementById('back-to-result');
const userInput = document.getElementById('user-input');
const api = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

let allMeals = [];

window.onload = async () => {
    const response = await fetch(api);
    const data = await response.json();
    allMeals = data.meals;
    displayAllRecipes(allMeals);
}

function displayAllRecipes(meals) {
    const allRecipesContainer = document.getElementById('all-recipes');
    allRecipesContainer.innerHTML = '';
    allRecipesContainer.style.display = 'grid';

    meals.forEach(meal => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
        <img src="${meal.strMealThumb}" alt="Meal Image">
        <h2>${meal.strMeal}</h2>
        <h4>${meal.strArea}</h4>
        `;
        allRecipesContainer.appendChild(recipeCard);
        recipeCard.addEventListener('click', () => displayRecipeDetails(meal));
    });

    searchContainer.appendChild(allRecipesContainer);
}

searchBtn.addEventListener('click', () => {
    const searchText = userInput.value;

    if (searchText.length == 0) {
        document.querySelector('.search').nextElementSibling.style.display = 'block';
        return;
    }

    document.querySelector('.search').nextElementSibling.style.display = 'none';

    const filteredMeals = allMeals.filter(meal => meal.strMeal.includes(searchText));

    if (filteredMeals.length == 0) {
        result.innerHTML = '<h3>No meals found</h3>';
        searchContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        return;
    }

    document.getElementById('all-recipes').style.display = 'none';
    displayAllRecipes(filteredMeals);
});

function displayRecipeDetails(meal) {
    result.innerHTML = `
        <img src="${meal.strMealThumb}" alt="meal img">
        <div class="details">
            <h2>${meal.strMeal}</h2>
            <h4>${meal.strArea}</h4>
        </div>
        <div>
            <ul id="ingredient-list"></ul>
        </div>
    `;

    const ingredientList = document.getElementById('ingredient-list');
    ingredientList.innerHTML = '';
    let count = 1;

    for (let i in meal) {
        if (i.startsWith("strIngredient") && meal[i]) {
            const ingredient = meal[i];
            const measure = meal[`strMeasure${count}`];
            count++;
            const listItem = document.createElement('li');
            listItem.textContent = `${measure} ${ingredient}`;
            ingredientList.appendChild(listItem);
        }
    }

    searchContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    showRecipeBtn.style.display = 'block';

    showRecipeBtn.onclick = () => {
        recipeText.textContent = meal.strInstructions;
        resultContainer.style.display = 'none';
        recipeContainer.style.display = 'block';
    };
}

backToResultBtn.addEventListener('click', () => {
    recipeContainer.style.display = 'none';
    resultContainer.style.display = 'block';
});

backToSearchBtn.addEventListener('click', () => {
    resultContainer.style.display = 'none';
    searchContainer.style.display = 'block';
    document.getElementById('all-recipes').style.display = 'grid';
    displayAllRecipes(allMeals);
});