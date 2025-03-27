
import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { motion } from "framer-motion";

// Sample data for the chart
const data = [
  { name: "Mon", activations: 65, invites: 110 },
  { name: "Tue", activations: 59, invites: 90 },
  { name: "Wed", activations: 80, invites: 125 },
  { name: "Thu", activations: 81, invites: 138 },
  { name: "Fri", activations: 56, invites: 95 },
  { name: "Sat", activations: 55, invites: 80 },
  { name: "Sun", activations: 40, invites: 72 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1E293B] p-3 border border-purple-500/20 rounded-lg shadow-lg">
        <p className="text-gray-400 text-xs mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-xs">
              <span className="text-gray-400 mr-2">{entry.name}:</span>
              <span className="text-white font-semibold">{entry.value}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const InvitationChart: React.FC = () => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#1E293B]/80 backdrop-blur-sm border border-[#8B5CF6]/20 rounded-xl p-5 mb-8"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Weekly Activity</h3>
        <p className="text-sm text-gray-400">Tracking invites and activations</p>
      </div>
      
      <div className="h-80 mt-5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorInvites" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorActivations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D946EF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D946EF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="#374151"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => <span className="text-gray-400">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="invites"
              stroke="#8B5CF6"
              fillOpacity={1}
              fill="url(#colorInvites)"
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#8B5CF6' }}
            />
            <Area
              type="monotone"
              dataKey="activations"
              stroke="#D946EF"
              fillOpacity={1}
              fill="url(#colorActivations)"
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#D946EF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default InvitationChart;
