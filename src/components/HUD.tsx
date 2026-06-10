'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from 'next-themes';

function SplashScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Star spins and scales up to "pop" into existence
    // Added opacity: 1 to ensure it becomes visible immediately when animation starts
    tl.fromTo(starRef.current, 
      { scale: 0, rotation: -90, opacity: 1 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "back.out(1.5)" }
    );

    // 2. Tiny pause to look cool
    tl.to({}, { duration: 0.2 });

    // 3. Star scales massively to engulf the screen, while background fades to transparent
    // We remove the expensive drop-shadow filter right as it scales up to prevent massive GPU lag
    tl.to(starRef.current, { 
      scale: 150, 
      rotation: 90, 
      duration: 1.2, 
      ease: "power3.in",
      onStart: () => {
        if (starRef.current) starRef.current.style.filter = "none";
      }
    });
    tl.to(containerRef.current, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "<0.4");

    // 4. Completely hide the splash screen so user can interact with the underlying UI
    tl.set(containerRef.current, { display: "none" });

  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-dark">
      {/* Set initial state using opacity-0 to prevent flash before GSAP initializes */}
      <svg ref={starRef} className="w-24 h-24 text-text-main drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] opacity-0" style={{ transform: 'scale(0) rotate(-90deg)', willChange: 'transform' }} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M50 0 C 53 40, 60 47, 100 50 C 60 53, 53 60, 50 100 C 47 60, 40 53, 0 50 C 40 47, 47 40, 50 0 Z" />
      </svg>
    </div>
  );
}

