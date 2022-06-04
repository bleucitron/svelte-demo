import { writable } from 'svelte/store';

const { subscribe, update } = writable(new Set());

export const favorites = {
  subscribe,
  toggle: id =>
    update(list => {
      if (list.has(id)) list.delete(id);
      else list.add(id);

      return list;
    }),
};
