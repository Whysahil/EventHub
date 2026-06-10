export const FALLBACK_IMAGES: Record<string, string> = {
  technology: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800',
  cultural: 'https://images.unsplash.com/photo-1604085572502-b06cbafd8d56?auto=format&fit=crop&q=80&w=800',
  government: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=800',
  community: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
  networking: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
  speaker: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
  venue: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
  default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
};

export class ImageService {
   static getFallbackImage(category?: string): string {
       const key = category?.toLowerCase() || '';
       if (key.includes('tech') || key.includes('ai')) return FALLBACK_IMAGES.technology;
       if (key.includes('cultur') || key.includes('music') || key.includes('art')) return FALLBACK_IMAGES.cultural;
       if (key.includes('gov') || key.includes('leader')) return FALLBACK_IMAGES.government;
       if (key.includes('commun') || key.includes('volunteer') || key.includes('ngo')) return FALLBACK_IMAGES.community;
       if (key.includes('network') || key.includes('startup') || key.includes('founder')) return FALLBACK_IMAGES.networking;
       return FALLBACK_IMAGES.default;
   }

   static getEventImage(url: string | null | undefined, category?: string): string {
       if (!url || url.trim() === '') return this.getFallbackImage(category);
       return url;
   }

   static getCategoryImage(url: string | null | undefined, categoryName: string): string {
       if (!url || url.trim() === '') return this.getFallbackImage(categoryName);
       return url;
   }

   static getVenueImage(url: string | null | undefined): string {
       if (!url || url.trim() === '') return FALLBACK_IMAGES.venue;
       return url;
   }

   static getSpeakerImage(url: string | null | undefined): string {
       if (!url || url.trim() === '') return FALLBACK_IMAGES.speaker;
       return url;
   }
}
