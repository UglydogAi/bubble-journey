
import React, { useState, useEffect } from "react";
import { 
  Trophy, Shield, Award, Star, TrendingUp, 
  BadgeCheck, Target, Rocket, Clock, Eye
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  ResponsiveContainer, AreaChart, Area, 
  XAxis, YAxis, Tooltip, CartesianGrid 
} from "recharts";
import { motion } from "framer-motion";

// Sample weekly data for the chart
const weeklyData = [
  { day: "Mon", points: 120 },
  { day: "Tue", points: 85 },
  { day: "Wed", points: 150 },
  { day: "Thu", points: 95 },
  { day: "Fri", points: 180 },
  { day: "Sat", points: 220 },
  { day: "Sun", points: 130 }
];

// Badge definitions with enhanced cyberpunk aesthetics
const badges = [
  { 
    id: "bronze", 
    name: "Bronze", 
    icon: "trophy",
    description: "Complete 5 conversations with UGLYDOG", 
    requiredPoints: 500,
    color: "from-amber-700 via-amber-600 to-amber-500",
    glowColor: "amber",
    borderColor: "border-amber-500/30"
  },
  { 
    id: "silver", 
    name: "Silver", 
    icon: "shield",
    description: "Complete 25 conversations with UGLYDOG", 
    requiredPoints: 2500,
    color: "from-slate-400 via-slate-300 to-slate-200",
    glowColor: "sky",
    borderColor: "border-sky-500/30"
  },
  { 
    id: "gold", 
    name: "Gold", 
    icon: "award",
    description: "Complete 50 conversations & weekly goals", 
    requiredPoints: 5000,
    color: "from-yellow-500 via-amber-400 to-amber-300",
    glowColor: "yellow",
    borderColor: "border-yellow-500/30"
  },
  { 
    id: "diamond", 
    name: "Diamond", 
    icon: "eye",
    description: "Complete 100 conversations & all milestones", 
    requiredPoints: 10000,
    color: "from-blue-400 via-indigo-300 to-violet-400",
    glowColor: "indigo",
    borderColor: "border-indigo-500/30"
  }
];

// Weekly goals
const weeklyGoals = [
  { 
    id: "daily-convo", 
    title: "Daily Conversations", 
    current: 5, 
    target: 7,
    icon: <Target className="h-5 w-5 text-primary" />,
    pointsPerUnit: 50
  },
  { 
    id: "feature-use", 
    title: "Use Advanced Features", 
    current: 3, 
    target: 5,
    icon: <Rocket className="h-5 w-5 text-orange-500" />,
    pointsPerUnit: 75
  },
  { 
    id: "consecutive", 
    title: "Consecutive Days", 
    current: 4, 
    target: 7,
    icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    pointsPerUnit: 100
  }
];

// Badge icon components with special effects
const BadgeIcon = ({ type, isUnlocked, size = 8 }) => {
  // For glowing pulse animation
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Map badge type to the appropriate icon
  const renderIcon = () => {
    switch (type) {
      case "trophy":
        return (
          <Trophy 
            className={`h-${size} w-${size} ${isUnlocked ? 'text-amber-500' : 'text-gray-500'}`}
            strokeWidth={1.5}
          />
        );
      case "shield":
        return (
          <Shield 
            className={`h-${size} w-${size} ${isUnlocked ? 'text-sky-400' : 'text-gray-500'}`}
            strokeWidth={1.5}
          />
        );
      case "award":
        return (
          <Award 
            className={`h-${size} w-${size} ${isUnlocked ? 'text-yellow-500' : 'text-gray-500'}`}
            strokeWidth={1.5}
          />
        );
      case "eye":
        return (
          <Eye 
            className={`h-${size} w-${size} ${isUnlocked ? 'text-indigo-400' : 'text-gray-500'}`}
            strokeWidth={1.5}
          />
        );
      default:
        return (
          <BadgeCheck 
            className={`h-${size} w-${size} ${isUnlocked ? 'text-primary' : 'text-gray-500'}`}
            strokeWidth={1.5}
          />
        );
    }
  };

  if (!isUnlocked) {
    return (
      <div className="relative flex items-center justify-center opacity-50">
        {renderIcon()}
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Glowing background effect */}
      <motion.div
        variants={pulseVariants}
        animate="pulse"
        className={`absolute inset-0 rounded-full blur-md bg-opacity-70 z-0`}
        style={{ 
          background: `radial-gradient(circle, currentColor 0%, transparent 70%)`,
          color: getBadgeGlowColor(type)
        }}
      />
      
      {/* Main icon */}
      <div className="relative z-10 transform transition-transform duration-300 hover:scale-110">
        {renderIcon()}
      </div>
    </div>
  );
};

