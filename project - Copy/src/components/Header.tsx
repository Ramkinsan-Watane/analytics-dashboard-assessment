import React from 'react';
import { Car, Battery, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
            >
              <Car className="h-8 w-8 text-blue-600" />
            </motion.div>
            <h1 className="ml-3 text-2xl font-bold text-gray-900">EV Analytics Dashboard</h1>
          </div>
          <div className="flex space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center text-green-600"
            >
              <Battery className="h-6 w-6 mr-2" />
              <span className="hidden sm:inline">Battery Status</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center text-yellow-600"
            >
              <Zap className="h-6 w-6 mr-2" />
              <span className="hidden sm:inline">Power Usage</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};