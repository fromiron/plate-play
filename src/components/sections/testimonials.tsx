import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Restaurant Owner",
    content:
      "Plate Play transformed our online presence. Our customers love how easy it is to browse our menu, and we've seen a significant increase in online orders!",
    avatar: "https://picsum.photos/40/40",
  },
  {
    name: "Michael Chen",
    role: "Cafe Manager",
    content:
      "The analytics feature has been a game-changer for us. We've optimized our menu based on real data, and our most popular items are now front and center.",
    avatar: "https://picsum.photos/40/40",
  },
  {
    name: "Emily Rodriguez",
    role: "Food Truck Owner",
    content:
      "As a food truck owner, having a digital menu that I can quickly update is invaluable. Plate Play makes it so simple, and the QR code feature has been a hit with our customers!",
    avatar: "https://picsum.photos/40/40",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {testimonial.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
