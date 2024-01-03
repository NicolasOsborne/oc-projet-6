// Cibler les éléments HTML du DOM :
// Le bouton "Modifier" pour ouvrir la modale
const buttonOpenEditor = document.querySelector('.portfolio-edit-button')

// La balise <aside> de la modale
const modalPortfolioEditor = document.querySelector('.modal-edit-portfolio')

// La croix pour fermer la fenêtre modale
const closeEditor = document.querySelector('.fa-xmark')

// Ouvrir la modale d'édition du portfolio au clic sur le bouton "modifier"
buttonOpenEditor.addEventListener('click', () => {
  modalPortfolioEditor.classList.add('modal-edit-portfolio-show')
})

// Gérer la fermeture de la fenêtre modale au clic sur la croix
closeEditor.addEventListener('click', () => {
  modalPortfolioEditor.classList.remove('modal-edit-portfolio-show')
})
// Gérer la fermeture de la fenêtre modale au clic en dehors de la fenêtre

// Gérer l'affichage de la galerie d'images via l'API
import { projects } from './projects.js'
function showProjects(projects) {
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]
    // Cibler la div du DOM qui affichera les projets
    const modalImageGallery = document.querySelector('.modal-image-gallery')

    // Créer la balise pour l'image du projet
    const modalProjectImage = document.createElement('img')
    modalProjectImage.src = project.imageUrl

    // Rattacher les images à la gallerie dans le DOM
    modalImageGallery.appendChild(modalProjectImage)
  }
}
showProjects(projects)

// Ajouter les icônes de suppression sur chaque image

// Gérer la suppression lors du clic sur l'icône poubelle

// Le bouton "Ajouter une photo" ouvre la 2ème fenêtre modale pour ajouter un nouveau projet
