export const getUserInitials = (name: string): string => {
  return name.split(' ').reduce((initials, word) => {
    if (word.trim().length > 0) {
      initials += word.charAt(0).toUpperCase();
    }
    return initials;
  }, '');
};
