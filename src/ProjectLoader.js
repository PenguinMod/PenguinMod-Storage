/* eslint-env browser */

const saferFetchAsArrayBuffer = require("./safer-fetch");
const pmp_protobuf = require("pmp-protobuf");

/**
 * Get and send assets with the fetch standard web api.
 */
class FetchTool {
    /**
     * Is get supported? false if the environment does not support fetch.
     * @returns {boolean} Is get supported?
     */
    get isGetSupported() {
        return typeof fetch !== "undefined";
    }

    /**
     * Request data from a server with fetch.
     * @param {{url:string}} reqConfig - Request configuration for data to get.
     * @param {{method:string}} options - Additional options to configure fetch.
     * @returns {Promise.<Uint8Array>} Resolve to Buffer of data from server.
     */
    get({ url, ...options }) {
        return saferFetchAsArrayBuffer(
            url,
            Object.assign({ method: "GET" }, options),
        ).then((arrayBufferOrNull) => {
            if (arrayBufferOrNull) {
                let json_obj = pmp_protobuf.protobufToJson(
                    new Uint8Array(arrayBufferOrNull),
                );
                return new TextEncoder().encode(JSON.stringify(json_obj));
            }
            return arrayBufferOrNull;
        });
    }

    /**
     * Is sending supported? false if the environment does not support sending
     * with fetch.
     * @returns {boolean} Is sending supported?
     */
    get isSendSupported() {
        return false;
    }

    /**
     * Send data to a server with fetch.
     * @param {Request} reqConfig - Request configuration for data to send.
     * @returns {Promise.<string>} Server returned metadata.
     */
    send({ url, withCredentials = false, ...options }) {
        throw new Error("we dont send in the editor!");
    }
}

module.exports = FetchTool;
