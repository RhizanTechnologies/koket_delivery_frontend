import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaRegCopyright,
} from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-foreground text-background px-6 md:px-12 lg:px-24 py-12 md:py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="flex flex-col">
          <div className="text-primary text-xl sm:text-2xl font-kaushan mb-3">
            Koket Bakery
          </div>
          <p className="text-background/80  text-sm sm:text-base max-w-md">
            Handcrafted cakes and desserts created with passion and premium
            ingredients for every celebration.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <div className="text-primary font-semibold mb-4 text-base sm:text-lg">
            Quick Links
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/products"
                className="text-background/80 hover:text-primary transition-colors"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/custom-orders"
                className="text-background/80 hover:text-primary transition-colors"
              >
                Custom Order
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-background/80 hover:text-primary transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-background/80 hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="text-primary font-semibold mb-4 text-base sm:text-lg">
            Contact Us
          </div>

          <ul className="text-sm space-y-2 text-background/80">
            <li className="break-words">
              Tulu Dimtu, near Shewa Supermarket, Atika Building
            </li>
            <li>Addis Ababa, Ethiopia</li>

            <li>
              Phone:
              <div className="flex flex-col ml-1">
                <Link 
                  href="tel:+251911529898"
                  className="hover:text-primary cursor-pointer text-base"
                >
                  09 11 52 98 98
                </Link>
                <Link 
                  href="tel:+251916911591"
                  className="hover:text-primary cursor-pointer text-base"
                >
                  09 16 91 15 91
                </Link>
                <Link 
                  href="tel:+251912700250"
                  className="hover:text-primary cursor-pointer text-base"
                >
                  09 12 70 02 50
                </Link>
              </div>
            </li>

            <li>
              Email:{" "}
              <Link
                href="mailto:koketbakeryandpastry@gmail.com"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                koketbakeryandpastry@gmail.com
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <div className="text-primary font-semibold mb-4 text-base sm:text-lg">
            Follow Us
          </div>
          <div className="flex gap-4 mt-2 text-2xl">
            <a
              href="#"
              aria-label="Facebook"
              className="text-background/80 hover:text-primary transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-background/80 hover:text-primary transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="text-background/80 hover:text-primary transition-colors"
            >
              <FaTiktok />
            </a>
            <a
              href="#"
              aria-label="X"
              className="text-background/80 hover:text-primary transition-colors"
            >
              <FaXTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-background/20 pt-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-background/70 text-sm sm:text-base">
            <FaRegCopyright />
            <span>Koket Bakery. All rights reserved</span>
          </div>

          <div className="text-sm text-background/70">
            <span className="hidden sm:inline">Crafted with care • </span>
            <Link
              href="/terms"
              className="text-background/80 hover:text-primary transition-colors mr-3"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-background/80 hover:text-primary transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
