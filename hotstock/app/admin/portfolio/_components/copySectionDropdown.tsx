import { Button } from "@/components/ui/button";
import { Copy, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { TIER_LABELS, type PortfolioTier } from "@/lib/constants/portfolio";

interface CopySectionDropdownProps {
  activeTier: PortfolioTier;
  onCopy: (tier: PortfolioTier) => void;
}

export function CopySectionDropdown({ activeTier, onCopy }: CopySectionDropdownProps) {
  const availableTiers = (["community", "titan", "gold", "premium"] as PortfolioTier[]).filter(
    (tier) => tier !== activeTier
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="bg-[#111] border-[#222] hover:bg-[#222]">
          <Copy className="mr-2 h-4 w-4" />
          Đồng bộ
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] bg-[#111] border-[#222] text-white">
        {availableTiers.map((tier) => (
          <DropdownMenuItem
            key={tier}
            onClick={() => onCopy(tier)}
            className="cursor-pointer hover:bg-[#c084fc]/20 hover:text-[#c084fc] focus:bg-[#c084fc]/20 focus:text-[#c084fc]"
          >
            Từ {TIER_LABELS[tier]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
