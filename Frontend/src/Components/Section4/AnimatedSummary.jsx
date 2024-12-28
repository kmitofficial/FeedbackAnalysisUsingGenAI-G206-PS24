import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const AnimatedSummary = ({ summary }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };


  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut"
      }
    })
  };

  const floatingAnimation = {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const words = summary?.split(' ') || ['No', 'summary', 'available'];

  const containerStyle = {
    padding: '24px',
    borderRadius: '8px',
    transition: 'all 300ms ease-in-out',
    backgroundColor: isExpanded ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid #1f2937',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  };

  const headerStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
    marginBottom: '16px'
  };

  const headerContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
  };

  const wordStyle = {
    display: 'inline-block',
    marginRight: '4px',
    padding: '4px',
    borderRadius: '4px',
    color: '#d1d5db'
  };

  const hintStyle = {
    marginTop: '16px',
    fontSize: '14px',
    color: '#6b7280'
  };

  const gradientBgStyle = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={containerStyle}
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div 
        style={gradientBgStyle}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

<div style={{ position: 'relative' }}>
        <div style={headerContainerStyle}>
          <motion.h3
            variants={textVariants}
            style={headerStyle}
          >
            Summary
          </motion.h3>
          <motion.div
            animate={floatingAnimation}
          >
            <Sparkles style={{ color: '#60a5fa' }} size={20} />
          </motion.div>
        </div>


        <motion.div 
          style={{ lineHeight: '1.5' }}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={textVariants}
              style={wordStyle}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: words.length * 0.1 + 0.5 }}
          style={hintStyle}
        >
          {isExpanded ? "Click to collapse" : "Click to expand"}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedSummary;