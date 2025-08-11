(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector)
  }

  function showError(container, message) {
    container.textContent = message
    container.classList.remove('d-none')
  }

  function clearError(container) {
    container.textContent = ''
    container.classList.add('d-none')
  }

  function mockApiLogin(identifier, password) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (identifier && password && password.length >= 4) {
          resolve({ token: 'mock-token', user: { id: 1, name: 'User' } })
        } else {
          reject(new Error('بيانات غير صحيحة'))
        }
      }, 500)
    })
  }

  function mockApiRegister(firstName, email, password, confirm) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (!firstName || !email || !password) return reject(new Error('املأ كل الحقول'))
        if (password !== confirm) return reject(new Error('كلمتا المرور غير متطابقتين'))
        resolve({ token: 'mock-token', user: { id: 1, name: firstName } })
      }, 500)
    })
  }

  function saveToken(token) {
    try {
      localStorage.setItem('auth_token', token)
    } catch (_) {}
  }

  function bindSignIn() {
    var page = document.getElementById('sign-in')
    if (!page) return

    var form = page.querySelector('form')
    var inputId = $('#signin-identifier', form)
    var inputPw = $('#signin-password', form)

    var error = document.createElement('div')
    error.className = 'alert alert-danger d-none mt-2'
    form.appendChild(error)

    var submitBtn = form.querySelector('button[type="button"]')
    submitBtn.type = 'submit'

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      clearError(error)
      var identifier = (inputId.value || '').trim()
      var password = inputPw.value || ''

      if (!identifier) return showError(error, 'الرجاء إدخال البريد أو الهاتف')
      if (!password) return showError(error, 'الرجاء إدخال كلمة المرور')

      submitBtn.disabled = true
      mockApiLogin(identifier, password)
        .then(function (res) {
          saveToken(res.token)
          window.location.href = 'main-feed.html'
        })
        .catch(function (err) {
          showError(error, err.message || 'خطأ غير متوقع')
        })
        .finally(function () {
          submitBtn.disabled = false
        })
    })
  }

  function bindSignUp() {
    var page = document.getElementById('sign-up')
    if (!page) return

    var form = page.querySelector('form')
    var inputName = $('#signup-first-name', form)
    var inputEmail = $('#signup-email', form)
    var inputPw = $('#signup-password', form)
    var inputConfirm = $('#signup-confirm', form)

    var error = document.createElement('div')
    error.className = 'alert alert-danger d-none mt-2'
    form.appendChild(error)

    var submitBtn = form.querySelector('button[type="button"]')
    submitBtn.type = 'submit'

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      clearError(error)

      var firstName = (inputName.value || '').trim()
      var email = (inputEmail.value || '').trim()
      var password = inputPw.value || ''
      var confirm = inputConfirm.value || ''

      if (!firstName) return showError(error, 'الاسم مطلوب')
      if (!email) return showError(error, 'البريد الإلكتروني مطلوب')
      if (!password) return showError(error, 'كلمة المرور مطلوبة')
      if (password.length < 8) return showError(error, 'يجب أن تكون كلمة المرور 8 أحرف على الأقل')
      if (password !== confirm) return showError(error, 'كلمتا المرور غير متطابقتين')

      submitBtn.disabled = true
      mockApiRegister(firstName, email, password, confirm)
        .then(function (res) {
          saveToken(res.token)
          window.location.href = 'select-region.html'
        })
        .catch(function (err) {
          showError(error, err.message || 'خطأ غير متوقع')
        })
        .finally(function () {
          submitBtn.disabled = false
        })
    })
  }

  function init() {
    bindSignIn()
    bindSignUp()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()