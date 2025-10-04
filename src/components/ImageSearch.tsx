import React, { useState, useEffect, useRef } from 'react';

const Modal = ({ selectedImage, setSelectedImage }) => {
  const modalRef = useRef(null);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedImage(null); // Close modal when clicking outside the modal
    }
  };

  return (
    selectedImage && (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick} // Handle backdrop click
      >
        <div
          ref={modalRef}
          className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto"
        >
          <div className="p-4 border-b flex justify-between items-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <div className="p-4">
            <img
              src={selectedImage} // Ensure correct property for the image URL
              alt={selectedImage}
              className="w-full h-auto max-h-96 object-contain mb-4"
            />
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-600">Image successfully loaded</p>
              <p className="text-sm font-medium">Image URL: {selectedImage.url}</p>
              {/* ✅ Copy to Clipboard Button */}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

const ImageSearch = ({ initialSearchTerm = '' }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCopying, setIsCopying] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [inputValue, setInputValue] = useState(initialSearchTerm);
  const [mediaType, setMediaType] = useState('all');
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchImages(searchTerm, mediaType);
  }, [searchTerm, mediaType]);

  const fetchImages = async (term, type) => {
    if (!term.trim()) return;

    setLoading(true);
    setError(null);
    const results = [];

    try {
      // Simulating different API calls based on media type
      // In a real implementation, you would use actual APIs

      if (type === 'all' || type === 'movies') {
        // Movie/TV search (OMDB API simulation)
        const movieResults = await simulateMovieSearch(term);
        const searchResults = movieResults.Search || [];
        const movies = searchResults.map((movie) => movie.Poster);
        setResults(movies);
      }

      if (type === 'all' || type === 'music') {
        // Music search (LastFM API simulation)
        const musicResults = await simulateMusicSearch(term);
        const images = musicResults.results.albummatches.album.map((album) => album.image[3]['#text']);
        setResults(images);
      }

      if (type === 'all' || type === 'games') {
        // Video game search (RAWG API simulation)
        const gameResults = await simulateGameSearch(term);
        const images = gameResults.results.map((game) => game.background_image);
        console.log('#########GAME RESULTS', images);
        setResults(images);
      }

      // Filter out any null results and limit to 20 total images
      const filteredResults = results.length === 0 ? [] : results;
      setImages(filteredResults);
      console.log(results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch media. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Simulate movie/TV search (OMDB API)
  const simulateMovieSearch = async (term) => {
    // In a real implementation, you would use:
    const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(term)}&apikey=81e56b7d`);
    const data = await response.json();

    // Simulation with placeholder images
    return data;
  };

  // Simulate music search (LastFM API)
  const simulateMusicSearch = async (term) => {
    // In a real implementation, you would use:
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(term)}&api_key=863409d5811dec7588723f4a65d9799b&format=json`);
    const data = await response.json();

    // Simulation with placeholder images
    return data;
  };

  // Simulate video game search (RAWG API)
  const simulateGameSearch = async (term) => {
    // In a real implementation, you would use:
    const response = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(term)}&key=11b7a229736b40ad8e94d61d571371e0`);
    const data = await response.json();

    // Simulation with placeholder images
    return data;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchTerm(inputValue);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleMediaTypeChange = (e) => {
    setMediaType(e.target.value);
  };


  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Multi-Media Image Search</h2>
        <form onSubmit={handleSearch} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search for movies, music, games..."
              className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>

          <div className="flex gap-4">
            <label className="inline-flex items-center text-black">
              <input
                type="radio"
                name="mediaType"
                value="all"
                checked={mediaType === 'all'}
                onChange={handleMediaTypeChange}
                className="mr-2"
              />
              All
            </label>
            <label className="inline-flex items-center text-black">
              <input
                type="radio"
                name="mediaType"
                value="movies"
                checked={mediaType === 'movies'}
                onChange={handleMediaTypeChange}
                className="mr-2"
              />
              Movies/TV
            </label>
            <label className="inline-flex items-center text-black">
              <input
                type="radio"
                name="mediaType"
                value="music"
                checked={mediaType === 'music'}
                onChange={handleMediaTypeChange}
                className="mr-2"
              />
              Music
            </label>
            <label className="inline-flex items-center text-black">
              <input
                type="radio"
                name="mediaType"
                value="games"
                checked={mediaType === 'games'}
                onChange={handleMediaTypeChange}
                className="mr-2"
              />
              Video Games
            </label>
          </div>
        </form>
      </div>

      {loading && <div className="text-center py-10">Loading images...</div>}

      {error && <div className="text-center py-4 text-red-500">{error}</div>}

      {!loading && !error && results.length === 0 && (
        <div className="text-center py-10 text-gray-600">No results found for "{searchTerm}"</div>
      )}

      {isCopying && (
        <div className="text-center py-10 text-gray-600">Copying image to clipboard...</div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3 text-gray-700">Results for "{searchTerm}"</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(image => (
              image ? (
                <div
                  key={image.id || image.albumId}
                  className="bg-white p-2 rounded shadow cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleImageClick(image)}
                >
                  <div className={`overflow-hidden ${image.mediaType === 'game' ? 'aspect-video' : image.mediaType === 'music' ? 'aspect-square' : 'aspect-[2/3]'}`}>
                    <img
                      src={image}
                      alt={image}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600 truncate">{image.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="inline-block px-2 py-1 text-xs bg-gray-200 rounded">
                      {image.mediaType}
                    </span>
                    {image.year && <span className="text-xs text-gray-500">{image.year}</span>}
                    {image.artist && <span className="text-xs text-gray-500">{image.artist}</span>}
                    {image.platform && <span className="text-xs text-gray-500">{image.platform}</span>}
                  </div>
                </div>
              ) : null // Don't render anything if the image is null
            ))}
          </div>
        </div>
      )}

      <Modal selectedImage={selectedImage} setSelectedImage={setSelectedImage} />

    </div>
  );
};

export default ImageSearch;
