import React from 'react';
import { Source, SourceType } from '../types';
import { YouTubeIcon } from './icons/YoutubeIcon';
import { GoogleDocsIcon } from './icons/GoogleDocsIcon';
import { RedditIcon } from './icons/RedditIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { TrustpilotIcon } from './icons/TrustpilotIcon';

interface SourceLinkProps {
  source: Source;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source }) => {
  const getIcon = () => {
    switch (source.type) {
      case SourceType.YouTube: return <YouTubeIcon className="w-4 h-4 flex-shrink-0 opacity-80" />;
      case SourceType.GoogleArticles: return <GoogleDocsIcon className="w-4 h-4 flex-shrink-0 opacity-80" />; 
      case SourceType.RedditPosts: return <RedditIcon className="w-4 h-4 flex-shrink-0 opacity-80" />;
      case SourceType.Tweets: return <TwitterIcon className="w-4 h-4 flex-shrink-0 opacity-80" />;
      case SourceType.TrustpilotPosts: return <TrustpilotIcon className="w-4 h-4 flex-shrink-0 opacity-80" />;
      default: return <span className="w-4 h-4 bg-gray-600 rounded-full"></span>;
    }
  };

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md transition-colors border border-white/5 hover:border-white/20 text-xs text-gray-300 hover:text-white max-w-full"
    >
      {getIcon()}
      <span className="truncate" title={source.title}>
        {source.title}
      </span>
    </a>
  );
};

export default SourceLink;