export default function HUD() {
  const hudRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Refresh ScrollTrigger to ensure calculations are correct after render
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    
    hudRefs.current.forEach((panel) => {
      if (!panel) return;
      gsap.fromTo(panel, 
        { y: 80, opacity: 0 },
        {
          scrollTrigger: {
            trigger: panel,
            start: "top 85%",
            once: true
          },
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        }
      );
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  hudRefs.current = [];
  const addToRefs = (el: HTMLElement | null) => {
    if (el && !hudRefs.current.includes(el)) {
      hudRefs.current.push(el);
    }
  };

  return (
    <>
      <SplashScreen />
      <div id="main-scroll-container" className="relative z-10 w-full overflow-x-hidden">
      
      {/* 1. Hero */}
      <div className="min-h-screen flex items-center justify-center px-6 mb-[150px]">
        <div ref={addToRefs} className="relative bg-card-bg backdrop-blur-xl border border-neon-purple/40 rounded-2xl p-10 max-w-2xl w-full shadow-[0_0_50px_rgba(147,51,234,0.2)] text-center border-t-4 border-t-neon-purple mt-16">
          
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider text-text-main drop-shadow-[0_0_15px_#9333ea] mb-3 mt-4 leading-tight">
            <span className="block">R<span className="animate-flicker inline-block text-text-main/90">a</span>jku<span className="animate-flicker-delayed inline-block">m</span>ar</span>
            <span className="block">M<span className="animate-flicker inline-block">u</span>rugesan</span>
          </h1>
          <p className="text-xl text-neon-purple tracking-wider mb-6">Full Stack Software Engineer</p>
          <p className="text-text-muted text-sm leading-relaxed mb-6">
            Software Engineer with 4+ years of experience building innovative applications. Focused on AI-driven solutions, full-stack development, and cloud infrastructure. Experienced in owning the full product lifecycle, building adaptive AI agents, and automating complex business workflows.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-4 relative z-30">
            <a href="mailto:rajkumarm688@gmail.com" className="text-sm text-text-muted hover:text-neon-purple transition-colors">rajkumarm688@gmail.com</a>
            <span className="text-gray-600">|</span>
            <a href="https://wa.me/919659256401" className="text-sm text-text-muted hover:text-neon-purple transition-colors">+91 96592 56401</a>
          </div>
          <div className="mt-8 text-xs uppercase tracking-[4px] text-neon-purple animate-pulse relative z-30">Scroll to initiate ▼</div>
        </div>
      </div>

      {/* 2. Skills Zone (Blue) */}
      <div className="max-w-7xl mx-auto px-6 mb-[150px]">
        <div ref={addToRefs} className="text-center mb-16">
          <h2 className="text-3xl text-neon-blue font-bold tracking-widest uppercase drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">Core Directives</h2>
          <p className="text-text-muted mt-2">Technical Capabilities & Tooling</p>
        </div>
        
        <div className="flex flex-col gap-[60px]">
          <div className="flex justify-start">
            <SkillCard getRef={addToRefs} title="Languages" color="blue" align="left" skills={['TypeScript', 'JavaScript', 'Python', 'HTML5', 'CSS3', 'Tailwind CSS']} desc="Primary programming languages used for developing scalable backend and frontend applications." />
          </div>
          <div className="flex justify-end">
            <SkillCard getRef={addToRefs} title="Frameworks" color="blue" align="right" skills={['Node.js', 'NestJS', 'Next.js', 'React', 'Express.js', 'REST APIs']} desc="Architectural frameworks utilized for building robust REST APIs and interactive user interfaces." />
          </div>
          <div className="flex justify-start">
            <SkillCard getRef={addToRefs} title="Databases" color="blue" align="left" skills={['PostgreSQL (Aurora)', 'MongoDB', 'Redis', 'SQL', 'Vector DBs', 'TypeORM', 'Mongoose']} desc="Relational, NoSQL, and vector database systems for efficient data storage and rapid querying." />
          </div>
          <div className="flex justify-end">
            <SkillCard getRef={addToRefs} title="Cloud & Infra" color="blue" align="right" skills={['AWS (EC2, ECS, RDS, SES, Lambda)', 'Azure', 'Docker', 'Microservices', 'Serverless', 'CI/CD']} desc="Cloud providers and containerization tools for deploying highly available, scalable infrastructure." />
          </div>
          <div className="flex justify-center">
            <SkillCard getRef={addToRefs} title="AI / Agents" color="blue" align="center" skills={['LangGraph', 'LangChain', 'OpenAI', 'Claude Code', 'Cursor', 'Stateful Agents']} desc="Modern AI tooling and agentic workflows for building intelligent, autonomous software solutions." />
          </div>
        </div>
      </div>

      {/* 3. Experience Zone (Pink) */}
      <div className="max-w-7xl mx-auto px-6 mb-[150px]">
        <div ref={addToRefs} className="text-center mb-16">
          <h2 className="text-3xl text-neon-pink font-bold tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">Career Timeline</h2>
          <p className="text-text-muted mt-2">Zysk Technologies, Bangalore</p>
        </div>

        <div className="flex flex-col gap-[60px]">
          <div className="flex justify-end">
            <ExperienceCard getRef={addToRefs} role="Software Engineer" period="Sep 2024 – Present" align="right"
              details={[
                "Led the complete rollout of a secure, enterprise-grade AI assessment platform from scratch.",
                "Automated software deployments via CI/CD pipelines, significantly improving system uptime.",
                "Proactively identified and patched critical security vulnerabilities.",
                "Collaborated cross-functionally to define and execute agentic AI features using LangGraph."
              ]} />
          </div>
          <div className="flex justify-start">
            <ExperienceCard getRef={addToRefs} role="Backend Developer" period="Feb 2024 – Sep 2024" align="left"
              details={[
                "Launched an AI-powered email marketing platform to automate customer outreach workflows.",
                "Built real-time e-commerce integrations with Shopify to seamlessly sync product catalogs.",
                "Architected systems to smoothly handle massive spikes in user traffic using Redis queuing.",
                "Utilized OpenAI function calling to parse and execute complex user marketing commands."
              ]} />
          </div>
          <div className="flex justify-end">
            <ExperienceCard getRef={addToRefs} role="Junior Backend Developer" period="Mar 2022 – Feb 2024" align="right"
              details={[
                "Sped up system response times by over 40% by completely redesigning the core database structure.",
                "Successfully delivered critical payment processing flows via Razorpay integrations.",
                "Developed overlapping schedule resolution algorithms for a Co-Workspace management tool.",
                "Migrated legacy monolithic codebases to scalable microservices using NestJS."
              ]} />
          </div>
          <div className="flex justify-start">
            <ExperienceCard getRef={addToRefs} role="Family Business Operations" period="2017 – 2022" align="left"
              details={[
                "Managed family business operations before transitioning into the IT industry.",
                "Developed strong business acumen, client relationship management, and operational leadership skills."
              ]} />
          </div>
        </div>
      </div>

      {/* 4. Projects Zone (Purple) */}
      <div className="max-w-7xl mx-auto px-6 mb-[150px]">
        <div ref={addToRefs} className="text-center mb-16">
          <h2 className="text-3xl text-neon-purple font-bold tracking-widest uppercase drop-shadow-[0_0_10px_rgba(147,51,234,0.5)]">Project Modules</h2>
          <p className="text-text-muted mt-2">Key Engineering Accomplishments</p>
        </div>

        <div className="flex flex-col gap-[80px]">
          <div className="flex justify-start">
            <ProjectCard getRef={addToRefs} title="AI-Powered Skill Evaluation" align="left"
              tech={['LangChain', 'LangGraph', 'AWS ECS', 'PostgreSQL', 'NestJS']}
              details={[
                "Built adaptive AI agents: Leveraged LangChain and LangGraph to create stateful agents for mock assessments that adjust question difficulty in real time.",
                "Built a scalable backend: Developed a highly optimized backend application and wrote efficient database queries to power a B2B scoring algorithm.",
                "Architected AWS infrastructure: Designed a secure network configuration with AWS ECS/ECR, Load Balancers, and WAF, built for rapid auto-scaling."
              ]} />
          </div>
          <div className="flex justify-end">
            <ProjectCard getRef={addToRefs} title="AI Email Marketing Platform" align="right"
              tech={['Next.js', 'PostgreSQL', 'OpenAI', 'AWS SES', 'Redis', 'NestJS']}
              details={[
                "Engineered AI and microservices: Built a 4-service architecture and used OpenAI function calling to automate marketing workflows and segmentation.",
                "Built real-time integrations: Architected a plug-and-play Shopify sync and used Redis queuing to smoothly handle heavy traffic.",
                "Managed cloud deployment: Handled the full AWS lifecycle (EC2, SES, S3) and secured the platform with AWS Cognito for enterprise OAuth."
              ]} />
          </div>
          <div className="flex justify-start">
            <ProjectCard getRef={addToRefs} title="Co-Workspace Management Tool" align="left"
              tech={['MongoDB', 'Express.js', 'Node.js', 'React']}
              details={[
                "Developed core backend logic: Built a robust meeting room booking system that resolves overlapping schedules using atomic database transactions.",
                "Designed management and access tools: Created a CRUD system to track workspace amenities and an RBAC system for corporate admins.",
                "Delivered rapid updates: Shipped new features on bi-weekly sprint cycles within a high-velocity, 10 person Scrum team."
              ]} />
          </div>
          <div className="flex justify-end">
            <ProjectCard getRef={addToRefs} title="Medical Equipment Rental" align="right"
              tech={['NestJS', 'PostgreSQL', 'Razorpay']}
              details={[
                "Revamped the architecture: Migrated a legacy framework to NestJS and restructured the PostgreSQL database, reducing query wait times by 40%.",
                "Integrated payments and alerts: Connected Razorpay with secure webhooks for handling orders, and added automated SMS and email notifications.",
                "Improved code quality: Applied Object-Oriented Programming (OOP) principles to create a modular, testable backend."
              ]} />
          </div>
        </div>
      </div>

      {/* 5. Credentials Zone (Blue) */}
      <div className="max-w-7xl mx-auto px-6 mb-[100px]">
        <div ref={addToRefs} className="text-center mb-16">
          <h2 className="text-3xl text-neon-blue font-bold tracking-widest uppercase drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">Credentials & Academia</h2>
          <p className="text-text-muted mt-2">Certifications, Awards & Education</p>
        </div>

        <div className="flex flex-col gap-[60px]">
          <div className="flex justify-start">
            <div ref={addToRefs} className="bg-card-bg backdrop-blur-xl border border-neon-blue/40 rounded-2xl p-8 max-w-xl w-full shadow-[0_0_40px_rgba(0,243,255,0.1)] border-l-4 border-l-neon-blue">
              <h3 className="text-2xl font-bold text-text-main mb-6">Certifications</h3>
              <ul className="space-y-6">
                <li className="border-b border-border-subtle pb-4">
                  <a href="https://www.udemy.com/certificate/UC-7ce9dc33-1273-40dc-9c38-386fbf487c55/" target="_blank" rel="noreferrer" className="group">
                    <strong className="text-neon-blue block text-lg mb-1 group-hover:text-text-main transition-colors flex items-center gap-2">
                      AWS Solutions Architect Associate
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </strong>
                  </a>
                  <span className="text-sm text-text-muted">Udemy | Jul 2025</span>
                  <p className="text-sm text-text-muted mt-2">Specializing in cloud architecture and infrastructure design on AWS.</p>
                </li>
                <li>
                  <a href="https://www.guvi.in/certificate?id=jn1H058467y40fKD96" target="_blank" rel="noreferrer" className="group">
                    <strong className="text-neon-blue block text-lg mb-1 group-hover:text-text-main transition-colors flex items-center gap-2">
                      MERN Stack Developer
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </strong>
                  </a>
                  <span className="text-sm text-text-muted">HCL GUVI</span>
                  <p className="text-sm text-text-muted mt-2">Certified Full Stack Developer specializing in MongoDB, Express.js, React.js, and Node.js.</p>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end">
            <div ref={addToRefs} className="bg-card-bg backdrop-blur-xl border border-neon-blue/40 rounded-2xl p-8 max-w-xl w-full shadow-[0_0_40px_rgba(0,243,255,0.1)] border-r-4 border-r-neon-blue text-left">
              <h3 className="text-2xl font-bold text-text-main mb-6">Awards <span className="text-sm font-normal text-text-muted">(Zynaissance)</span></h3>
              <ul className="space-y-4">
                <li className="border-b border-border-subtle pb-3">
                  <strong className="text-neon-blue block text-lg">Empowering Aspirants (2025)</strong>
                  <p className="text-sm text-text-muted mt-1">Awarded for thinking boldly, exploring freely, and creating equal opportunities that move the team forward.</p>
                </li>
                <li className="border-b border-border-subtle pb-3">
                  <strong className="text-neon-blue block text-lg">3 Years of Excellence (2025)</strong>
                  <p className="text-sm text-text-muted mt-1">Recognized for sustained impact and dedication over three years of contributions at Zysk Technologies.</p>
                </li>
                <li className="border-b border-border-subtle pb-3">
                  <strong className="text-neon-blue block text-lg">Fire Fighter Award (2024)</strong>
                  <p className="text-sm text-text-muted mt-1">Recognized for handling critical issues under pressure and resolving technical challenges efficiently.</p>
                </li>
                <li>
                  <strong className="text-neon-blue block text-lg">Team Player Award (2023)</strong>
                  <p className="text-sm text-text-muted mt-1">Awarded for team success contribution and strong collaboration as a Node.js backend developer.</p>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Education Row */}
          <div className="flex justify-center mt-10">
            <div ref={addToRefs} className="bg-card-bg backdrop-blur-xl border border-neon-blue/40 rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_40px_rgba(0,243,255,0.1)] border-t-4 border-t-neon-blue">
              <h3 className="text-2xl font-bold text-text-main mb-6 text-center">Education</h3>
              <ul className="space-y-6">
                <li className="border-b border-border-subtle pb-4">
                  <div className="flex justify-between items-start mb-1">
                    <strong className="text-neon-blue text-lg">BE / Electronics & Communication</strong>
                    <span className="text-sm text-neon-blue/80 bg-neon-blue/10 px-2 py-1 rounded border border-neon-blue/30">2013 – 2017</span>
                  </div>
                  <span className="text-sm text-text-muted block">Excel Engineering College / Anna University | Namakkal</span>
                  <p className="text-sm text-text-muted mt-2 font-mono">CGPA: 6.56</p>
                </li>
                <li>
                  <div className="flex justify-between items-start mb-1">
                    <strong className="text-neon-blue text-lg">Higher Secondary (HSC)</strong>
                    <span className="text-sm text-neon-blue/80 bg-neon-blue/10 px-2 py-1 rounded border border-neon-blue/30">2012 – 2013</span>
                  </div>
                  <span className="text-sm text-text-muted block">Shri Vethathiri Vidhyalaya | Erode</span>
                  <p className="text-sm text-text-muted mt-2 font-mono">Score: 83.90%</p>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="min-h-screen flex items-center justify-center px-6">
        <div ref={addToRefs} className="bg-card-bg backdrop-blur-xl border border-neon-purple/50 rounded-2xl p-10 max-w-4xl w-full mx-auto shadow-[0_0_60px_rgba(147,51,234,0.2)] text-center border-t-4 border-t-neon-purple">
          <h2 className="text-2xl text-text-main font-bold tracking-widest uppercase mb-8 drop-shadow-[0_0_10px_#9333ea]">Transmission Complete</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://github.com/rajm688" target="_blank" rel="noreferrer" className="px-8 py-3 border border-border-subtle rounded-lg text-text-main font-semibold hover:border-neon-blue hover:text-neon-blue hover:shadow-[0_0_15px_#00f3ff] transition-all">GitHub</a>
            <a href="https://linkedin.com/in/rajm688" target="_blank" rel="noreferrer" className="px-8 py-3 border border-border-subtle rounded-lg text-text-main font-semibold hover:border-neon-blue hover:text-neon-blue hover:shadow-[0_0_15px_#00f3ff] transition-all">LinkedIn</a>
            <a href="https://flowcv.com/resume/4u6lrjuwmd" target="_blank" rel="noreferrer" className="px-8 py-3 bg-neon-purple text-white rounded-lg font-semibold hover:bg-purple-500 transition-all shadow-[0_0_20px_#9333ea]">Download Resume</a>
          </div>
          <p className="mt-10 text-text-muted text-sm tracking-wide">
            Built with ❤️ by Raj · Thanks for taking your time to look into my profile 😊
          </p>
        </div>
      </div>

    </div>
    <BackToTop />
    <ThemeToggle />
    </>
  );
}

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-[90] p-4 rounded-full bg-card-bg border border-neon-blue/40 text-neon-blue backdrop-blur-md shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:bg-neon-blue/20 hover:text-text-main hover:border-neon-blue hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all duration-500 ease-out flex items-center justify-center group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <svg 
        className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform duration-300" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed top-8 right-8 z-[90] p-3 rounded-full bg-card-bg border border-border-subtle text-text-main backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:scale-110 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

// Subcomponents
function SkillCard({ title, desc, skills, color, align, getRef }: { title: string, desc: string, skills: string[], color: string, align: 'left'|'right'|'center', getRef: any }) {
  const borderClass = align === 'right' ? 'border-r-4' : align === 'left' ? 'border-l-4' : 'border-t-4';
  const textAlign = align === 'center' ? 'text-center' : 'text-left';
  const flexJustify = align === 'center' ? 'justify-center' : 'justify-start';
  
  return (
    <div ref={getRef} className={`bg-card-bg backdrop-blur-xl border border-neon-blue/30 rounded-2xl p-8 max-w-lg w-full shadow-[0_0_30px_rgba(0,243,255,0.1)] ${borderClass} border-neon-blue`}>
      <h3 className={`text-2xl font-bold text-text-main mb-2 ${textAlign}`}>{title}</h3>
      <p className={`text-sm text-text-muted mb-6 ${textAlign}`}>{desc}</p>
      <div className={`flex flex-wrap gap-3 ${flexJustify}`}>
        {skills.map(skill => (
          <span key={skill} className={`text-sm px-3 py-1.5 rounded-md bg-card-bg border border-neon-blue/40 text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.1)]`}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExperienceCard({ role, period, details, align, getRef }: { role: string, period: string, details: string[], align: 'left'|'right', getRef: any }) {
  const borderClass = align === 'right' ? 'border-r-4 border-r-neon-pink' : 'border-l-4 border-l-neon-pink';
  
  return (
    <div ref={getRef} className={`bg-card-bg backdrop-blur-xl border border-neon-pink/30 rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_30px_rgba(255,0,255,0.1)] ${borderClass} flex flex-col items-start`}>
      <h3 className="text-2xl font-bold text-text-main text-left">{role}</h3>
      <div className="my-3 text-left">
        <span className="inline-block px-3 py-1 text-xs uppercase tracking-wider rounded bg-neon-pink/10 text-neon-pink border border-neon-pink/40">{period}</span>
      </div>
      <ul className="mt-4 space-y-3 w-full">
        {details.map((d, i) => (
          <li key={i} className="flex flex-row gap-3 text-sm text-text-muted leading-relaxed">
            <span className="text-neon-pink opacity-70 mt-1">▹</span>
            <span className="text-left flex-1">{d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCard({ title, tech, details, align, getRef }: { title: string, tech: string[], details: string[], align: 'left'|'right', getRef: any }) {
  const borderClass = align === 'right' ? 'border-r-4 border-r-neon-purple' : 'border-l-4 border-l-neon-purple';

  return (
    <div ref={getRef} className={`bg-card-bg backdrop-blur-xl border border-neon-purple/30 rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_30px_rgba(147,51,234,0.1)] hover:shadow-[0_0_40px_rgba(147,51,234,0.2)] transition-shadow ${borderClass} group flex flex-col items-start`}>
      <h3 className="text-2xl font-bold text-text-main mb-4 group-hover:text-neon-purple transition-colors text-left">{title}</h3>
      
      <ul className="mb-6 space-y-3 w-full">
        {details.map((d, i) => (
          <li key={i} className="flex flex-row gap-3 text-sm text-text-muted leading-relaxed">
            <span className="text-neon-purple opacity-70 mt-1">▹</span>
            <span className="text-left flex-1">{d}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2 justify-start">
        {tech.map(t => (
          <span key={t} className="text-xs uppercase tracking-wider px-3 py-1 rounded-md bg-neon-purple/10 text-neon-purple border border-neon-purple/30">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
