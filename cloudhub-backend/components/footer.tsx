import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"
import AnimatedGradientText from "./animated-gradient-text"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Mentors", href: "#mentors" },
        { name: "API", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Guides", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Support", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Partners", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
  ]

  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <Github className="h-5 w-5" />, href: "#", label: "GitHub" },
  ]

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 xl:gap-12">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link href="/" className="block">
                <Image
                  src="/CloudHub.svg"
                  alt="CloudHub Logo"
                  width={180}
                  height={48}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </Link>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-md">
              CloudHub is a community marketplace where anyone can create or participate in hackathons, with all the
              tools and services needed for success.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-slate-400 hover:text-violet-600 transition-colors transform hover:scale-110 duration-300"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((column, index) => (
            <div key={index}>
              <h3 className="font-semibold text-slate-900 mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-slate-600 hover:text-violet-600 transition-colors hover:translate-x-1 inline-block transform duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs sm:text-sm text-slate-500">&copy; {currentYear} CloudHub. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <Link href="#" className="text-xs sm:text-sm text-slate-600 hover:text-violet-600">
              Terms
            </Link>
            <Link href="#" className="text-xs sm:text-sm text-slate-600 hover:text-violet-600">
              Privacy
            </Link>
            <Link href="#" className="text-xs sm:text-sm text-slate-600 hover:text-violet-600">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
