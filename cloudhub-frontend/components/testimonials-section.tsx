import Image from "next/image"
import { Star } from "lucide-react"

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "CloudHub made organizing our company hackathon incredibly simple. The platform handled everything from registration to judging, and the escrow service gave our participants confidence in the prize distribution.",
      author: "Sophia Rodriguez",
      role: "Innovation Lead at TechCorp",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
    },
    {
      quote:
        "As a hackathon participant, I love how CloudHub connects me with mentors who have real industry experience. The guidance I received helped my team win first place!",
      author: "David Kim",
      role: "Software Engineer",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
    },
    {
      quote:
        "The mentor marketplace is a game-changer. I've been able to share my expertise with talented developers while earning extra income on my own schedule.",
      author: "Aisha Patel",
      role: "UX Designer & Mentor",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4,
    },
  ]

  return (
    <section id="testimonials" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">What Our Community Says</h2>
          <p className="text-lg text-slate-600">
            Join thousands of organizers, participants, and mentors who are already part of the CloudHub ecosystem.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <blockquote className="text-slate-700 mb-6">"{testimonial.quote}"</blockquote>
              <div className="flex items-center">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{testimonial.author}</p>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-4xl mx-auto">
          <div className="grid gap-8 md:grid-cols-3 items-center">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Join Our Growing Community</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">10K+</p>
                  <p className="text-sm text-slate-600">Active Users</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">250+</p>
                  <p className="text-sm text-slate-600">Hackathons</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">5M+ AED</p>
                  <p className="text-sm text-slate-600">Prize Money</p>
                </div>
              </div>
              <p className="text-slate-600">
                CloudHub is trusted by individual developers, startups, enterprises, and educational institutions
                worldwide.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              {["TechCorp", "InnovateCo", "DevUniversity", "StartupX", "GlobalTech"].map((company, i) => (
                <div key={i} className="h-10 px-4 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-slate-700">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
