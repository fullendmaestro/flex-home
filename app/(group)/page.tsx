"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, Smartphone, Shield, Zap, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted email:", email);
    setEmail("");
  };

  return (
    <main>
      <section className="py-12 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to the Future of Smart Homes
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Experience the power of IoT with Flex Home&apos;s cutting-edge
            device services.
          </p>
          <Button
            size="lg"
            onClick={() =>
              document
                .getElementById("signup")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get Started
          </Button>
        </motion.div>
      </section>

      <section id="features" className="py-12 md:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Home,
                title: "Smart Home Integration",
                description: "Seamlessly connect all your smart devices",
              },
              {
                icon: Smartphone,
                title: "Mobile Control",
                description: "Control your home from anywhere with our app",
              },
              {
                icon: Shield,
                title: "Enhanced Security",
                description: "Advanced security features to protect your home",
              },
              {
                icon: Zap,
                title: "Energy Efficiency",
                description: "Optimize your energy usage and save on bills",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <feature.icon className="w-10 h-10 md:w-12 md:h-12 mb-4 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            {[
              {
                step: 1,
                title: "Install Devices",
                description: "Set up our IoT devices in your home",
              },
              {
                step: 2,
                title: "Connect to App",
                description: "Download our app and connect your devices",
              },
              {
                step: 3,
                title: "Enjoy Automation",
                description: "Experience the convenience of a smart home",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex items-center"
              >
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mr-4">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base">{step.description}</p>
                </div>
                {index < 2 && (
                  <ChevronRight className="hidden md:block w-6 h-6 md:w-8 md:h-8 ml-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-12 md:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">
            Pricing Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Basic",
                price: "$9.99",
                features: [
                  "5 IoT Devices",
                  "Mobile App Access",
                  "24/7 Support",
                ],
              },
              {
                title: "Pro",
                price: "$19.99",
                features: [
                  "15 IoT Devices",
                  "Advanced Automation",
                  "Energy Analytics",
                ],
              },
              {
                title: "Enterprise",
                price: "Custom",
                features: [
                  "Unlimited Devices",
                  "Custom Integration",
                  "Dedicated Account Manager",
                ],
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">
                      {plan.title}
                    </CardTitle>
                    <CardDescription className="text-2xl md:text-3xl font-bold">
                      {plan.price}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <ChevronRight className="w-4 h-4 mr-2 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6">Choose Plan</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="signup" className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
            Get Started Today
          </h2>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
