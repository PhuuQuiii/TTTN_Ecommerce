import ReactGA from 'react-ga4'

let isInitialized = false

export const initGA = () => {
  if (!isInitialized) {
    console.log('GA init')
    ReactGA.initialize('G-8YE29G0KKR', {
      gaOptions: {
        cookieFlags: 'SameSite=None;Secure'
      }
    })
    isInitialized = true
  }
}

export const logPageView = () => {
  if (isInitialized && typeof window !== 'undefined') {
    console.log(`Logging pageview for ${window.location.pathname}`)
    ReactGA.send({ 
      hitType: "pageview", 
      page: window.location.pathname 
    })
  }
}

export const logEvent = (category = '', action = '') => {
  if (isInitialized && category && action) {
    ReactGA.event({
      category,
      action
    })
  }
}

export const logException = (description = '', fatal = false) => {
  if (isInitialized && description) {
    ReactGA.exception({
      description,
      fatal
    })
  }
}

// Function to safely check if cookies are accepted
export const checkCookieConsent = () => {
  try {
    if (typeof window !== 'undefined' && 
        window._iub && 
        window._iub.cs && 
        typeof window._iub.cs.api !== 'undefined' && 
        typeof window._iub.cs.api.isConsentGiven === 'function') {
      return window._iub.cs.api.isConsentGiven()
    }
    // If iubenda is not ready yet, default to false
    return false
  } catch (error) {
    console.warn('Error checking cookie consent:', error)
    return false
  }
}

// Initialize GA only after consent with retry
export const initGAWithConsent = () => {
  // First attempt
  if (checkCookieConsent()) {
    initGA()
    return
  }

  // Retry after a short delay to allow iubenda to initialize
  const retryInterval = setInterval(() => {
    if (checkCookieConsent()) {
      initGA()
      clearInterval(retryInterval)
    }
  }, 1000) // Check every second

  // Clear interval after 10 seconds to prevent infinite checking
  setTimeout(() => {
    clearInterval(retryInterval)
  }, 10000)
}