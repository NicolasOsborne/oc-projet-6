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
import { projects, showProjects } from './projects.js'
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
  deleteProjectFromPortfolio()
}
showProjectsInModal(projects)

// Suppression d'un projet dans la modale

function deleteProjectFromPortfolio() {
  const deleteProject = document.querySelectorAll('.modal-image-delete')
  deleteProject.forEach((containerIconDeleteProject) => {
    containerIconDeleteProject.addEventListener('click', (e) => {
      e.preventDefault()
      let projectId = e.currentTarget.id
      fetch(`http://localhost:5678/api/works/${projectId}`, {
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
          console.log('Le projet a bien été supprimé')
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
    })
  })
}

// Fonction qui refait un appel à l'API pour récupérer les projets restants après la suppression et met à jour leur affichage dans le portfolio de la page index.html ainsi que dans la galerie photo de la modale

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

// Message d'erreur pour l'upload de la photo
const imageUploadError = document.createElement('p')
imageUploadError.classList.add('photo-accepted-error')
newProjectImagePlaceholder.appendChild(imageUploadError)

// Afficher la photo uploadée (et cacher les éléments précédents dans la div "add-new-photo")
const newProjectPhotoPreview = document.createElement('img')
inputAddNewProjectPhoto.addEventListener('change', () => {
  const uploadedPhoto = inputAddNewProjectPhoto.files[0]
  // Si l'image est de la bonne taille et au bon format
  if (verifyImageType(uploadedPhoto) && verifyImageSize(uploadedPhoto)) {
    // Elle est ajoutée au preview à la place du placeholder
    newProjectPhotoPreview.classList.add('new-photo-preview')
    newProjectPhotoPreview.src = URL.createObjectURL(uploadedPhoto)
    newProjectImagePlaceholder.classList.add('add-new-photo-placeholder-hide')
    newProjectImage.appendChild(newProjectPhotoPreview)
  } else {
    // Afficher un message d'erreur
    imageUploadError.classList.add('photo-accepted-error-show')
  }
})

// Vérifier que l'image choisie est au bon format (jpg ou png)
let acceptedImageType = ['image/jpeg', 'image/jpg', 'image/png']
function verifyImageType(uploadedPhoto) {
  for (let i = 0; i < acceptedImageType.length; i++) {
    if (uploadedPhoto.type === acceptedImageType[i]) {
      return true
    }
  }
  imageUploadError.innerText =
    "Ce format d'image n'est pas accepté (jpg ou png)."
  return false
}

// Vérifier que l'image choisie est à la bonne taille (4mo maximum)
function verifyImageSize(uploadedPhoto) {
  const uploadedImageSize = uploadedPhoto.size / 1024 / 1024
  if (uploadedImageSize <= 4) {
    return true
  }
  imageUploadError.innerText =
    'Cette image est trop volumineuse (taille supérieure à 4mo).'
  return false
}

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

  // Si tout le formulaire est bien rempli
  if (
    newProjectCategory.value != 0 &&
    newProjectTitle.value != '' &&
    inputAddNewProjectPhoto.value != ''
  ) {
    let formData = new FormData()
    formData.append('image', inputAddNewProjectPhoto.files[0])
    formData.append('title', newProjectTitle.value)
    formData.append('category', newProjectCategory.value)
    addNewProject(formData)
  }

  // Si il n'y a pas d'image uploadée
  else if (inputAddNewProjectPhoto.value == '') {
    newProjectImage.classList.add('input-error')
    addProjectError.classList.add('form-error-message-show')
    addProjectError.innerText =
      'Veuillez choisir une photo à ajouter pour le nouveau projet'
  }

  // Si il n'y a pas de titre saisi
  else if (newProjectTitle.value == '') {
    newProjectTitle.classList.add('input-error')
    newProjectImage.classList.remove('input-error')
    newProjectCategory.classList.remove('input-error')
    addProjectError.classList.add('form-error-message-show')
    addProjectError.innerText =
      'Veuillez saisir un titre pour le nouveau projet.'
  }

  // Si il n'y a pas de catégorie sélectionnée
  else if (newProjectCategory.value == 0) {
    newProjectCategory.classList.add('input-error')
    newProjectImage.classList.remove('input-error')
    newProjectTitle.classList.remove('input-error')
    addProjectError.classList.add('form-error-message-show')
    addProjectError.innerText =
      'Veuillez selectionner une catégorie pour le nouveau projet.'
  }
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
      imageUploadError.classList.remove('photo-accepted-error-show')
      addProjectError.classList.remove('form-error-message-show')

      const clearAllInputErrors = document.querySelectorAll('.input-error')
      for (let k = 0; k < clearAllInputErrors.length; k++) {
        clearAllInputErrors[k].classList.remove('input-error')
      }

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
      addProjectError.classList.add('form-error-message-show')
      addProjectError.innerText =
        "Erreur lors de l'ajout du nouveau projet. Veuillez vous reconnecter et réessayer."

      // Une autre erreur innatendue est survenue (Error 500)
    } else {
      // Message d'erreur
      addProjectError.classList.add('form-error-message-show')
      addProjectError.innerText =
        "Erreur innatendue lors de l'ajout du nouveau projet. Veuillez réessayer."
    }
  })
  console.log('Le nouveau projet a bien été ajouté')
}
