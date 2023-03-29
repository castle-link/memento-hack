import { useEffect, MutableRefObject, useCallback } from "react";

export const useOutsideClick = (
  ref: MutableRefObject<any>,
  callback: () => void
) => {
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    },
    [callback]
  );

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handleClick]);
};

export default useOutsideClick;
