// Récupérer les projets éventuellement stockés dans le localStorage

// Récupération des projets depuis le fichier JSON de l'API
const responseProjects = await fetch(`http://localhost:5678/api/works`)
export const projects = await responseProjects.json()

// Générer les projets sur la page web
export function showProjects(projects) {
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
const responseCategories = await fetch(`http://localhost:5678/api/categories`)
const categories = await responseCategories.json()

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

// Filtrer les projets

// Changer la couleur des boutons de filtres selon s'ils sont sélectionnés ou non
function updateButtonColor(e) {
  const previouslySelectedButton = document.querySelector('.button-selected')
  previouslySelectedButton.classList.remove('button-selected')
  previouslySelectedButton.classList.add('button-unselected')
  e.target.classList.remove('button-unselected')
  e.target.classList.add('button-selected')
}

// Montrer tous les projets
const filterAllProjects = document.querySelector('#filter-all')
filterAllProjects.addEventListener('click', (e) => {
  document.querySelector('.gallery').innerHTML = ''
  showProjects(projects)
  // Changer la couleur du bouton
  updateButtonColor(e)
})

// Filtrer les projets par catégorie
for (let index = 0; index < categories.length; index++) {
  const filterProjectsByCategory = document.querySelector(
    `#filter-${categories[index].id}`
  )
  filterProjectsByCategory.addEventListener('click', (e) => {
    const projectsFiltered = projects.filter(function (project) {
      return project.categoryId === index + 1
    })

    document.querySelector('.gallery').innerHTML = ''
    showProjects(projectsFiltered)

    // Changer la couleur des boutons de filtres selon s'ils sont sélectionnés ou non
    updateButtonColor(e)
  })
}
