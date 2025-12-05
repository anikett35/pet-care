
// src/hooks/useInView.js
import { useState, useEffect, useRef } from 'react';

/**
 * MOCK Implementation of a Hook to detect if an element is in the viewport.
 * In a real project, you would use: npm install react-intersection-observer
 */
const useInView = (options) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Set the inView state based on whether the element is intersecting
      if (entry.isIntersecting) {
        setInView(true);
        // Optional: Unobserve after the first intersection for a one-time animation
        if (ref.current) {
             observer.unobserve(ref.current);
        }
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  // We only return the ref and the boolean state
  return [ref, inView];
};

export default useInView;