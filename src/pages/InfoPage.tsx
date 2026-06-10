import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

const INFO_CONTENT: Record<string, { title: string, subtitle: string, content: string }> = {
  '/how-it-works': {
    title: 'How It Works',
    subtitle: 'A seamless bridge between vision and experience.',
    content: `
      EventHub redefines the infrastructure of modern gatherings by eliminating friction.
      
      **For Attendees:**
      Immerse yourself in a curated portfolio of world-class summits, cultural festivals, and exclusive tech conferences. Our intelligent matching engine connects you with experiences that matter. Booking is instantaneous. Your digital pass, secured by cryptography, lives in your profile—ready to be scanned in milliseconds at the gate.
      
      **For Organizers:**
      Launch with precision. Our creator suite equips you with enterprise-grade tools: dynamic ticket tiering, real-time demand analytics, and seamless audience communication. From independent creators to multinational corporations, EventHub provides the operational clarity needed to execute flawless events.
    `
  },
  '/categories': {
    title: 'Curated Categories',
    subtitle: 'Experiences tailored to the vanguard.',
    content: `
      We meticulously curate our ecosystem to ensure profound relevance and uncompromising quality.
      
      - **Technology & AI:** Immerse yourself in the vanguard of software development, artificial intelligence, and decentralized systems.
      - **Venture & Startup:** Forge transformative connections with visionary founders, global VCs, and the angel investor community.
      - **Culture & Arts:** Experience the pinnacle of musical performances, heritage festivals, and contemporary art exhibitions.
      - **Policy & Leadership:** Engage in high-stakes discourse with the policymakers and thought leaders shaping tomorrow.
      
      Every category on EventHub represents a commitment to excellence, granting you access to the ideas and individuals moving the world forward.
    `
  },
  '/organizer': {
    title: 'Become an Organizer',
    subtitle: 'Architect the future of live experiences.',
    content: `
      Join an elite cohort of creators who leverage EventHub to launch industry-defining events. 
      
      We provide uncompromising infrastructure: deep data insights, frictionless payment operations, and direct access to an audience actively seeking premium intellectual and cultural capital. Elevate your event from a gathering to a landmark occasion.
    `
  },
  '/host-event': {
    title: 'Host an Event',
    subtitle: 'Enterprise capabilities. Creator intuition.',
    content: `
      Command your event from our state-of-the-art Creator Studio. 
      
      Gain absolute control over spatial mapping, dynamic pricing, and attendee lifecycle management. Whether hosting an intimate masterclass or a multi-day global summit, EventHub scales effortlessly to meet your ambition. Apply today to secure your presence on the platform.
    `
  },
  '/partnerships': {
    title: 'Global Partnerships',
    subtitle: 'Synergy at scale. Cultivate unparalleled value.',
    content: `
      We forge strategic alliances with vanguard brands, premier venues, and leading media conglomerates.
      
      Partnering with EventHub integrates your brand into the epicenter of professional and cultural convergence. Whether sponsoring flagship digital summits, becoming a certified venue partner, or co-authoring exclusive experiences, we deliver the precision analytics and audience reach necessary to multiply your impact.
    `
  },
  '/about': {
    title: 'About EventHub',
    subtitle: 'Engineering the ecosystem of human connection.',
    content: `
      EventHub was engineered to resolve the deep fragmentation within the global events industry.
      
      Our mandate is singular: to empower visionary creators and dynamic communities with technology that transforms discovery into seamless participation. We are uncompromising in our craftsmanship—from the elegance of our typography to the resilience of our distributed backend systems. 
      
      Headquartered in India, we are architects of the next paradigm in global platform infrastructure.
    `
  },
  '/careers': {
    title: 'Careers at EventHub',
    subtitle: 'Build infrastructure that moves the world.',
    content: `
      Join a multidisciplinary collective that prizes engineering rigor, exceptional design, and relentless operational excellence.
      
      We are actively scaling our core teams:
      - **Senior Systems Engineers:** Distributed systems, Node.js, and high-availability architecture.
      - **Frontend Architects:** React, WebGL, and uncompromising UI/UX execution.
      - **Product Designers:** Designing seamless, deeply intuitive human-computer interactions.
      
      If you are driven by the pursuit of perfection and the scale of our mission, we invite you to build with us.
    `
  },
  '/press': {
    title: 'Press & Media',
    subtitle: 'The narrative of our evolution.',
    content: `
      Access the latest intelligence, product paradigms, and corporate milestones from EventHub.
      
      We maintain an open dialogue regarding our product velocity, infrastructure milestones, and perspectives on the experiential economy. For exclusive briefings, brand assets, or executive statements, please engage directly with our global communications team.
    `
  },
  '/blog': {
    title: 'Insights & Engineering',
    subtitle: 'Deep dives from the frontier.',
    content: `
      Welcome to the intellectual core of EventHub.
      
      Here, we publish definitive architectural breakdowns on how we scale our microservices, exclusive interviews with the world's leading event producers, and strategic playbooks on accelerating community growth in the modern era.
    `
  },
  '/faq': {
    title: 'Frequently Asked Questions',
    subtitle: 'Clarity and operational guidance.',
    content: `
      **Q: How is my digital pass managed?**
      A: Your pass is cryptographically generated and securely stored in your "My Tickets" vault. Present the dynamically generated QR code for frictionless entry at the venue.
      
      **Q: What is the cancellation protocol?**
      A: Cancellation architecture is governed by each organizer's individual smart policy. Please consult the specific event manifesto for precise temporal and financial guidelines.
      
      **Q: How do tickets achieve instant availability?**
      A: Our high-throughput transactional database processes your reservation in milliseconds, instantly minting your digital ticket without legacy delays.
    `
  },
  '/support': {
    title: 'Premium Support',
    subtitle: 'Uncompromising assistance, whenever required.',
    content: `
      Operational excellence demands flawless support.
      
      Our global resolution team operates 24/7 to ensure platform continuity.
      - For immediate transactional matters, engage our secure live chat protocol.
      - For architectural or strategic queries, dispatch an email to support@eventhub.com.
      - Organizers requiring technical integration assistance may consult our comprehensive Developer Documentation.
    `
  },
  '/privacy': {
    title: 'Privacy Architecture',
    subtitle: 'Data sovereignty and absolute security.',
    content: `
      Your privacy is not a preference; it is a fundamental design constraint.
      
      We capture only the telemetry strictly required to execute your transactions and optimize platform performance. We fundamentally reject the monetization of personal data to third-party brokers. All data payloads are secured via enterprise-grade AES-256 encryption, both in transit and at rest.
    `
  },
  '/terms': {
    title: 'Terms of Service',
    subtitle: 'The operating principles of our ecosystem.',
    content: `
      Engagement with EventHub constitutes alignment with our operational mandates.
      
      We maintain uncompromising content hygiene and behavioral standards. Organizers leveraging our cryptographic ticketing layer are strictly vetted; unauthorized, deceptive, or malicious utilization is permanently prohibited.
    `
  },
  '/cookies': {
    title: 'Cookie Infrastructure',
    subtitle: 'Optimizing session continuity.',
    content: `
      EventHub utilizes sophisticated local storage protocols to guarantee session integrity and high-performance navigation.
      
      This architecture supports critical authentication lifecycles and anonymized telemetry, empowering our engineering teams to refine the platform dynamically. You retain granular control over these infrastructural preferences.
    `
  },
  '/contact': {
    title: 'Corporate Connectivity',
    subtitle: 'Direct lines to our operational hubs.',
    content: `
      **Global Headquarters:**
      EventHub Technologies 
      Bengaluru, India
      
      **Dedicated Channels:**
      - Enterprise Sales: enterprise@eventhub.com
      - Talent Acquisition: careers@eventhub.com
      - Media Relations: press@eventhub.com
      - Priority Support: support@eventhub.com
    `
  }
};

export default function InfoPage() {
  const location = useLocation();
  const data = INFO_CONTENT[location.pathname] || {
    title: 'Not Found',
    subtitle: 'The page you are looking for does not exist.',
    content: 'Please navigate back to the home page.'
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative flex flex-col items-center">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="max-w-[800px] w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-bold tracking-tight mb-4 display-font">{data.title}</h1>
          <p className="text-xl text-gray-400 font-light mb-16">{data.subtitle}</p>
          
          <div className="max-w-none text-gray-300 text-lg">
            {data.content.split('\n').filter(p => p.trim() !== '').map((paragraph, idx) => {
              if (paragraph.trim().startsWith('-')) {
                return <li key={idx} className="mb-2 ml-6 text-gray-300 list-disc leading-relaxed font-light">{paragraph.replace('-', '').trim()}</li>;
              }
              return <p key={idx} className="mb-6 leading-relaxed font-light">{paragraph.trim()}</p>;
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
