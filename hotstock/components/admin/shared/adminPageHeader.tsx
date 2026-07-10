import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#222] pb-6 mb-8"
    >
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="text-[28px] font-bold tracking-tighter text-[#ededed]"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="text-[14px] text-[#888] mt-1 tracking-tight"
          >
            {description}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "backOut" }}
          className="shrink-0"
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
