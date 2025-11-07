export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  poster: string;
  description: string;
  duration: number;
  director: string;
}

export type MovieInput = Partial<Movie>;

export function createMovie(input: MovieInput = {}): Movie {
  return {
    id: input.id ?? 0,
    title: input.title ?? '',
    year: input.year ?? new Date().getFullYear(),
    genre: input.genre ?? '',
    rating: input.rating ?? 0,
    poster: input.poster ?? '',
    description: input.description ?? '',
    duration: input.duration ?? 0,
    director: input.director ?? '',
  };
}
