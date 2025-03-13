import { writable } from 'svelte/store';

export const ReadAccess = 10;
export const AdminAccess = 80;

export const access = writable(ReadAccess);
