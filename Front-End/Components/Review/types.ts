import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Review: { movieId: number }; // Define the parameter type here
};

export type MovieDetails = {
  id: number;
  title: string;
  directors: string[];
  cast: string[];
  genres: string[];
  release_date: string;
  poster_path: string;
};

export type ReviewData = {
  userID: string | null;
  Username: string;
  movieid: number;
  review: string;
  ratings: BasicAspectRatings;
  additionalAspectRatings: {
    [key: string]: number;
  };
};

export type BasicAspectRatings = {
  Story: number;
  Characters: number;
  Screenplay: number;
  Casting: number;
};

export type WriteReviewProps = {
  movieId: number;
  onClose: () => void;
  refreshReviews: () => void;
  isUpdate: boolean;
  ExistingReview: ReviewData | null;
};

// Define ReviewScreenRouteProp type based on your RootStackParamList
export type ReviewScreenRouteProp = RouteProp<RootStackParamList, 'Review'>;
