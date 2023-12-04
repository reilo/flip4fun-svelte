import { writable } from 'svelte/store';

// 0 = Read, 1 = Contribute, 2 = Admin
export const login = writable(0);
