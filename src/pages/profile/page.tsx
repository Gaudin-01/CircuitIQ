import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { cn } from "../../lib/utils";
import { api } from "../../../convex/_generated/api";
import { Button } from "../../components/ui/button";
import { Download, User, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SignInButton } from "../../components/ui/signin"; // Add this import!
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
} from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

export default function ProfilePage() {
  const navigate = useNavigate();
  const convexUser = useQuery(api.users.getCurrentUser);

  const isAdmin = convexUser?.role === "admin";
  const phoneNumber = "2349032212960";
  const message = "Hello, CircuitIQ support! I have a question.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

// ADD THIS NEW EFFECT:
  useEffect(() => {
    // 1. Function to show the ad
    const showBannerAd = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await AdMob.showBanner({
            adId: "ca-app-pub-3940256099942544/6300978111", // Google Test Banner ID
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.TOP_CENTER,
            margin: 0,
            isTesting: true, // REMOVE IN PRODUCTION
          });
        } catch (err) {
          console.error("AdMob Banner error:", err);
        }
      }
    };

    showBannerAd();

    // 2. Cleanup function to hide the ad when leaving the page
    // 2. CLEANUP: Hide the ad when leaving the profile page!
    return () => {
      if (Capacitor.isNativePlatform()) {
        AdMob.hideBanner().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-y-auto p-4 py-20">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Profile Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Username
              </span>
              <span className="font-medium text-blue-600">
                {convexUser?.username || "Anonymous"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Name
              </span>
              <span className="font-medium text-blue-600">
                {convexUser?.name || "Anonymous"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </span>
              <span className="font-medium truncate max-w-[15rem]">
                {convexUser?.email || "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>
        {isAdmin && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Admin Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-blue-300 hover:bg-blue-100"
                onClick={() => navigate("/manage-questions")}
              >
                Manage Quiz Questions
              </Button>
            </CardContent>
          </Card>
        )}
        {/* Auth Buttons: Show Sign Out if logged in, Sign In if not */}
        {/* Auth Buttons: The smart component handles state automatically! */}
        <div className="space-y-3">
          <SignInButton
            className="w-full py-6"
            // Dynamically make the button Red if they are logged in, or default primary if logged out
            variant={convexUser ? "destructive" : "default"}
            signInText="Sign In to Account"
            signOutText="Sign Out"
          />
        </div>

        {/* Android App Download*/}
        <div className="w-full max-w-md p-4 bg-secondary/10 rounded-xl border border-secondary/20 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-primary">
            Get the App
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Share CircuitIQ with your colleagues or install it on another
            device.
          </p>

          <DynamicDownloadButton />
          {/* <a
            href="/CircuitIQ.apk"
            download="CircuitIQ.apk"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all active:scale-95 shadow-md"
          >
            <Download size={20} />
            Download Android APK
          </a> */}
        </div>
        {/* Support Contact Info */}
        <p className="text-[12px] text-center text-muted-foreground px-6">
          Found any bug? Have you got any questions or feel that something isn't
          working right? please reach out to us at{" "}
          <a href={whatsappUrl} className="text-blue-600 hover:underline">
            support@circuitiq.com
          </a>
        </p>
      </div>
    </div>
  );
}

function DynamicDownloadButton() {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // IMPORTANT: Replace YOUR_GITHUB_NAME and YOUR_REPO_NAME below!
    fetch("https://api.github.com/repos/Gaudin-01/CircuitIQ/releases/latest")
      .then((res) => res.json())
      .then(
        (data: {
          assets?: { name: string; browser_download_url: string }[];
        }) => {
          // Find the asset that ends in .apk
          const apkAsset = data.assets?.find((asset) =>
            asset.name.endsWith(".apk"),
          );
          if (apkAsset) {
            setDownloadUrl(apkAsset.browser_download_url);
          }
          setLoading(false);
        },
      )
      .catch((err) => {
        console.error("Failed to fetch latest release", err);
        setLoading(false);
      });
  }, []);

  return (
    <a
      href={downloadUrl || "#"}
      className={cn(
        "flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg transition-all shadow-md font-medium",
        downloadUrl
          ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
          : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none",
      )}
    >
      <Download size={20} />
      {loading ? "Locating Latest APK..." : "Download Android APK"}
    </a>
  );
}
