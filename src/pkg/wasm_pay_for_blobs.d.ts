/* tslint:disable */
/* eslint-disable */
/**
* @param {string} signer_address
* @param {Uint8Array} vm_id_namespace
* @param {Uint8Array} data
* @param {number} share_version
* @returns {Uint8Array}
*/
export function pay_blobs(signer_address: string, vm_id_namespace: Uint8Array, data: Uint8Array, share_version: number): Uint8Array;
/**
* @param {Uint8Array} value
* @returns {Uint8Array}
*/
export function message_to_tx(value: Uint8Array): Uint8Array;
/**
* @param {string} pub_key
* @param {bigint} sequence
* @param {string} coin_denom
* @param {string} coin_amount
* @param {bigint} fee_gas
* @param {string} fee_payer
* @param {string} fee_granter
* @returns {Uint8Array}
*/
export function auth_info_encode(pub_key: string, sequence: bigint, coin_denom: string, coin_amount: string, fee_gas: bigint, fee_payer: string, fee_granter: string): Uint8Array;
