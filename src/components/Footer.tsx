import Link from "next/link";
import Image from "next/image";
import balloonImage from "@/lib/assets/balloon.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-stone-200 bg-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src={balloonImage} alt="LumiTrip" width={32} height={32} />
              <span className="text-lg font-bold text-stone-900">VoyageBlitz</span>
            </div>
            <p className="text-sm text-stone-600">
              Personalized travel recommendations that understand what you really need.
            </p>
          </div>

          {/* About section */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-4">About</h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/wandertypes" className="hover:text-primary transition-colors">
                  Wander Types
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact section */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <a href="mailto:hello@lumitrip.com" className="hover:text-primary transition-colors">
                  hello@voyageblitz.com
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-primary transition-colors">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-stone-200 mt-8 pt-8 text-center text-sm text-stone-500">
          © {currentYear} VoyageBlitz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
