import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Globe, Shield, Smartphone } from "lucide-react";

const performanceMetrics = [
  {
    title: "Lightning Fast Load Times",
    description: "Average page load time of 0.5 seconds",
    icon: Zap,
  },
  {
    title: "Global CDN",
    description: "99.99% uptime with edge servers worldwide",
    icon: Globe,
  },
  {
    title: "Secure by Default",
    description: "Built-in HTTPS and DDoS protection",
    icon: Shield,
  },
  {
    title: "Mobile Optimized",
    description: "100% responsive across all devices",
    icon: Smartphone,
  },
];

export default function Performance() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Unmatched Performance
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {performanceMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader>
                <metric.icon className="mb-3 h-10 w-10 text-purple-600" />
                <CardTitle>{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
