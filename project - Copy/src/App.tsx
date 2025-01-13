import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { DashboardCard } from './components/DashboardCard';
import { useEVData } from './hooks/useEVData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function App() {
  const { data, loading, error } = useEVData();
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Process data using useMemo to avoid unnecessary recalculations
  const {
    makeDistribution,
    vehicleTypeDistribution,
    yearDistribution,
    averageRange,
    latestYear
  } = useMemo(() => {
    if (!data.length) return {
      makeDistribution: [],
      vehicleTypeDistribution: [],
      yearDistribution: [],
      averageRange: 0,
      latestYear: 0
    };

    // Calculate make distribution
    const makeCount = data.reduce((acc, item) => {
      acc[item.Make] = (acc[item.Make] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const makeDistribution = Object.entries(makeCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Calculate vehicle type distribution
    const typeCount = data.reduce((acc, item) => {
      acc[item.ElectricVehicleType] = (acc[item.ElectricVehicleType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const vehicleTypeDistribution = Object.entries(typeCount)
      .map(([name, value]) => ({ name, value }));

    // Calculate year distribution
    const yearCount = data.reduce((acc, item) => {
      const year = item.ModelYear;
      if (year) {
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const yearDistribution = Object.entries(yearCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => Number(a.name) - Number(b.name));

    // Calculate average range
    const validRanges = data
      .map(item => Number(item.ElectricRange))
      .filter(range => !isNaN(range) && range > 0);
    
    const averageRange = Math.round(
      validRanges.reduce((sum, range) => sum + range, 0) / validRanges.length
    );

    // Get latest year
    const latestYear = Math.max(...data
      .map(item => Number(item.ModelYear))
      .filter(year => !isNaN(year))
    );

    return {
      makeDistribution,
      vehicleTypeDistribution,
      yearDistribution,
      averageRange,
      latestYear
    };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-600 flex items-center"
        >
          <Info className="h-6 w-6 mr-2" />
          <p>Error loading data: {error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard title="Top 5 EV Manufacturers">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={makeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#0088FE"
                    onMouseEnter={(data) => setSelectedMake(data.name)}
                    onMouseLeave={() => setSelectedMake(null)}
                  >
                    {makeDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={selectedMake === entry.name ? '#005bb7' : '#0088FE'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          <DashboardCard title="Vehicle Type Distribution">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleTypeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {vehicleTypeDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          <DashboardCard title="EV Adoption by Year">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill="#00C49F"
                    animationBegin={0}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          <DashboardCard title="Key Statistics">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-blue-50 p-4 rounded-lg cursor-pointer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <p className="text-sm text-blue-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-blue-900">{data.length}</p>
                <AnimatePresence>
                  {showTooltip && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-blue-500 mt-2"
                    >
                      Total number of EVs in the dataset
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Unique Makes</p>
                <p className="text-2xl font-bold text-green-900">
                  {new Set(data.filter(item => item.Make).map(item => item.Make)).size}
                </p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Average Range</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {averageRange} mi
                </p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Latest Year</p>
                <p className="text-2xl font-bold text-purple-900">
                  {latestYear}
                </p>
              </motion.div>
            </div>
          </DashboardCard>
        </div>
      </main>
    </div>
  );
}

export default App;