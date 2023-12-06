import { writable } from 'svelte/store';

export const NoAccess = 0;
export const ReadAccess = 10;
export const ContributeAccess = 30;
export const AdminAccess = 80;
export const SuperAdminAccess = 100;

export const access = writable(ReadAccess);
