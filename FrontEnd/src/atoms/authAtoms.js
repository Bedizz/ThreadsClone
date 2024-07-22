import { atom } from "recoil";

export const authScreenAtom = atom({
    key: 'authScreen',
    default: 'login',
});