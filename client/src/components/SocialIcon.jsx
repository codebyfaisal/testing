import React from "react";
import { motion } from "motion/react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaDribbble,
  FaBehance,
  FaMedium,
  FaGlobe,
} from "react-icons/fa";

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
  youtube: FaYoutube,
  dribbble: FaDribbble,
  behance: FaBehance,
  medium: FaMedium,
  website: FaGlobe,
};

const SocialIcon = ({ social, url }) => {
  const Icon = socialIcons[social];
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-zinc-400 hover:text-indigo-400 transition-colors text-xl"
    >
      {Icon ? <Icon /> : social}
    </motion.a>
  );
};

export default SocialIcon;
