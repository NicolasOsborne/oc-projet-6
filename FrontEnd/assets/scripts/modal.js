////////////////////////////////////////////////////
// Cibler et récupérer les éléments HTML du DOM : //
////////////////////////////////////////////////////

// Sur la page index.html :
// Le bouton "Modifier" pour ouvrir la modale
const buttonOpenEditor = document.querySelector('.portfolio-edit-button')

// La balise <aside> englobant les modales
const modalPortfolioEditor = document.querySelector('.modal-edit-portfolio')

// Sur la 1ère fenêtre modale (pour visualiser et supprimer les projets) :
// La 1ère fenêtre
const modalPortfolioEditorWindowDeleteProject = document.querySelector(
  '.modal-edit-gallery-window'
)

// La gallerie qui affiche les projets dans la modale
const modalImageGallery = document.querySelector('.modal-image-gallery')

// Sur la 2ème fenêtre modale (pour ajouter des projets) :
// La 2ème fenêtre :
const modalPortfolioEditorWindowAddProject = document.querySelector(
  '.modal-add-new-project-window'
)

// La div pour ajouter et afficher la nouvelle image du projet
const newProjectImage = document.querySelector('.add-new-image')
const newProjectImagePlaceholder = document.querySelector(
  '.add-new-image-placeholder'
)

// Le bouton "+ Ajouter photo"
const buttonAddNewProjectImage = document.getElementById('button-upload-image')
const inputAddNewProjectImage = document.getElementById('input-upload-image')

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

//////////////////////////////////////////////////////////////////
// Ouvrir, fermer et basculer entre les deux fenêtres modales : //
//////////////////////////////////////////////////////////////////

// Le bouton sur la 1ère fenêtre modale pour ouvrir la 2ème
const buttonOpenAddProjectWindow = document.getElementById('add-new-project')

// La flèche pour retourner à la 1ère modale
const previousModalWindow = document.querySelector('.previous-modal')

// La croix pour fermer les fenêtres modales
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
  if (e.target === modalPortfolioEditorWindowDeleteProject) {
    return
  }
})

// Ouvrir la 2ème modale depuis la 1ère modale
buttonOpenAddProjectWindow.addEventListener('click', () => {
  modalPortfolioEditorWindowDeleteProject.classList.add(
    'modal-edit-gallery-window-hide'
  )
  modalPortfolioEditorWindowAddProject.classList.add(
    'modal-add-new-project-window-show'
  )
})

// Revenir à la 1ère modale depuis la 2ème modale
previousModalWindow.addEventListener('click', () => {
  modalPortfolioEditorWindowAddProject.classList.remove(
    'modal-add-new-project-window-show'
  )
  modalPortfolioEditorWindowDeleteProject.classList.remove(
    'modal-edit-gallery-window-hide'
  )
})

//////////////////////////////////////////////
// Comportement de la 1ère fenêtre modale : //
//////////////////////////////////////////////

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

//////////////////////////////////////////////
// Comportement de la 2ème fenêtre modale : //
//////////////////////////////////////////////

// Le bouton "+ Ajouter photo" appelle l'input file pour ouvrir le gestionnaire de dossiers et choisir une image à uploader
buttonAddNewProjectImage.addEventListener('click', (e) => {
  inputAddNewProjectImage.click()
  e.preventDefault()
})

// Message d'erreur pour l'upload de l'image
const imageUploadError = document.createElement('p')
imageUploadError.classList.add('image-accepted-error')
newProjectImagePlaceholder.appendChild(imageUploadError)

