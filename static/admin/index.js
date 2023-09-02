/*
 * Signin
 */
function login() {
    let apiKey = document.querySelector('#apikey').value
    let dataJson = {
        'apikey': apiKey
    }

    // Checks input fields
    if (!apiKey) {
        lib_msg.displayErrors('Admin key is mandatory')
        return
    }

    lib_msg.displayMessage('Processing...')

    lib_api.signin(dataJson).then(
        (result) => {
            const auth = result.authorizations
            const accessToken = auth.access_token
            if (lib_auth.isAdmin(accessToken)) {
                lib_auth.setAccessToken(accessToken)
                const refreshToken = auth.refresh_token
                lib_auth.setRefreshToken(refreshToken)
                sessionStorage.setItem('activeTab', '')
                lib_msg.displayInfo('Successfully connected to your backend')
                // Redirection to default page
                lib_cmn.goToDefaultPage()
            } else {
                lib_msg.displayErrors('You must sign in with the admin key')
            }
        },
        (error) => {
            lib_errors.processError(error)
        }
    )
}

/**
 * Get status of auth47 request
 * @param nonce {string}
 */
function auth47Status(nonce) {
    const init = () => lib_api.getAuth47Status(nonce)
        .then((response) => {
            if (response.authorizations) {
                const auth = response.authorizations

                const accessToken = auth.access_token
                const refreshToken = auth.refresh_token

                lib_auth.setAccessToken(accessToken)
                lib_auth.setRefreshToken(refreshToken)

                sessionStorage.setItem('activeTab', '')

                lib_msg.displayInfo('Successfully connected to your backend')
                // Redirection to default page
                lib_cmn.goToDefaultPage()
            } else {
                return setTimeout(() => init(), 2000)
            }
        },
        (error) => {
            lib_errors.processError(error)
        })

    init()
}

function initAuth47() {
    lib_api.getAuth47Uri()
        .then((response) => {
            const { nonce, uri } = response.data

            document.querySelector('#qr-auth47').innerHTML = new QRCode({ content: uri, join: true, height: 256, width: 256 }).svg()
            const qrLogoElement = document.createElement('div')
            qrLogoElement.className = 'qr-logo'
            document.querySelector('#qr-auth47').append(qrLogoElement)
            document.querySelector('#signin').classList.add('with-auth47')
            document.querySelector('#qr-auth47').classList.add('active')
            return nonce
        })
        .then((nonce) => {
            auth47Status(nonce)
        })
        .catch((error) => {
            console.error(error)
        })
}

(() => {
    // Dynamic loading of html and scripts
    lib_cmn.includeHTML()
    initAuth47()
    document.querySelector('#signin').addEventListener('submit', (event) => {
        event.preventDefault()
        login()
    })
})()
