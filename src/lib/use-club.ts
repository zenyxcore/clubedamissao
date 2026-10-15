'use client';

import { useSyncExternalStore, type Dispatch, type SetStateAction } from 'react';
import { EMPTY, STORAGE_KEY, parseState, type ClubState } from './adventure';

type Snapshot = { state: ClubState; ready: boolean; storageError: boolean };
const serverSnapshot: Snapshot = { state: EMPTY, ready: false, storageError: false };
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());
const getSnapshot = () => snapshot;
const getServerSnapshot = () => serverSnapshot;
function subscribe(listener: () => void) {
 listeners.add(listener);
 if (!snapshot.ready) {
  try { snapshot = { state: parseState(localStorage.getItem(STORAGE_KEY)), ready: true, storageError: false }; }
  catch { snapshot = { state: EMPTY, ready: true, storageError: true }; }
  emit();
 }
 const onStorage = (event: StorageEvent) => {
  if (event.key === STORAGE_KEY || event.key === null) {
   snapshot = { ...snapshot, state: parseState(event.newValue) };
   emit();
  }
 };
 window.addEventListener('storage', onStorage);
 return () => { listeners.delete(listener); window.removeEventListener('storage', onStorage); };
}
const setState: Dispatch<SetStateAction<ClubState>> = update => {
 const state = typeof update === 'function' ? update(snapshot.state) : update;
 let storageError = snapshot.storageError;
 try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageError = false; }
 catch { storageError = true; }
 snapshot = { state, ready: true, storageError };
 emit();
};
export function useClub() { return { ...useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot), setState }; }
