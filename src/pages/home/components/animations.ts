export const ease = [0.16, 1, 0.3, 1] as const;
export const easeOut = [0, 0, 0.2, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease } },
};

export const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

export const staggerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -6, transition: { duration: 0.3, ease } },
};

export const letterReveal = {
  hidden: { opacity: 0, y: 80, rotateX: -40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: i * 0.035, duration: 0.5, ease },
  }),
};

export const wordReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease },
  }),
};

export const float = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export const floatSlow = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [-15, 15, -15],
    rotate: [-2, 2, -2],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export const pulse = {
  initial: { opacity: 0.4, scale: 1 },
  animate: {
    opacity: [0.4, 0.8, 0.4],
    scale: [1, 1.05, 1],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export const shimmer = {
  initial: { backgroundPosition: "200% 0" },
  animate: {
    backgroundPosition: "-200% 0",
    transition: { duration: 3, repeat: Infinity, ease: "linear" as const },
  },
};

// Legacy aliases — do not remove, used by Plugins.tsx & other pages
export const fadeInUp = fadeUp;
export const staggerContainer = stagger;
