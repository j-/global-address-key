import React, { useCallback, useEffect, useRef, useState } from 'react';

export type UseIsDirtyOptions = {
  isCleanWhenDefault?: boolean;
};

export const useIsDirty = <T extends HTMLInputElement | HTMLTextAreaElement>(
  ref: React.RefObject<T>,
  {
    isCleanWhenDefault = true,
  }: UseIsDirtyOptions = {},
) => {
  const [isDirty, setIsDirty] = useState<boolean | null>(null);
  const cleanValueRef = useRef<string | null>(null);

  const evaluate = useCallback(() => {
    if (!ref.current) return;
    const element = ref.current;
    const doEvaluate = () => {
      const currentValue = element.value;
      const cleanValue = cleanValueRef.current;
      const isClean = (
        currentValue === cleanValue ||
        (isCleanWhenDefault && currentValue === element.defaultValue)
      );
      setIsDirty(!isClean);
    };
    doEvaluate();
    setTimeout(doEvaluate, 0);
  }, [isCleanWhenDefault]);

  const setClean = useCallback((cleanValue: string | null) => {
    cleanValueRef.current = cleanValue;
    evaluate();
  }, [evaluate]);

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;
    const handler = () => evaluate();
    element.addEventListener('input', handler);
    return () => {
      element.removeEventListener('input', handler);
    };
  }, [evaluate]);
  
  return { isDirty, setClean };
};
