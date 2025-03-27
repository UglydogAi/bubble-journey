
import React from "react";
import { 
  UserPlus, 
  CheckCircle, 
  Clock, 
  Users,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: { value: number; type: "increase" | "decrease" };
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#1E293B]/80 backdrop-blur-sm border border-[#8B5CF6]/20 rounded-xl p-5 flex justify-between"
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        
        {change && (
          <div className="flex items-center text-xs">
            {change.type === "increase" ? (
              <>
                <ArrowUp className="w-3 h-3 text-green-400 mr-1" />
                <span className="text-green-400">{change.value}%</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-3 h-3 text-red-400 mr-1" />
                <span className="text-red-400">{change.value}%</span>
              </>
            )}
            <span className="text-gray-500 ml-1">from last week</span>
          </div>
        )}
      </div>
      
      <div className="flex items-start">
        <div className="w-12 h-12 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const StatsOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Invites"
        value="5,847"
        icon={<UserPlus className="w-6 h-6" />}
        change={{ value: 12.5, type: "increase" }}
        delay={0.1}
      />
      <StatCard
        title="Activated Codes"
        value="3,492"
        icon={<CheckCircle className="w-6 h-6" />}
        change={{ value: 8.2, type: "increase" }}
        delay={0.2}
      />
      <StatCard
        title="Pending Activations"
        value="1,256"
        icon={<Clock className="w-6 h-6" />}
        change={{ value: 2.1, type: "decrease" }}
        delay={0.3}
      />
      <StatCard
        title="Active Users"
        value="2,841"
        icon={<Users className="w-6 h-6" />}
        change={{ value: 5.8, type: "increase" }}
        delay={0.4}
      />
    </div>
  );
};

export default StatsOverview;
