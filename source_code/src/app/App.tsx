import React from 'react';
import { Accordion } from './components/Accordion';
import { AnimatedBackground } from './components/AnimatedBackground';
import { TerminalContact } from './components/TerminalContact';
import { TypewriterProfile } from './components/TypewriterProfile';
import { NeonSignCTA } from './components/NeonSignCTA';
import { Globe, Code, Briefcase, Github, Lock, Smartphone, ShoppingCart } from 'lucide-react';
import profileImage from '../assets/cartoon_profile_photo.png';

export default function App() {
  const [isContactModalOpen, setIsContactModalOpen] = React.useState(false);

  const calculateExperience = () => {
    const startDate = new Date(2016, 0, 1); // January 2016
    const currentDate = new Date();

    const years = currentDate.getFullYear() - startDate.getFullYear();
    const months = currentDate.getMonth() - startDate.getMonth();

    const totalMonths = years * 12 + months;
    const experienceYears = Math.floor(totalMonths / 12);
    const experienceMonths = totalMonths % 12;

    return `${experienceYears} years ${experienceMonths} months`;
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-black -z-20" />
      <AnimatedBackground />
      <div className="max-w-6xl mx-auto relative z-20">
        {/* Header Section with Profile */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="relative flex flex-col items-center gap-4 order-1 md:order-2">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 p-1 shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:shadow-[0_0_60px_rgba(168,85,247,0.9)] transition-shadow duration-300">
              <div className="w-full h-full rounded-full bg-purple-900 flex items-center justify-center overflow-hidden">
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute -inset-4 bg-purple-500/20 rounded-full blur-2xl -z-10 animate-pulse"></div>
            <div className="px-4 py-2 rounded-full bg-purple-900/50 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.4)] backdrop-blur-sm text-center">
              <div className="text-purple-300/70 text-xs uppercase tracking-wider">Experience</div>
              <div className="text-purple-200 text-sm font-medium">{calculateExperience()}</div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left order-2 md:order-1">
            <h1 className="text-4xl md:text-6xl mb-3 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
              Marcel Mulders
            </h1>
            <p className="text-xl md:text-2xl text-purple-300/80">Senior Software Developer</p>

            <button
              onClick={() => setIsContactModalOpen(true)}
              className="mt-3 px-6 py-2 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-200 hover:bg-purple-600/50 hover:border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300"
            >
              Contact Me
            </button>
          </div>
        </div>

        {/* Profile Bio */}
        <TypewriterProfile
          texts={[
            "Seasoned Senior Software Engineer delivering secure, fault-tolerant solutions across mobile, web, backend, and infrastructure.",
            "I work closely with clients on requirements and solution architecture, then lead testing, documentation, and handover to ensure reliable delivery.",
            "I mentor engineers, run React Native knowledge-sharing, and champion continuous learning and security-focused engineering practices."
          ]}
        />

        {/* Accordions Section */}
        <div className="space-y-6">
          <Accordion title="Active Websites I Maintain" defaultOpen={true} icon={Globe}>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                  <a href="https://www.123helpmestudy.com" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-purple-100 transition-colors break-all font-medium">www.123helpmestudy.com</a>
                </div>
                <p className="text-purple-200/70 text-sm pl-5">A revolutionary online tutor marketplace platform designed to empower educators with complete flexibility. Work anywhere, anytime, and keep 100% of your hourly rate—no platform fees, no middlemen, just pure earning potential. Connecting students with passionate tutors while giving educators the freedom they deserve.</p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                  <a href="https://isras-bracelets.onrender.com" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-purple-100 transition-colors break-all font-medium">isras-bracelets.onrender.com</a>
                </div>
                <p className="text-purple-200/70 text-sm pl-5">A beautifully crafted custom eCommerce platform showcasing handmade bracelets designed and created by my talented niece. Built from the ground up on Render, this bespoke platform combines elegant design with robust functionality, enabling a seamless shopping experience for unique, artisan jewelry pieces.</p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full shadow-[0_0_8px_rgba(156,163,175,0.8)]"></span>
                  <a href="https://www.moneysavingexpert.com/savings-hub" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-purple-100 transition-colors break-all font-medium">www.moneysavingexpert.com/savings-hub</a>
                </div>
                <p className="text-purple-200/70 text-sm pl-5">An innovative interactive savings recommendation hub built while leading a development team for a previous employer. Though no longer actively maintained, I architected and implemented the groundbreaking foundation—leveraging Cloudflare edge computing for lightning-fast performance and building the dynamic, user-centric features that power intelligent savings insights. A testament to modern web architecture at scale.</p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                  <a href="https://www.hantsiowrosecroix.org.uk" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-purple-100 transition-colors break-all font-medium">www.hantsiowrosecroix.org.uk</a>
                </div>
                <p className="text-purple-200/70 text-sm pl-5">The official digital hub for the Rose Croix in the province of Hampshire and Isle of Wight. This comprehensive informational website keeps members and visitors connected with real-time event calendars, announcements, and organizational updates—bridging tradition with modern digital accessibility.</p>
              </div>
            </div>
          </Accordion>

          <Accordion title="Current Projects" icon={Code}>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-5 h-5 text-purple-400" />
                  <h3 className="text-purple-200">FeeNix Mobile Phone</h3>
                </div>
                <p className="text-purple-200/80">Pioneering a revolutionary open-source mobile phone that breaks free from traditional smartphone constraints. Built on a custom Linux-based architecture specifically optimized to run on the Raspberry Pi Zero 2W with integrated mobile SIM capabilities, FeeNix represents the convergence of open-source philosophy and practical mobile computing. The device features a meticulously crafted custom user interface that seamlessly bridges the Linux and Android ecosystems, enabling users to install and run Android applications while maintaining full control over their device at the kernel level. This isn't just another Linux phone—it's a complete reimagining of what a mobile device can be when you combine the flexibility of ARM-based computing, the power of open-source software, and the practicality of Android app compatibility. The project encompasses custom PCB design for optimal component integration, low-level driver development for hardware interfacing, and an intuitive UI framework that makes advanced features accessible to everyday users. FeeNix is designed for privacy-conscious individuals, developers who want full device control, and anyone who believes in the right to truly own their technology. Currently in active development with working prototypes demonstrating voice calls, data connectivity, and seamless Android app execution on pure Linux infrastructure.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-5 h-5 text-purple-400" />
                  <h3 className="text-purple-200">Open eCommerce</h3>
                </div>
                <p className="text-purple-200/80">Democratizing online commerce through a groundbreaking serverless architecture that delivers enterprise-grade eCommerce capabilities at virtually no cost. Open eCommerce leverages the edge computing power of Cloudflare Workers as an intelligent proxy layer combined with Google Apps Script to expose a suite of flexible, production-ready API endpoints. This innovative approach transforms traditional eCommerce infrastructure—what typically costs thousands in monthly hosting, database management, and scaling becomes accessible to anyone with an internet connection. The system operates as a unified, massive-scale eCommerce platform while maintaining complete data segregation per entity, allowing thousands of independent businesses to share the same robust infrastructure without compromising security or privacy. Each business gets their own isolated data namespace, custom configurations, and complete control over their storefront logic—all while benefiting from shared optimizations and zero infrastructure management. The platform is interface-agnostic, meaning developers can build custom storefronts using any framework (React, Vue, mobile apps) while leveraging battle-tested backend logic for product management, inventory tracking, order processing, and payment integration. By utilizing serverless technologies and smart caching strategies, the system automatically scales from zero to millions of requests without manual intervention or cost spikes. Perfect for startups, small businesses, and developers who want powerful eCommerce capabilities without the complexity and expense of traditional platforms.</p>
              </div>
            </div>
          </Accordion>

          <Accordion title="Past Experience" icon={Briefcase}>
            <div className="relative pl-8">
              {/* Timeline Line */}
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700"></div>

              <div className="space-y-8">
                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">Feb 2023 - Present</span>
                    <h3 className="text-purple-200">Senior Software Engineer at CreateFuture</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=react" alt="React" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=terraform" alt="Terraform" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=aws" alt="AWS" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=python" alt="Python" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=azure" alt="Azure" className="w-6 h-6" />
                  </div>
                  <ul className="text-purple-200/80 mt-2 space-y-1 list-disc list-inside">
                    <li>Liaise with clients on requirements, architect solutions, and lead testing, documentation &amp; handover.</li>
                    <li>Line-manage and mentor engineers across all seniority levels; run the React Native community of practice.</li>
                    <li>Security champion — ensuring delivery of fault-tolerant and secure systems.</li>
                    <li>Fanduel: casino &amp; racing reward system (React, React Native) and address verification service (Kafka, Node.js).</li>
                    <li>Sky Betting &amp; Gaming: draw-in card game (Node.js, Terraform, AWS).</li>
                    <li>MoneySavingExpert: Savings Hub micro-frontend (Vue.js, Node.js Lambdas on AWS).</li>
                    <li>Baillie Gifford Sidekick+: safe mode for AI chat platform (React, Python).</li>
                    <li>Greenfield AI search platform for local government &amp; social care ombudsman (Python, React, OpenAI on Azure).</li>
                    <li>Delivered React Native enterprise training to ~70 engineers across seniority and tech backgrounds.</li>
                  </ul>
                </div>

                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">Jun 2021 - Feb 2023</span>
                    <h3 className="text-purple-200">Software Engineer at Dotfive</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=react" alt="React" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=python" alt="Python" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=postgres" alt="PostgreSQL" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=elasticsearch" alt="Elasticsearch" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=kafka" alt="Kafka" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=kubernetes" alt="Kubernetes" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=docker" alt="Docker" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=aws" alt="AWS" className="w-6 h-6" />
                  </div>
                  <ul className="text-purple-200/80 mt-2 space-y-1 list-disc list-inside">
                    <li>Architected and delivered client solutions across analytics and platform engineering.</li>
                    <li>Built Elasticsearch &amp; Kibana infrastructure on AWS; redeployed Node.js web-scraper &amp; ETL pipeline with Airflow &amp; Docker.</li>
                    <li>Implemented Python Airflow DAGs processing Kafka financial data into PostgreSQL; Scala data transforms with S3.</li>
                    <li>Custom Airflow UI extensions orchestrating 300+ jobs; FastAPI microservices deployed to ECS.</li>
                    <li>Bespoke CI/CD build manager in Bash, Python, and Ruby (Chef); Pritunl VPN deployment.</li>
                    <li>Greenfield React trading platform with Python-scripted data automation and ORM backend.</li>
                    <li>Kubernetes restructuring for two platforms — focusing on HA, scalability, and health monitoring.</li>
                  </ul>
                </div>

                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">Oct 2020 - Jun 2021</span>
                    <h3 className="text-purple-200">Software Developer at Cerberus Technologies</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=python" alt="Python" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=aws" alt="AWS" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=selenium" alt="Selenium" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=html" alt="HTML" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=css" alt="CSS" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=jquery" alt="jQuery" className="w-6 h-6" />
                  </div>
                  <ul className="text-purple-200/80 mt-2 space-y-1 list-disc list-inside">
                    <li>Python backend operations and infrastructure automation.</li>
                    <li>Automated VM provisioning &amp; software installation via SQS, EC2, and Secrets Manager.</li>
                    <li>Live billing-stat monitoring, automated failover, and error correction systems.</li>
                    <li>Selenium-based automated deployment testing.</li>
                    <li>Internal management UI for products and pricing (HTML, CSS, jQuery).</li>
                  </ul>
                </div>

                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">Oct 2018 - Oct 2020</span>
                    <h3 className="text-purple-200">IT Manager at Lazy Susan</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=flask" alt="Flask" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=php" alt="PHP" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=js" alt="JavaScript" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=html" alt="HTML" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=css" alt="CSS" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=linux" alt="Linux" className="w-6 h-6" />
                  </div>
                  <ul className="text-purple-200/80 mt-2 space-y-1 list-disc list-inside">
                    <li>Line-managed 7 employees; managed third-party suppliers for advertising, digital, and accounting.</li>
                    <li>Administered 5 servers; built bespoke ETL pipeline consolidating ecommerce &amp; accounting data into a data warehouse.</li>
                    <li>Led development of custom Flask ERP integrating Shopware, Amazon, and eBay order management.</li>
                    <li>Built a Digital Asset Management platform (JavaScript, HTML, CSS).</li>
                    <li>Managed Google Search &amp; Shopping, Facebook, and Amazon advertising channels.</li>
                    <li>Delivered custom tooling to improve productivity across operations, finance, and customer services.</li>
                  </ul>
                </div>

                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">May 2017 - Sep 2018</span>
                    <h3 className="text-purple-200">Senior Robotics Engineer &amp; Operations MI at Utilita Energy</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=python" alt="Python" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=postgres" alt="SQL" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=linux" alt="Linux" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=git" alt="Git" className="w-6 h-6" />
                  </div>
                  <ul className="text-purple-200/80 mt-2 space-y-1 list-disc list-inside">
                    <li>Line-managed 3 engineers; recruited junior developers and developed team robotics capability.</li>
                    <li>Led development &amp; project management of the BluePrism RPA platform stack.</li>
                    <li>Built SQL &amp; Python server-side systems to dynamically adjust customer debt collection rates.</li>
                    <li>Performed data manipulation on a CRM of ~500,000 customers to report on debt levels.</li>
                  </ul>
                </div>

                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">Feb 2017 - May 2017</span>
                    <h3 className="text-purple-200">Forecast Analyst at Utilita Energy</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=python" alt="Python" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=postgres" alt="SQL" className="w-6 h-6" />
                  </div>
                  <ul className="text-purple-200/80 mt-2 space-y-1 list-disc list-inside">
                    <li>Collected and analysed weekly call-volume data for each customer services team.</li>
                    <li>Produced weekly, monthly, and annual call-volume forecasts.</li>
                    <li>Optimised staff distribution across shifts to hit SLAs within a 4-week planning window.</li>
                    <li>Assumed staff resourcing role, allocating shifts for 550 employees.</li>
                  </ul>
                </div>

                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">Jan 2016 - Present</span>
                    <h3 className="text-purple-200">Software Mentor / Private Tutor at 123 Help Me Study</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=html" alt="HTML" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=css" alt="CSS" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=js" alt="JavaScript" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=python" alt="Python" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=react" alt="React" className="w-6 h-6" />
                  </div>
                  <ul className="text-purple-200/80 mt-2 space-y-1 list-disc list-inside">
                    <li>Provide 1-to-1 online lessons for students learning to code.</li>
                    <li>Built and manage a personal website to attract new students.</li>
                    <li>Partner with Code Institute to mentor students through HTML, CSS, JavaScript, and Python projects.</li>
                  </ul>
                </div>
              </div>
            </div>
          </Accordion>
        </div>

        {/* Neon Sign CTA */}
        <NeonSignCTA onOpenContact={() => setIsContactModalOpen(true)} />

        {/* Social Media Links */}
        <div className="flex justify-center gap-6 mt-16">
          <a
            href="https://github.com/marcel-dev-acc"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-purple-900/50 border border-purple-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:border-purple-400/60 transition-all duration-300 group"
          >
            <Github className="w-6 h-6 text-purple-300 group-hover:text-purple-100 transition-colors" />
          </a>
        </div>
      </div>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <TerminalContact
          isModal={true}
          onClose={() => setIsContactModalOpen(false)}
        />
      )}
    </div>
  );
}