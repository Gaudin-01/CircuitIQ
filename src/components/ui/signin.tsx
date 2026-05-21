import { forwardRef, useCallback } from "react";
import { type VariantProps } from "class-variance-authority";
import { Loader2, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/use-auth"; // Adjust this path if needed!
import { Button, buttonVariants } from "./button";

export interface SignInButtonProps
  extends
    Omit<React.ComponentProps<"button">, "onClick">,
    VariantProps<typeof buttonVariants> {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  showIcon?: boolean;
  signInText?: string;
  signOutText?: string;
  loadingText?: string;
  asChild?: boolean;
}

export const SignInButton = forwardRef<HTMLButtonElement, SignInButtonProps>(
  (
    {
      onClick,
      disabled,
      showIcon = true,
      signInText = "Sign In",
      signOutText = "Sign Out",
      loadingText,
      className,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    // Bring in our custom Convex hook!
    const { isAuthenticated, signinRedirect, removeUser, isLoading } =
      useAuth();

    const handleClick = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        try {
          if (isAuthenticated) {
            await removeUser();
            toast.success("Signed out successfully");
          } else {
            await signinRedirect();
          }
        } catch (err) {
          console.error("Auth process failed:", err);
          toast.error("Action failed", { description: "Please try again." });
        }
      },
      [isAuthenticated, removeUser, signinRedirect, onClick],
    );

    const isDisabled = disabled || isLoading;

    // Logic for dynamic text and icons based on Convex Auth state
    const currentLoadingText =
      loadingText || (isAuthenticated ? "Signing Out..." : "Signing In...");
    const buttonText = isLoading
      ? currentLoadingText
      : isAuthenticated
        ? signOutText
        : signInText;

    const icon = isLoading ? (
      <Loader2 className="size-4 animate-spin" />
    ) : isAuthenticated ? (
      <LogOut className="size-4" />
    ) : (
      <LogIn className="size-4" />
    );

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        disabled={isDisabled}
        variant={variant}
        size={size}
        className={className}
        asChild={asChild}
        aria-label={isAuthenticated ? "Sign out" : "Sign in"}
        {...props}
      >
        {showIcon && icon}
        <span className="ml-2">{buttonText}</span>
      </Button>
    );
  },
);

SignInButton.displayName = "SignInButton";
