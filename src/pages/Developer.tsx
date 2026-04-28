import { PageShell } from "@/components/layout/PageShell";
import { motion } from "framer-motion";
import {
  Linkedin,
  Github,
  Globe,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Code2,
  Sparkles,
  ExternalLink,
  Cpu,
  BookOpen,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const skills = [
  "Python",
  "SQL",
  "Machine Learning",
  "Deep Learning",
  "Neural Networks",
  "NLP",
  "LLMs",
  "RAG",
  "TensorFlow",
  "Scikit-Learn",
  "Hugging Face",
  "FastAPI",
  "Git & GitHub",
  "Web Scraping",
  "Power BI",
];

const projects = [
  {
    title: "Dawrly",
    desc: "AI-based job recommendation system analyzing 1,000+ postings with real-time matching.",
    icon: Briefcase,
  },
  {
    title: "Wajehni",
    desc: "AI-powered adaptive learning SaaS with dynamic roadmaps and AI mentoring.",
    icon: BookOpen,
  },
  {
    title: "Mesdaq AI",
    desc: "Arabic fake news detection using fine-tuned AraBERT with explainable AI.",
    icon: Sparkles,
  },
];

const experiences = [
  {
    role: "AI & ML Instructor",
    org: "IEEE MTI · Minders · FBY · 4MIND",
    period: "Feb 2024 – Present",
  },
  {
    role: "AI Engineer Intern",
    org: "HAMS.AI",
    period: "Sep 2025 – Nov 2025",
  },
  {
    role: "Freelance Data Scientist",
    org: "Self-employed",
    period: "Jun 2024 – Present",
  }
];

export default function Developer() {
  return (
    <PageShell>
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="container py-16 md:py-24">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-3xl mx-auto"
          >
            {/* Profile Header */}
            <motion.div variants={item} className="text-center mb-12">
              {/* Profile Image */}
              <div className="relative mx-auto mb-6 w-32 h-32 md:w-40 md:h-40">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-md" />
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/40 to-primary/10" />
                <img
                  src="/profile.jpg"
                  alt="Ibrahim Abdelsattar"
                  className="relative w-full h-full object-cover rounded-full border-2 border-white/10 shadow-2xl"
                />
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-4">
                <Cpu className="w-3.5 h-3.5" />
                Meet the Developer
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight gradient-text mb-3">
                Ibrahim Abdelsattar
              </h1>
              <p className="text-lg md:text-xl font-medium text-foreground/80 mb-2">
                AI Engineer & Educator
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Cairo, Egypt
                </span>
                <span className="hidden sm:inline text-border">|</span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  MTI University
                </span>
              </div>
            </motion.div>

            {/* Quick Bio */}
            <motion.div
              variants={item}
              className="glass rounded-2xl p-6 md:p-8 mb-8"
            >
              <p className="text-foreground/80 leading-relaxed text-center">
                Computer and Artificial Intelligence student passionate about building
                intelligent systems that solve real-world problems. Experienced in
                designing, training, and deploying ML/DL models at scale. Helped{" "}
                <strong>50+ students</strong> discover their path in tech through
                instruction and mentorship at IEEE MTI, Minders, FBY, and 4MIND.
                Proactive, collaborative, and committed to continuous learning.
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={item}
              className="flex flex-wrap items-center justify-center gap-3 mb-12"
            >
              <a
                href="https://www.linkedin.com/in/ibrahim-abdelsattar/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors font-medium text-sm"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <a
                href="https://github.com/IbrahimAbdelsattar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors font-medium text-sm"
              >
                <Github className="w-4 h-4" />
                GitHub
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <a
                href="https://ibrahim-abdelsattar.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm"
              >
                <Globe className="w-4 h-4" />
                Portfolio
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <a
                href="mailto:ibrahimabdelsattar042@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors font-medium text-sm"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </motion.div>

            {/* Experience */}
            <motion.div variants={item} className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Experience
              </h2>
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div
                    key={exp.role + exp.org}
                    className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {exp.role}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {exp.org}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2.5 py-1 rounded-full self-start sm:self-auto">
                      {exp.period}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Projects */}
            <motion.div variants={item} className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Featured Projects
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {projects.map((proj) => (
                  <div
                    key={proj.title}
                    className="glass rounded-xl p-4 hover:border-primary/30 transition-colors"
                  >
                    <proj.icon className="w-5 h-5 text-primary mb-2" />
                    <h3 className="font-semibold text-sm mb-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {proj.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div variants={item} className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Education & Community */}
            <motion.div variants={item} className="grid sm:grid-cols-2 gap-4">
              <div className="glass rounded-xl p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  Education
                </h3>
                <p className="text-sm text-foreground/80">
                  Bachelor of Computer and Artificial Intelligence
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  MTI University, Cairo · GPA 3.5 · 2024 – 2027
                </p>
              </div>
              <div className="glass rounded-xl p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Community Impact
                </h3>
                <p className="text-sm text-foreground/80">
                  AI & ML Instructor across multiple organizations
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  IEEE MTI · Minders · FBY · 4MIND · 50+ students mentored
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
