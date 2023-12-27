// Récupérer les projets éventuellement stockés dans le localStorage

// Récupération des projets depuis le fichier JSON de l'API
const reponse = await fetch(`http://localhost:5678/api/works`)
const projects = await reponse.json()

// Générer les projets sur la page web
function showProjects(projects) {
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]

    // Cibler la div du DOM qui affichera les projets
    const projectsGallery = document.querySelector('.gallery')

    // Créer une balise dédiée à un projet
    const projectArticle = document.createElement('article')

    // Création des différentes balises attribuées à un projet
    // La balise pour l'image du projet
    const projectImage = document.createElement('img')
    projectImage.src = project.imageUrl

    // La balise pour le titre du projet
    const projectTitle = document.createElement('p')
    projectTitle.innerText = project.title

    // Rattachement des balises image et title à l'article dans le DOM
    projectArticle.appendChild(projectImage)
    projectArticle.appendChild(projectTitle)

    // Rattachement de l'article à la gallerie dans le DOM
    projectsGallery.appendChild(projectArticle)
  }
}

showProjects(projects)

// Filtrage des projets

// Ajout des boutons de façon dynamique via l'API

// Récupération des catégories depuis le fichier JSON de l'API
const reponseCategories = await fetch(`http://localhost:5678/api/categories`)
const categories = await reponseCategories.json()

// Générer les boutons

const filters = document.querySelector('.filters')
function showFilters(categories) {
  // Bouton "Tous"
  let buttonFilterAll = document.createElement('button')
  buttonFilterAll.innerText = 'Tous'
  buttonFilterAll.setAttribute('id', 'filter-all')
  buttonFilterAll.classList.add('button-selected')
  filters.appendChild(buttonFilterAll)
  // Autres boutons
  for (let j = 0; j < categories.length; j++) {
    let filterButton = document.createElement('button')
    filterButton.innerText = categories[j].name
    filterButton.setAttribute('id', `filter-${categories[j].id}`)
    filterButton.classList.add('button-unselected')
    filters.appendChild(filterButton)
  }
}
showFilters(categories)

// Filtrer les projets par catégorie

// Filtrer tous les projets
const filterAllProjects = document.querySelector('#filter-all')
filterAllProjects.addEventListener('click', () => {
  document.querySelector('.gallery').innerHTML = ''
  showProjects(projects)
})

// Filtrer les projets "Objets"
const filterObjets = document.querySelector('#filter-1')
filterObjets.addEventListener('click', () => {
  const projectsObjets = projects.filter(function (project) {
    return project.categoryId === 1
  })
  document.querySelector('.gallery').innerHTML = ''
  showProjects(projectsObjets)
})

// Filtrer les projets "Appartements"
const filterAppartements = document.querySelector('#filter-2')
filterAppartements.addEventListener('click', () => {
  const projectsAppartements = projects.filter(function (project) {
    return project.categoryId === 2
  })
  document.querySelector('.gallery').innerHTML = ''
  showProjects(projectsAppartements)
})

// Filtrer les projets "Hôtels & restaurants"
const filterHotelsAndRestaurants = document.querySelector('#filter-3')
filterHotelsAndRestaurants.addEventListener('click', () => {
  const projectsHotelsAndRestaurants = projects.filter(function (project) {
    return project.categoryId === 3
  })
  document.querySelector('.gallery').innerHTML = ''
  showProjects(projectsHotelsAndRestaurants)
})

// Gestion des couleurs des boutons selon s'ils sont sélectionnés ou non
const filtersButtons = document.querySelectorAll('.filters button')
for (let index = 0; index < filtersButtons.length; index++) {
  filtersButtons[index].onclick = function () {
    let selectedButton = document.querySelectorAll('.button-selected')[0]
    if (this.className == 'button-unselected') {
      if (selectedButton) selectedButton.className = 'button-unselected'
      this.className = 'button-selected'
    }
  }
}

/*
// Filtrer les projets en ayant ajouté les bouton en HTML (non-dynamique)

// Cibler les différents boutons de filtres dans le DOM
const filterAllProjects = document.querySelector('#filter-all')
const filterObjets = document.querySelector('#filter-objets')
const filterAppartements = document.querySelector('#filter-appartements')
const filterHotelsAndRestaurants = document.querySelector(
  '#filter-hotels-restaurants'
)

// Filtrer tous les projets
filterAllProjects.addEventListener('click', () => {
  document.querySelector('.gallery').innerHTML = ''
  showProjects(projects)
})

// Filtrer les projets "Objets"
filterObjets.addEventListener('click', () => {
  const projectsObjets = projects.filter(function (project) {
    return project.categoryId === 1
  })
  document.querySelector('.gallery').innerHTML = ''
  showProjects(projectsObjets)
})

// Filtrer les projets "Appartements"
filterAppartements.addEventListener('click', () => {
  const projectsAppartements = projects.filter(function (project) {
    return project.categoryId === 2
  })
  document.querySelector('.gallery').innerHTML = ''
  showProjects(projectsAppartements)
})

// Filtrer les projets "Hôtels & Restaurants"
filterHotelsAndRestaurants.addEventListener('click', () => {
  const projectsHotelsAndRestaurants = projects.filter(function (project) {
    return project.categoryId === 3
  })
  document.querySelector('.gallery').innerHTML = ''
  showProjects(projectsHotelsAndRestaurants)
})

// Gestion des couleurs des boutons selon s'ils sont sélectionnés ou non
const filtersButtons = document.querySelectorAll('.filters button')
for (let index = 0; index < filtersButtons.length; index++) {
  filtersButtons[index].onclick = function () {
    let selectedButton = document.querySelectorAll('.button-selected')[0]
    if (this.className == 'button-unselected') {
      if (selectedButton) selectedButton.className = 'button-unselected'
      this.className = 'button-selected'
    }
  }
}
*/
