import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ 
            duration: 0.2, 
            ease: [0.4, 0, 0.2, 1]
          }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Layout;
