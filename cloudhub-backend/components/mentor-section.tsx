import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Star, Users } from "lucide-react"

export default function MentorSection() {
  const mentors = [
    {
      name: "Alex Johnson",
      role: "Full Stack Developer",
      rating: 4.9,
      hourlyRate: 120,
      expertise: ["React", "Node.js", "AWS"],
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Sarah Chen",
      role: "UX/UI Designer",
      rating: 4.8,
      hourlyRate: 100,
      expertise: ["Figma", "User Research", "Prototyping"],
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Michael Okonjo",
      role: "AI Specialist",
      rating: 5.0,
      hourlyRate: 150,
      expertise: ["Machine Learning", "Python", "TensorFlow"],
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <section id="mentors" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-violet-600 mr-2"></span>
            Mentorship
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Connect with Expert Mentors
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Get guidance from industry professionals who can help take your hackathon project to the next level.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
            >
              <div className="relative h-40 sm:h-48 w-full bg-gradient-to-r from-violet-100 to-indigo-100">
                <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white overflow-hidden bg-white">
                    <Image src={mentor.image || "/placeholder.svg"} alt={mentor.name} fill className="object-cover" />
                  </div>
                </div>
              </div>

              <div className="pt-12 sm:pt-16 px-4 sm:px-6 pb-6 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{mentor.name}</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-2">{mentor.role}</p>
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 text-sm font-medium text-slate-700">{mentor.rating}</span>
                </div>

                <div className="flex items-center justify-between mb-6 px-4 py-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-slate-500 mr-1" />
                    <span className="text-sm text-slate-700">${mentor.hourlyRate}/hour</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-slate-500 mr-1" />
                    <span className="text-sm text-slate-700">Available</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {mentor.expertise.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-white border border-slate-200 text-slate-900 hover:bg-violet-50 hover:border-violet-200 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300">
                  Book Session
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 sm:mt-20 relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600"></div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative p-6 sm:p-12 text-white">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-4 border border-white/10">
                  <Users className="h-4 w-4 text-white mr-2" />
                  Become a Mentor
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Share Your Expertise</h3>
                <p className="text-base sm:text-lg text-white/80 mb-6">
                  Share your expertise with the CloudHub community and earn income by mentoring hackathon participants.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Set your own hourly rate and availability",
                    "Choose which hackathons to support",
                    "Provide guidance in your area of expertise",
                    "Build your professional network and reputation",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/10 flex items-center justify-center mr-3 mt-0.5 border border-white/20">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="bg-white text-violet-900 hover:bg-white/90 px-6 py-6 h-auto text-base font-medium rounded-xl">
                  Apply as Mentor
                </Button>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
                <h4 className="text-xl font-semibold text-white mb-6">How It Works</h4>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4 border border-white/20">
                      <span className="text-base font-bold text-white">1</span>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium text-white mb-2">Create Your Profile</h5>
                      <p className="text-white/80">
                        Set up your mentor profile with your skills, experience, and hourly rate.
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4 border border-white/20">
                      <span className="text-base font-bold text-white">2</span>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium text-white mb-2">Choose Hackathons</h5>
                      <p className="text-white/80">
                        Browse active hackathons and select those that match your expertise.
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4 border border-white/20">
                      <span className="text-base font-bold text-white">3</span>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium text-white mb-2">Book Sessions</h5>
                      <p className="text-white/80">Participants book time slots based on your availability calendar.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4 border border-white/20">
                      <span className="text-base font-bold text-white">4</span>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium text-white mb-2">Get Paid</h5>
                      <p className="text-white/80">Receive payments directly to your account (minus platform fee).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
