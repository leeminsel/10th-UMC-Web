import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LpItem } from '../types/lp';

interface Props { lp: LpItem; }

function normalizeThumbnail(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'loremflickr.com') {
      const lock = parsed.searchParams.get('lock');
      return `https://loremflickr.com/300/300${lock ? `?lock=${lock}` : ''}`;
    }
  } catch {}
  return url;
}

const LpCard = ({ lp }: Props) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => navigate(`/lp/${lp.id}`)}
      className="rounded-sm cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-105"
    >
      {imgError || !lp.thumbnail ? (
        <div className="w-full aspect-square rounded bg-[#e0e0e0] flex items-center justify-center text-[#999] text-sm">
          No Image
        </div>
      ) : (
        <img
          src={normalizeThumbnail(lp.thumbnail)}
          alt={lp.title}
          className="w-full rounded block"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
};

export default LpCard;
