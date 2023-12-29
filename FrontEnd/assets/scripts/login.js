// Cibler les éléments du DOM
// Le formulaire de connexion
const loginForm = document.getElementById('login-form')

// L'input de saisie de l'email
const loginEmail = document.getElementById('email')

// L'input de saisie du mot de passe
const loginPassword = document.getElementById('password')

// Le bouton de validation de l'envoi de demande de connexion
const loginSubmit = document.getElementById('submit')

// Créer l'élément pour l'affichage du message d'erreur
const loginError = document.createElement('p')
loginForm.insertBefore(loginError, loginSubmit)

// Ecouter le bouton d'envoi de la demande de connexion
loginForm.addEventListener('submit', async (event) => {
  // Empêcher le rechargement de la page
  event.preventDefault()

  // Récupération des valeurs saisies dans les inputs du formulaire de connexion
  const loginUser = {
    email: loginEmail.value,
    password: loginPassword.value,
  }

  // Envoi de la demande de connexion à l'API
  const responseLogin = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: { accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(loginUser),
  })

  const userAuthentification = await responseLogin.json()

  // Si e-mail & mot de passe corrects (200 - Connected)
  if (responseLogin.status === 200) {
    // Stocker le token d'authentification
    localStorage.setItem('token', userAuthentification.token)
    // Redirection vers la page d'accueil
    window.location = './index.html'
  }

  // Si l'e-mail est incorrect (404 - User not found)
  else if (responseLogin.status === 404) {
    // Message d'erreur
    loginError.innerText = 'Identifiant incorrect'
    loginEmail.classList.add('input-error')
    loginPassword.classList.remove('input-error')
  }

  // Si le mot de passe est incorrect (401 - Not authorized)
  else if (responseLogin.status === 401) {
    // Message d'erreur
    loginError.innerText = 'Mot de passe incorrect'
    loginPassword.classList.add('input-error')
    loginEmail.classList.remove('input-error')
  }
  // Dans le cas d'une autre erreur
  else {
    loginError.innerText = "Erreur d'authentification. Veuillez réessayer"
  }
})
