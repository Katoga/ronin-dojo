const screenPairingScript = {

    initPage: () => {},

    preparePage: () => {
        screenPairingScript.displayQRPairing()
    },

    /**
     * @returns {Promise<object | null>}
     */
    loadPairingPayloads: () => {
        lib_msg.displayMessage('Loading pairing payloads...')

        return lib_api.getPairingInfo()
            .then((apiInfo) => {
                const result = apiInfo

                result.pairing.url = `${window.location.protocol}//${window.location.host}${conf.api.baseUri}`

                lib_msg.cleanMessagesUi()
                return result
            })
            .catch((error) => {
                lib_errors.processError(error)
                return null
            })
    },

    displayQRPairing: () => {
        screenPairingScript.loadPairingPayloads().then(
            (result) => {
                if (result) {
                    document.querySelector('#qr-pairing').innerHTML = '' // clear qrcode first
                    document.querySelector('#dojo-pairing-payload').value = JSON.stringify(result, null, 4)

                    const pairingQrcode = new QRCode({ content: JSON.stringify(result), join: true, height: 256, width: 256 }).svg()
                    document.querySelector('#qr-pairing').innerHTML = pairingQrcode
                }
            }
        )
    }

}

screenScripts.set('#screen-pairing', screenPairingScript)
