// Cibler les éléments HTML du DOM :
// Le bouton "Modifier" pour ouvrir la modale
const buttonOpenEditor = document.querySelector('.portfolio-edit-button')

// La balise <aside> englobant les modales
const modalPortfolioEditor = document.querySelector('.modal-edit-portfolio')

// La 1ère fenêtre modale pour visualiser et supprimer les projets
const modalPortfolioEditorWindow = document.querySelector(
  '.modal-edit-gallery-window'
)

// La croix pour fermer la fenêtre modale
const closeEditor1 = document.querySelector('.close-modal1')
const closeEditor2 = document.querySelector('.close-modal2')

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
  if (
    e.target === closeEditor1 ||
    e.target === closeEditor2 ||
    e.target === modalPortfolioEditor
  ) {
    closeModal(e)
  }
  if (e.target === modalPortfolioEditorWindow) {
    return
  }
})

// Comportement de la 1ère fenêtre modale :

// Cibler la div du DOM qui affichera les projets
const modalImageGallery = document.querySelector('.modal-image-gallery')

// Cibler le bouton sur la première fenêtre modale pour ouvrir la deuxième
const buttonOpenAddProjectWindow = document.getElementById('add-new-project')

// Gérer l'affichage de la galerie d'images via l'API
import { projects } from './projects.js'
function showProjectsInModal(projects) {
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]

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

// Suppression des projets lors du clic sur l'icône de suppression
const deleteProject = document.querySelectorAll('.modal-image-delete')

for (let j = 0; j < deleteProject.length; j++) {
  deleteProject[j].addEventListener('click', (e) => {
    e.preventDefault()
    let projectId = e.currentTarget.id
    deleteProjectFromPortfolio(projectId)
  })
}

async function deleteProjectFromPortfolio(projectId) {
  await fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then((response) => {
    // La demande de suppression a réussi
    if (response.ok === true) {
      // Vider la gallerie de la modale
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
      deleteError.insertBefore(deleteError, buttonOpenAddProjectWindow)
      deleteError.innerText =
        "Erreur lors de la suppression du projet. Vérifiez que vous êtes bien connecté et que vous avez l'authorisation de modifier le portfolio."
    }
  })
}

// Fonction qui refait un appel à l'API pour récupérer les projets restants après la suppression et met à jour leur affichage dans le portfolio de la page index.html ainsi que dans la galerie photo de la modale
import { showProjects } from './projects.js'
async function refreshProjects(projects) {
  const responseProjects = await fetch(`http://localhost:5678/api/works`)
  projects = await responseProjects.json()
  showProjectsInModal(projects)
  showProjects(projects)
}

// Basculer entre la première et la deuxième fenêtre modale :

// Cibler la 2ème fenêtre modale
const modalPortfolioEditorAddProjectWindow = document.querySelector(
  '.modal-add-new-project-window'
)

// Cibler la flèche pour retourner à la première modale
const previousModalWindow = document.querySelector('.previous-modal')

// Ouvrir la 2ème modale depuis la 1ère modale
buttonOpenAddProjectWindow.addEventListener('click', () => {
  modalPortfolioEditorWindow.classList.add('modal-edit-gallery-window-hide')
  modalPortfolioEditorAddProjectWindow.classList.add(
    'modal-add-new-project-window-show'
  )
})

// Revenir à la 1ère modale depuis la 2ème modale
previousModalWindow.addEventListener('click', () => {
  modalPortfolioEditorAddProjectWindow.classList.remove(
    'modal-add-new-project-window-show'
  )
  modalPortfolioEditorWindow.classList.remove('modal-edit-gallery-window-hide')
})

// Comportement de la 2ème fenêtre modale :
// Cibler les éléments du DOM :
// La div pour ajouter une nouvelle photo
const newProjectImage = document.querySelector('.add-new-photo')
const newProjectImagePlaceholder = document.querySelector(
  '.add-new-photo-placeholder'
)

// Le bouton "+ Ajouter photo"
const buttonAddNewProjectPhoto = document.getElementById('button-upload-photo')
const inputAddNewProjectPhoto = document.getElementById('input-upload-photo')

// Le formulaire de création d'un nouveau projet
const formNewProject = document.forms.namedItem('add-new-project-form')

