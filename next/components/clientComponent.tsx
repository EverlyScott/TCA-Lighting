"use client";

import { useEffect, useState } from "react";

const ClientComponent: React.FC = () => {
  // basic client side only logic
  const [test, setTest] = useState(false);

  useEffect(() => {
    setTest(true);
  }, []);

  return (
    <>
      <h1>This should only be seen once the page has loaded</h1>
      <p>{test}</p>
    </>
  );
};

export default ClientComponent;