// Afficher l'image uploadée (et cacher les éléments précédents dans la div "add-new-image")
const newProjectImagePreview = document.createElement('img')
inputAddNewProjectImage.addEventListener('change', () => {
  const uploadedImage = inputAddNewProjectImage.files[0]
  // Si l'image est de la bonne taille et au bon format
  if (verifyImageType(uploadedImage) && verifyImageSize(uploadedImage)) {
    // Elle est ajoutée au preview à la place du placeholder
    newProjectImagePreview.classList.add('new-image-preview')
    newProjectImagePreview.src = URL.createObjectURL(uploadedImage)
    newProjectImagePlaceholder.classList.add('add-new-image-placeholder-hide')
    newProjectImage.appendChild(newProjectImagePreview)
  } else {
    // Afficher un message d'erreur
    imageUploadError.classList.add('image-accepted-error-show')
  }
})

// Vérifier que l'image choisie est au bon format (jpg ou png)
let acceptedImageType = ['image/jpeg', 'image/jpg', 'image/png']
function verifyImageType(uploadedImage) {
  for (let i = 0; i < acceptedImageType.length; i++) {
    if (uploadedImage.type === acceptedImageType[i]) {
      return true
    }
  }
  imageUploadError.innerText =
    "Ce format d'image n'est pas accepté (jpg ou png)."
  return false
}

// Vérifier que l'image choisie est à la bonne taille (4mo maximum)
function verifyImageSize(uploadedImage) {
  const uploadedImageSize = uploadedImage.size / 1024 / 1024
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
    inputAddNewProjectImage.value != ''
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
    inputAddNewProjectImage.value != ''
  ) {
    let formData = new FormData()
    formData.append('image', inputAddNewProjectImage.files[0])
    formData.append('title', newProjectTitle.value)
    formData.append('category', newProjectCategory.value)
    addNewProject(formData)
  }

  // Si il n'y a pas d'image uploadée
  else if (inputAddNewProjectImage.value == '') {
    newProjectImage.classList.add('input-error')
    addProjectError.classList.add('form-error-message-show')
    addProjectError.innerText =
      'Veuillez choisir une image à ajouter pour le nouveau projet'
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
        'add-new-image-placeholder-hide'
      )
      newProjectImage.removeChild(newProjectImagePreview)
      imageUploadError.classList.remove('image-accepted-error-show')
      addProjectError.classList.remove('form-error-message-show')

      const clearAllInputErrors = document.querySelectorAll('.input-error')
      for (let k = 0; k < clearAllInputErrors.length; k++) {
        clearAllInputErrors[k].classList.remove('input-error')
      }

      submitNewProject.setAttribute('id', 'submit-new-project')

      formNewProject.reset()

      // La modale se ferme
      modalPortfolioEditor.classList.remove('modal-edit-portfolio-show')

      // Le nouveau projet s'affiche dans la galerie (et dans la modale) sans avoir à rafraîchir la page
      const projectsGallery = document.querySelector('.gallery')
      projectsGallery.innerHTML = ''
      modalImageGallery.innerHTML = ''
      refreshProjects(projects)

      console.log('Le nouveau projet a bien été ajouté')

      // La session de connexion a expirée (Error 401)
    } else if (response.status === 401) {
      // Message d'erreur
      addProjectError.classList.add('form-error-message-show')
      addProjectError.innerText =
        "Erreur lors de l'ajout du nouveau projet. Veuillez vous reconnecter avant réessayer."

      // Une autre erreur innatendue est survenue (Error 500)
    } else {
      // Message d'erreur
      addProjectError.classList.add('form-error-message-show')
      addProjectError.innerText =
        "Erreur innatendue lors de l'ajout du nouveau projet. Veuillez réessayer."
    }
  })
}

/////////////////////////////////////////////////////////////////////////////
// Mettre à jour l'affichage des projets sans avoir à rafraîchir la page : //
/////////////////////////////////////////////////////////////////////////////

// Fonction qui refait un appel à l'API pour récupérer les projets après la suppression ou l'ajout et met à jour l'affichage dans le portfolio de la page index.html ainsi que dans la galerie photo de la modale
async function refreshProjects(projects) {
  const responseProjects = await fetch(`http://localhost:5678/api/works`)
  projects = await responseProjects.json()
  showProjectsInModal(projects)
  showProjects(projects)
}
