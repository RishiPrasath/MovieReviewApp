export type ReviewData = {
  username: string;
  review: string;
  ratings: BasicAspectRatings;
  additionalAspectRatings: {
    [key: string]: number;
  };
};

export type BasicAspectRatings = {
  story: number;
  characters: number;
  screenplay: number;
  casting: number;
};

export type WriteReviewProps = {
  onClose: () => void;
};
