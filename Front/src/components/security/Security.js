import CryptoJS from 'crypto-js';
import {serialize, unserialize} from 'php-serialize'
import base64 from 'base-64'

class Security {
    constructor() {
		this.encryption_key = process.env.REACT_APP_API_KEY_ENC;
        this.decryption_key = process.env.REACT_APP_API_KEY_DEC;
        this.cipher = process.env.REACT_APP_CIPHER;
    }

    encrypt(value, _serialize = false) {
        const iv = process.env.REACT_APP_API_ENCRYPT_VI_KEY;

        // First we will encrypt the value using OpenSSL. After this is encrypted we
		// will proceed to calculating a MAC for the encrypted value so that this
		// value can be verified later as not having been changed by the users.

        value = CryptoJS.AES.encrypt(
            _serialize ? serialize(JSON.stringify(value)) : JSON.stringify(value),
            CryptoJS.enc.Utf8.parse(this.encryption_key), {
                iv: CryptoJS.enc.Utf8.parse(iv),
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC
            }
        ).toString();

        if (value === false) {
            alert('EncryptException - Could not encrypt the data.');
		}

        // var base64Vi = iv;
        var base64Vi = base64.encode(iv)

        // Once we get the encrypted value we'll go ahead and base64_encode the input
		// vector and create the MAC for the encrypted value so we can then verify
		// its authenticity. Then, we'll JSON the data into the "payload" array.
		var mac = this.hash(base64Vi, value, this.encryption_key);
        return {value, mac};
        

    }

    hash(iv, value, key){
        return CryptoJS.HmacSHA256(iv + value, key).toString();
    }

    decrypt(payload, _unserialize = false) {
        const { value } = this.getJsonPayload(payload)

        const iv = process.env.REACT_APP_API_DECRYPT_VI_KEY;

		// Here we will decrypt the value. If we are able to successfully decrypt it
		// we will then unserialize it and return it out to the caller. If we are
		// unable to decrypt this value we will throw out an exception message.
        
        var decrypted = CryptoJS.AES.decrypt(
            value,
            CryptoJS.enc.Utf8.parse(this.decryption_key), {
                iv: CryptoJS.enc.Utf8.parse(iv),
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC
            }
        ).toString(CryptoJS.enc.Utf8);

		if (decrypted === false) {
            console.log('DecryptException', 'Could not decrypt the data.');
        }
		return _unserialize ? unserialize(JSON.parse(decrypted)) : JSON.parse(decrypted);
    }
    
	getJsonPayload(payload) {
        payload = (typeof payload == 'object') ? payload : JSON.parse(payload);
        if(!this.validPayload(payload)) {
            alert('DecryptException - The payload is invalid.'); 
        }

		if (!this.validMac(payload)) {
            alert('DecryptException - The MAC is invalid.'); 
		}

        return payload;
    }

    validPayload(payload) {
        return payload.mac !== undefined && payload.value !== undefined;
    }

    validMac(payload) {
        return payload.mac === this.calculateMac(payload);
    }

    calculateMac(payload) {
        return this.hash(base64.encode(process.env.REACT_APP_API_DECRYPT_VI_KEY), payload.value, this.decryption_key);
    }

}
export default Security;