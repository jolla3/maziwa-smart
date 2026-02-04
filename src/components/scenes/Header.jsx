import { Typography, Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { tokens } from "../../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const titleVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, delay: 0.2, ease: 'easeOut' }
    }
  };

  return (
    <Box mb="30px">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={titleVariants}
      >
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ 
            m: "0 0 5px 0",
            background: `linear-gradient(135deg, ${colors.grey[100]} 0%, ${colors.greenAccent[400]} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </Typography>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={subtitleVariants}
      >
        <Typography 
          variant="h5" 
          color={colors.greenAccent[400]}
          sx={{
            fontWeight: 600,
            letterSpacing: '1px',
          }}
        >
          {subtitle}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default Header;