import { useState, useEffect } from "react";
import { fetchImg } from "API/api";
import { Searchbar } from "./Searchbar/Searchbar";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import Notiflix from 'notiflix';
import { Loader } from "./Loader/Loader";
import { Button } from "./Button/Button";





export function App () {
  const [ name, setName ] = useState('');
  const [ images, setImages ] = useState([]);
  const [ page, setPage ] = useState(1);
  const [ totalHits, setTotalHits ] = useState(0);
  const [ loading, setLoading ] = useState(false);

   useEffect(() => {
    if (!name) {
      return;
    }

    setLoading(true);

      const apiData = async () => {
        const { totalHits, hits } = await fetchImg(name, page);
        
        if (totalHits === 0) {
        Notiflix.Notify.info('No image with that name');
        setLoading(false);
        return;
      }

      setImages(prevState => page === 1 ? hits : [...prevState, ...hits]);
      setTotalHits(prevState => page === 1 ? totalHits - hits.length :  prevState - hits.length);
      setLoading(false);
      };

      apiData().catch((error) => {
      Notiflix.Notify.warning(`Something went wrong! ${error}`);
    });
  }, [name, page])

 const handleFormSubmit = name => {
    setName(name);
    setPage(1);
  }

 const loadMore = () => {
    setPage(prevState => prevState + 1)
  };

    return (
      <>
        <Searchbar onSubmit={handleFormSubmit}/>
        {loading && <Loader />} 
        {name ? 
        <ImageGallery images={images}/> :
        <p className="ImageGallery-text">Enter the name of the picture to search!</p>}
        {totalHits > 0 && <Button loadMore={loadMore}/>}
      </>
    );
};