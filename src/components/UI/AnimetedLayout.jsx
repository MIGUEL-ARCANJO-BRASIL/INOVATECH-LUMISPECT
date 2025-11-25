// src/AnimatedLayout.jsx
import { useLocation, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const AnimatedLayout = () => {
  const { pathname } = useLocation();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    // força recriar o container a cada rota, disparando a animação
    setKey(pathname);
  }, [pathname]);

  return (
    <div key={key} className="page-transition">
      <Outlet />
    </div>
  );
};

export default AnimatedLayout;
