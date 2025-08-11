(function () {
  function togglePassword(id, el) {
    var input = document.getElementById(id)
    if (!input) return
    if (input.type === 'password') {
      input.type = 'text'
      if (el && el.classList) {
        el.classList.remove('fa-eye')
        el.classList.add('fa-eye-slash')
      }
    } else {
      input.type = 'password'
      if (el && el.classList) {
        el.classList.remove('fa-eye-slash')
        el.classList.add('fa-eye')
      }
    }
  }

  function resolveTargetInput(el) {
    var id = el && el.getAttribute('data-password-target')
    if (id) return document.getElementById(id)
    var container = el && el.closest('.position-relative')
    if (!container) return null
    var input = container.querySelector('input[type="password"], input[type="text"]')
    return input
  }

  function onToggleClick(event) {
    var el = event.currentTarget
    var input = resolveTargetInput(el)
    if (!input) return
    togglePassword(input.id || '', el)
  }

  function onToggleKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onToggleClick(event)
  }

  function attachToggleHandlers() {
    var toggles = document.querySelectorAll('.toggle-password')
    toggles.forEach(function (icon) {
      icon.addEventListener('click', onToggleClick)
      icon.addEventListener('keydown', onToggleKeydown)
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachToggleHandlers)
  } else {
    attachToggleHandlers()
  }

  // Expose globally for backward compatibility (if inline handlers still exist)
  window.togglePassword = togglePassword
})()