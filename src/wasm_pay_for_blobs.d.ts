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

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly pay_blobs: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly message_to_tx: (a: number, b: number, c: number) => void;
  readonly auth_info_encode: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
