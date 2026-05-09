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
      className="border border-[#ddd] rounded-lg p-[10px] cursor-pointer hover:shadow-md transition-shadow"
    >
      {imgError ? (
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
      <h3 className="mt-2 mb-1 text-base font-semibold">{lp.title}</h3>
      <p className="text-xs text-[#666] mb-2">{lp.content.slice(0, 30)}...</p>
      <div className="flex gap-1 flex-wrap">
        {lp.tags.map(tag => (
          <span key={tag.id} className="text-[0.7rem] text-blue-500">#{tag.name}</span>
        ))}
      </div>
    </div>
  );
};

export default LpCard;
