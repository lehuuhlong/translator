'use client';

import { useState, useEffect } from 'react';
import { ANIMATIONS } from './constants';

export function useTransitionState(initialState: boolean): [boolean, (value: boolean) => void] {
  const [state, setState] = useState(initialState);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, ANIMATIONS.DURATION);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const setTransitionState = (value: boolean) => {
    setIsTransitioning(true);
    setState(value);
  };

  return [state, setTransitionState];
}
