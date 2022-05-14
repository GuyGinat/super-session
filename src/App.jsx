import { useState, useEffect, useRef } from "react";
import VideoCard from "./Components/VideoCard";
import useDebounce from "./Hooks/useDebounce";
import axios from "axios";

const App = () => {

  const [searchTerm, setSearchTerm] = useState("");
  // API search results
  const [results, setResults] = useState([]);
  // Searching status (whether there is pending API request)
  const [isSearching, setIsSearching] = useState(false);
  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 500ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        search(debouncedSearchTerm).then((results) => {
          setIsSearching(false);
          setResults(results);
        });
      } else {
        setResults([]);
        setIsSearching(false);
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );

  const search = async (term) => {
    const results = await axios.get(`http://localhost:3010/yt/captions?q=${searchTerm}`)
    return results.data
  }  

  const cards = results.map((r, idx) =>
    <VideoCard key={r._id} data={r} idx={idx}/>
  );

  return (
    <div className="font-bold text-2xl text-white static bg-neutral-900 min-h-screen">
      <input type="text" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)}
      className="items-center rounded-md border-2 bg-gray-100 text-slate-700 border-black px-2 absolute top-8 left-1/3 w-1/3 shadow-sm border-opacity-10"/>
      {isSearching ? <div className="flex justify-center">...</div> : 
      <div className="p-24 grid grid-cols-3 grid-row-6  ">
        {results.length > 0 ? cards : <div></div>}
      </div>}
    </div>
  );
};

export default App;
