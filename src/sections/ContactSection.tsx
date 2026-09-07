import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';
import { Magnet } from '../components/Magnet';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: '3D Design',
    message: '',
  });

  const [activeField, setActiveField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // High-performance Framer Motion MotionValues for background 3D parallax
  // This updates elements directly in the GPU/DOM and avoids triggering React re-renders on mousemove
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for lag-free physical responsiveness
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Map coordinate directions and limits for multiple floaters
  const x1 = springX;
  const y1 = springY;
  
  const x2 = useTransform(springX, (val) => -val * 1.2);
  const y2 = useTransform(springY, (val) => -val * 1.2);

  const x3 = useTransform(springX, (val) => val * 0.8);
  const y3 = useTransform(springY, (val) => -val * 0.8);

  const x4 = useTransform(springX, (val) => -val * 0.9);
  const y4 = useTransform(springY, (val) => val * 0.9);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) * 0.04;
      const y = (clientY - window.innerHeight / 2) * 0.04;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const projectOptions = [
    '3D Design',
    'Rendering',
    'Motion Design',
    'Branding',
    'Web Design',
    'Other',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSelectProjectType = (type: string) => {
    setFormState((prev) => ({ ...prev, projectType: type }));
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!formState.name.trim()) {
      setError('Please fill in your name.');
      return;
    }
    if (!formState.email.trim() || !formState.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formState.message.trim()) {
      setError('Please enter your project details.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate premium submit delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Custom float animation configurations for background 3D graphics
  const floatTransition = (duration: number, delay: number) => ({
    y: {
      duration,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut' as const,
      delay,
    },
    rotate: {
      duration: duration * 1.5,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut' as const,
      delay: delay * 0.5,
    },
  });

  const contactNavLinks = [
    { name: 'Home', href: '/#' },
    { name: 'About', href: '/#about' },
    { name: 'Price', href: '/#services' },
    { name: 'Projects', href: '/#projects' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState(null, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full bg-[#0C0C0C] pb-24 px-5 sm:px-8 md:px-10 overflow-hidden flex flex-col justify-start items-center z-20 select-none"
    >
      {/* 1. Dedicated Premium Navbar at the top of the Contact Page */}
      <FadeIn delay={0} y={-20} duration={0.8} as="nav" animateOnMount={true} className="w-full z-30">
        <div className="w-full flex justify-between items-center px-2 md:px-6 pt-6 md:pt-8 mb-16 sm:mb-20">
          <a
            href="/#"
            onClick={(e) => handleLinkClick(e, '/#')}
            className="text-[#D7E2EA] font-black uppercase tracking-widest text-lg md:text-xl lg:text-[1.6rem] hover:opacity-75 transition-opacity duration-200"
          >
            Hafiz
          </a>
          <div className="flex gap-4 sm:gap-6 md:gap-10">
            {contactNavLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-[#D7E2EA] font-semibold uppercase tracking-wider text-xs sm:text-sm md:text-base lg:text-[1.2rem] hover:opacity-70 transition-opacity duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Dynamic Floating 3D Background Assets with Parallax & Hover Physics */}
      {/* These elements now animate via GPU style values, preventing React re-renders completely */}
      <motion.div
        style={{ x: x1, y: y1 }}
        className="absolute top-[18%] left-[2%] sm:left-[4%] z-10 pointer-events-auto"
      >
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
          transition={floatTransition(4.5, 0.2)}
          className="w-[70px] sm:w-[110px] md:w-[140px]"
        >
          <Magnet padding={30} strength={4}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
              alt="Floating 3D Moon"
              className="w-full object-contain pointer-events-none opacity-50 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
          </Magnet>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ x: x2, y: y2 }}
        className="absolute bottom-[12%] left-[3%] sm:left-[6%] z-10 pointer-events-auto"
      >
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -6, 0] }}
          transition={floatTransition(5, 0.6)}
          className="w-[60px] sm:w-[90px] md:w-[120px]"
        >
          <Magnet padding={30} strength={4}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
              alt="Floating 3D Spike"
              className="w-full object-contain pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
          </Magnet>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ x: x3, y: y3 }}
        className="absolute top-[18%] right-[2%] sm:right-[4%] z-10 pointer-events-auto"
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, -8, 0] }}
          transition={floatTransition(4.2, 0.4)}
          className="w-[70px] sm:w-[110px] md:w-[140px]"
        >
          <Magnet padding={30} strength={4}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
              alt="Floating 3D Lego block"
              className="w-full object-contain pointer-events-none opacity-50 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
          </Magnet>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ x: x4, y: y4 }}
        className="absolute bottom-[12%] right-[3%] sm:right-[6%] z-10 pointer-events-auto"
      >
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, 10, 0] }}
          transition={floatTransition(4.8, 0.8)}
          className="w-[80px] sm:w-[110px] md:w-[145px]"
        >
          <Magnet padding={30} strength={4}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
              alt="Floating 3D Group Shapes"
              className="w-full object-contain pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
          </Magnet>
        </motion.div>
      </motion.div>

      {/* Main Content Grid Wrapper */}
      <div className="w-full max-w-5xl z-10 relative flex flex-col md:grid md:grid-cols-[4.5fr_5.5fr] gap-12 md:gap-16 items-center flex-grow">
        
        {/* Left Hand: Info column */}
        <div className="w-full text-left flex flex-col gap-6 md:gap-8">
          <FadeIn delay={0.1} y={30} duration={0.8} animateOnMount={true}>
            <span className="text-[#B600A8] font-bold uppercase tracking-widest text-xs sm:text-sm">
              Get In Touch
            </span>
          </FadeIn>

          <FadeIn delay={0.2} y={30} duration={0.8} animateOnMount={true}>
            <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[2.8rem] sm:text-[4.5rem] md:text-[5rem] lg:text-[5.5rem] select-none">
              Let&apos;s build it
            </h2>
          </FadeIn>

          <FadeIn delay={0.3} y={35} duration={0.8} animateOnMount={true}>
            <p className="text-[#D7E2EA]/60 uppercase text-xs sm:text-sm tracking-widest font-light leading-relaxed max-w-md">
              Have an exciting project or idea in mind? Let&apos;s team up and craft an unforgettable 3D or web experience together. Fill out the form and I will get back to you shortly.
            </p>
          </FadeIn>

          {/* Quick contact credentials */}
          <div className="flex flex-col gap-4 mt-6">
            <FadeIn delay={0.4} y={20} duration={0.6} animateOnMount={true}>
              <div className="flex items-center gap-4 text-[#D7E2EA]/85 hover:text-[#D7E2EA] transition-colors duration-300 select-all">
                <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Email:</span>
                <a href="mailto:shaikhafiz.developer@gmail.com" className="font-medium text-sm sm:text-base border-b border-transparent hover:border-[#D7E2EA] transition-colors duration-200">
                  shaikhafiz.developer@gmail.com
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={0.48} y={20} duration={0.6} animateOnMount={true}>
              <div className="flex items-center gap-4 text-[#D7E2EA]/85 hover:text-[#D7E2EA] transition-colors duration-300">
                <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Based in:</span>
                <span className="font-medium text-sm sm:text-base">
                  Palnadu, India
                </span>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Right Hand: Super Animated Glassmorphic Form Card */}
        <div className="w-full relative min-h-[480px]">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="contact-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="w-full rounded-[30px] sm:rounded-[40px] border border-[#D7E2EA]/15 bg-white/5 backdrop-blur-xl p-6 sm:p-8 md:p-10 flex flex-col gap-6 shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative overflow-hidden"
              >
                {/* Form Ambient Background Radial Glow */}
                <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-[#B600A8]/10 blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-[#7621B0]/10 blur-[100px] pointer-events-none" />

                {/* Error Banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-500/10 border border-red-500/35 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-xs sm:text-sm font-medium leading-snug"
                    >
                      <AlertCircle size={18} className="flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name Input Field */}
                <div className="relative w-full">
                  <div
                    className={`absolute inset-0 rounded-2xl transition-opacity duration-300 -z-10 pointer-events-none ${
                      activeField === 'name' ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      background:
                        'linear-gradient(123deg, rgba(182,0,168,0.2) 0%, rgba(118,33,176,0.2) 100%)',
                      filter: 'blur(8px)',
                    }}
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setActiveField('name')}
                    onBlur={() => setActiveField(null)}
                    autoComplete="off"
                    placeholder=" "
                    className="w-full bg-[#0C0C0C]/40 border border-[#D7E2EA]/15 rounded-2xl px-5 pt-6 pb-2 text-[#D7E2EA] font-medium text-sm sm:text-base focus:border-[#B600A8] focus:outline-none transition-all duration-300 peer placeholder-transparent"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-5 top-4 text-[#D7E2EA]/45 font-medium text-xs sm:text-sm uppercase tracking-wider select-none pointer-events-none transition-all duration-300 origin-[0_0] peer-focus:scale-75 peer-focus:-translate-y-2.5 peer-focus:text-[#B600A8] peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[#B600A8]"
                  >
                    Your Name
                  </label>
                </div>

                {/* Email Input Field */}
                <div className="relative w-full">
                  <div
                    className={`absolute inset-0 rounded-2xl transition-opacity duration-300 -z-10 pointer-events-none ${
                      activeField === 'email' ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      background:
                        'linear-gradient(123deg, rgba(182,0,168,0.2) 0%, rgba(118,33,176,0.2) 100%)',
                      filter: 'blur(8px)',
                    }}
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField(null)}
                    autoComplete="off"
                    placeholder=" "
                    className="w-full bg-[#0C0C0C]/40 border border-[#D7E2EA]/15 rounded-2xl px-5 pt-6 pb-2 text-[#D7E2EA] font-medium text-sm sm:text-base focus:border-[#B600A8] focus:outline-none transition-all duration-300 peer placeholder-transparent"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-5 top-4 text-[#D7E2EA]/45 font-medium text-xs sm:text-sm uppercase tracking-wider select-none pointer-events-none transition-all duration-300 origin-[0_0] peer-focus:scale-75 peer-focus:-translate-y-2.5 peer-focus:text-[#B600A8] peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[#B600A8]"
                  >
                    Your Email
                  </label>
                </div>

                {/* Project Type Multi-selection pills */}
                <div className="flex flex-col gap-3 w-full">
                  <span className="text-[#D7E2EA]/45 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-left">
                    What project type are we crafting?
                  </span>
                  <div className="flex flex-wrap gap-2 justify-start">
                    {projectOptions.map((option) => {
                      const isSelected = formState.projectType === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSelectProjectType(option)}
                          className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                            isSelected
                              ? 'border-transparent text-white font-medium shadow-[0_0_15px_rgba(182,0,168,0.4)]'
                              : 'border-[#D7E2EA]/15 text-[#D7E2EA]/60 hover:text-[#D7E2EA] hover:border-[#D7E2EA]/40 bg-white/0 hover:bg-white/5'
                          }`}
                          style={
                            isSelected
                              ? {
                                  background:
                                    'linear-gradient(123deg, #18011F 7%, #B600A8 47%, #7621B0 100%)',
                                }
                              : {}
                          }
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message TextArea Field */}
                <div className="relative w-full">
                  <div
                    className={`absolute inset-0 rounded-2xl transition-opacity duration-300 -z-10 pointer-events-none ${
                      activeField === 'message' ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      background:
                        'linear-gradient(123deg, rgba(182,0,168,0.2) 0%, rgba(118,33,176,0.2) 100%)',
                      filter: 'blur(8px)',
                    }}
                  />
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    onFocus={() => setActiveField('message')}
                    onBlur={() => setActiveField(null)}
                    placeholder=" "
                    rows={4}
                    className="w-full bg-[#0C0C0C]/40 border border-[#D7E2EA]/15 rounded-2xl px-5 pt-6 pb-2 text-[#D7E2EA] font-medium text-sm sm:text-base focus:border-[#B600A8] focus:outline-none transition-all duration-300 peer placeholder-transparent resize-none min-h-[120px]"
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-5 top-4 text-[#D7E2EA]/45 font-medium text-xs sm:text-sm uppercase tracking-wider select-none pointer-events-none transition-all duration-300 origin-[0_0] peer-focus:scale-75 peer-focus:-translate-y-2.5 peer-focus:text-[#B600A8] peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[#B600A8]"
                  >
                    Tell me about your project...
                  </label>
                </div>

                {/* Submission Button with Premium Magnet physics */}
                <div className="w-full flex justify-end mt-4">
                  <Magnet padding={25} strength={3}>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-3 rounded-full text-white font-medium uppercase tracking-widest px-8 py-3.5 sm:px-10 sm:py-4 text-xs sm:text-sm cursor-pointer shadow-[0px_4px_4px_rgba(181,1,167,0.25),inset_4px_4px_12px_#7721B1] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                        outline: '2px solid #FFFFFF',
                        outlineOffset: '-3px',
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </Magnet>
                </div>
              </motion.div>
            ) : (
              /* Success Animative Card State */
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                className="w-full rounded-[30px] sm:rounded-[40px] border border-[#D7E2EA]/15 bg-white/5 backdrop-blur-xl p-8 sm:p-12 md:p-14 flex flex-col items-center text-center gap-6 shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden min-h-[480px] justify-center relative"
              >
                {/* Floating decorative elements in success state */}
                <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-[#B600A8]/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-[#7621B0]/10 blur-3xl pointer-events-none" />

                {/* Floating Rotating Glass Checkmark Icon */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotateY: [0, 360],
                  }}
                  transition={{
                    y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                    rotateY: { duration: 6, repeat: Infinity, ease: 'linear' },
                  }}
                  className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-2xl relative"
                  style={{ perspective: 1000 }}
                >
                  <CheckCircle2 size={42} className="text-[#B600A8] filter drop-shadow-[0_0_10px_rgba(182,0,168,0.6)]" />
                </motion.div>

                <h3 className="hero-heading font-black uppercase text-2xl sm:text-3xl tracking-wide mt-4">
                  Thank You, {formState.name}!
                </h3>

                <p className="text-[#D7E2EA]/70 text-sm sm:text-base font-light leading-relaxed max-w-md">
                  Your message regarding **{formState.projectType}** was sent successfully. I have received your details and will get back to you within 24 hours.
                </p>

                {/* Back / Reset button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormState({ name: '', email: '', projectType: '3D Design', message: '' });
                  }}
                  className="mt-6 border border-[#D7E2EA]/20 hover:border-[#D7E2EA] bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#D7E2EA] transition-all duration-300 cursor-pointer"
                >
                  Send another message
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
