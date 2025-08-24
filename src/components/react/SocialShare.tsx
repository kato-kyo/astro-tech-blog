import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  HatenaShareButton,
  LineShareButton,
  XIcon,
  FacebookIcon,
  LinkedinIcon,
  HatenaIcon,
  LineIcon,
} from 'react-share';
import { MdContentCopy } from 'react-icons/md';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export default function SocialShare({
  url,
  title,
  description = '',
  className = '',
}: SocialShareProps) {
  const copyToClipboard = async () => {
    try {
      // Modern Clipboard APIを使用
      if (window.navigator?.clipboard && window.isSecureContext) {
        await window.navigator.clipboard.writeText(url);
      } else {
        // フォールバック: テキストエリア + execCommand('copy') を使用
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!ok) {
          throw new Error('execCommand copy failed');
        }
      }
    } catch {
      // URLのコピーに失敗した場合は何もしない
    }
  };

  const iconSize = 32;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        シェア:
      </span>

      {/* Twitter/X */}
      <div className="relative group">
        <TwitterShareButton
          url={url}
          title={title}
          className="focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded-lg transition-all hover:scale-105"
          aria-label="Twitterでシェア"
        >
          <XIcon size={iconSize} round />
        </TwitterShareButton>
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Twitter
        </span>
      </div>

      {/* LINE */}
      <div className="relative group">
        <LineShareButton
          url={url}
          title={title}
          className="focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded-lg transition-all hover:scale-105"
          aria-label="LINEでシェア"
        >
          <LineIcon size={iconSize} round />
        </LineShareButton>
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          LINE
        </span>
      </div>

      {/* Facebook */}
      <div className="relative group">
        <FacebookShareButton
          url={url}
          title={title}
          className="focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded-lg transition-all hover:scale-105"
          aria-label="Facebookでシェア"
        >
          <FacebookIcon size={iconSize} round />
        </FacebookShareButton>
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Facebook
        </span>
      </div>

      {/* LinkedIn */}
      <div className="relative group">
        <LinkedinShareButton
          url={url}
          title={title}
          summary={description}
          className="focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded-lg transition-all hover:scale-105"
          aria-label="LinkedInでシェア"
        >
          <LinkedinIcon size={iconSize} round />
        </LinkedinShareButton>
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          LinkedIn
        </span>
      </div>

      {/* はてなブックマーク */}
      <div className="relative group">
        <HatenaShareButton
          url={url}
          title={title}
          className="focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded-lg transition-all hover:scale-105"
          aria-label="はてなブックマークでシェア"
        >
          <HatenaIcon size={iconSize} round />
        </HatenaShareButton>
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          hatena
        </span>
      </div>

      {/* URLコピー */}
      <div className="relative group">
        <button
          onClick={copyToClipboard}
          className="rounded-lg transition-all hover:scale-105"
          aria-label="URLをコピー"
        >
          <MdContentCopy
            size={iconSize}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          />
        </button>
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          コピー
        </span>
      </div>
    </div>
  );
}
