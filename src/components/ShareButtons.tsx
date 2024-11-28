import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // Note: We'll use the notification context here later
      console.log('URL copied to clipboard');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title="Share on Twitter">
        <IconButton
          onClick={() => window.open(shareLinks.twitter, '_blank')}
          color="primary"
          size="small"
        >
          <TwitterIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Share on Facebook">
        <IconButton
          onClick={() => window.open(shareLinks.facebook, '_blank')}
          color="primary"
          size="small"
        >
          <FacebookIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Share on LinkedIn">
        <IconButton
          onClick={() => window.open(shareLinks.linkedin, '_blank')}
          color="primary"
          size="small"
        >
          <LinkedInIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Copy link">
        <IconButton
          onClick={copyToClipboard}
          color="primary"
          size="small"
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ShareButtons;
