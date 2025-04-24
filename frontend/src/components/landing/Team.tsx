import { Github, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    github?: string;
    linkedin?: string;
  };
}

export default function TeamSection() {
  const teamMembers: TeamMember[] = [
    {
      name: 'Dadda Abdelghafour',
      role: 'Frontend Developer',
      bio: 'A passionate frontend developer with a love for coding.',
      image: '/images/abdelghafour.jpg?height=400&width=400',
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    },
    {
      name: 'Oussama Tahiri',
      role: 'Backend Developer',
      bio: 'A passionate backend developer with a love for coding.',
      image: '/?height=400&width=400',
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    },
    {
      name: 'Marouane El Hammal',
      role: 'Ai Engineer',
      bio: 'Passionate about AI and its applications in real-world scenarios.',
      image: '/images/marouane.jpg?height=400&width=400',
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    },
  ];

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden bg-[#0e0d14]">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
        <svg
          className="absolute h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Curved paths - Inverted direction (right to left) */}
          <path
            d="M100,20 Q60,40 30,35 T0,70"
            stroke="rgba(147, 51, 234, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M100,25 Q70,45 40,40 T0,75"
            stroke="rgba(139, 92, 246, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M100,30 Q55,35 25,30 T0,65"
            stroke="rgba(79, 70, 229, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M100,35 Q75,50 45,45 T0,80"
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="text-indigo-400 uppercase text-sm font-medium tracking-wider mb-4">
            OUR TEAM
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Meet the Innovators Behind EnsaAi
          </h2>
          <p className="text-lg text-gray-400">
            Our passionate and talented team is committed to delivering
            exceptional results, driving innovation, and transforming your
            vision into reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center group">
              {/* Image with gradient border */}
              <div className="relative mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-70 blur-sm group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-48 h-48 p-[2px] rounded-full overflow-hidden border-4 border-[#0e0d14] group">
                  <Image
                    src={member.image || '/placeholder.svg'}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>

                {/* Hover effect with social links */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/60 backdrop-blur-sm w-full h-full rounded-full flex items-center justify-center">
                    <div className="flex space-x-4">
                      {member.social.github && (
                        <a
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-indigo-500 transition-colors"
                        >
                          <Github className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-indigo-500 transition-colors"
                        >
                          <Linkedin className="w-5 h-5 text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <h3 className="text-xl font-bold text-white mb-1">
                {member.name}
              </h3>
              <div className="text-indigo-400 mb-3">{member.role}</div>
              <p className="text-gray-400 text-center max-w-xs">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
