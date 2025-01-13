import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      {children}
    </motion.div>
  );
};