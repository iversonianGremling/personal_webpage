/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';

interface MediaSearchProps {
  onSelectMedia: (mediaData: {
    title: string;
    author: string;
    country: string;
    year: string;
    themes: string;
    image?: string;
  }) => void;
}

type MediaType = 'music' | 'movie' | 'book' | 'videogame';

interface SearchResult {
  id: string;
  title: string;
  author: string;
  country: string;
  year: string;
  themes: string[];
  image?: string;
}

const MetadataSearch: React.FC<MediaSearchProps> = ({ onSelectMedia }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('movie');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const OMDB_API_KEY = 'ebfa6ed2'; // Replace with your actual API key
  const DISCOGS_API_KEY = 'ukWRtnJlEEjeRaMRNYaj'; // Replace with your actual API key
  const DISCOGS_API_SECRET = 'oiOARihzktuoHYoTmWyHgxzbFJMzoAwo'; // Replace with your actual API secret
  const RAWG_API_KEY = '11b7a229736b40ad8e94d61d571371e0'; // Replace with your actual API key

  useEffect(() => {
    console.log('OMDB_API_KEY:', OMDB_API_KEY);
    console.log('DISCOGS_API_KEY:', DISCOGS_API_KEY);
    console.log('DISCOGS_API_SECRET:', DISCOGS_API_SECRET);
    console.log('RAWG_API_KEY:', RAWG_API_KEY);
  }, []);

  const searchMedia = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      let data: SearchResult[] = [];

      switch (mediaType) {
        case 'movie':
          data = await searchMovies(searchTerm);
          break;
        case 'music':
          data = await searchMusic(searchTerm);
          break;
        case 'book':
          data = await searchBooks(searchTerm);
          break;
        case 'videogame':
          data = await searchVideoGames(searchTerm);
          break;
        default:
          throw new Error('Invalid media type');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during search');
    } finally {
      setIsLoading(false);
    }
  };

  const searchMovies = async (term: string): Promise<SearchResult[]> => {
    // Using OMDb API
    const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(term)}&apikey=${OMDB_API_KEY}`);
    const data = await response.json();

    if (data.Response === 'False') {
      throw new Error(data.Error || 'No results found');
    }

    const movies = await Promise.all(
      data.Search.slice(0, 5).map(async (movie: any) => {
        // Get detailed info for each movie
        const detailResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`);
        const detail = await detailResponse.json();

        return {
          id: movie.imdbID,
          title: detail.Title,
          author: detail.Director,
          country: detail.Country,
          year: detail.Year,
          themes: detail.Genre?.split(', ') || [],
          image: detail.Poster !== 'N/A' ? detail.Poster : undefined
        };
      })
    );

    return movies;
  };

  const searchMusic = async (term: string): Promise<SearchResult[]> => {
    // Using Discogs API
    const response = await fetch(
      `https://api.discogs.com/database/search?q=${encodeURIComponent(term)}&type=release&key=${DISCOGS_API_KEY}&secret=${DISCOGS_API_SECRET}`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('No results found');
    }

    return data.results.slice(0, 5).map((album: any) => ({
      id: album.id,
      title: album.title.split(' - ')[1] || album.title,
      author: album.title.split(' - ')[0] || 'Unknown',
      country: album.country || 'Unknown',
      year: album.year || 'Unknown',
      themes: album.genre || [],
      image: album.thumb || album.cover_image
    }));
  };

  const searchBooks = async (term: string): Promise<SearchResult[]> => {
    // Using Open Library API
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(term)}`);
    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      throw new Error('No results found');
    }

    return data.docs.slice(0, 5).map((book: any) => ({
      id: book.key,
      title: book.title,
      author: book.author_name ? book.author_name.join(', ') : 'Unknown',
      country: 'Unknown', // Open Library doesn't provide country info
      year: book.first_publish_year ? book.first_publish_year.toString() : 'Unknown',
      themes: book.subject || [],
      image: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : undefined
    }));
  };

  const searchVideoGames = async (term: string): Promise<SearchResult[]> => {
    // Using RAWG API (free tier)
    const response = await fetch(
      `https://api.rawg.io/api/games?search=${encodeURIComponent(term)}&key=${RAWG_API_KEY}`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('No results found');
    }

    return data.results.slice(0, 5).map((game: any) => ({
      id: game.id,
      title: game.name,
      author: game.developers?.map((dev: any) => dev.name).join(', ') || 'Unknown',
      country: 'Unknown', // RAWG doesn't provide country info
      year: game.released ? new Date(game.released).getFullYear().toString() : 'Unknown',
      themes: game.genres?.map((genre: any) => genre.name) || [],
      image: game.background_image
    }));
  };

  const handleSelect = (result: SearchResult) => {
    onSelectMedia({
      title: result.title,
      author: result.author,
      country: result.country,
      year: result.year,
      themes: result.themes.join(', '),
      image: result.image
    });
  };

  return (
    <div className="bg-gray-600 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Media Search</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Media Type</label>
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value as MediaType)}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="movie">Movies</option>
          <option value="music">Music</option>
          <option value="book">Books</option>
          <option value="videogame">Video Games</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Search</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search for ${mediaType}s...`}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={searchMedia}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-gray-700 p-4 rounded-lg flex gap-4 cursor-pointer hover:bg-gray-600 transition"
            onClick={() => handleSelect(result)}
          >
            {result.image ? (
              <img
                src={result.image}
                alt={result.title}
                className="w-20 h-28 object-cover rounded"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x112?text=No+Image';
                }}
              />
            ) : (
              <div className="w-20 h-28 bg-gray-800 flex items-center justify-center rounded">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            <div>
              <h4 className="font-bold">{result.title}</h4>
              <p className="text-gray-300">{result.author}</p>
              <p className="text-gray-400">{result.year} • {result.country}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {result.themes.slice(0, 3).map((theme, index) => (
                  <span key={index} className="text-xs bg-gray-800 px-2 py-1 rounded">
                    {theme}
                  </span>
                ))}
                {result.themes.length > 3 && (
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                    +{result.themes.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetadataSearch;
