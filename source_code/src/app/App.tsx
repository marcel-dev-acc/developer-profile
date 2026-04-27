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
                <img src={`${import.meta.env.BASE_URL}cartoon_profile_photo.png`} alt="Profile" className="w-full h-full object-cover" />
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
              href="mailto:marcelm4242@gmail.com"
              className="inline-block md:hidden mt-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
            >
              marcelm4242@gmail.com
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
            "Seasoned Senior Software Engineer delivering secure, fault-tolerant solutions across mobile, web, backend, and infrastructure.",
            "I work closely with clients on requirements and solution architecture, then lead testing, documentation, and handover to ensure reliable delivery.",
            "I mentor engineers, run React Native knowledge-sharing, and champion continuous learning and security-focused engineering practices."
          ]}
        />

        {/* Accordions Section */}
        <div className="space-y-6">
          <Accordion title="Active Websites I Maintain" defaultOpen={true} icon={Globe}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                <a href="https://www.123helpmestudy.com" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-purple-100 transition-colors">www.123helpmestudy.com</a>
              </div>
              {/* <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                <a href="#" className="text-purple-200 hover:text-purple-100 transition-colors">blog.example.com</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                <a href="#" className="text-purple-200 hover:text-purple-100 transition-colors">api.service.example.com</a>
              </div> */}
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