import { useEffect, useRef } from "react";

export function useInfiniteScroll(callback: () => void, hasNext: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext) {
          callback();
        }
      },
      { threshold: 1 }
    );

    const element = ref.current;
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [callback, hasNext]);

  return ref;
}
