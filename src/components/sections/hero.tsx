import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth, signIn } from "@/server/auth";
import Link from "next/link";

export default async function Hero() {
  const session = await auth();
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:py-20">
        <div className="flex flex-col-reverse items-center justify-between gap-2 md:flex-row md:gap-8">
          <div className="mb-10 mt-10 md:mb-0 md:mt-0 md:w-1/2">
            <h1 className="mb-12">
              <p className="text-6xl font-bold text-primary">Plate Play!</p>
              <p className="mt-6 text-3xl font-bold leading-relaxed text-stone-800 lg:text-4xl lg:leading-relaxed">
                プレートプレーで簡単にメニューページを作成しましょう。
              </p>
            </h1>
            <div className="rounded-lg bg-secondary p-8 text-sm leading-loose">
              直観的な操作でデザイン反応型レストランのメニューページを作ってみてください！
              <br />
              Drag & Dropで簡単にできます。コーディングは必要ありません！
            </div>
            <div className="mt-10">
              {session?.user.email ? (
                <Link
                  href={"/dashboard"}
                  className={cn(
                    buttonVariants({ variant: "default", size: "default" }),
                  )}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <form
                  action={async () => {
                    "use server";
                    await signIn("google");
                  }}
                >
                  <Button type="submit">Get Start</Button>
                </form>
              )}
            </div>
          </div>
          <div className="md:w-1/2 lg:w-2/3">
            <img
              src="https://picsum.photos/600/400"
              alt="Plate Play Interface Demo"
              className="w-full rounded-lg object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
