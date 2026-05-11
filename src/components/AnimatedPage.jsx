import React from 'react';
import { motion } from 'framer-motion';

const animations = {
  initial: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 100 : -100,
  }),
  animate: { opacity: 1, x: 0 },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -100 : 100,
  }),
};

const AnimatedPage = ({ children, direction = 1 }) => {
  return (
    <motion.div
      custom={direction}
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex-1 flex flex-col w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