// Helper to get appropriate glow color based on badge type
const getBadgeGlowColor = (type) => {
  switch (type) {
    case "trophy": return "rgba(245, 158, 11, 0.5)"; // amber
    case "shield": return "rgba(56, 189, 248, 0.5)"; // sky
    case "award": return "rgba(234, 179, 8, 0.5)";   // yellow
    case "eye": return "rgba(129, 140, 248, 0.5)";   // indigo
    default: return "rgba(139, 92, 246, 0.5)";       // primary
  }
};

// Reflective 3D badge component with hover effects
const CyberpunkBadge = ({ badge, isUnlocked, onClick }) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-xl backdrop-blur-sm
        border ${isUnlocked ? badge.borderColor : 'border-gray-700/50'}
        transition-all duration-500 cursor-pointer
        ${isUnlocked ? 'shadow-lg' : 'opacity-60'}
      `}
      onClick={onClick}
      whileHover={isUnlocked ? { scale: 1.05, y: -5 } : { scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background gradient with animated overlay */}
      <div className={`
        absolute inset-0 bg-gradient-to-br 
        ${isUnlocked ? badge.color : 'from-gray-800 to-gray-900'}
        opacity-80 z-0
      `}>
        {/* Scanlines effect */}
        {isUnlocked && (
          <div className="absolute inset-0 bg-scanlines opacity-10 mix-blend-overlay z-10"></div>
        )}
      </div>
      
      {/* Holographic reflection effect */}
      {isUnlocked && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-10 z-20"
          animate={{ 
            left: ["-100%", "200%"],
            top: ["-100%", "200%"],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            repeatType: "loop",
            ease: "linear",
            repeatDelay: 4
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative flex flex-col items-center justify-center py-6 px-4 z-30">
        {/* Badge icon */}
        <div className="mb-3">
          <BadgeIcon 
            type={badge.icon} 
            isUnlocked={isUnlocked} 
          />
        </div>
        
        {/* Badge name with metallic text effect */}
        <span className={`
          font-bold text-lg 
          ${isUnlocked ? 'text-white' : 'text-gray-400'} 
          ${isUnlocked ? 'text-shadow-sm' : ''}
        `}>
          {badge.name}
        </span>
        
        {/* Unlock indicator */}
        {isUnlocked && (
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-lg border border-green-400">
            <BadgeCheck className="h-3 w-3 text-white" strokeWidth={3} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export function RewardsView() {
  const [totalPoints, setTotalPoints] = useState(3200);
  const [weeklyPoints, setWeeklyPoints] = useState(980);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Find current tier based on points
  const currentTier = badges.reduce((prev, current) => {
    return totalPoints >= current.requiredPoints ? current : prev;
  }, badges[0]);
  
  // Calculate next tier
  const nextTierIndex = badges.findIndex(b => b.id === currentTier.id) + 1;
  const nextTier = nextTierIndex < badges.length ? badges[nextTierIndex] : null;
  
  // Calculate progress to next tier
  const progressToNextTier = nextTier 
    ? Math.min(100, ((totalPoints - currentTier.requiredPoints) / (nextTier.requiredPoints - currentTier.requiredPoints)) * 100)
    : 100;
  
  // Airdrop eligibility - set at 5000 points
  const airdropThreshold = 5000;
  const airdropEligible = totalPoints >= airdropThreshold;
  const airdropProgress = Math.min(100, (totalPoints / airdropThreshold) * 100);
  
  // Calculate weekly progress
  const weeklyPointsProgress = weeklyGoals.reduce((acc, goal) => {
    return acc + ((goal.current / goal.target) * goal.pointsPerUnit * goal.current);
  }, 0);

  // CSS for cyberpunk/holographic UI 
  useEffect(() => {
    // Add global CSS for scanlines and text effects
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes scanlines {
        from { background-position: 0 0; }
        to { background-position: 0 100%; }
      }
      .bg-scanlines {
        background: repeating-linear-gradient(
          to bottom,
          transparent 0px,
          rgba(255, 255, 255, 0.05) 1px,
          transparent 2px
        );
        background-size: 100% 4px;
        animation: scanlines 8s linear infinite;
      }
      .text-shadow-sm {
        text-shadow: 0 0 5px currentColor, 0 0 10px rgba(255, 255, 255, 0.3);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-1 md:pt-6 animate-fade-in">
      {/* Header with Points Overview */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch">
        <Card className="flex-1 bg-card/50 backdrop-blur-xl border-border/30 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Gem className="h-5 w-5 text-primary animate-pulse" />
              <span>OG Points</span>
            </CardTitle>
            <CardDescription>
              Earn points through UGLYDOG interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-4xl font-bold text-primary">{totalPoints}</div>
              <div className="text-sm text-muted-foreground mb-1">points</div>
            </div>
            
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span>{currentTier.name}</span>
                {nextTier && <span>{nextTier.name}</span>}
              </div>
              <Progress value={progressToNextTier} className="h-2" />
              {nextTier && (
                <div className="text-xs text-muted-foreground">
                  {nextTier.requiredPoints - totalPoints} points until next tier
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1 bg-card/50 backdrop-blur-xl border-border/30 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Weekly Recap</span>
            </CardTitle>
            <CardDescription>
              You earned {weeklyPoints} points this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pointsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8A2BE2" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.1} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(23, 23, 23, 0.8)', 
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value} points`, 'Points']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="points" 
                    stroke="#8A2BE2" 
                    fillOpacity={1} 
                    fill="url(#pointsGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badge Collection - Cyberpunk Edition */}
      <Card className="bg-card/50 backdrop-blur-xl border-border/30 shadow-lg overflow-hidden">
        <CardHeader className="pb-3 relative">
          <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-8 h-16 bg-primary/20 blur-xl rounded-full"></div>
          <CardTitle className="flex items-center gap-2 relative z-10">
            <Award className="h-5 w-5 text-primary" />
            <span>Badge Collection</span>
          </CardTitle>
          <CardDescription className="relative z-10">
            Unlock badges as you interact with UGLYDOG
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => {
              const isUnlocked = totalPoints >= badge.requiredPoints;
              return (
                <CyberpunkBadge
                  key={badge.id}
                  badge={badge}
                  isUnlocked={isUnlocked}
                  onClick={() => {
                    setSelectedBadge(badge);
                    setIsDetailModalOpen(true);
                  }}
                />
              );
            })}
          </div>
          
          {/* Badge details modal could be added here */}
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card className="bg-card/50 backdrop-blur-xl border-border/30 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Weekly Goals</span>
          </CardTitle>
          <CardDescription>
            Complete these goals to earn extra OG Points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              const earnedPoints = goal.current * goal.pointsPerUnit;
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {goal.icon}
                      <span className="font-medium">{goal.title}</span>
                    </div>
                    <div className="text-sm text-primary font-semibold">
                      +{earnedPoints} points
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{goal.current} of {goal.target} completed</span>
                    <span>{goal.pointsPerUnit} points each</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
            
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-sm flex items-center gap-1">
                <Star className="h-4 w-4 text-primary" />
                <span>Weekly progress:</span>
                <span className="font-semibold">{weeklyPointsProgress} points</span>
              </div>
              <Button size="sm" className="self-end sm:self-auto bg-primary hover:bg-primary/90">
                Claim Bonus
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Airdrop Eligibility */}
      <Card className="bg-card/50 backdrop-blur-xl border-border/30 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <span>OG Token Airdrop</span>
          </CardTitle>
          <CardDescription>
            Convert your OG Points to OG Tokens when eligible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-2 md:items-center">
              <div>
                <div className="text-sm mb-1">
                  {airdropEligible 
                    ? "You are eligible for the OG Token airdrop!" 
                    : `You need ${airdropThreshold - totalPoints} more points to qualify`}
                </div>
                <Progress value={airdropProgress} className="h-2 w-full md:w-60" />
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Next airdrop in</div>
                  <div className="text-lg font-bold text-primary">14 days</div>
                </div>
              </div>
              
              <Button 
                disabled={!airdropEligible}
                className={`${airdropEligible 
                  ? 'bg-primary hover:bg-primary/90' 
                  : 'bg-gray-700 text-gray-300'}`}
              >
                {airdropEligible ? "Register for Airdrop" : "Not Eligible Yet"}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>OG Points can be converted to OG Tokens according to our tokenomics model. Minimum 5,000 points required for eligibility.</p>
              <p className="mt-1">The conversion rate varies based on your tier level and participation. Higher tiers receive better conversion rates.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
