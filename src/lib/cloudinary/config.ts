export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  folders: {
    portfolioImages: "prumo/portfolio/images",
    portfolioVideos: "prumo/portfolio/videos",
    profilePhotos: "prumo/profiles",
    evaluationPhotos: "prumo/evaluations",
  },
} as const;

export type CloudinaryFolder = keyof typeof cloudinaryConfig.folders;
