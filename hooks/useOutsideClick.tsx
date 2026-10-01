import { MutableRefObject, useEffect } from 'react';

type UseOutsideClickProps = (
  ref: MutableRefObject<any>,
  onOutsideClick: (isInside: false) => void
) => void;

const useOutsideClick: UseOutsideClickProps = (ref, onOutsideClick) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onOutsideClick(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, onOutsideClick]);
};

export default useOutsideClick;
