
import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Calendar, Dumbbell, Heart, Lightbulb, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bubble } from "@/components/auth/Bubble";
import { toast } from "sonner";

const bubbleConfigs = [
  { icon: Lightbulb, position: { x: "20%", y: "20%" }, message: "Unlock your potential" },
  { icon: Brain, position: { x: "70%", y: "15%" }, message: "Train your mindset" },
  { icon: Dumbbell, position: { x: "80%", y: "60%" }, message: "Push your limits" },
  { icon: Calendar, position: { x: "15%", y: "70%" }, message: "Plan for success" },
  { icon: Heart, position: { x: "60%", y: "80%" }, message: "Transform your life" },
];

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulated login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Welcome to UGLYDOG!");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full bg-auth-gradient flex items-center justify-center overflow-hidden relative"
    >
      {bubbleConfigs.map((bubble, index) => (
        <Bubble
          key={index}
          icon={bubble.icon}
          position={{ x: bubble.position.x, y: bubble.position.y }}
          size={index % 2 === 0 ? "lg" : "md"}
          delay={index * 0.2}
          message={bubble.message}
        />
      ))}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to UGLYDOG</h1>
          <p className="text-white/80">The first brutally honest AI coach</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-white/60" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/60"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-white/60" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/60"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-white/60 hover:text-white transition-colors">
            Forgot password?
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Auth;
