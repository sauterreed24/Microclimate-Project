import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ALL_LOCATIONS, getLocationById } from "../../data/reeds/locations/index.js";

const home = ALL_LOCATIONS.find((l) => l.isHome) || ALL_LOCATIONS[0];

export const useReedStore = create(
  persist(
    (set, get) => ({
      locationId: home?.id ?? null,
      page: 1,
      loading: false,
      rawResponse: null,
      listings: [],
      error: null,

      homeStatus: "FOR_SALE",
      homeType: "HOUSES",
      sort: "NEWEST",
      minPrice: "",
      maxPrice: "",
      minBedrooms: "",
      maxBedrooms: "",
      minBathrooms: "",
      maxBathrooms: "",
      minSqft: "",
      maxSqft: "",

      /** @type {string[]} */
      favoriteZpids: [],

      selectedListing: null,
      detailOpen: false,

      setLocationId: (id) => set({ locationId: id, page: 1 }),
      setPage: (page) => set({ page }),
      setFilters: (patch) => set((s) => ({ ...s, ...patch })),

      setSelectedListing: (listing) => set({ selectedListing: listing, detailOpen: !!listing }),
      setDetailOpen: (detailOpen) => set({ detailOpen }),

      toggleFavorite: (zpid) => {
        if (!zpid) return;
        set((s) => {
          const next = new Set(s.favoriteZpids);
          if (next.has(zpid)) next.delete(zpid);
          else next.add(zpid);
          return { favoriteZpids: [...next] };
        });
      },
      isFavorite: (zpid) => (zpid ? get().favoriteZpids.includes(zpid) : false),

      getActiveLocation: () => {
        const id = get().locationId;
        return getLocationById(id);
      },
    }),
    {
      name: "reed-home-finder-v1",
      partialize: (s) => ({
        locationId: s.locationId,
        homeStatus: s.homeStatus,
        homeType: s.homeType,
        sort: s.sort,
        minPrice: s.minPrice,
        maxPrice: s.maxPrice,
        minBedrooms: s.minBedrooms,
        maxBedrooms: s.maxBedrooms,
        minBathrooms: s.minBathrooms,
        maxBathrooms: s.maxBathrooms,
        minSqft: s.minSqft,
        maxSqft: s.maxSqft,
        favoriteZpids: s.favoriteZpids,
      }),
      version: 1,
    }
  )
);
