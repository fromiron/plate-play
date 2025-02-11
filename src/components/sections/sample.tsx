import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const samples = [
  { name: "Elegant Bistro", image: "https://picsum.photos/300/400" },

  { name: "Casual Diner", image: "https://picsum.photos/300/400" },

  {
    name: "Upscale Restaurant",
    image: "https://picsum.photos/300/400",
  },
  { name: "Cozy Café", image: "https://picsum.photos/300/400" },
];

export default function Samples() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Customizable Menu Styles
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {samples.map((sample, index) => (
            <Card key={index} className="overflow-hidden">
              <Image
                width={300}
                height={400}
                src={sample.image}
                alt={sample.name}
                className="h-48 w-full object-cover"
              />
              <CardContent className="p-4">
                <h3 className="mb-2 font-semibold">{sample.name}</h3>
                <Button variant="outline" size="sm">
                  Preview Style
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
