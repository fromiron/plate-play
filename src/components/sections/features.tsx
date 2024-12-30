import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Paintbrush,
  Zap,
  MoveHorizontalIcon as DragDropHorizontal,
  BarChart,
  Smartphone,
  Globe,
} from "lucide-react";

const features = [
  {
    title: "Drag-and-Drop Builder",
    description:
      "Create beautiful menus effortlessly with our intuitive interface.",
    icon: DragDropHorizontal,
  },
  {
    title: "Custom Branding",
    description:
      "Tailor your menu's look and feel to match your restaurant's style.",
    icon: Paintbrush,
  },
  {
    title: "Lightning Fast",
    description: "Static site generation ensures your menu loads instantly.",
    icon: Zap,
  },
  {
    title: "Responsive Design",
    description:
      "Your menu looks great on all devices, from phones to desktops.",
    icon: Smartphone,
  },
  {
    title: "Insightful Analytics",
    description: "Gain valuable insights into your menu's performance.",
    icon: BarChart,
  },
  {
    title: "Global CDN",
    description: "Serve your menu quickly to customers anywhere in the world.",
    icon: Globe,
  },
];

export default function Features() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Why Choose Plate Play?
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="mb-3 h-10 w-10 text-purple-600" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
