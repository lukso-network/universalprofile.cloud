import { LSP3Profile } from '../interfaces/lsps';
import { validateImage } from './validateLSP4Metdata';

export const validateLSP3 = (LSP3Metadata: any): LSP3Profile => {
  let tags = [];
  let links = [];
  let profileImage = [];
  let backgroundImage = [];

  if (LSP3Metadata?.LSP3Profile?.profileImage?.length) {
    const imageIsValid = validateImage(LSP3Metadata?.LSP3Profile?.profileImage);
    profileImage = imageIsValid ? LSP3Metadata?.LSP3Profile?.profileImage : [];
  }

  if (LSP3Metadata?.LSP3Profile?.backgroundImage?.length) {
    const imageIsValid = validateImage(
      LSP3Metadata?.LSP3Profile?.backgroundImage,
    );
    backgroundImage = imageIsValid
      ? LSP3Metadata?.LSP3Profile?.backgroundImage
      : [];
  }

  if (LSP3Metadata?.LSP3Profile?.links?.length) {
    links = LSP3Metadata?.LSP3Profile?.links.filter((link: any) => {
      return link?.title && link?.url;
    });
  }

  if (LSP3Metadata?.LSP3Profile?.tags?.length) {
    tags = LSP3Metadata?.LSP3Profile?.tags.filter((tag: any) => {
      return tag?.title && tag?.url;
    });
  }

  return {
    LSP3Profile: {
      name: LSP3Metadata?.LSP3Profile.name || '',
      description: LSP3Metadata?.LSP3Profile.description || '',
      links,
      tags,
      profileImage,
      backgroundImage,
    },
  };
};
