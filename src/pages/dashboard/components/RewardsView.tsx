
import React, { useState } from "react";
import { 
  Trophy, Gem, Award, Star, TrendingUp, 
  BadgeCheck, Target, Rocket, Clock 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  ResponsiveContainer, AreaChart, Area, 
  XAxis, YAxis, Tooltip, CartesianGrid 
} from "recharts";

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

// Badge definitions
const badges = [
  { 
    id: "bronze", 
    name: "Bronze", 
    icon: <Trophy className="h-5 w-5 text-amber-600" />, 
    description: "Complete 5 conversations with UGLYDOG", 
    requiredPoints: 500,
    color: "from-amber-700 to-amber-500"
  },
  { 
    id: "silver", 
    name: "Silver", 
    icon: <Trophy className="h-5 w-5 text-slate-400" />, 
    description: "Complete 25 conversations with UGLYDOG", 
    requiredPoints: 2500,
    color: "from-slate-400 to-slate-300"
  },
  { 
    id: "gold", 
    name: "Gold", 
    icon: <Trophy className="h-5 w-5 text-yellow-500" />, 
    description: "Complete 50 conversations & weekly goals", 
    requiredPoints: 5000,
    color: "from-yellow-500 to-amber-300"
  },
  { 
    id: "diamond", 
    name: "Diamond", 
    icon: <Gem className="h-5 w-5 text-blue-400" />, 
    description: "Complete 100 conversations & all milestones", 
    requiredPoints: 10000,
    color: "from-blue-400 to-indigo-300"
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

export function RewardsView() {
  const [totalPoints, setTotalPoints] = useState(3200);
  const [weeklyPoints, setWeeklyPoints] = useState(980);
  const [showBadgeInfo, setShowBadgeInfo] = useState<string | null>(null);
  
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

      {/* Badge Collection */}
      <Card className="bg-card/50 backdrop-blur-xl border-border/30 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <span>Badge Collection</span>
          </CardTitle>
          <CardDescription>
            Unlock badges as you interact with UGLYDOG
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => {
              const isUnlocked = totalPoints >= badge.requiredPoints;
              return (
                <div
                  key={badge.id}
                  className="relative group"
                  onMouseEnter={() => setShowBadgeInfo(badge.id)}
                  onMouseLeave={() => setShowBadgeInfo(null)}
                >
                  <div 
                    className={`
                      h-20 flex flex-col items-center justify-center p-3 rounded-lg
                      transition-all duration-300 hover:transform hover:scale-105
                      ${isUnlocked 
                        ? `bg-gradient-to-br ${badge.color} border border-white/10 shadow-lg` 
                        : 'bg-gray-800/50 border border-gray-700'}
                    `}
                  >
                    <div className="relative">
                      {badge.icon}
                      {isUnlocked && (
                        <BadgeCheck 
                          className="absolute -bottom-2 -right-2 h-4 w-4 text-white bg-green-500 rounded-full p-0.5" 
                        />
                      )}
                    </div>
                    <span className={`mt-2 font-semibold text-sm ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                      {badge.name}
                    </span>
                  </div>
                  
                  {showBadgeInfo === badge.id && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-50
                      bg-black/90 text-white text-xs p-2 rounded w-40 backdrop-blur-sm
                      shadow-lg border border-primary/20 animate-fade-in">
                      <p className="font-medium mb-1">{badge.name} Badge</p>
                      <p className="text-gray-300">{badge.description}</p>
                      <p className="mt-1 text-primary">{badge.requiredPoints} points required</p>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2
                        border-8 border-transparent border-t-black/90"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
            
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm flex items-center gap-1">
                <Star className="h-4 w-4 text-primary" />
                <span>Weekly progress:</span>
                <span className="font-semibold">{weeklyPointsProgress} points</span>
              </div>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
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
