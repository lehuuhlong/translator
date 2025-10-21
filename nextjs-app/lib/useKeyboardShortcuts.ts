'use client';

import { useEffect } from 'react';
import { KEYBOARD_SHORTCUTS } from './constants';

type ShortcutActions = {
  [K in keyof typeof KEYBOARD_SHORTCUTS]?: () => void;
};

export function useKeyboardShortcuts(actions: ShortcutActions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? event.metaKey : event.ctrlKey;

      if (!modKey) return;

      Object.entries(KEYBOARD_SHORTCUTS).forEach(([action, shortcut]) => {
        const key = shortcut.split('+')[1];
        if (event.key.toLowerCase() === key && actions[action as keyof ShortcutActions]) {
          event.preventDefault();
          actions[action as keyof ShortcutActions]?.();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);
}
