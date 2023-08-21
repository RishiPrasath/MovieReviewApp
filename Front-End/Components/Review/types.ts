export type RootStackParamList = {
  Home: undefined;
  Review: { movieId: number }; // Define the parameter type here
};


export type MovieDetails = {
  title: string;
  directors: string[];
  cast: string[];
  release_date: string;
  poster_path: string;
};



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
