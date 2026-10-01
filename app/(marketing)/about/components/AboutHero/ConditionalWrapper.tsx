'use client';

import { useEffect, useState } from 'react';

const ConditionalWrapper = ({ children }) => {
  const [documentReady, setDocumentReady] = useState(false);

  useEffect(() => {
    setDocumentReady(true);
  }, []);

  return documentReady ? children : null;
};
export default ConditionalWrapper;