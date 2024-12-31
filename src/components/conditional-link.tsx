import Link from "next/link";

export const ConditionalLink = ({
  children,
  href,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  href: string;
  disabled?: boolean;
} & React.ComponentProps<typeof Link>) => {
  if (disabled) {
    return (
      <div className="cursor-not-allowed opacity-80 grayscale">{children}</div>
    );
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
};
