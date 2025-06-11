import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ChevronRight, ArrowRight } from "lucide-react";

const Breadcrumb = ({ categories }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const containerStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(8px)",
    padding: "12px 20px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    display: "inline-block",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  };

  const breadcrumbStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "#94a3b8",
    fontSize: "15px",
    fontWeight: "500",
    flexWrap: "wrap",
  };

  const chevronStyle = {
    color: "rgba(255, 255, 255, 0.5)",
    width: "16px",
    height: "16px",
  };

  const itemStyle = {
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "6px",
    background: "transparent",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    maxWidth: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: "all 0.3s ease",
  };

  const lastItemStyle = {
    ...itemStyle,
    color: "#fff",
    fontWeight: "600",
    background: "rgba(59, 130, 246, 0.1)",
  };

  const lastItemStyleHeading = {
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "6px",
    background: "transparent",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#fff",
    fontWeight: "600",
  };

  const toggleButtonStyle = {
    border: "none",
    background: "rgba(59, 130, 246, 0.1)",
    color: "#60a5fa",
    padding: "4px 8px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
    marginLeft: "8px",
    transition: "all 0.2s ease",
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <motion.div
      style={containerStyle}
      whileHover={{
        boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={breadcrumbStyle}
            onClick={() => setIsExpanded(true)}
          >
            <motion.span
              style={lastItemStyleHeading}
              whileHover={{
                background: "rgba(59, 130, 246, 0.2)",
              }}
            >
              {categories[categories.length - 1]}
              <ChevronDown size={14} />
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={breadcrumbStyle}
          >
            {categories.map((category, index) => (
              (index>2)?<motion.span
                key={index}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.span
                  style={index === categories.length - 1 ? lastItemStyle : itemStyle}
                  whileHover={{
                    background:
                      index === categories.length - 1
                        ? "rgba(59, 130, 246, 0.2)"
                        : "rgba(255, 255, 255, 0.05)",
                    color: "#fff",
                  }}
                >
                  {category}
                </motion.span>
                {index < categories.length - 1 && (
                  <ArrowRight style={chevronStyle} />
                )}
              </motion.span>:<></>
            ))}
            <motion.button
              style={toggleButtonStyle}
              onClick={() => setIsExpanded(false)}
              whileHover={{
                background: "rgba(59, 130, 246, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronUp size={14} />
              Collapse
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Breadcrumb;