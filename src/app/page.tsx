import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CookingPot, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function HomePage() {
  return (
    <>
      <main className="container mx-auto flex-grow px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold">
            Create Stunning Menu Pages with Ease
          </h1>
          <p className="mb-8 text-xl">
            Drag, drop, and design your perfect menu in minutes.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>

        <section className="mb-16 grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg bg-muted p-6 text-center">
              <div className="mb-4 inline-block rounded-full bg-primary/10 p-3">
                <CookingPot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Sample Plate {i}</h3>
              <p>A beautiful menu design created with Plate Play.</p>
            </div>
          ))}
        </section>

        <section className="text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Play with Your Plates?
          </h2>
          <p className="mb-8 text-xl">
            Join thousands of restaurants creating stunning menus.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">Create Your First Plate</Link>
          </Button>
        </section>
      </main>
    </>
  );
}
