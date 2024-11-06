import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../../provider/authProvider';

const MovieReviewForm = ({children,api_endpoint,...rest_props}) => {
//   const [rating, setRating] = useState(0);
//   const [opinion, setOpinion] = useState('');
//   const [tags, setTags] = useState([]);

  const [formState, setFormState] = useState({
    movie_id:rest_props.movie_id,
    rating: 0,
    opinion: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isGettingData, setIsGettingData] = useState(true);

  const isFirstRender = useRef(true);

  const {token} = useAuth();

//   const handleRatingChange = (e) => {
//     console.log("Rating change requested");
//     setRating(Number(e.target.value));
    
//   };

//   const handleOpinionChange = (e) => {
//     setOpinion(e.target.value);
//   };

//   const handleTagInputChange = (e) => {
//     setTagInput(e.target.value);
//   };

//   const addTag = () => {
//     if (tagInput && tags.length < 10 && !tags.includes(tagInput)) {
//       setTags([...tags, tagInput]);
//       setTagInput('');
//     }
//   };

//   const removeTag = (index) => {
//     setTags(tags.filter((_, i) => i !== index));
//   };

  const addTag = () => {
    if (tagInput && formState.tags.length < 10 && !formState.tags.includes(tagInput)) {
      updateFormState('tags', [...formState.tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    updateFormState(
      'tags',
      formState.tags.filter((_, i) => i !== index)
    );
  };

  const updateFormState = (field, value) => {
    setFormState((prevState) => {
        return {
      ...prevState,
      [field]: value};
    });
  };

  const getData = async ()=>{
    try {
        console.log('getting user\'s stored rating data');
        if(!token){
            console.error('No valid token..');
            return ;
        }
        const response = await fetch(api_endpoint+'?'+new URLSearchParams({
                movie_id: rest_props.movie_id,
            }).toString(), {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`${JSON.stringify(await response.json())}`);
        }
  
        const result = await response.json();
        // setRating(result.rating);
        // setOpinion(result.opinion);
        // setTags(result.tags);
        setFormState((prevState)=>({...prevState,
            rating: result.rating,
            opinion: result.opinion,
            tags: result.tags
        }));
        console.log('Data received from server!');
    } catch (error) {
      console.error('Failed to get data:', error);
    } finally {
      setIsGettingData(false);
    }
  }
  useEffect(()=>{getData()},[]);

  // Function to handle API save
  const saveData = async () => {
    if(!isGettingData){
        setIsSaving(true);
        try {
            if(!token){
                console.error('No valid token..');
            }
            const response = await fetch(api_endpoint, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                },
                // body: JSON.stringify({ rating, opinion, tags }),
                body: JSON.stringify(formState),
            });
            if (!response.ok) {
                throw new Error(`${JSON.stringify(await response.json())}`);
            }
            console.log('Data saved at the Server');
        } catch (error) {
        console.error('Failed to save data:', error);
        } finally {
        setIsSaving(false);
        }
    }
  };
  // Debounce save function
  const debounceSave = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

//   const debouncedSave = debounceSave(saveData, 1000);
const debouncedSave = useCallback(
    debounceSave(saveData, 1000),
    [formState, isGettingData] // Only re-run debouncedSave when formState or isGettingData changes
  );

  // Effect to trigger save on meaningful change
  useEffect(() => {
    if (!isFirstRender.current) {
      debouncedSave();
    } else {
      isFirstRender.current = false;
    }
  }, [formState]);

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Movie Review</h2>
      
      {/* Slider for Rating */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{width: '150px'}}>
            <label style={{overflow:"hidden"}}>Rating: {formState.rating}/5</label>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={formState.rating}
          onChange={(e) => {console.log("change...");updateFormState('rating', Number(e.target.value))}}
          onClick={()=>{console.log("clicked!");}}
          style={{ width: '100%',minWidth:"3cm", position:"relative" }}
        />
      </div>

      {/* Text Input for Opinion */}
      <div style={{ marginBottom: '20px' }}>
        <label>Opinion:</label>
        <textarea
          placeholder="What did you think about the movie?"
          value={formState.opinion}
          onChange={(e) => updateFormState('opinion', e.target.value)}
          style={{ width: '100%', height: '80px', resize: 'none' }}
        />
      </div>

      {/* Tag Input and Display */}
      <div style={{ marginBottom: '20px' }}>
        <label>Tags:</label>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input
            type="text"
            placeholder="Add a tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            style={{ flexGrow: 1 }}
          />
          <button onClick={addTag} disabled={!tagInput || formState.tags.length >= 10}>
            Add Tag
          </button>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px', gap: '8px' }}>
          {formState.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                backgroundColor: '#ddd',
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {tag}
              <button
                onClick={() => removeTag(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#333',
                  marginLeft: '5px',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
      {isSaving && <p>Saving...</p>}
    </div>
  );
};

export default MovieReviewForm;
