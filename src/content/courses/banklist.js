// v18 T1: the modules that have a practice-test bank (banks/<moduleId>.{nl,en,blueprint}.js).
// A module pass that writes a bank adds its id here and its three files to the SHELL in
// sw.js. The validator checks that this list and the files on disk agree. With the list,
// loadBank can tell "this module has no bank" (null) from "the bank did not load" (throws).
export const BANKS = ['pm.plan', 'pm.intake', 'pm.approach'];
