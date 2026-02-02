'use client';

import { User } from '../types/user';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsChartProps {
  users: User[];
}

export default function AnalyticsChart({ users }: AnalyticsChartProps) {
  // Prepare monthly joined data 
  const monthlyData = users.reduce((acc: { [key: string]: number }, user) => {
    try {
      const date = new Date(user.joinedAt);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
    } catch (error) {
      console.error('Error parsing date:', user.joinedAt);
    }
    return acc;
  }, {});

  // Convert to array and sort by date
  const joinedChartData = Object.entries(monthlyData)
    .map(([monthYear, count]) => ({
      month: monthYear,
      users: count,
    }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
      return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth);
    })
    .slice(-6);  

   const activeUsers = users.filter(u => u.status.toLowerCase() === 'active').length;
  const inactiveUsers = users.filter(u => u.status.toLowerCase() === 'inactive').length;
  const activeRate = users.length > 0 ? Math.round((activeUsers / users.length) * 100) : 0;

  // Calculate average users per month
  const avgPerMonth = joinedChartData.length > 0
    ? Math.round(joinedChartData.reduce((sum, item) => sum + item.users, 0) / joinedChartData.length)
    : 0;

  // Empty state
  if (users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Analytics
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">
            No data available for the  filters
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Try adjusting your search or filters 
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-50 rounded-xl shadow-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Users Joined per Month
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Monthly user   
            </p>
          </div>
        </div>
        <TrendingUp className="h-5 w-5 text-green-500" />
      </div>
            {/* Chart Section */}
      <div className="mb-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={joinedChartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value: number) => [value, 'Users']}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
              <Bar 
                dataKey="users" 
                name="Users Joined"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Details */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Users joined each month</span>
          </div>
          <div className="text-right">
            <span className="font-medium text-gray-700">{joinedChartData.length}</span> months displayed
          </div>
        </div>
      </div>
    </motion.div>
  );
}