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

    // Rattachement de l'article à la gallerie dans le DOM
    projectsGallery.appendChild(projectArticle)

    // Rattachement des balises image et title à l'article dans le DOM
    projectArticle.appendChild(projectImage)
    projectArticle.appendChild(projectTitle)
  }
}

showProjects(projects)

// Filtrer les projets
// Cibler les différents boutons de filtres
const filterAllProjects = document.querySelector('.filters-all')
const filterObjets = document.querySelector('.filters-objets')
const filterAppartements = document.querySelector('.filters-appartements')
const filterHotelsAndRestaurants = document.querySelector(
  '.filters-hotels-restaurants'
)

// Afficher tous les projets
filterAllProjects.addEventListener('click', () => {
  document.querySelector('.gallery').innerHTML = ''
  showProjects(projects)
})

// Afficher les projets "Objets"
filterObjets.addEventListener('click', () => {
  const projectsObjets = projects.filter(function (project) {
    return project.category.id === 1
  })
  document.querySelector('.gallery').innerHTML = ''
  showProjects(projectsObjets)
})

// Afficher les projets "Appartements"
filterAppartements.addEventListener('click', () => {
  const projectsAppartements = projects.filter(function (project) {
    return project.category.id === 2
  })
  document.querySelector('.gallery').innerHTML = ''
  showProjects(projectsAppartements)
})

// Afficher les projets "Hôtels & Restaurants"
filterHotelsAndRestaurants.addEventListener('click', () => {
  const projectsHotelsAndRestaurants = projects.filter(function (project) {
    return project.category.id === 3
  })
  document.querySelector('.gallery').innerHTML = ''
  showProjects(projectsHotelsAndRestaurants)
})
