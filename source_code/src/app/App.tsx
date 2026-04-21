import React from 'react';
import { Accordion } from './components/Accordion';
import { AnimatedBackground } from './components/AnimatedBackground';
import { TerminalContact } from './components/TerminalContact';
import { TypewriterProfile } from './components/TypewriterProfile';
import { NeonSignCTA } from './components/NeonSignCTA';
import { Globe, Code, Briefcase, Github, Instagram, Lock } from 'lucide-react';

export default function App() {
  const [isContactModalOpen, setIsContactModalOpen] = React.useState(false);

  const calculateExperience = () => {
    const startDate = new Date(2017, 0, 1); // January 2017
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
                <img src="/cartoon_profile_photo.png" alt="Profile" className="w-full h-full object-cover" />
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

            {/* Mobile: Show email, Desktop: Show Contact Me pill */}
            <a
              href="mailto:your.email@example.com"
              className="inline-block md:hidden mt-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
            >
              your.email@example.com
            </a>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="hidden md:inline-block mt-3 px-6 py-2 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-200 hover:bg-purple-600/50 hover:border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300"
            >
              Contact Me
            </button>
          </div>
        </div>

        {/* Profile Bio */}
        <TypewriterProfile
          texts={[
            "Passionate software developer with 9+ years of experience building scalable web applications and cloud infrastructure. Specialized in React, Node.js, and AWS.",
            "I love solving complex problems and creating elegant solutions that make a difference. Always exploring new technologies and best practices.",
            "Experienced in leading development teams, architecting microservices, and delivering enterprise solutions. Let's build something amazing together!"
          ]}
        />

        {/* Accordions Section */}
        <div className="space-y-6">
          <Accordion title="Active Websites I Maintain" defaultOpen={true} icon={Globe}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                <a href="#" className="text-purple-200 hover:text-purple-100 transition-colors">portfolio.example.com</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                <a href="#" className="text-purple-200 hover:text-purple-100 transition-colors">blog.example.com</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                <a href="#" className="text-purple-200 hover:text-purple-100 transition-colors">api.service.example.com</a>
              </div>
            </div>
          </Accordion>

          <Accordion title="Current Projects" icon={Code}>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Github className="w-5 h-5 text-purple-400" />
                  <h3 className="text-purple-200">AI-Powered Analytics Platform</h3>
                </div>
                <p className="text-purple-200/80">Building a comprehensive real-time analytics dashboard with advanced machine learning integration using TypeScript, React, and Python. The platform processes over 10 million data points daily and provides predictive insights using custom-trained neural networks. Key features include real-time data visualization with D3.js, automated anomaly detection using scikit-learn, and a microservices architecture deployed on AWS ECS. The system integrates with multiple data sources including PostgreSQL, MongoDB, and Apache Kafka for stream processing. Currently implementing advanced caching strategies with Redis to optimize query performance and reduce database load by 60%. The project also includes a comprehensive testing suite with Jest and Pytest, achieving over 90% code coverage.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Github className="w-5 h-5 text-purple-400" />
                  <h3 className="text-purple-200">Open Source Contribution: DevTools Pro</h3>
                </div>
                <p className="text-purple-200/80">Contributing to one of the most popular developer productivity tools on GitHub with over 50,000 stars. Focused on automation and workflow optimization features that help developers save hours of repetitive work. Recent contributions include implementing a plugin system using TypeScript that allows third-party extensions, refactoring the core CLI architecture to support concurrent task execution, and adding comprehensive documentation with interactive examples. Working closely with the maintainer team to review pull requests from the community and mentor new contributors. Successfully merged 15 PRs in the last quarter, including a major feature that enables custom scripting with JavaScript/TypeScript for advanced automation scenarios. The tool is used by thousands of developers worldwide and has been featured in several tech conferences.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Github className="w-5 h-5 text-purple-400" />
                  <h3 className="text-purple-200">E-Commerce Microservices Architecture</h3>
                </div>
                <p className="text-purple-200/80">Designing and implementing a highly scalable microservices-based e-commerce platform capable of handling millions of transactions per day. The architecture consists of 12 independent services including user management, product catalog, inventory tracking, order processing, payment gateway integration, and recommendation engine. Using Docker for containerization and Kubernetes for orchestration across multi-cloud environments (AWS and GCP). Implemented GraphQL API gateway with Apollo Server to provide a unified interface for all microservices, reducing API calls by 40%. Services communicate via event-driven architecture using RabbitMQ message queues to ensure eventual consistency. Database strategy includes PostgreSQL for transactional data, Elasticsearch for product search with fuzzy matching, and Redis for session management and caching. The system is designed for 99.99% uptime with automatic failover, circuit breakers using Hystrix, and comprehensive monitoring with Prometheus and Grafana dashboards.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-5 h-5 text-purple-400" />
                  <h3 className="text-purple-200">Mobile App: Fitness Tracker</h3>
                </div>
                <p className="text-purple-200/80">Developing a comprehensive cross-platform fitness tracking application using React Native that works seamlessly on both iOS and Android devices. The app features real-time health data synchronization with wearable devices including Apple Watch, Fitbit, and Garmin. Core functionality includes workout tracking with GPS route mapping, calorie counting with a database of over 500,000 foods, personalized workout plans generated by machine learning algorithms, and social features allowing users to challenge friends and share achievements. Backend built with Node.js and Express, using MongoDB for user data and workout history. Implemented real-time notifications using Firebase Cloud Messaging and WebSocket connections for live workout tracking. The app includes offline mode with local SQLite database that syncs when connectivity is restored. Advanced features include AR-powered form checker for exercises using TensorFlow Lite, integration with Apple HealthKit and Google Fit, and customizable dashboard widgets. Currently in beta testing with 500 active users providing valuable feedback for improvements.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-5 h-5 text-purple-400" />
                  <h3 className="text-purple-200">Cloud Infrastructure Automation Tool</h3>
                </div>
                <p className="text-purple-200/80">Creating a powerful infrastructure-as-code tool for automated cloud deployment, configuration management, and real-time monitoring across multiple cloud providers including AWS, Azure, and Google Cloud Platform. The tool is built with Go for performance and uses a declarative YAML-based configuration system similar to Terraform but with enhanced features for multi-cloud orchestration. Key capabilities include automated resource provisioning with dependency resolution, rolling deployments with automatic rollback on failure, cost optimization recommendations based on usage patterns, and security compliance checking against industry standards like CIS benchmarks. The monitoring component integrates with native cloud services and third-party tools like Datadog and New Relic, providing unified dashboards for infrastructure health across all environments. Implemented a plugin architecture allowing custom providers and integrations. The CLI tool includes interactive wizards for common tasks, reducing configuration time by 70%. Currently being used internally to manage infrastructure for 20+ production applications with over 500 cloud resources, resulting in 40% reduction in operational costs and 90% faster deployment cycles.</p>
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
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">2020 - 2024</span>
                    <h3 className="text-purple-200">Senior Developer at Tech Corp</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=react" alt="React" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=aws" alt="AWS" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=terraform" alt="Terraform" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=jest" alt="Jest" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=cypress" alt="Cypress" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=github" alt="GitHub" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=jenkins" alt="Jenkins" className="w-6 h-6" />
                  </div>
                  <p className="text-purple-200/80 mt-2">Led development of multiple cloud-based enterprise applications using React, Node.js, and AWS infrastructure. Managed and mentored a cross-functional team of 5 developers, conducting code reviews, sprint planning, and technical architecture decisions. Successfully delivered 8 major product releases on time and under budget, serving over 100,000 active users. Architected and implemented a microservices migration strategy that improved system scalability by 300% and reduced infrastructure costs by 35%. Spearheaded the adoption of DevOps practices including automated testing with Jest and Cypress, CI/CD pipelines using GitHub Actions and Jenkins, and infrastructure-as-code with Terraform. Collaborated with product managers and stakeholders to define technical requirements and translate business needs into scalable solutions. Implemented comprehensive monitoring and logging solutions using ELK stack and CloudWatch, reducing mean time to resolution for production issues by 60%. Championed best practices including code documentation, unit testing with 85% coverage requirement, and security standards compliance.</p>
                </div>

                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">2017 - 2020</span>
                    <h3 className="text-purple-200">Full Stack Developer at StartupXYZ</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=react" alt="React" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=redux" alt="Redux" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=express" alt="Express" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=postgres" alt="PostgreSQL" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=docker" alt="Docker" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=git" alt="Git" className="w-6 h-6" />
                  </div>
                  <p className="text-purple-200/80 mt-2">Built multiple scalable web applications from scratch as one of the first engineering hires at a fast-growing startup. Developed the core product using React, Redux, Node.js, Express, and PostgreSQL, which grew to serve 50,000+ users and process $5M in annual transactions. Implemented comprehensive CI/CD pipelines using CircleCI and Docker, enabling the team to deploy features multiple times per day with zero downtime. Designed and built RESTful APIs that integrated with third-party services including Stripe for payments, SendGrid for email notifications, and Twilio for SMS communications. Created responsive and accessible user interfaces following WCAG 2.1 guidelines, improving user engagement by 45%. Established modern development workflows including Git flow branching strategy, pull request reviews, and automated linting with ESLint and Prettier. Participated in on-call rotations and incident response, maintaining 99.9% uptime. Contributed to technical hiring by conducting over 30 technical interviews and developing coding challenges that improved candidate assessment quality.</p>
                </div>

                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">2015 - 2017</span>
                    <h3 className="text-purple-200">Software Developer at Digital Solutions Inc</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=angular" alt="Angular" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=php" alt="PHP" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=laravel" alt="Laravel" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=mysql" alt="MySQL" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=bootstrap" alt="Bootstrap" className="w-6 h-6" />
                  </div>
                  <p className="text-purple-200/80 mt-2">Developed custom web solutions for enterprise clients in healthcare, finance, and retail sectors, working on 12+ client projects simultaneously. Specialized in database optimization and API development, implementing complex SQL queries and stored procedures that improved query performance by up to 200%. Built integrations between legacy systems and modern web applications using SOAP and REST APIs. Created data migration tools that successfully transferred millions of records from on-premise databases to cloud-based solutions with zero data loss. Worked extensively with MySQL, SQL Server, and Oracle databases, implementing indexing strategies, query optimization, and database normalization best practices. Developed internal tools and admin panels using Angular, PHP Laravel, and Bootstrap that reduced manual data entry time by 70%. Collaborated with UX designers and project managers in agile sprints to deliver features that met client specifications and exceeded quality standards. Provided technical support and training to clients, creating comprehensive documentation and video tutorials that reduced support tickets by 40%.</p>
                </div>

                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">2013 - 2015</span>
                    <h3 className="text-purple-200">Junior Developer at WebWorks Agency</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=html" alt="HTML" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=css" alt="CSS" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=js" alt="JavaScript" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=jquery" alt="jQuery" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=php" alt="PHP" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=wordpress" alt="WordPress" className="w-6 h-6" />
                  </div>
                  <p className="text-purple-200/80 mt-2">Created responsive websites and web applications for small to medium businesses across various industries, completing over 25 projects during tenure. Developed pixel-perfect implementations of design mockups using HTML5, CSS3, JavaScript, jQuery, and PHP with WordPress and custom CMS solutions. Ensured cross-browser compatibility and mobile responsiveness, testing on multiple devices and browsers including IE8+, Chrome, Firefox, and Safari. Implemented SEO best practices including semantic HTML, meta tags optimization, schema markup, and page speed optimization achieving 90+ Google PageSpeed scores. Worked with clients to gather requirements, provide technical recommendations, and explain complex technical concepts in accessible language. Built custom WordPress themes and plugins, extending functionality with custom post types, meta boxes, and shortcodes. Integrated third-party APIs including Google Maps, social media platforms, payment gateways, and email marketing services. Maintained and updated existing client websites, fixing bugs and implementing new features while maintaining backwards compatibility.</p>
                </div>

                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">2012 - 2013</span>
                    <h3 className="text-purple-200">Intern Developer at CodeCraft Studios</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=html" alt="HTML" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=css" alt="CSS" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=js" alt="JavaScript" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=angular" alt="Angular" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=git" alt="Git" className="w-6 h-6" />
                  </div>
                  <p className="text-purple-200/80 mt-2">Assisted in front-end development projects for web and mobile applications, working closely with senior developers to learn industry best practices in agile software development. Contributed to various client projects by implementing UI components using HTML, CSS, and JavaScript frameworks including Backbone.js and early versions of Angular. Participated in daily stand-ups, sprint planning, and retrospective meetings following Scrum methodology. Wrote unit tests using Jasmine and maintained test coverage above 75% for new features. Fixed bugs and implemented small features under supervision, gaining experience with version control using Git and collaborative development workflows. Created wireframes and prototypes using tools like Balsamiq and Adobe XD to communicate design ideas. Learned responsive design principles and mobile-first development approach. Documented code and created wiki pages for internal knowledge sharing. Shadowed senior developers during code reviews and client meetings to understand professional software development lifecycle from requirements gathering to deployment and maintenance.</p>
                </div>

                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">2011 - 2012</span>
                    <h3 className="text-purple-200">Freelance Web Developer</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=html" alt="HTML" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=css" alt="CSS" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=js" alt="JavaScript" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=wordpress" alt="WordPress" className="w-6 h-6" />
                  </div>
                  <p className="text-purple-200/80 mt-2">Built custom websites for local businesses and individuals, completing 15+ projects ranging from simple landing pages to e-commerce stores. Gained valuable experience in client communication, requirement gathering, project scoping, and managing expectations. Developed websites using HTML, CSS, JavaScript, and popular CMS platforms including WordPress, Joomla, and Drupal. Provided end-to-end services including domain registration, hosting setup, website development, content migration, and post-launch support. Learned crucial project management skills including time estimation, milestone tracking, invoice generation, and maintaining professional relationships with repeat clients. Created portfolio pieces that demonstrated versatility across different industries including restaurants, real estate, photography, and professional services. Handled all aspects of the business including marketing, client acquisition, proposal writing, contract negotiation, and accounting. Developed problem-solving skills by troubleshooting various technical issues independently and researching solutions through online communities and documentation.</p>
                </div>

                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">2010 - 2011</span>
                    <h3 className="text-purple-200">Technical Support Specialist at TechHelp Co</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=windows" alt="Windows" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=linux" alt="Linux" className="w-6 h-6" />
                  </div>
                  <p className="text-purple-200/80 mt-2">Provided comprehensive technical support for software applications, handling an average of 30+ support tickets per day via phone, email, and live chat. Helped troubleshoot and resolve system issues for end users ranging from basic software navigation to complex technical problems. Developed deep product knowledge across multiple software platforms and maintained 95% customer satisfaction rating. Created and maintained knowledge base articles and video tutorials that reduced common support inquiries by 30%. Escalated complex issues to development team with detailed reproduction steps and log files, improving bug resolution time. Assisted with user onboarding and training, conducting webinars for groups of 20+ new users. Identified patterns in support tickets and provided feedback to product team for feature improvements. Used ticketing systems like Zendesk and collaboration tools like Slack to coordinate with team members. Built strong communication skills by explaining technical concepts to non-technical users in clear, patient manner. This role provided valuable perspective on user experience and the importance of writing user-friendly, well-documented software.</p>
                </div>

                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-2">
                    <span className="text-purple-300/70 text-sm whitespace-nowrap">2009 - 2010</span>
                    <h3 className="text-purple-200">IT Assistant at University Tech Lab</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <img src="https://skillicons.dev/icons?i=java" alt="Java" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=cpp" alt="C++" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=python" alt="Python" className="w-6 h-6" />
                    <img src="https://skillicons.dev/icons?i=windows" alt="Windows" className="w-6 h-6" />
                  </div>
                  <p className="text-purple-200/80 mt-2">Maintained computer lab equipment consisting of 100+ workstations and assisted students with software and hardware issues while completing computer science degree. Performed routine maintenance tasks including software updates, hardware upgrades, system imaging, and network troubleshooting. Provided one-on-one technical assistance to students learning programming languages including Java, C++, and Python, as well as software tools like Eclipse, Visual Studio, and MATLAB. Set up and configured new equipment for special projects and semester courses. Managed printer stations, ensuring adequate paper and toner supplies and resolving printing issues. Monitored lab security and enforced computer lab policies. Created simple batch scripts to automate repetitive system administration tasks. Worked evening and weekend shifts, developing time management skills while balancing work responsibilities with academic coursework. This position sparked interest in pursuing software development as a career by exposure to various programming concepts and interactions with computer science professors and students working on interesting projects.</p>
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
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-purple-900/50 border border-purple-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:border-purple-400/60 transition-all duration-300 group"
          >
            <Github className="w-6 h-6 text-purple-300 group-hover:text-purple-100 transition-colors" />
          </a>
          <a
            href="https://instagram.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-purple-900/50 border border-purple-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:border-purple-400/60 transition-all duration-300 group"
          >
            <Instagram className="w-6 h-6 text-purple-300 group-hover:text-purple-100 transition-colors" />
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