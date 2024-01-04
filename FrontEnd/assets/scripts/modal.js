// Cibler les éléments HTML du DOM :
// Le bouton "Modifier" pour ouvrir la modale
const buttonOpenEditor = document.querySelector('.portfolio-edit-button')

// La balise <aside> de la modale
const modalPortfolioEditor = document.querySelector('.modal-edit-portfolio')

// La fenêtre modale
const modalPortfolioEditorWindow = document.querySelector(
  '.modal-edit-gallery-window'
)

// La croix pour fermer la fenêtre modale
const closeEditor = document.querySelector('.fa-xmark')

// Fonction d'ouverture de la modale
function openModal(e) {
  e.preventDefault()
  modalPortfolioEditor.classList.add('modal-edit-portfolio-show')
}

// Fonction de fermeture de la modale
function closeModal(e) {
  e.preventDefault()
  modalPortfolioEditor.classList.remove('modal-edit-portfolio-show')
}

// Ouvrir la modale d'édition du portfolio au clic sur le bouton "modifier"
buttonOpenEditor.addEventListener('click', (e) => {
  openModal(e)
})

// Fermer la modale d'édition du portfolio au clic sur la croix X ou en dehors de la fenêtre
modalPortfolioEditor.addEventListener('click', (e) => {
  if (e.target === closeEditor || e.target === modalPortfolioEditor) {
    closeModal(e)
  }
  if (e.target === modalPortfolioEditorWindow) {
    return
  }
})

// Gérer l'affichage de la galerie d'images via l'API
import { projects } from './projects.js'
function showProjects(projects) {
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]
    // Cibler la div du DOM qui affichera les projets
    const modalImageGallery = document.querySelector('.modal-image-gallery')

    // Créer la balise pour l'image du projet
    const modalProjectContainer = document.createElement('div')
    modalProjectContainer.classList.add('modal-project-container')
    const modalProjectImage = document.createElement('img')
    modalProjectImage.src = project.imageUrl
    // Rattacher l'image au container dans le DOM
    modalProjectContainer.appendChild(modalProjectImage)

    // Créer l'icône de suppression
    const deleteProject = document.createElement('div')
    deleteProject.classList.add('modal-image-delete')
    const iconDeleteProject = document.createElement('i')
    iconDeleteProject.classList.add('fa-solid')
    iconDeleteProject.classList.add('fa-trash-can')
    // Rattacher au DOM
    deleteProject.appendChild(iconDeleteProject)
    modalProjectContainer.appendChild(deleteProject)

    // Rattacher la div contenant l'image et l'icône à la gallerie dans le DOM
    modalImageGallery.appendChild(modalProjectContainer)
  }
}
showProjects(projects)

// Gérer la suppression lors du clic sur l'icône poubelle

// Le bouton "Ajouter une photo" ouvre la 2ème fenêtre modale pour ajouter un nouveau projet
