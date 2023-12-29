// Cibler les éléments du DOM :
// Bannière "Mode édition" en haut de la page
const bannerEditMode = document.querySelector('.edit-mode-banner')

// Element "login" du menu de navigation
const loginOrLogout = document.querySelector('.login-logout')

// Bouton "modifier" pour ouvrir la modale
const buttonOpenEditor = document.querySelector('.portfolio-edit-button')

// Boutons de filtres des projets
const filters = document.querySelector('.filters')
// Fonction de mise à jour de la page d'accueil si l'utilisateur est connecté :
function updatePageToEditMode() {
  // Afficher le bandeau "Mode édition" au sommet de la page
  bannerEditMode.classList.add('edit-mode-banner-show')
  // Changer "login" par "logout" dans la barre de navigation
  loginOrLogout.innerText = 'logout'

  // Afficher l'option "modifier" à côté du titre "Mes projets"
  buttonOpenEditor.classList.add('portfolio-edit-button-show')
  // Cacher les boutons pour filtrer les projets
  filters.classList.add('filters-hide')
}

// Vérifier si l'utilisateur est connecté :
let userIsConnected = localStorage.getItem('token')
// Si l'utilisateur est connecté, mettre à jour la page d'accueil en mode édition
if (userIsConnected !== null) {
  updatePageToEditMode()
}

// Déconnecter l'utilisateur quand il clique sur "logout"
loginOrLogout.addEventListener('click', () => {
  localStorage.removeItem('token')
  // Rediriger vers la page de connexion
  window.location = './login.html'
})

// Ouvrir la modale d'édition du portfolio
