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
function showProjectsInModal(projects) {
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
    const containerIconDeleteProject = document.createElement('div')
    containerIconDeleteProject.classList.add('modal-image-delete')
    // Attribuer l'ID du projet à l'icône de suppression
    containerIconDeleteProject.setAttribute('id', `${project.id}`)
    const iconDeleteProject = document.createElement('i')
    iconDeleteProject.classList.add('fa-solid')
    iconDeleteProject.classList.add('fa-trash-can')
    // Rattacher au DOM
    containerIconDeleteProject.appendChild(iconDeleteProject)
    modalProjectContainer.appendChild(containerIconDeleteProject)

    // Rattacher la div contenant l'image et l'icône à la gallerie dans le DOM
    modalImageGallery.appendChild(modalProjectContainer)
  }
}
showProjectsInModal(projects)

// Gérer la suppression lors du clic sur l'icône poubelle
const deleteProject = document.querySelectorAll('.modal-image-delete')

for (let j = 0; j < deleteProject.length; j++) {
  deleteProject[j].addEventListener('click', (e) => {
    let projectId = e.currentTarget.id
    deleteProjectFromPortfolio(projectId)
  })

  async function deleteProjectFromPortfolio(projectId, projects) {
    await fetch(`http://localhost:5678/api/works/${projectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((response) => {
      console.log(response)
      // La demande de suppression a réussi
      if (response.ok === true) {
        // Vider la gallerie de la modale
        const modalImageGallery = document.querySelector('.modal-image-gallery')
        modalImageGallery.innerHTML = ''
        // Vider la gallerie de la page index.html
        const projectsGallery = document.querySelector('.gallery')
        projectsGallery.innerHTML = ''
        // Afficher les projets restants sans avoir à rafraîchir la page
        refreshProjects(projects)
      }
      // En cas d'erreur de requête
      else {
        // Message d'erreur
        const deleteError = document.createElement('p')
        const addPhotoButton = document.querySelector('.add-new-project')
        deleteError.insertBefore(deleteError, addPhotoButton)
        deleteError.innerText =
          "Erreur lors de la suppression du projet. Vérifiez que vous êtes bien connecté et que vous avez l'authorisation de modifier le portfolio."
      }
    })
  }
}

// Fonction qui refait un appel à l'API pour récupérer les projets restants après la suppression et met à jour leur affichage dans le portfolio de la page index.html ainsi que dans la galerie photo de la modale
import { showProjects } from './projects.js'
async function refreshProjects(projects) {
  const responseProjects = await fetch(`http://localhost:5678/api/works`)
  const projectsRefresh = await responseProjects.json()
  showProjectsInModal(projectsRefresh)
  showProjects(projectsRefresh)
}

// Le bouton "Ajouter une photo" ouvre la 2ème fenêtre modale pour ajouter un nouveau projet
