const search_bar = document.querySelector(".search input")
const search_button = document.querySelector(".search img")
let x;
const card_holder = document.querySelector('.card_holder')
const modal = document.querySelector('#modal-container')

const get_detail = async (ingredient_name) => {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=" + ingredient_name)
    if (response.status !== 200) {
        throw new Error("No Result Found")
    }
    const data = await response.json()
    return data;
}

const get_recipe = async (id) => {
    const recipe_details = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    if (recipe_details.status !== 200) {
        throw new Error("No Result Found")
    }
    const receipe_detail = await recipe_details.json()
    return receipe_detail;

}



const show = () => {
    card_holder.innerHTML = "";
    card_holder.textContent = "";
    get_detail(search_bar.value)
        .then(data => {
            card_holder.style.justifyContent = "space-between"
            data.meals.forEach(food => {
                // create element
                const card = document.createElement('div')
                const image = document.createElement('img')
                const name = document.createElement('div')
                const button = document.createElement('div')
                const id = document.createElement('div')

                //Add Value
                image.setAttribute("src", food.strMealThumb);
                name.textContent = food.strMeal;
                button.textContent = "Get Recipe";
                id.textContent = food.idMeal;

                //append
                card.appendChild(image);
                card.appendChild(name);
                card.appendChild(button);
                card.appendChild(id)
                card_holder.appendChild(card);

                //add classses

                id.classList.add('id')
                card.classList.add('card');
                name.classList.add('food_name')
                button.classList.add('recipe_button')

            })
        })
        .catch(err => {
            const error = document.createElement("div")
            error.textContent = "No Result Found!!"
            card_holder.appendChild(error)
            error.classList.add("error")
            card_holder.style.justifyContent = "center"
        }
        )

}

search_button.onclick = () => {
    show();

}

search_bar.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        show();
    }
})

card_holder.onclick = (e) => {
    if (e.target.classList.contains("recipe_button")) {
        get_recipe(e.target.parentNode.querySelector('.id').textContent).then(recipe => {
            document.querySelector('.name').textContent = recipe.meals[0].strMeal
            document.querySelector('.recipe').textContent = recipe.meals[0].strInstructions
            document.querySelector('.modal img').setAttribute("src", recipe.meals[0].strMealThumb)
            document.querySelector('.modal a').setAttribute("href", recipe.meals[0].strYoutube)
            modal.style.zIndex = 1;
            modal.style.opacity = 1;
            document.querySelector("body").style.overflow = "hidden"
            
        })
        .catch(err => {
            
        })
        
    }
}

document.querySelector('.close').onclick = () => {
    modal.style.opacity = 0;
    modal.style.zIndex = -1;
    document.querySelector("body").style.overflow = "auto"
}