// Le champ de saisie pour le titre du projet
const newProjectTitle = document.getElementById('new-project-title')

// La liste déroulante pour la catégorie du projet
const newProjectCategory = document.getElementById('new-project-category')
let categoryOptionNone = document.createElement('option')
categoryOptionNone.innerHTML = ''
categoryOptionNone.setAttribute('value', '0')
newProjectCategory.appendChild(categoryOptionNone)

// Le bouton "Valider" pour envoyer le nouveau projet
const submitNewProject = document.getElementById('submit-new-project')

// Le bouton "+ Ajouter photo" appelle l'input file pour ouvrir le gestionnaire de dossiers et choisir une photo à uploader
buttonAddNewProjectPhoto.addEventListener('click', (e) => {
  inputAddNewProjectPhoto.click()
  e.preventDefault()
})

// Afficher la photo uploadée (et cacher les éléments précédents dans la div "add-new-photo")
const newProjectPhotoPreview = document.createElement('img')
inputAddNewProjectPhoto.addEventListener('change', () => {
  const uploadedPhoto = inputAddNewProjectPhoto.files[0]
  newProjectPhotoPreview.classList.add('new-photo-preview')
  newProjectPhotoPreview.src = URL.createObjectURL(uploadedPhoto)
  newProjectImagePlaceholder.classList.add('add-new-photo-placeholder-hide')
  newProjectImage.appendChild(newProjectPhotoPreview)
})

// Générer les catégories affichées dans la liste déroulante du formulaire (via l'API)
import { categories } from './projects.js'
for (let index = 0; index < categories.length; index++) {
  let categoryOption = document.createElement('option')
  categoryOption.innerText = categories[index].name
  categoryOption.setAttribute('value', `${categories[index].id}`)
  newProjectCategory.appendChild(categoryOption)
}

// Message d'erreur si le formulaire n'est pas correctement rempli
const addProjectError = document.createElement('p')
addProjectError.classList.add('form-error-message')
formNewProject.insertBefore(addProjectError, submitNewProject)

// Le bouton "Valider" change de couleur une fois que tous les champs et l'image sont renseignés
formNewProject.addEventListener('input', () => {
  if (
    newProjectCategory.value != 0 &&
    newProjectTitle.value != '' &&
    inputAddNewProjectPhoto.value != ''
  ) {
    submitNewProject.setAttribute('id', 'submit-new-project-complete')
  } else {
    submitNewProject.setAttribute('id', 'submit-new-project')
  }
})

// Création du FormData avec les informations des champs du formulaire
formNewProject.addEventListener('submit', (e) => {
  e.preventDefault()
  let formData = new FormData()
  formData.append('image', inputAddNewProjectPhoto.files[0])
  formData.append('title', newProjectTitle.value)
  formData.append('category', newProjectCategory.value)
  addNewProject(formData)
})

// Envoi à l'API du nouveau projet
async function addNewProject(formData) {
  await fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  }).then((response) => {
    // Réponse de l'API si l'envoi a réussi
    if (response.ok === true) {
      // Vider le formulaire d'ajout
      newProjectImagePlaceholder.classList.remove(
        'add-new-photo-placeholder-hide'
      )
      newProjectImage.removeChild(newProjectPhotoPreview)
      formNewProject.reset()

      // La modale se ferme
      modalPortfolioEditor.classList.remove('modal-edit-portfolio-show')

      // Le nouveau projet s'affiche dans la galerie (et dans la modale) sans avoir à rafraîchir la page
      const projectsGallery = document.querySelector('.gallery')
      projectsGallery.innerHTML = ''
      modalImageGallery.innerHTML = ''
      refreshProjects(projects)

      // La session de connexion a expirée (Error 401)
    } else if (response.status === 401) {
      // Message d'erreur
      addProjectError.innerText =
        "Erreur lors de l'ajout du nouveau projet. Assurez-vous d'être bien connecté."

      // Une autre erreur est survenue
    } else {
      // Message d'erreur
      addProjectError.innerText =
        "Erreur lors de l'ajout du nouveau projet. Assurez-vous d'avoir bien renseigné tous les champs."
    }
  })
}
