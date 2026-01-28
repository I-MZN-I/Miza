'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

type AnimatedCounterProps = {
  value: number;
  isCurrency?: boolean;
  className?: string;
};

export function AnimatedCounter({ value, isCurrency = true, className }: AnimatedCounterProps) {
  const motionValue = useSpring(0, {
    damping: 40,
    stiffness: 300,
  });

  const rounded = useTransform(motionValue, (latest) => {
    if (isCurrency) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(latest);
    }
    return latest.toFixed(0);
  });

  useEffect(() => {
    // Animate to the new value when it changes
    motionValue.set(value);
  }, [motionValue, value]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
