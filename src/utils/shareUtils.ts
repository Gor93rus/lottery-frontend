interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export const canShare = (): boolean => {
  return 'share' in navigator;
};

export const canShareFiles = (): boolean => {
  return canShare() && 'canShare' in navigator && typeof navigator.canShare === 'function';
};

export const shareContent = async (data: ShareData): Promise<boolean> => {
  if (!canShare()) {
    console.warn('Web Share API not supported');
    return false;
  }

  try {
    if (data.files && canShareFiles()) {
      const canShareData = navigator.canShare && navigator.canShare(data);
      if (!canShareData) {
        delete data.files;
      }
    }

    await navigator.share(data);
    return true;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.log('Share cancelled by user');
    } else {
      console.error('Share error:', error);
    }
    return false;
  }
};

export const shareToTelegram = (text: string, url?: string) => {
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url || window.location.href)}&text=${encodeURIComponent(text)}`;
  window.open(telegramUrl, '_blank');
};

export const shareToTwitter = (text: string, url?: string) => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url || window.location.href)}`;
  window.open(twitterUrl, '_blank');
};

export const shareViaEmail = (subject: string, body: string) => {
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Clipboard error:', error);
    }
  }
  
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    textArea.remove();
    return true;
  } catch (error) {
    console.error('Fallback clipboard error:', error);
    textArea.remove();
    return false;
  }
};

export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
